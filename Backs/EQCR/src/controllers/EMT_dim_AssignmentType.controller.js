import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getTypes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_AssignmentType where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newType = async (req, res) => {
  const {EMT_Assignment_Desc} = req.body;

  if (EMT_Assignment_Desc == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("EMT_Assignment_Desc", sql.VarChar, req.body.EMT_Assignment_Desc)
      .query(
        "INSERT INTO EMT_dim_AssignmentType (EMT_Assignment_Desc) VALUES (@EMT_Assignment_Desc); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      EMT_Assignment_Desc,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterTypeCurrent = async (req, res) => {
  const { EMT_Assignment_ID } = req.params;
  const { EMT_Assignment_Desc, Is_Current } = req.body;

  if (EMT_Assignment_ID == null || EMT_Assignment_Desc == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_Assignment_ID", sql.Int, Number(EMT_Assignment_ID))
      .input("EMT_Assignment_Desc", sql.VarChar, EMT_Assignment_Desc)
      .input("Is_Current", sql.Int, Is_Current)
      .query(`
        UPDATE EMT_dim_AssignmentType
        SET EMT_Assignment_Desc = @EMT_Assignment_Desc,
            Is_Current = @Is_Current
        WHERE EMT_Assignment_ID = @EMT_Assignment_ID
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMT_Assignment_ID: Number(EMT_Assignment_ID),
      EMT_Assignment_Desc,
      Is_Current,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
