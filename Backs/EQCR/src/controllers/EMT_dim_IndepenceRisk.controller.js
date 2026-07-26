import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getIndepence = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_IndepenceRisk where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newIndepence = async (req, res) => {
  const {EMT_Indepence_Desc} = req.body;

  if (EMT_Indepence_Desc == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("EMT_Indepence_Desc", sql.VarChar, req.body.EMT_Indepence_Desc)
      .query(
        "INSERT INTO EMT_dim_IndepenceRisk (EMT_Indepence_Desc) VALUES (@EMT_Indepence_Desc); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      EMT_Indepence_Desc,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterIndepenceCurrent = async (req, res) => {
  const { EMT_Indepence_ID } = req.params;
  const { EMT_Indepence_Desc, Is_Current } = req.body;

  if (EMT_Indepence_ID == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_Indepence_ID", sql.Int, Number(EMT_Indepence_ID))
      .input("EMT_Indepence_Desc", sql.VarChar, EMT_Indepence_Desc)
      .input("Is_Current", sql.Int, Is_Current)
      .query(`
        UPDATE EMT_dim_IndepenceRisk
        SET EMT_Indepence_Desc = @EMT_Indepence_Desc,
            Is_Current = @Is_Current
        WHERE EMT_Indepence_ID = @EMT_Indepence_ID
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMT_Indepence_ID: Number(EMT_Indepence_ID),
      EMT_Indepence_Desc,
      Is_Current,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


