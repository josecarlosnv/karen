/*---------------------------------Codigo de  ISaaac para Claims---------------------------------*/

import { getConnection, sql } from "../database/connection.js";
export const authAD = async (req, res, next) => {
  if (req.method === "OPTIONS") {
       return next();
      } //para ya no enviar headers
  try {
      console.log("HEADERS:", req.headers);

let rawUser =
  req.headers["x-iisnode-logon_user"] ||
  req.headers["x-forwarded-user"] ||
  req.headers["auth-user"] ||
  req.headers["logon-user"];

console.log("RAW USER:", rawUser);

console.log("RAW USER:", rawUser);
    
    if (!rawUser) {
      const localUser = process.env.USERNAME;
 
      if (localUser) {
        rawUser = `LOCAL\\${localUser}`;
      } else {
        return res.status(401).json({ msg: "Unauthorized - No AD user" });
      }
    }
   
    if (!rawUser) {
      return res.status(401).json({ msg: "Unauthorized - No AD user" });
    }

    const networkId = rawUser.includes("\\")
      ? rawUser.split("\\")[1].toLowerCase()
      : rawUser.toLowerCase();

    if (!networkId) {
      return res.status(400).json({ msg: "Invalid NetworkID format" });
    }
    const pool = await getConnection();

    const empLookup = await pool
      .request()
      .input("networkId", sql.VarChar(100), networkId)
      .query(`
        SELECT TOP 1 *
        FROM PVIII_Cat_Colabs
        WHERE LOWER(networkId) = LOWER(@networkId)
      `);

    let email = `${networkId}@kpmg.com.mx`;

    if (empLookup.recordset.length) {
      const emp = empLookup.recordset[0];

      if (emp.Email_Address_Business) {
        email = emp.Email_Address_Business.toLowerCase();
      }
    }

    const result = await pool
      .request()
      .input("Email_Address_Business", sql.VarChar(100), email)
      .query(`
        SELECT * 
        FROM EMT_tbl_Security 
        WHERE Email_Address_Business = @Email_Address_Business
      `);

    const claims = {
      networkId,
      email,
      fullName: null,
      roles: [],
      BU: [],
      Segment: [],
      Office: [],
      isAll: false,
      NO_ACCESS: false
    };

   if (!result.recordset.length) {
      const empResult = await pool
        .request()
        .input("employee_email", sql.VarChar(100), email)
        .query(`
          SELECT *
          FROM PVIII_Cat_Colabs
          WHERE employee_email = @employee_email
            AND levelLabel IN ('Partner', 'Director', 'Senior Manager')
        `);

      if (empResult.recordset.length) {
        
        const emp = empResult.recordset[0];

        claims.fullName = emp.Full_Name || null;
        claims.roles = ["EmployeeLevel"]; 
        claims.isAll = false;
        claims.NO_ACCESS = false;

        req.user = claims;
        return next();
      }

      claims.NO_ACCESS = true;
      req.user = claims;
      return next();
    }


    const records = result.recordset;
    let hasScope = false;

    for (const rec of records) {
      const role = rec.Role_Desc?.trim()?.toLowerCase();

      if (role === "all") {
        claims.fullName = rec.Full_Name;
        claims.roles.push("All");
        claims.isAll = true;

        req.user = claims;
        return next(); 
      }
    }

if (records.length > 0 && !records.some(r => r.Role_Desc?.trim())) {
  claims.fullName = records[0].Full_Name || null;
  claims.NO_ACCESS = false;
  req.user = claims;
  return next();
}

    const empResult = await pool
      .request()
      .input("employee_email", sql.VarChar(100), email)
      .query(`
        SELECT *
        FROM PVIII_Cat_Colabs
        WHERE employee_email = @employee_email
          AND levelLabel IN ('Partner', 'Director', 'Senior Manager')
      `);

   
if (records.length === 0 && !empResult.recordset.length) {
  claims.NO_ACCESS = true;
  req.user = claims;
  return next();
}


    for (const rec of records) {
      const role = rec.Role_Desc?.trim();
      claims.fullName = rec.Full_Name;

      if (!role) continue;

      claims.roles.push(role);

      if (rec.BU_Desc) {
        claims.BU.push(rec.BU_Desc);
        hasScope = true;
      }

      if (rec.Segment_Desc) {
        claims.Segment.push(rec.Segment_Desc);
        hasScope = true;
      }

      if (rec.Office_Desc) {
        claims.Office.push(rec.Office_Desc);
        hasScope = true;
      }
    }

    if (records.length > 0 && claims.roles.length === 0) {
      claims.NO_ACCESS = false;
    }

    req.user = claims;

    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////
export const authorize = (roles = []) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    const hasRole = roles.length === 0 || roles.some(r => userRoles.includes(r));

    if (!hasRole) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    if (req.user?.NO_ACCESS) {
      return res.status(403).json({ msg: "No Access - Scope missing" });
    }

    next();
  };
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Esto se hace para poder exportar esos benditos  claims
/*export const getClaims = (req, res) => {
  res.json(req.user);
};*/
export const getClaims = (req, res) => {
  res.json(req.user);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getSecurity = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_Security");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newSecurity = async (req, res) => {
  const {
    Email_Address_Business,
    Full_Name,
    Role_ID,
    Role_Desc,
    BU_ID,
    BU_Desc,
    Segment_ID,
    Segment_Desc,
    Office_ID,
    Office_Desc
  } = req.body;

  if (Email_Address_Business == null || Role_ID == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Email_Address_Business", sql.VarChar(100), Email_Address_Business)
      .input("Full_Name", sql.VarChar(250), Full_Name ?? null)
      .input("Role_ID", sql.Int, Role_ID)
      .input("Role_Desc", sql.VarChar(50), Role_Desc ?? null)
      .input("BU_ID", sql.Int, BU_ID ?? null)
      .input("BU_Desc", sql.VarChar(50), BU_Desc ?? null)
      .input("Segment_ID", sql.Int, Segment_ID ?? null)
      .input("Segment_Desc", sql.VarChar(50), Segment_Desc ?? null)
      .input("Office_ID", sql.Int, Office_ID ?? null)
      .input("Office_Desc", sql.VarChar(50), Office_Desc ?? null)
      .query(`
        INSERT INTO EMT_tbl_Security (
          Email_Address_Business,
          Full_Name,
          Role_ID,
          Role_Desc,
          BU_ID,
          BU_Desc,
          Segment_ID,
          Segment_Desc,
          Office_ID,
          Office_Desc
        )
        VALUES (
          @Email_Address_Business,
          @Full_Name,
          @Role_ID,
          @Role_Desc,
          @BU_ID,
          @BU_Desc,
          @Segment_ID,
          @Segment_Desc,
          @Office_ID,
          @Office_Desc
        );
        SELECT SCOPE_IDENTITY() as id;
      `);

    return res.json({
      ...req.body,
      id: result.recordset[0].id
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getSecurityByEmail = async (req, res) => {
  const { Email_Address_Business } = req.params;

  if (!Email_Address_Business || String(Email_Address_Business).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Email_Address_Business", sql.VarChar(100), String(Email_Address_Business).trim())
      .query("SELECT * FROM EMT_tbl_Security WHERE Email_Address_Business = @Email_Address_Business");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterSecurity = async (req, res) => {
  const { EMTSecurity_PK } = req.params;

  const {
    Email_Address_Business,
    Full_Name,
    Role_ID,
    Role_Desc,
    BU_ID,
    BU_Desc,
    Segment_ID,
    Segment_Desc,
    Office_ID,
    Office_Desc
  } = req.body;

  if (!EMTSecurity_PK) {
    return res.status(400).json({ msg: "Bad Request. Please provide EMTSecurity_PK in params." });
  }

  if (Email_Address_Business == null || Role_ID == null) {
    return res.status(400).json({
      msg: "Bad Request. Please fill all required fields."
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTSecurity_PK", sql.Int, parseInt(EMTSecurity_PK, 10))
      .input("Email_Address_Business", sql.VarChar(100), Email_Address_Business)
      .input("Full_Name", sql.VarChar(250), Full_Name ?? null)
      .input("Role_ID", sql.Int, parseInt(Role_ID, 10))
      .input("Role_Desc", sql.VarChar(50), Role_Desc ?? null)
      .input("BU_ID", sql.Int, BU_ID ?? null)
      .input("BU_Desc", sql.VarChar(50), BU_Desc ?? null)
      .input("Segment_ID", sql.Int, Segment_ID ?? null)
      .input("Segment_Desc", sql.VarChar(50), Segment_Desc ?? null)
      .input("Office_ID", sql.Int, Office_ID ?? null)
      .input("Office_Desc", sql.VarChar(50), Office_Desc ?? null)
      .query(`
        UPDATE EMT_tbl_Security
        SET
          Email_Address_Business = @Email_Address_Business,
          Full_Name = @Full_Name,
          Role_ID = @Role_ID,
          Role_Desc = @Role_Desc,
          BU_ID = @BU_ID,
          BU_Desc = @BU_Desc,
          Segment_ID = @Segment_ID,
          Segment_Desc = @Segment_Desc,
          Office_ID = @Office_ID,
          Office_Desc = @Office_Desc
        WHERE EMTSecurity_PK = @EMTSecurity_PK;

        SELECT @@ROWCOUNT AS affectedRows;
      `);

    const affectedRows = result.recordset?.[0]?.affectedRows ?? 0;

    if (affectedRows === 0) {
      return res.status(404).json({ msg: "Not Found" });
    }

    return res.status(200).json({
      msg: "Security updated successfully.",
      EMTSecurity_PK: parseInt(EMTSecurity_PK, 10),
      affectedRows
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message
    });
  }
};
