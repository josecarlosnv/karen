import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getSS = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_SecondReviewerRequiered where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newSS = async (req, res) => {
  const {EMT_SSRequi_Desc} = req.body;

  if (EMT_SSRequi_Desc == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("EMT_SSRequi_Desc", sql.VarChar, req.body.EMT_SSRequi_Desc)
      .query(
        "INSERT INTO EMT_dim_SecondReviewerRequiered (EMT_SSRequi_Desc) VALUES (@EMT_SSRequi_Desc); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      EMT_SSRequi_Desc,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterSSCurrent = async (req, res) => {
  const { EMT_SSRequi_ID } = req.params;
  const { EMT_SSRequi_Desc, Is_Current } = req.body;

  if (EMT_SSRequi_ID == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_SSRequi_ID", sql.Int, Number(EMT_SSRequi_ID))
      .input("EMT_SSRequi_Desc", sql.VarChar, EMT_SSRequi_Desc)
      .input("Is_Current", sql.Int, Is_Current)
      .query(`
        UPDATE EMT_dim_SecondReviewerRequiered
        SET EMT_SSRequi_Desc = @EMT_SSRequi_Desc,
            Is_Current = @Is_Current
        WHERE EMT_SSRequi_ID = @EMT_SSRequi_ID
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMT_SSRequi_ID: Number(EMT_SSRequi_ID),
      EMT_SSRequi_Desc,
      Is_Current,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
