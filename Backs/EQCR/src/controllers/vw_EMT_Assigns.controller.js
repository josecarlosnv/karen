import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getvwAssi = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Assign");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica Created_By

export const getvwAssiByCreatedBy = async (req, res) => {
  const { Created_By } = req.params;

  if (!Created_By || String(Created_By).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Created_By", sql.VarChar(100), String(Created_By).trim())
      .query("SELECT * FROM vw_EMT_Assign WHERE Created_By = @Created_By");

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica Key_EMT
export const getvwAssiByKeyEMT = async (req, res) => {
  const { Key_EMT } = req.params;

  if (!Key_EMT || String(Key_EMT).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Key_EMT", sql.VarChar(50), String(Key_EMT).trim())
      .query("SELECT * FROM vw_EMT_Assign WHERE Key_EMT = @Key_EMT");

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica BU
export const getvwAssiByBU = async (req, res) => {
  const { BU } = req.params;

  if (!BU || String(BU).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("BU", sql.VarChar(50), String(BU).trim())
      .query("SELECT * FROM vw_EMT_Assign WHERE BU = @BU");

    return res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
