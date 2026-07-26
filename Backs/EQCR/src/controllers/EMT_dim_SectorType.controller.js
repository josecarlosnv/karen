import {getConnection, sql} from "../database/connection.js";
//ISAAC
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getSectorTypes = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_SectorType where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar //ya tamos horny, que lo que hacemo aqui
export const getSectorTypesParent = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT distinct Sector_ID, Parent_Sector_Desc FROM EMT_dim_SectorType where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
