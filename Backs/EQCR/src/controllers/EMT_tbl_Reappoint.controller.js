import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getReappoint = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_Reappoint");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newReappoint = async (req, res) => {
  const {
    Employee_ID,
    Entity_ID,
    FY,
    Key_EMT_PFY,
    CEAC_ID,
    Engagement_Name,
    LeadPartner_ID,
    Year_Appointment,
    Year_Reappointment,
    Competence_Capabilities,
    No_Significant_Changes_Initial,
    No_significan_Changes_Legal_Regulatory,
    No_changes_entitys_Industry,
    No_changes_Complexity,
    Sufficient_time,
    Independent,
    Ablility_objectivity_integrity,
    Member_engagement,
    Two_Year_Cooling,
    Has_Threats,
    Has_Threats_Desc,
    No_responsibility,
    NC_Impact_Eval,
	  PCAOB_Results,
    EMTSSRequi_Desc,
    EMTAssignment_ID,
    EMTSector_ID,
    Validated,
    Created_By
  } = req.body;

  if (
    Employee_ID == null ||
    Entity_ID == null ||
    FY == null ||
    Key_EMT_PFY == null ||
    LeadPartner_ID == null ||
    Year_Appointment == null ||
    Year_Reappointment == null ||
    No_responsibility == null ||
    Created_By == null
  ) {
    return res.status(400).json({ msg: "Bad Request. Please fill all required fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Employee_ID", sql.Int, Employee_ID)
      .input("Entity_ID", sql.Decimal(15, 0), Entity_ID)
      .input("FY", sql.Int, FY)
      .input("Key_EMT_PFY", sql.VarChar(100), Key_EMT_PFY)
      .input("LeadPartner_ID", sql.Int, LeadPartner_ID)
      .input("Year_Appointment", sql.Int, Year_Appointment)
      .input("Year_Reappointment", sql.Int, Year_Reappointment)
      .input("No_responsibility", sql.Int, No_responsibility)
      .input("Created_By", sql.VarChar(100), Created_By)
      .input("CEAC_ID", sql.Int, CEAC_ID ?? null)
      .input("Engagement_Name", sql.VarChar, Engagement_Name ?? null)
      .input("Competence_Capabilities", sql.Int, Competence_Capabilities ?? null)
      .input("No_Significant_Changes_Initial", sql.Int, No_Significant_Changes_Initial ?? null)
      .input("No_significan_Changes_Legal_Regulatory", sql.Int, No_significan_Changes_Legal_Regulatory ?? null)
      .input("No_changes_entitys_Industry", sql.Int, No_changes_entitys_Industry ?? null)
      .input("No_changes_Complexity", sql.Int, No_changes_Complexity ?? null)
      .input("Sufficient_time", sql.Int, Sufficient_time ?? null)
      .input("Independent", sql.Int, Independent ?? null)
      .input("Ablility_objectivity_integrity", sql.Int, Ablility_objectivity_integrity ?? null)
      .input("Member_engagement", sql.Int, Member_engagement ?? null)
      .input("Two_Year_Cooling", sql.Int, Two_Year_Cooling ?? null)
      .input("Has_Threats", sql.Int, Has_Threats ?? null)
      .input("Has_Threats_Desc", sql.VarChar, Has_Threats_Desc ?? null)
      .input("NC_Impact_Eval", sql.Int, NC_Impact_Eval ?? null)
      .input("PCAOB_Results", sql.Int, PCAOB_Results ?? null)
      .input("EMTSSRequi_Desc", sql.VarChar, EMTSSRequi_Desc ?? null)
      .input("EMTAssignment_ID", sql.Int, EMTAssignment_ID ?? null)
      .input("EMTSector_ID", sql.Int, EMTSector_ID ?? null)
      .input("Validated", sql.Int, Validated ?? null)

      .query(`
        INSERT INTO EMT_tbl_Reappoint (
          Employee_ID,
          Entity_ID,
          FY,
          Key_EMT_PFY,
          CEAC_ID,
          Engagement_Name,
          LeadPartner_ID,
          Year_Appointment,
          Year_Reappointment,
          Competence_Capabilities,
          No_Significant_Changes_Initial,
          No_significan_Changes_Legal_Regulatory,
          No_changes_entitys_Industry,
          No_changes_Complexity,
          Sufficient_time,
          Independent,
          Ablility_objectivity_integrity,
          Member_engagement,
          Two_Year_Cooling,
          Has_Threats,
          Has_Threats_Desc,
          No_responsibility,
          NC_Impact_Eval,
	        PCAOB_Results,
          EMTSSRequi_Desc,
          EMTAssignment_ID,
          EMTSector_ID,
          Validated,
          Created_By
        )
        VALUES (
          @Employee_ID,
          @Entity_ID,
          @FY,
          @Key_EMT_PFY,
          @CEAC_ID,
          @Engagement_Name,
          @LeadPartner_ID,
          @Year_Appointment,
          @Year_Reappointment,
          @Competence_Capabilities,
          @No_Significant_Changes_Initial,
          @No_significan_Changes_Legal_Regulatory,
          @No_changes_entitys_Industry,
          @No_changes_Complexity,
          @Sufficient_time,
          @Independent,
          @Ablility_objectivity_integrity,
          @Member_engagement,
          @Two_Year_Cooling,
          @Has_Threats,
          @Has_Threats_Desc,
          @No_responsibility,
          @NC_Impact_Eval,
	        @PCAOB_Results,
          @EMTSSRequi_Desc,
          @EMTAssignment_ID,
          @EMTSector_ID,
          @Validated,
          @Created_By
        );

        SELECT SCOPE_IDENTITY() as id;
      `);

    return res.json({
      id: result.recordset?.[0]?.id,
      Employee_ID,
      Entity_ID,
      FY,
      Key_EMT_PFY
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica

export const getReappointByID = async (req, res) => {
  const { EMTReapp_PK } = req.params;

  if (EMTReapp_PK == null) {
    return res.status(400).json({ msg: "Bad Request. EMTReapp_PK is required" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTReapp_PK", sql.Int, EMTReapp_PK)
      .query("SELECT * FROM EMT_tbl_Reappoint WHERE EMTReapp_PK = @EMTReapp_PK");

    if (result.recordset.length === 0) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterReappointCurrent = async (req, res) => {
  const { EMTReapp_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (EMTReapp_PK == null || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTReapp_PK", sql.Int, Number(EMTReapp_PK))
      .input("Is_Current", sql.Bit, Boolean(Is_Current))
      .input("Modified_By", sql.VarChar(100), String(Modified_By))
      .query(`
        UPDATE EMT_tbl_Reappoint
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMTReapp_PK = @EMTReapp_PK
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMTReapp_PK: Number(EMTReapp_PK),
      Is_Current: Boolean(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};