import { getConnection, sql } from "../database/connection.js";

////////////////////////////////////////////////////////////////////////////////////////////////////
export const getColabsGenerated = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM EMT_tbl_ColabsGenerated
      WHERE Is_Current = 1
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////
export const getColabsGeneratedActives = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT *
      FROM EMT_tbl_ColabsGenerated
      WHERE Is_Current = 1
      And Estatus_ID = 1
    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////
// INSERTAR (evitando campos con DEFAULT)
export const newColabGenerated = async (req, res) => {
  const {
    Employee_ID,
    Full_Name,
    Local_Job_Level_Name,
    Local_Job_Level_ID,
    Email_Address_Business,
    Years_In_Role,
    Location_Name,
    AICPA,
    PCAOB,
    ICFR,
    SEC,
    IFRS,
    USGAAP,
    QPR1,
    QPR2,
    QPR3,
    Created_By
  } = req.body;

  // VALIDACIÓN mínima
  if (
    Employee_ID == null ||
    Full_Name == null ||
    Local_Job_Level_Name == null ||
    Local_Job_Level_ID == null ||
    Email_Address_Business == null ||
    Created_By == null
  ) {
    return res.status(400).json({ msg: "Bad Request. Please fill all required fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Employee_ID", sql.BigInt, Employee_ID)
      .input("Full_Name", sql.VarChar, Full_Name)
      .input("Local_Job_Level_Name", sql.VarChar, Local_Job_Level_Name)
      .input("Local_Job_Level_ID", sql.Int, Local_Job_Level_ID)
      .input("Email_Address_Business", sql.VarChar, Email_Address_Business)
      .input("Years_In_Role", sql.Decimal(3,1), Years_In_Role)
      .input("Location_Name", sql.VarChar, Location_Name)
      .input("AICPA", sql.Decimal(3,2), AICPA)
      .input("PCAOB", sql.Decimal(3,2), PCAOB)
      .input("ICFR", sql.Decimal(3,2), ICFR)
      .input("SEC", sql.Decimal(3,2), SEC)
      .input("IFRS", sql.Decimal(3,2), IFRS)
      .input("USGAAP", sql.Decimal(3,2), USGAAP)
      .input("QPR1", sql.VarChar, QPR1)
      .input("QPR2", sql.VarChar, QPR2)
      .input("QPR3", sql.VarChar, QPR3)
      .input("Created_By", sql.VarChar, Created_By)
      .query(`
        INSERT INTO EMT_tbl_ColabsGenerated (
          Employee_ID,
          Full_Name,
          Local_Job_Level_Name,
          Local_Job_Level_ID,
          Email_Address_Business,
          Years_In_Role,
          Location_Name,
          AICPA,
          PCAOB,
          ICFR,
          SEC,
          IFRS,
          USGAAP,
          QPR1,
          QPR2,
          QPR3,
          Created_By
        ) VALUES (
          @Employee_ID,
          @Full_Name,
          @Local_Job_Level_Name,
          @Local_Job_Level_ID,
          @Email_Address_Business,
          @Years_In_Role,
          @Location_Name,
          @AICPA,
          @PCAOB,
          @ICFR,
          @SEC,
          @IFRS,
          @USGAAP,
          @QPR1,
          @QPR2,
          @QPR3,
          @Created_By
        );
        SELECT SCOPE_IDENTITY() as id;
      `);

    res.json({
      ...req.body,
      id: result.recordset[0].id
    });

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// CONSULTA POR Employee_ID
export const getColabByEmployeeID = async (req, res) => {
  const { Employee_ID } = req.params;

  if (!Employee_ID) {
    return res.status(400).json({ msg: "Bad Request. Employee_ID is required" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Employee_ID", sql.BigInt, Employee_ID)
      .query(`
        SELECT *
        FROM EMT_tbl_ColabsGenerated
        WHERE Employee_ID = @Employee_ID
      `);

    if (!result.recordset.length) return res.sendStatus(404);

    return res.json(result.recordset[0]);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// CAMBIAR VIGENCIA POR Employee_ID
export const alterColabCurrent = async (req, res) => {
  const { Employee_ID } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!Employee_ID || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Employee_ID", sql.BigInt, Employee_ID)
      .input("Is_Current", sql.Bit, Number(Is_Current))
      .input("Modified_By", sql.VarChar, Modified_By)
      .query(`
        UPDATE EMT_tbl_ColabsGenerated
        SET
          Is_Current = @Is_Current,
          Modified = GETDATE(),
          Modified_By = @Modified_By
        WHERE Employee_ID = @Employee_ID
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      Employee_ID,
      Is_Current: Number(Is_Current),
      Modified_By
    });

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////
///// Get para llenar el DDL lead partener name de Assigments -> new
export const getColabsGeneratedLead = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM EMT_tbl_ColabsGenerated where Local_Job_Level_ID = 1 And Estatus_ID = 1;

    `);

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
//////////////////////////////////////////////////////////////////////////////////////////
///// Get para llenar el DDL Select Assistant name de Assigments -> new
export const getColabsGeneratedAsistant = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      SELECT * FROM EMT_tbl_ColabsGenerated where Local_Job_Level_ID = 2 And Estatus_ID = 1;`);

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
