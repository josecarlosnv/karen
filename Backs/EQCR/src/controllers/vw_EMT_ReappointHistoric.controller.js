import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getvwReappHistoric = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_ReappointHistoric");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por Key_EMT
export const getvwReappHistoricByID = async (req, res) => {
  const { Key_EMT } = req.params;

  if (!Key_EMT || String(Key_EMT).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Key_EMT", sql.VarChar(50), String(Key_EMT))
      .query("SELECT * FROM vw_EMT_ReappointHistoric WHERE Key_EMT = @Key_EMT");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};