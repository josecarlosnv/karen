import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getAssigns = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_Assignment");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newAssign = async (req, res) => {
  const {
    Employee_ID,
    Entity_ID,
    FY,
    Key_EMT_PFY,
    EMTSSRequi_Desc,
    Year_Appointment,
    EMTReason_ID,
    CEAC_ID,
    Engagement_Name,
    LeadPartner_ID,
    Member_engagement,
    Two_Year_Cooling,
    Independent,
    Ablility_objectivity_integrity,
    Has_Threats,
    Has_Threats_Desc,
    EMTSector_ID,
    EMTAssignment_ID,
    Validated,
    Created_By
    } = req.body;
  if (
    Employee_ID == null ||
    Entity_ID == null ||
    FY == null ||
    Year_Appointment == null ||
    EMTReason_ID == null ||
    EMTAssignment_ID == null ||
    EMTSector_ID == null ||
    LeadPartner_ID == null ||
    Created_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }
  try {
    const pool = await getConnection();
    const result = await pool.request()
    .input("Employee_ID", sql.Int, req.body.Employee_ID)
    .input("Entity_ID", sql.Int, req.body.Entity_ID)
    .input("FY", sql.Int, req.body.FY)
    .input("Key_EMT_PFY", sql.VarChar, req.body.Key_EMT_PFY)
    .input("EMTSSRequi_Desc", sql.VarChar, req.body.EMTSSRequi_Desc)
    .input("Year_Appointment", sql.Int, req.body.Year_Appointment)
    .input("EMTReason_ID", sql.Int, req.body.EMTReason_ID)
    .input("EMTAssignment_ID", sql.Int, req.body.EMTAssignment_ID)
    .input("EMTSector_ID", sql.Int, req.body.EMTSector_ID)
    .input("CEAC_ID", sql.Int, req.body.CEAC_ID)
    .input("Engagement_Name", sql.VarChar, req.body.Engagement_Name)
    .input("LeadPartner_ID", sql.Int, req.body.LeadPartner_ID)
    .input("Member_engagement", sql.Int, req.body.Member_engagement)
    .input("Two_Year_Cooling", sql.Int, req.body.Two_Year_Cooling)
    .input("Independent", sql.Int, req.body.Independent)
    .input("Ablility_objectivity_integrity", sql.Int, req.body.Ablility_objectivity_integrity)
    .input("Has_Threats", sql.Int, req.body.Has_Threats)
    .input("Has_Threats_Desc", sql.VarChar, req.body.Has_Threats_Desc)
    .input("Created_By", sql.VarChar, req.body.Created_By)
    .input("Validated", sql.Int, Validated ?? null)
    .query(
      `INSERT INTO EMT_tbl_Assignment (
        Employee_ID,
        [Entity_ID],
        FY,
        Key_EMT_PFY,
        EMTSSRequi_Desc,
        Year_Appointment,
        EMTReason_ID,
        CEAC_ID,
        Engagement_Name,
        LeadPartner_ID,
        Member_engagement,
        Two_Year_Cooling,
        Independent,
        Ablility_objectivity_integrity,
        Has_Threats,
        Has_Threats_Desc,
        EMTSector_ID,
        EMTAssignment_ID,
        Validated,
        Created_By
      ) VALUES (
        @Employee_ID,
        @Entity_ID,
        @FY,
        @Key_EMT_PFY,
        @EMTSSRequi_Desc,
        @Year_Appointment,
        @EMTReason_ID,
        @CEAC_ID,
        @Engagement_Name,
        @LeadPartner_ID,
        @Member_engagement,
        @Two_Year_Cooling,
        @Independent,
        @Ablility_objectivity_integrity,
        @Has_Threats,
        @Has_Threats_Desc,
        @EMTSector_ID,
        @EMTAssignment_ID,
        @Validated,
        @Created_By
      ); SELECT SCOPE_IDENTITY() as id`
    );
  res.json(
    {
      Employee_ID,
      Entity_ID,
      FY,
      Key_EMT_PFY,
      EMTSSRequi_Desc,
      Year_Appointment,
      EMTReason_ID,
      CEAC_ID,
      Engagement_Name,
      LeadPartner_ID,
      Member_engagement,
      Two_Year_Cooling,
      Independent,
      Ablility_objectivity_integrity,
      Has_Threats,
      Has_Threats_Desc,
      EMTSector_ID,
      EMTAssignment_ID,
      Created_By,
      id: result.recordset[0].id,
    }
  );
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getAssignByID = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTAssign_PK", req.params.EMTAssign_PK)
      .query("SELECT * FROM EMT_tbl_Assignment WHERE EMTAssign_PK = @EMTAssign_PK");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterAssignCurrent = async (req, res) => {
  const { EMTAssign_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (Is_Current == null || !Modified_By) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("EMTAssign_PK", sql.Int, EMTAssign_PK)
      .input("Is_Current", sql.Bit, Boolean(Is_Current))
      .input("Modified_By", sql.VarChar(100), Modified_By)
      .query(`
        UPDATE EMT_tbl_Assignment
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMTAssign_PK = @EMTAssign_PK
      `);

    if (!result.rowsAffected[0]) return res.sendStatus(404);

    return res.json({ EMTAssign_PK, Is_Current, Modified_By });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};





