import { getConnection, sql } from "../database/connection.js";
import { randomUUID } from "crypto";
////////////////////////////////////////////////////////////////////////////////////////////////////
// INSERT EMT_tbl_AssignmentsBasicInformation
export const newAssignmentBasicInformation = async (req, res) => {
  const Key_EMT = randomUUID();
 

  const {
    //Key_EMT,
    Key_EMT_PFY,
    Fiscal_Year_EMT,
    Employee_ID,
    Year_Appointment,
    Year_Reappointment,
    EMT_Type_PK,
    Assistant_Employee_ID,
    EMT_Reason_ID,
    CEAC_ID,
    Engagement_Name,
    Entity_ID,
    LeadPartner_Employee_ID,
    Ready_to_Complete,
    Ready_to_Approve,
    Created_By
  } = req.body;
 console.log("BODY RECEIVED:");
    console.log(req.body);
  if (
    //!Key_EMT ||
    !Employee_ID ||
    !Year_Appointment ||
    !EMT_Type_PK ||
    !Created_By
  ) {
    return res
      .status(400)
      .json({ msg: "Bad Request. Please fill all required fields" });
  }

  try {
    const pool = await getConnection();

    await pool.request()
      .input("Key_EMT", sql.UniqueIdentifier, Key_EMT)
      .input("Key_EMT_PFY", sql.UniqueIdentifier, Key_EMT_PFY || null)
      .input("Fiscal_Year_EMT", sql.Int, Fiscal_Year_EMT)
      .input("Employee_ID", sql.BigInt, Employee_ID)
      .input("Year_Appointment", sql.Int, Year_Appointment)
      .input("Year_Reappointment", sql.Int, Year_Reappointment)
      .input("EMT_Type_PK", sql.Int, EMT_Type_PK)
      .input("Assistant_Employee_ID", sql.Int, Assistant_Employee_ID)
      .input("EMT_Reason_ID", sql.Int, EMT_Reason_ID)
      .input("CEAC_ID", sql.VarChar, CEAC_ID)
      .input("Engagement_Name", sql.VarChar, Engagement_Name)
      .input("Entity_ID", sql.VarChar, Entity_ID)
      .input("LeadPartner_Employee_ID",sql.BigInt,LeadPartner_Employee_ID)
      .input("Ready_to_Approve", sql.Bit, Ready_to_Approve || 0)
      .input("Ready_to_Complete", sql.Bit, Ready_to_Complete || 0)
      .input("Created_By", sql.VarChar, Created_By)
      .query(`
        INSERT INTO EMT_tbl_AssignmentsBasicInformation (
            Key_EMT,
            Key_EMT_PFY,
            Fiscal_Year_EMT,
            Employee_ID,
            Year_Appointment,
            Year_Reappointment,
            EMT_Type_PK,
            Assistant_Employee_ID,
            EMT_Reason_ID,
            CEAC_ID,
            Engagement_Name,
            Entity_ID,
            LeadPartner_Employee_ID,
                Ready_to_Complete,
            Ready_to_Approve,
            Created_By
        )
        VALUES (
            @Key_EMT,
            @Key_EMT_PFY,
            @Fiscal_Year_EMT,
            @Employee_ID,
            @Year_Appointment,
            @Year_Reappointment,
            @EMT_Type_PK,
            @Assistant_Employee_ID,
            @EMT_Reason_ID,
            @CEAC_ID,
            @Engagement_Name,
            @Entity_ID,
            @LeadPartner_Employee_ID,
            @Ready_to_Complete,
            @Ready_to_Approve,
            @Created_By
        )
      `);

    res.json({
      msg: "Assignment Basic Information created successfully",
      Key_EMT
    });

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};
/////////////////////////////////////////////////////////////////////////////
/////////////////
export const DeleteAssignmentBasicInformation = async (req, res) => {
  try {
    const { Key_EMT, user } = req.body; 
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("Key_EMT", sql.UniqueIdentifier, Key_EMT)
      .query(`
          SELECT *
          FROM EMT_tbl_AssignmentsBasicInformation
          WHERE Key_EMT = @Key_EMT
          AND Is_Current = 1
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Registro no encontrado",
      });
    }

    await pool
  .request()
  .input("Key_EMT", sql.UniqueIdentifier, Key_EMT)
  .input("Created_By", sql.VarChar(100), user)
  .query(`
      INSERT INTO EMT_tbl_AssignmentsBasicInformation (
          Key_EMT,
          Key_EMT_PFY,
          Fiscal_Year_EMT,
          Employee_ID,
          Year_Appointment,
          Year_Reappointment,
          EMT_Type_PK,
          EMT_Reason_ID,
          CEAC_ID,
          Engagement_Name,
          Entity_ID,
          LeadPartner_Employee_ID,
          Ready_to_Approve,
          Is_Current,
          Created_By
      )
      SELECT
          Key_EMT,
          Key_EMT_PFY,
          Fiscal_Year_EMT,
          Employee_ID,
          Year_Appointment,
          Year_Reappointment,
          EMT_Type_PK,
          EMT_Reason_ID,
          CEAC_ID,
          Engagement_Name,
          Entity_ID,
          LeadPartner_Employee_ID,
          Ready_to_Approve,
          0,
          @Created_By
      FROM EMT_tbl_AssignmentsBasicInformation
      WHERE Key_EMT = @Key_EMT
      AND Is_Current = 1
  `);
    await pool.request()
     .execute("EMT_sp_AssignmentsGenerated");
     res.json({  success: true,
       message: "Registro marcado como no vigente y AssignmentsGenerated actualizado",});
    

  } catch (error) {
    console.error("DeleteAssignmentBasicInformation ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
      sqlError: error.originalError?.info?.message,
    });
  }
};