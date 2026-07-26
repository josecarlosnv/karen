import { getConnection, sql } from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// consultar todos
export const getAssignmentsApprovals = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .query(`
        SELECT *
        FROM EMT_tbl_AssignmentsApprovals
        WHERE Is_Current = 1
        ORDER BY EMT_AssiAppr_PK DESC
      `);

    return res.json(result.recordset);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// consultar por Key_EMT
export const getAssignmentsApprovalsByKey = async (req, res) => {
  const { Key_EMT } = req.params;

  if (!Key_EMT) {
    return res.status(400).json({
      msg: "Key_EMT is required"
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Key_EMT", sql.VarChar(80), Key_EMT)
      .query(`
    WITH LastRecordDetail AS (
      SELECT *
      FROM (
        SELECT
          EMT_tbl_AssignmentsApprovals.*,
          ROW_NUMBER() OVER (
            PARTITION BY Key_EMT
            ORDER BY Event_Number DESC
          ) RowNumber
        FROM EMT_tbl_AssignmentsApprovals
      ) LastRecord
      WHERE RowNumber = 1
    )

    SELECT *
    FROM LastRecordDetail
    WHERE Key_EMT = @Key_EMT
`)

    return res.json(result.recordset);

  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// insertar
export const newAssignmentsApproval = async (req, res) => {
  const {
    Key_EMT,
    Approve_Level,
    Approve_Status,
    Approve_Email_Address_Business,
    Approve_Comment,
    Is_Current,
    Event_Number
  } = req.body;

  if (
    Key_EMT == null ||
    Approve_Level == null ||
    Approve_Email_Address_Business == null
  ) {
    return res.status(400).json({
      msg: "Bad Request. Please fill all required fields"
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Key_EMT", sql.VarChar(80), Key_EMT)
      .input("Approve_Level", sql.VarChar(50), Approve_Level)
      .input(
        "Approve_Status",
        sql.Int,
        Approve_Status ?? null
      )
      .input(
        "Approve_Email_Address_Business",
        sql.VarChar(100),
        Approve_Email_Address_Business
      )
      .input(
        "Approve_Comment",
        sql.VarChar(1000),
        Approve_Comment ?? null
      )
      .input(
        "Is_Current",
        sql.Bit,
        Is_Current ?? 1
      )
      .input(
        "Event_Number",
        sql.Int,
        Event_Number ?? null
      )
      .query(`
        INSERT INTO EMT_tbl_AssignmentsApprovals (
          Key_EMT,
          Approve_Level,
          Approve_Status,
          Approve_Email_Address_Business,
          Approve_Comment,
          Is_Current,
          Event_Number
        )
        VALUES (
          @Key_EMT,
          @Approve_Level,
          @Approve_Status,
          @Approve_Email_Address_Business,
          @Approve_Comment,
          @Is_Current,
          @Event_Number
        );

        SELECT SCOPE_IDENTITY() AS id;
      `);

    return res.status(201).json({
      ...req.body,
      id: result.recordset[0].id
    });

  } catch (error) {
    return res.status(500).json({
      msg: error.message
    });
  }
};
