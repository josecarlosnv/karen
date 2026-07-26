import { getConnection, sql } from "../database/connection.js";

////////////////////////////////////////////////////////////////////////////////////////////////////
// INSERT EMT_tbl_AssignmentsValidationCriteria
export const newAssignmentValidationCriteria = async (req, res) => {
  const {
    Key_EMT,
    Competence_To_Perform,
    EMT_SR_Requi_ID_Concat,
    Has_Threats,
    Has_Threats_Desc,
    Changes_Nature,
    Changes_Legal_Regulatory,
    Changes_Industry,
    Changes_Complexity,
    Sufficient_Time,
    Member_of_the_engagement,
    Experience_Similar,
    Cooling_Off_Applied,    
    No_responsibility,
    Able_Carry_With_Objectivity_Integrity_Impartiality,
    Created_By
  } = req.body;

  if (!Created_By) {
    return res
      .status(400)
      .json({ msg: "Bad Request. Please fill all required fields" });
  }

  try {
    const pool = await getConnection();

    await pool.request()
      .input("Key_EMT", sql.UniqueIdentifier, Key_EMT)
      .input("Competence_To_Perform", sql.VarChar, Competence_To_Perform)
      .input("EMT_SR_Requi_ID_Concat", sql.VarChar, EMT_SR_Requi_ID_Concat)
      .input("Has_Threats", sql.Bit, Has_Threats)
      .input("Has_Threats_Desc", sql.VarChar, Has_Threats_Desc)
      .input("Changes_Nature", sql.Bit, Changes_Nature)
      .input(
        "Changes_Legal_Regulatory",
        sql.Bit,
        Changes_Legal_Regulatory
      )
      .input("Changes_Industry", sql.Bit, Changes_Industry)
      .input("Changes_Complexity", sql.Bit, Changes_Complexity)
      .input("Sufficient_time", sql.Bit, Sufficient_Time)
            .input("Member_of_the_engagement", sql.Bit, Member_of_the_engagement)

      
      .input("No_responsibility", sql.Bit, No_responsibility)
      .input("Two_Year_Cooling", sql.Bit, Cooling_Off_Applied)
      .input(
          "Able_Carry_With_Objectivity_Integrity_Impartiality",
          sql.Bit,
          Able_Carry_With_Objectivity_Integrity_Impartiality
        )
      .input("Created_By", sql.VarChar, Created_By)
      .query(`
        INSERT INTO EMT_tbl_AssignmentsValidationCriteria (
            Key_EMT,
            Competence_To_Perform,
            EMT_SR_Requi_ID_Concat,
            Has_Threats,
            Has_Threats_Desc,
            Changes_Nature,
            Changes_Legal_Regulatory,
            Changes_Industry,
            Changes_Complexity,
            Sufficient_time,
            Member_of_the_engagement,
            Two_Year_Cooling,
            No_responsibility,
            Able_Carry_With_Objectivity_Integrity_Impartiality,

            Created_By
        )
        VALUES (
            @Key_EMT,
            @Competence_To_Perform,
            @EMT_SR_Requi_ID_Concat,
            @Has_Threats,
            @Has_Threats_Desc,
            @Changes_Nature,
            @Changes_Legal_Regulatory,
            @Changes_Industry,
            @Changes_Complexity,
            @Sufficient_time,
            @Member_of_the_engagement,
            @Two_Year_Cooling,
            @No_Responsibility,
            @Able_Carry_With_Objectivity_Integrity_Impartiality,
            @Created_By
        )
      `);
      //Para ejecutar el store despues de crear un assigment
      await pool.request()
        .execute("EMT_sp_AssignmentsGenerated");
    res.json({
      msg: "Validation Criteria created successfully",
      Key_EMT
    });

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// GET EMT_tbl_AssignmentsValidationCriteria BY ID
export const getAssignmentValidationCriteriaById = async (req, res) => {
  const { Key_EMT } = req.params;

  if (!Key_EMT) {
    return res.status(400).json({
      msg: "Bad Request. Key_EMT is required",
    });
  }

  try {
    const pool = await getConnection();

    const result = await pool.request()
      .input("Key_EMT", sql.UniqueIdentifier, Key_EMT)
      .query(`
        SELECT *
        FROM EMT_tbl_AssignmentsValidationCriteria
        WHERE Key_EMT = @Key_EMT
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        msg: "Validation Criteria not found",
      });
    }

    res.json(result.recordset[0]);

  } catch (error) {
    res.status(500).send(error.message);
  }
};