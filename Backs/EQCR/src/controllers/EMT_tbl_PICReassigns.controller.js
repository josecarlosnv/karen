import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getPICReass = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_PICReassigns");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newPICReass = async (req, res) => {
  const { 
      Key_EMT,
      Employee_ID,
      Comments,
      Created_By
    } = req.body;

  if (Key_EMT == null || Created_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("Key_EMT", sql.VarChar, req.body.Key_EMT)
      .input("Employee_ID", sql.Int, req.body.Employee_ID)
      .input("Comments", sql.VarChar, req.body.Comments)
      .input("Created_By", sql.VarChar, req.body.Created_By)
      .query(
        "INSERT INTO EMT_tbl_PICReassigns (Key_EMT, Employee_ID, Comments, Created_By) VALUES (@Key_EMT,@Employee_ID,@Comments,@Created_By); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      Key_EMT,
      Employee_ID,
      Comments,
      Created_By,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getPICReassByID = async (req, res) => {
  const { EMTPICReassig_PK } = req.params;

  if (!EMTPICReassig_PK) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  const id = Number(EMTPICReassig_PK);
  if (!Number.isInteger(id)) {
    return res
      .status(400)
      .json({ msg: "Bad Request. EMTPICReassig_PK must be an integer" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTPICReassig_PK", sql.Int, id)
      .query(
        "SELECT * FROM EMT_tbl_PICReassigns WHERE EMTPICReassig_PK = @EMTPICReassig_PK"
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
export const alterPICReassCurrent = async (req, res) => {
  const { EMTPICReassig_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!EMTPICReassig_PK || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTPICReassig_PK", sql.Int, Number(EMTPICReassig_PK))
      .input("Is_Current", sql.Int, Number(Is_Current))
      .input("Modified_By", sql.VarChar, String(Modified_By))
      .query(`
        UPDATE EMT_tbl_PICReassigns
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMTPICReassig_PK = @EMTPICReassig_PK
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMTPICReassig_PK: Number(EMTPICReassig_PK),
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
