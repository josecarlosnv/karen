import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getvwColabsAll = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Colabs");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultarFiltraoSocioDirect
export const getvwColabsPD = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Colabs where Local_Job_Level_ID = 1 And Estatus_ID = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultarFiltraoSeniorManager
export const getvwColabsSM = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Colabs where Local_Job_Level_ID = 2 And Estatus_ID = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultarFiltraoActivos
export const getvwColabsFilterAct = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM vw_EMT_Colabs where Estatus_ID = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultarFiltraoActivos
export const getvwColabsLocalJobName = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT distinct Local_Job_Level_Name FROM vw_EMT_Colabs where Estatus_ID = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getvwColabsByID = async (req, res) => {
  const { Employee_ID } = req.params;

  if (Employee_ID == null || String(Employee_ID).trim() === "" || isNaN(Number(Employee_ID))) {
    return res.status(400).json({ msg: "Bad Request. Please provide a valid Employee_ID" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Employee_ID", sql.Int, Number(Employee_ID))
      .query("SELECT * FROM vw_EMT_Colabs WHERE Employee_ID = @Employee_ID");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
