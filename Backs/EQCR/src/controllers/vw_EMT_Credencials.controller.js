import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getvwCred = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Credencials");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por Employee_ID
export const getvwCredByEmployeeID = async (req, res) => {
  const { Employee_ID } = req.params;

  if (Employee_ID == null || String(Employee_ID).trim() === "" || isNaN(Number(Employee_ID))) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Employee_ID", sql.Int, Number(Employee_ID))
      .query("SELECT * FROM vw_EMT_Credencials WHERE Employee_ID = @Employee_ID");

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por Created_By
export const getvwCredByCreatedBy = async (req, res) => {
  const { Created_By } = req.params;

  if (!Created_By || String(Created_By).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Created_By", sql.VarChar(100), String(Created_By).trim())
      .query("SELECT * FROM vw_EMT_Credencials WHERE Created_By = @Created_By");

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica por BU
export const getvwCredByBU = async (req, res) => {
  const { BU } = req.params;

  if (!BU || String(BU).trim() === "") {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("BU", sql.VarChar(50), String(BU).trim())
      .query("SELECT * FROM vw_EMT_Credencials WHERE BU = @BU");

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};