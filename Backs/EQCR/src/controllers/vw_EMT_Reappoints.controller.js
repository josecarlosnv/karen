import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getvwReapp = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Reappoint");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por Key_EMT
export const getvwReappvByID = async (req, res) => {
  const { Key_EMT } = req.params;

  if (!Key_EMT || String(Key_EMT).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Key_EMT", sql.VarChar(50), String(Key_EMT))
      .query("SELECT * FROM vw_EMT_Reappoint WHERE Key_EMT = @Key_EMT");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por Created_By
export const getvwReappByCreatedBy = async (req, res) => {
  const { Created_By } = req.params;

  if (!Created_By || String(Created_By).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Created_By", sql.VarChar(100), String(Created_By))
      .query("SELECT * FROM vw_EMT_Reappoint WHERE Created_By = @Created_By");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por BU
export const getvwReappByBU = async (req, res) => {
  const { BU } = req.params;

  if (!BU || String(BU).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("BU", sql.VarChar, String(BU))
      .query("SELECT * FROM vw_EMT_Reappoint WHERE BU = @BU");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);

  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};