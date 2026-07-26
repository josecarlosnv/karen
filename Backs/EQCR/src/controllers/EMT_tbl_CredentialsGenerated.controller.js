import {getConnection, sql} from "../database/connection.js";
import { authAD } from "./EMT_tbl_Security.controller.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// consultar
export const getCredentialsGenerated = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_CredentialsGenerated where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// consultar
export const getCredentialsGeneratedReady = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_CredentialsGenerated where Is_Current = 1 AND Ready_to_Approve = 1 and Status_ID not in (2, 5)");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// consultar con seguridaaaaaa
/*
export const getCredentialsGenerated = async (req, res) => {
  try {
    const {
      email = "",
      roles = [],
      NO_ACCESS = false
    } = req.user || {};
/*
    if (NO_ACCESS) {
      return res.status(403).json({ msg: "No tienes acceso" });
    }
*//*
    const pool = await getConnection();
    const isAll = roles.some(r => r.toUpperCase() === "ALL");
    const request = pool.request();
    let query = `
      SELECT *
      FROM EMT_tbl_CredentialsGenerated
      WHERE Is_Current = 1
    `;

    if (!isAll) {
      query += `
        AND Email_Address_Business = @Email
      `;
      request.input("Email", sql.VarChar(100), email);
    }

    const result = await request.query(query);

    return res.json(result.recordset);

  } catch (error) {
    return res.status(500).send(error.message);
  }
};
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// insertar
export const newCredentialsGenerated = async (req, res) => {
  const {
    Employee_ID,
    Full_Name,
    Local_Job_Level_Name,
    Is_Firm_Member,
    Is_Assistant,
    Years_In_Role,
    BU,
    Location_Name,
    Understanding_Responsabilities,
    AICPA,
    PCAOB,
    ICFR,
    SEC,
    IFRS,
    USGAAP,
    Specific_Training,
    Indutry_Experience,
    QPR1,
    QPR2,
    QPR3,
    NC_Evaluation,
    PCAOB_Inspection_Results,
    EMT_Indepence_ID,
    EMT_Indepence_Desc,
    Created_By
  } = req.body;

  if (
    Employee_ID == null ||
    Full_Name == null ||
    Local_Job_Level_Name == null ||
    Is_Firm_Member == null ||
    Is_Assistant == null ||
    NC_Evaluation == null ||
    EMT_Indepence_ID == null ||
    Created_By == null
  ) {
    return res.status(400).json({
      msg: "Bad Request. Please fill all required fields"
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Employee_ID", sql.BigInt, Employee_ID)
      .input("Full_Name", sql.VarChar(250), Full_Name)
      .input("Local_Job_Level_Name", sql.VarChar(100), Local_Job_Level_Name)
      .input("Is_Firm_Member", sql.Int, Is_Firm_Member)
      .input("Is_Assistant", sql.Int, Is_Assistant)
      .input("Years_In_Role", sql.Decimal(3, 1), Years_In_Role ?? null)
      .input("BU", sql.VarChar(50), BU ?? null)
      .input("Location_Name", sql.VarChar(100), Location_Name ?? null)
      .input("Understanding_Responsabilities", sql.Int, Understanding_Responsabilities ?? null)
      .input("AICPA", sql.Decimal(3, 2), AICPA ?? null)
      .input("PCAOB", sql.Decimal(3, 2), PCAOB ?? null)
      .input("ICFR", sql.Decimal(3, 2), ICFR ?? null)
      .input("SEC", sql.Decimal(3, 2), SEC ?? null)
      .input("IFRS", sql.Decimal(3, 2), IFRS ?? null)
      .input("USGAAP", sql.Decimal(3, 2), USGAAP ?? null)
      .input("Specific_Training", sql.VarChar(3000), Specific_Training ?? null)
      .input("Indutry_Experience", sql.VarChar(3000), Indutry_Experience ?? null)
      .input("QPR1", sql.VarChar(10), QPR1 ?? null)
      .input("QPR2", sql.VarChar(10), QPR2 ?? null)
      .input("QPR3", sql.VarChar(10), QPR3 ?? null)
      .input("NC_Evaluation", sql.VarChar(3000), NC_Evaluation)
      .input("PCAOB_Inspection_Results", sql.VarChar(3000), PCAOB_Inspection_Results ?? null)
      .input("EMT_Indepence_ID", sql.Int, EMT_Indepence_ID)
      .input("EMT_Indepence_Desc", sql.VarChar(100), EMT_Indepence_Desc ?? null)
      .input("Created_By", sql.VarChar(100), Created_By)
      .query(`
        INSERT INTO EMT_tbl_CredentialsGenerated (
          Employee_ID,
          Full_Name,
          Local_Job_Level_Name,
          Is_Firm_Member,
          Is_Assistant,
          Years_In_Role,
          BU,
          Location_Name,
          Understanding_Responsabilities,
          AICPA,
          PCAOB,
          ICFR,
          SEC,
          IFRS,
          USGAAP,
          Specific_Training,
          Indutry_Experience,
          QPR1,
          QPR2,
          QPR3,
          NC_Evaluation,
          PCAOB_Inspection_Results,
          EMT_Indepence_ID,
          EMT_Indepence_Desc,
          Created_By
        )
        VALUES (
          @Employee_ID,
          @Full_Name,
          @Local_Job_Level_Name,
          @Is_Firm_Member,
          @Is_Assistant,
          @Years_In_Role,
          @BU,
          @Location_Name,
          @Understanding_Responsabilities,
          @AICPA,
          @PCAOB,
          @ICFR,
          @SEC,
          @IFRS,
          @USGAAP,
          @Specific_Training,
          @Indutry_Experience,
          @QPR1,
          @QPR2,
          @QPR3,
          @NC_Evaluation,
          @PCAOB_Inspection_Results,
          @EMT_Indepence_ID,
          @EMT_Indepence_Desc,
          @Created_By
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
// consulta especifica por PK
export const getCredentialsGeneratedById = async (req, res) => {
  const { Employee_ID } = req.params;

  if (!Employee_ID || String(Employee_ID).trim() === "") {
    return res.status(400).json({
      msg: "Bad Request. Please provide EMT_CredentGen_PK"
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Employee_ID", sql.Int, parseInt(Employee_ID, 10))
      .query(`
        SELECT * 
        FROM EMT_tbl_CredentialsGenerated 
        WHERE Employee_ID = @Employee_ID
      `);

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// actualizar
export const alterCredentialsGenerated = async (req, res) => {
  const { Employee_ID } = req.params;

  const {
    Full_Name,
    Local_Job_Level_Name,
    Is_Firm_Member,
    Is_Assistant,
    Years_In_Role,
    BU,
    Location_Name,
    Understanding_Responsabilities,
    AICPA,
    PCAOB,
    ICFR,
    SEC,
    IFRS,
    USGAAP,
    Specific_Training,
    Indutry_Experience,
    QPR1,
    QPR2,
    QPR3,
    NC_Evaluation,
    PCAOB_Inspection_Results,
    EMT_Indepence_ID,
    EMT_Indepence_Desc,
    Deputy,
    CPPP,
    Deputy_Email_Address_Business,
    CPPP_Email_Address_Business,
    Deputy_Comment,
    CPPP_Comment,
    Status_ID,
    Status_Label,
    Modified_By
  } = req.body;

  if (!Employee_ID) {
    return res.status(400).json({
      msg: "Bad Request. Please provide Employee_ID in params."
    });
  }

  if (
    Full_Name == null ||
    Local_Job_Level_Name == null ||
    Is_Firm_Member == null ||
    Is_Assistant == null ||
    NC_Evaluation == null ||
    EMT_Indepence_ID == null
  ) {
    return res.status(400).json({
      msg: "Bad Request. Please fill all required fields."
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Employee_ID", sql.BigInt, parseInt(Employee_ID))
      .input("Full_Name", sql.VarChar(250), Full_Name)
      .input("Local_Job_Level_Name", sql.VarChar(100), Local_Job_Level_Name)
      .input("Is_Firm_Member", sql.Int, Is_Firm_Member)
      .input("Is_Assistant", sql.Int, Is_Assistant)
      .input("Years_In_Role", sql.Decimal(3, 1), Years_In_Role ?? null)
      .input("BU", sql.VarChar(50), BU ?? null)
      .input("Location_Name", sql.VarChar(100), Location_Name ?? null)
      .input("Understanding_Responsabilities", sql.Int, Understanding_Responsabilities ?? null)
      .input("AICPA", sql.Decimal(3, 2), AICPA ?? null)
      .input("PCAOB", sql.Decimal(3, 2), PCAOB ?? null)
      .input("ICFR", sql.Decimal(3, 2), ICFR ?? null)
      .input("SEC", sql.Decimal(3, 2), SEC ?? null)
      .input("IFRS", sql.Decimal(3, 2), IFRS ?? null)
      .input("USGAAP", sql.Decimal(3, 2), USGAAP ?? null)
      .input("Specific_Training", sql.VarChar(3000), Specific_Training ?? null)
      .input("Indutry_Experience", sql.VarChar(3000), Indutry_Experience ?? null)
      .input("QPR1", sql.VarChar(10), QPR1 ?? null)
      .input("QPR2", sql.VarChar(10), QPR2 ?? null)
      .input("QPR3", sql.VarChar(10), QPR3 ?? null)
      .input("NC_Evaluation", sql.VarChar(3000), NC_Evaluation)
      .input("PCAOB_Inspection_Results", sql.VarChar(3000), PCAOB_Inspection_Results ?? null)
      .input("EMT_Indepence_ID", sql.Int, EMT_Indepence_ID)
      .input("EMT_Indepence_Desc", sql.VarChar(100), EMT_Indepence_Desc ?? null)
      .input("Deputy", sql.Int, Deputy ?? null)
      .input("CPPP", sql.Int, CPPP ?? null)
      .input("Deputy_Email_Address_Business", sql.VarChar(100), Deputy_Email_Address_Business ?? null)
      .input("CPPP_Email_Address_Business", sql.VarChar(100), CPPP_Email_Address_Business ?? null)
      .input("Deputy_Comment", sql.VarChar(3000), Deputy_Comment ?? null)
      .input("CPPP_Comment", sql.VarChar(3000), CPPP_Comment ?? null)
      .input("Status_ID", sql.Int, Status_ID ?? null)
      .input("Status_Label", sql.VarChar(100), Status_Label ?? null)
      .input("Modified_By", sql.VarChar(100), Modified_By ?? null)
      .query(`
        UPDATE EMT_tbl_CredentialsGenerated
        SET
          Full_Name = @Full_Name,
          Local_Job_Level_Name = @Local_Job_Level_Name,
          Is_Firm_Member = @Is_Firm_Member,
          Is_Assistant = @Is_Assistant,
          Years_In_Role = @Years_In_Role,
          BU = @BU,
          Location_Name = @Location_Name,
          Understanding_Responsabilities = @Understanding_Responsabilities,
          AICPA = @AICPA,
          PCAOB = @PCAOB,
          ICFR = @ICFR,
          SEC = @SEC,
          IFRS = @IFRS,
          USGAAP = @USGAAP,
          Specific_Training = @Specific_Training,
          Indutry_Experience = @Indutry_Experience,
          QPR1 = @QPR1,
          QPR2 = @QPR2,
          QPR3 = @QPR3,
          NC_Evaluation = @NC_Evaluation,
          PCAOB_Inspection_Results = @PCAOB_Inspection_Results,
          EMT_Indepence_ID = @EMT_Indepence_ID,
          EMT_Indepence_Desc = @EMT_Indepence_Desc,
          Deputy = @Deputy,
          CPPP = @CPPP,
          Deputy_Email_Address_Business = @Deputy_Email_Address_Business,
          CPPP_Email_Address_Business = @CPPP_Email_Address_Business,
          Deputy_Comment = @Deputy_Comment,
          CPPP_Comment = @CPPP_Comment,
          Status_ID = @Status_ID,
          Status_Label = @Status_Label,
          Modified = GETDATE(),
          Modified_By = @Modified_By
        WHERE Employee_ID = @Employee_ID;

        SELECT @@ROWCOUNT AS affectedRows;
      `);

    const affectedRows = result.recordset?.[0]?.affectedRows ?? 0;

    if (affectedRows === 0) {
      return res.status(404).json({ msg: "Not Found" });
    }

    return res.status(200).json({
      msg: "CredentialsGenerated updated successfully.",
      Employee_ID: parseInt(Employee_ID, 10),
      affectedRows
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message
    });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// actualizarApprov
export const approveCredentialsGenerated = async (req, res) => {
  const { Employee_ID } = req.params;

  const {
    Approve_Status,
    Email_Address_Business,
    Comment
  } = req.body;

  if (!Employee_ID) {
    return res.status(400).json({
      msg: "Bad Request. Please provide Employee_ID in params."
    });
  }

  if (Approve_Status == null || Email_Address_Business == null) {
    return res.status(400).json({
      msg: "Bad Request. Please fill all required fields."
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Employee_ID", sql.BigInt, parseInt(Employee_ID))
      .input("Approve_Status", sql.Int, Approve_Status ?? null)
      .input("Email_Address_Business", sql.VarChar(100), Email_Address_Business ?? null)
      .input("Comment", sql.VarChar(3000), Comment ?? null)
      .query(`
        IF EXISTS (
          SELECT 1
          FROM EMT_tbl_CredentialsGenerated
          WHERE Employee_ID = @Employee_ID
            AND (Deputy IS NULL Or Deputy = 0)
        )
        BEGIN
            UPDATE EMT_tbl_CredentialsGenerated
            SET
                Deputy = @Approve_Status,
                Deputy_Email_Address_Business = @Email_Address_Business,
                Deputy_Comment = @Comment,
                Modified = GETDATE(),
                Modified_By = @Email_Address_Business
            WHERE Employee_ID = @Employee_ID;
        END
        ELSE
        BEGIN
            UPDATE EMT_tbl_CredentialsGenerated
            SET
                CPPP = @Approve_Status,
                CPPP_Email_Address_Business = @Email_Address_Business,
                CPPP_Comment = @Comment,
                Modified = GETDATE(),
                Modified_By = @Email_Address_Business
            WHERE Employee_ID = @Employee_ID;
        END;
        SELECT @@ROWCOUNT AS affectedRows;
      `);

    const affectedRows = result.recordset?.[0]?.affectedRows ?? 0;

    if (affectedRows === 0) {
      return res.status(404).json({ msg: "Not Found" });
    }

    return res.status(200).json({
      msg: "CredentialsGenerated updated successfully.",
      Employee_ID: parseInt(Employee_ID, 10),
      affectedRows
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message
    });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////
/////Consulta para el DDL de la seccion de assigments New select * from EMT_tbl_CredentialsGenerated where Status_ID=1
export const getCredentialsEQCR = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("select * from EMT_tbl_CredentialsGenerated where Status_ID=1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
/////////////////////////////////////////////////////////////////////////////
//para obtener los kpis de credenciales
export const getCredentialSummaryByEmployeeId = async (req, res) => {
  const { Employee_ID } = req.params;

  if (!Employee_ID) {
    return res.status(400).json({
      msg: "Employee_ID is required"
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Employee_ID", sql.BigInt, Employee_ID)
      .query(`
        SELECT
          Indepence_Desc,
          QPR1,
          QPR2,
          QPR3,
          AICPA,
          PCAOB,
          IFRS,
          USGAAP,
          Years_In_Role,
          Local_Job_Level_Name
        FROM EMT_tbl_CredentialsGenerated
        WHERE Employee_ID = @Employee_ID
          AND Status_ID = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        msg: "Credential not found"
      });
    }

    return res.json(result.recordset[0]);
     await pool.request()
        .execute("EMT_sp_AssignmentsGenerated");
    res.json({
      msg: "Validation Criteria created successfully",
      Key_EMT
    });

  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
};
