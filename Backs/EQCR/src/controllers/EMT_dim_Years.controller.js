import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getYears = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_Years where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newYear = async (req, res) => {
  const {EMT_FY_Desc, 
      Is_CFY, 
      Is_PFY
    } = req.body;

  if (EMT_FY_Desc == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("EMT_FY_Desc", sql.VarChar, req.body.EMT_FY_Desc)
      .input("Is_CFY", sql.Int, req.body.Is_CFY)
      .input("Is_PFY", sql.Int, req.body.Is_PFY)
      .query(
        "INSERT INTO EMT_dim_FiscalYear (EMT_FY_Desc, Is_CFY, Is_PFY) VALUES (@EMT_FY_Desc,@Is_CFY,@Is_PFY); SELECT SCOPE_IDENTITY() as id"
      );

    res.json({
      EMT_FY_Desc, 
      Is_CFY, 
      Is_PFY,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterYearCurrent = async (req, res) => {
  const { EMT_FY_ID } = req.params;
  const { EMT_FY_Desc, Is_CFY, Is_PFY, Is_Current } = req.body;

  if (EMT_FY_ID == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_FY_ID", sql.Int, Number(EMT_FY_ID))
      .input("EMT_FY_Desc", sql.VarChar, EMT_FY_Desc)
      .input("Is_CFY", sql.Int, Is_CFY)
      .input("Is_PFY", sql.Int, Is_PFY)
      .input("Is_Current", sql.Int, Is_Current)
      .query(`
        UPDATE EMT_dim_FiscalYear
        SET EMT_FY_Desc = @EMT_FY_Desc,
            Is_CFY = @Is_CFY,
            Is_PFY = @Is_PFY,
            Is_Current = @Is_Current
        WHERE EMT_FY_ID = @EMT_FY_ID
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMT_FY_ID: Number(EMT_FY_ID),
      EMT_FY_Desc,
      Is_CFY,
      Is_PFY,
      Is_Current,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
