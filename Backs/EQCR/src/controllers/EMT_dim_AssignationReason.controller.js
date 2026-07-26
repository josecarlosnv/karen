import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getAssignationReasons = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_AssignationReason where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newAssignationReason = async (req, res) => {
  const {EMT_Reason_Desc} = req.body;

  if (EMT_Reason_Desc == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("EMT_Reason_Desc", sql.VarChar, req.body.EMT_Reason_Desc)
      .query("INSERT INTO EMT_dim_AssignationReason (EMT_Reason_Desc) VALUES (@EMT_Reason_Desc); SELECT SCOPE_IDENTITY() as id");

    res.json({
      EMT_Reason_Desc,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia

export const alterAssignationReason = async (req, res) => {
  const { EMT_Reason_ID } = req.params; // viene de la URL
  const { EMT_Reason_Desc, Is_Current } = req.body;

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_Reason_ID", sql.Int, Number(EMT_Reason_ID))
      .input("EMT_Reason_Desc", sql.VarChar, EMT_Reason_Desc)
      .input("Is_Current", sql.Int, Is_Current)
      .query(`
        UPDATE EMT_dim_AssignationReason
        SET EMT_Reason_Desc = @EMT_Reason_Desc,
            Is_Current = @Is_Current
        WHERE EMT_Reason_ID = @EMT_Reason_ID
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMT_Reason_ID: Number(EMT_Reason_ID),
      EMT_Reason_Desc,
      Is_Current,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};