import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getCredencialsApprs = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_CredentialsApprovals where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newCredencialAppr = async (req, res) => {
  const {
      Employee_ID,
      Approve_Level,
      Approve_Status,
      Approve_Email_Address_Business,
      Approve_Comment
    } = req.body;

  if (Employee_ID == null || Approve_Email_Address_Business == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("Employee_ID", sql.Int, req.body.Employee_ID)
      .input("Approve_Level", sql.VarChar, req.body.Approve_Level)
      .input("Approve_Status", sql.Int, req.body.Approve_Status)
      .input("Approve_Email_Address_Business", sql.VarChar, req.body.Approve_Email_Address_Business)
      .input("Approve_Comment", sql.VarChar, req.body.Approve_Comment)
      .query(
        `INSERT INTO EMT_tbl_CredentialsApprovals (
          Employee_ID,
          Approve_Level,
          Approve_Status,
          Approve_Email_Address_Business,
          Approve_Comment
        ) VALUES (
         @Employee_ID,
         @Approve_Level,
         @Approve_Status,
         @Approve_Email_Address_Business,
         @Approve_Comment
        ); SELECT SCOPE_IDENTITY() as id;
        
        exec EMT_sp_CredentialsGenerator`
      );

    res.json({
      Employee_ID,
      Approve_Level,
      Approve_Status,
      Approve_Email_Address_Business,
      Approve_Comment,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getCredencialApprByID = async (req, res) => {
  const { EMT_CredAppr_PK } = req.params;

  if (!EMT_CredAppr_PK) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  const id = Number(EMT_CredAppr_PK);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ msg: "Bad Request. EMT_CredAppr_PK must be an integer" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_CredAppr_PK", sql.Int, id)
      .query(
        "SELECT * FROM EMT_tbl_CredentialsApprovals WHERE EMT_CredAppr_PK = @EMT_CredAppr_PK"
      );

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
/*
export const alterCredencialApprCurrent = async (req, res) => {
  const { EMT_CredAppr_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!EMT_CredAppr_PK || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_CredAppr_PK", sql.Int, Number(EMT_CredAppr_PK))
      .input("Is_Current", sql.Int, Number(Is_Current))
      .input("Modified_By", sql.VarChar, String(Modified_By))
      .query(`
        UPDATE EMT_tbl_CredentialsApprovals
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMT_CredAppr_PK = @EMT_CredAppr_PK
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMT_CredAppr_PK: Number(EMT_CredAppr_PK),
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
*/