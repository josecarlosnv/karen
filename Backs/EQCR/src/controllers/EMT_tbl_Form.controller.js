import {getConnection, sql} from "../database/connection.js";

////////////////////////////////////////////////////////////////////////////////////////////////////
// INSERT EMT_tbl_Form
export const newForm = async (req, res) => {

const {
  EMT_Type_PK,
  Key_EMT,
	Employee_ID,
	Full_Name,
	Email_Address_Business,
	Local_Job_Level_Name,
	BU,
	Office,
	Entity_ID,
	Entity_Name,
	Year_Appointment,
  Criteria_A,
  Criteria_A_Comments,
  Criteria_B,
  Criteria_B_Comments,
  Perfomance_Requirements,
  Perfomance_Requirements_Comments,
  Documentation_Requirements,
  Documentation_Requirements_Comments,
  Assistant,
  Conduct_Requirements,
  Conduct_Requirements_Comments,
  Ready_to_Approve,
  Created_By
} = req.body;

  if ( 
    EMT_Type_PK == null &&
    Key_EMT == null &&
    Employee_ID == null &&
    Full_Name == null &&
    Email_Address_Business == null &&
    Local_Job_Level_Name == null &&
    BU == null &&
    Office == null &&
    Entity_ID == null &&
    Entity_Name == null &&
    Year_Appointment == null &&
    Created_By == null
  ) {
    return res.status(400).json({
      msg: "Bad Request. Missing fields"
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("EMT_Type_PK", sql.Int, req.body.EMT_Type_PK)
      .input("Key_EMT", sql.VarChar, req.body.Key_EMT)
      .input("Employee_ID", sql.Int, req.body.Employee_ID)
      .input("Full_Name", sql.VarChar, req.body.Full_Name)
      .input("Email_Address_Business", sql.VarChar, req.body.Email_Address_Business)
      .input("Local_Job_Level_Name", sql.VarChar, req.body.Local_Job_Level_Name)
      .input("BU", sql.VarChar, req.body.BU)
      .input("Office", sql.VarChar, req.body.Office)
      .input("Entity_ID", sql.Int, req.body.Entity_ID)
      .input("Entity_Name", sql.VarChar, req.body.Entity_Name)
      .input("Year_Appointment", sql.Int, req.body.Year_Appointment)
      .input("Criteria_A", sql.Int, req.body.Criteria_A)
      .input("Criteria_A_Comments", sql.VarChar, req.body.Criteria_A_Comments)
      .input("Criteria_B", sql.Int, req.body.Criteria_B)
      .input("Criteria_B_Comments", sql.VarChar, req.body.Criteria_B_Comments)
      .input("Perfomance_Requirements", sql.Int, req.body.Perfomance_Requirements)
      .input("Perfomance_Requirements_Comments", sql.VarChar, req.body.Perfomance_Requirements_Comments)
      .input("Documentation_Requirements", sql.Int, req.body.Documentation_Requirements)
      .input("Documentation_Requirements_Comments", sql.VarChar, req.body.Documentation_Requirements_Comments)
      .input("Assistant", sql.Int, req.body.Assistant)
      .input("Conduct_Requirements", sql.Int, req.body.Conduct_Requirements)
      .input("Conduct_Requirements_Comments", sql.VarChar, req.body.Conduct_Requirements_Comments)
      .input("Ready_to_Approve", sql.Int, req.body.Ready_to_Approve)
      .input("Created_By", sql.VarChar, req.body.Created_By)
      .query(
        `INSERT INTO EMT_tbl_Form (
          EMT_Type_PK,
          Key_EMT,
          Employee_ID,
          Full_Name,
          Email_Address_Business,
          Local_Job_Level_Name,
          BU,
          Office,
          Entity_ID,
          Entity_Name,
          Year_Appointment,
          Criteria_A,
          Criteria_A_Comments,
          Criteria_B,
          Criteria_B_Comments,
          Perfomance_Requirements,
          Perfomance_Requirements_Comments,
          Documentation_Requirements,
          Documentation_Requirements_Comments,
          Assistant,
          Conduct_Requirements,
          Conduct_Requirements_Comments,
          Ready_to_Approve,
          Created_By
        ) VALUES (
          @EMT_Type_PK,
          @Key_EMT,
          @Employee_ID,
          @Full_Name,
          @Email_Address_Business,
          @Local_Job_Level_Name,
          @BU,
          @Office,
          @Entity_ID,
          @Entity_Name,
          @Year_Appointment,
          @Criteria_A,
          @Criteria_A_Comments,
          @Criteria_B,
          @Criteria_B_Comments,
          @Perfomance_Requirements,
          @Perfomance_Requirements_Comments,
          @Documentation_Requirements,
          @Documentation_Requirements_Comments,
          @Assistant,
          @Conduct_Requirements,
          @Conduct_Requirements_Comments,
          @Ready_to_Approve,
          @Created_By
        ); SELECT SCOPE_IDENTITY() as id;    
        
        --exec EMT_sp_CredentialsGenerator;`
      );

    res.json({
      EMT_Type_PK,
      Key_EMT,
      Employee_ID,
      Full_Name,
      Email_Address_Business,
      Local_Job_Level_Name,
      BU,
      Office,
      Entity_ID,
      Entity_Name,
      Year_Appointment,
      Criteria_A,
      Criteria_A_Comments,
      Criteria_B,
      Criteria_B_Comments,
      Perfomance_Requirements,
      Perfomance_Requirements_Comments,
      Documentation_Requirements,
      Documentation_Requirements_Comments,
      Assistant,
      Conduct_Requirements,
      Conduct_Requirements_Comments,
      Ready_to_Approve,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


////////////////////////////////////////////////////////////////////////////////////////////////////
// GET EMT_tbl_Form
export const getForm = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`
      WITH LastFm as (
        select * from (select G.*, ROW_NUMBER() OVER (PARTITION BY G.Key_EMT order by G.Event_Number DESC) Mayor
        from EMT_tbl_Form G
      ) t where Mayor = 1)
      select * from LastFm where Is_Current = 1`);
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getFormbyID = async (req, res) => {

  const { Key_EMT } = req.params;

  if (!Key_EMT) {
    return res.status(400).json({
      success: false,
      message: "Key_EMT is required"
    });
  }

  try {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input(
        "Key_EMT",
        sql.VarChar(40),
        Key_EMT
      )
      .query(`
        SELECT TOP 1 *
        FROM EMT_tbl_Form
        WHERE Key_EMT = @Key_EMT
        ORDER BY EMT_Form_PK DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }

    return res.json(result.recordset[0]);

  } catch (error) {

    console.error("getFormbyID ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterFormCurrent = async (req, res) => {
  const { EMTForm_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!EMTForm_PK || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTForm_PK", sql.VarChar, EMTForm_PK) // VARCHAR
      .input("Is_Current", sql.Int, Number(Is_Current))
      .input("Modified_By", sql.VarChar, String(Modified_By))
      .query(`
        UPDATE EMT_tbl_Form
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMTForm_PK = @EMTForm_PK
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMTForm_PK,
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


/*
import {getConnection, sql} from "../database/connection.js";

////////////////////////////////////////////////////////////////////////////////////////////////////
// INSERT EMT_tbl_Form
export const newForm = async (req, res) => {

const {
  Key_EMT,

  Criteria_A,
  Criteria_A_Comments,

  Criteria_B,
  Criteria_B_Comments,

  Perfomance_Requirements,
  Perfomance_Requirements_Comments,

  Documentation_Requirements,
  Documentation_Requirements_Comments,

  Assistant,

  Conduct_Requirements,
  Conduct_Requirements_Comments,

  Ready_to_Approve
} = req.body;

  if (!Key_EMT) {
    return res.status(400).json({
      msg: "Bad Request. Key_EMT is required"
    });
  }

  try {

    const pool = await getConnection();

   const basicInfo = await pool.request()
  .input("Key_EMT", sql.VarChar(40), Key_EMT)
  .query(`
    SELECT TOP 1 *
    FROM EMT_tbl_AssignmentsBasicInformation
    WHERE Key_EMT = @Key_EMT
    ORDER BY EMT_AssiBasic_PK DESC
  `);

    if (basicInfo.recordset.length === 0) {
      return res.status(404).json({
        msg: "Assignment Basic Information not found"
      });
    }

    const assignment = basicInfo.recordset[0];

      const employee = await pool.request()
  .input("Employee_ID", sql.BigInt, assignment.Employee_ID)
  .query(`
    SELECT TOP 1
        Employee_ID,
        Full_Name,
        Local_Job_Level_Name,
        BU,
        Location_Name,
        Entity_ID,
        Entity_Name
    FROM EMT_tbl_AssignmentsGenerated
    WHERE Employee_ID = @Employee_ID
  `);

    if (employee.recordset.length === 0) {
      return res.status(404).json({
        msg: "Employee not found in EMT_tbl_AssignmentsGenerated"
      });
    }

    const emp = employee.recordset[0];


   const validation = await pool.request()
  .input("Key_EMT", sql.VarChar(40), Key_EMT)
  .query(`
    SELECT TOP 1 *
    FROM EMT_tbl_AssignmentsValidationCriteria
    WHERE Key_EMT = @Key_EMT
    ORDER BY EMT_AssiVali_PK DESC
  `);

    const criteria =
      validation.recordset.length > 0
        ? validation.recordset[0]
        : null;

    await pool.request()

      .input("EMT_Type_PK", sql.Int, assignment.EMT_Type_PK)
      .input("Key_EMT", sql.VarChar(40), Key_EMT)
      .input("Employee_ID", sql.BigInt, assignment.Employee_ID)
      .input("Full_Name", sql.VarChar(250), emp.Full_Name)
      .input("Local_Job_Level_Name", sql.VarChar(50), emp.Local_Job_Level_Name)
      .input("BU", sql.VarChar(20), emp.BU)
      .input("Office", sql.VarChar(30), emp.Location_Name)
      .input(
        "Entity_ID",
        sql.Decimal(20,0),
        Number(emp.Entity_ID)
      )
      .input(
        "Entity_Name",
        sql.VarChar(250),
        emp.Entity_Name
      )
      .input("Year_Appointment", sql.Int, assignment.Year_Appointment)
.input("Criteria_A", sql.Bit, Criteria_A)
.input(
  "Criteria_A_Comments",
  sql.VarChar(1000),
  Criteria_A_Comments
)

.input("Criteria_B", sql.Bit, Criteria_B)
.input(
  "Criteria_B_Comments",
  sql.VarChar(1000),
  Criteria_B_Comments
)

.input(
  "Perfomance_Requirements",
  sql.Bit,
  Perfomance_Requirements
)
.input(
  "Perfomance_Requirements_Comments",
  sql.VarChar(1000),
  Perfomance_Requirements_Comments
)

.input(
  "Documentation_Requirements",
  sql.Bit,
  Documentation_Requirements
)
.input(
  "Documentation_Requirements_Comments",
  sql.VarChar(1000),
  Documentation_Requirements_Comments
)

.input(
  "Assistant",
  sql.Bit,
  Assistant
)

.input(
  "Conduct_Requirements",
  sql.Bit,
  Conduct_Requirements
)
.input(
  "Conduct_Requirements_Comments",
  sql.VarChar(1000),
  Conduct_Requirements_Comments
)

      //.input("Ready_to_Approve", sql.Bit, assignment.Ready_to_Approve)
      //.input("Ready_to_Approve", sql.Bit, false)
.input("Ready_to_Approve",sql.Bit,Ready_to_Approve ?? false)
      .input("Created_By", sql.VarChar(80), assignment.Created_By)

      .query(`
        INSERT INTO EMT_tbl_Form
        (
            EMT_Type_PK,
            Key_EMT,
            Employee_ID,
            Full_Name,
            Local_Job_Level_Name,
            BU,
            Office,
            Entity_ID,
            Entity_Name,
            Year_Appointment,
            Criteria_A,
            Criteria_A_Comments,
            Criteria_B,
            Criteria_B_Comments,
            Perfomance_Requirements,
            Perfomance_Requirements_Comments,
            Documentation_Requirements,
            Documentation_Requirements_Comments,
            Assistant,
            Conduct_Requirements,
            Conduct_Requirements_Comments,
            Ready_to_Approve,
            Created_By
        )
        VALUES
        (
            @EMT_Type_PK,
            @Key_EMT,
            @Employee_ID,
            @Full_Name,
            @Local_Job_Level_Name,
            @BU,
            @Office,
            @Entity_ID,
            @Entity_Name,
            @Year_Appointment,
            @Criteria_A,
            @Criteria_A_Comments,
            @Criteria_B,
            @Criteria_B_Comments,
            @Perfomance_Requirements,
            @Perfomance_Requirements_Comments,
            @Documentation_Requirements,
            @Documentation_Requirements_Comments,
            @Assistant,
            @Conduct_Requirements,
            @Conduct_Requirements_Comments,
            @Ready_to_Approve,
            @Created_By
        )
      `);
await pool.request()
        .execute("EMT_sp_AssignmentsGenerated");
    
    return res.json({
      success: true,
      message: "Form created successfully",
      Key_EMT
    });

  } catch (error) {

    console.error("newForm ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////
// GET EMT_tbl_Form
export const getForm = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .query(`
        WITH LastRD AS (
          SELECT *
          FROM (
            SELECT
              G.*,
              ROW_NUMBER() OVER (
                PARTITION BY G.Key_EMT
                ORDER BY G.Event_Number DESC
              ) AS Mayor
            FROM EMT_tbl_Form G
          ) t
          WHERE Mayor = 1
        )

        SELECT
          EMT_Form_PK,
          EMT_Type_PK,
          Key_EMT,
          Employee_ID,
          Full_Name,
          Local_Job_Level_Name,
          BU,
          Office,
          Entity_ID,
          Entity_Name,
          Year_Appointment,
          Criteria_A,
          Criteria_B,
          Perfomance_Requirements,
          Documentation_Requirements,
          Assistant,
          Conduct_Requirements,
          Ready_to_Approve,
          Is_Current,
          Created,
          Created_By,
          Event_Number
        FROM LastRD
        WHERE Is_Current = 1
        ORDER BY EMT_Form_PK DESC
      `);

    res.json(result.recordset);

  } catch (error) {
    console.error("getForms ERROR");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getFormbyID = async (req, res) => {

  const { Key_EMT } = req.params;

  if (!Key_EMT) {
    return res.status(400).json({
      success: false,
      message: "Key_EMT is required"
    });
  }

  try {

    const pool = await getConnection();

    const result = await pool
      .request()
      .input(
        "Key_EMT",
        sql.VarChar(40),
        Key_EMT
      )
      .query(`
        SELECT TOP 1 *
        FROM EMT_tbl_Form
        WHERE Key_EMT = @Key_EMT
        ORDER BY EMT_Form_PK DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }

    return res.json(result.recordset[0]);

  } catch (error) {

    console.error("getFormbyID ERROR");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterFormCurrent = async (req, res) => {
  const { EMTForm_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!EMTForm_PK || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTForm_PK", sql.VarChar, EMTForm_PK) // VARCHAR
      .input("Is_Current", sql.Int, Number(Is_Current))
      .input("Modified_By", sql.VarChar, String(Modified_By))
      .query(`
        UPDATE EMT_tbl_Form
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMTForm_PK = @EMTForm_PK
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMTForm_PK,
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
*/
