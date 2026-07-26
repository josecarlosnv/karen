import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const GetAssigmentsGenerated = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("select * from EMT_tbl_AssignmentsGenerated");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////
///////////GEtByid
export const GetAssignmentGeneratedById = async (req, res) => {
  const { id } = req.params;

  const pool = await getConnection();

  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query(`
      SELECT *
      FROM EMT_tbl_AssignmentsGenerated
      WHERE EMT_AssiGene_PK = @id
    `);

  res.json(result.recordset[0]);
};

///////////////////////////////////////////////////////////////////////////////
////////////endpoint para approvals assigments

export const getAssignmentsApprovals = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT * FROM EMT_tbl_AssignmentsGenerated
      WHERE Is_Current = 1 AND Status_ID NOT IN (5,6) 
      ORDER BY Created DESC`);

    res.status(200).json(result.recordset);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};