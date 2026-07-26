import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getCredencials = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_Credentials");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newCredencial = async (req, res) => {
  const {
    Is_Firm_Member, 
    Employee_ID, 
    Is_Assistant, 
    Understanding_Responsabilities, 
    NC_Evaluation, 
    PCAOB_Inspection_Results, 
    Indepence_Desc,
    Specific_Training, 
    Indutry_Experience,
    Ready_to_Approve,
    Created_By
  } = req.body;

  if (Employee_ID == null || 
      Understanding_Responsabilities == null || 
      Created_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("Is_Firm_Member", sql.Int, req.body.Is_Firm_Member)
      .input("Employee_ID", sql.Int, req.body.Employee_ID)
      .input("Is_Assistant", sql.Int, req.body.Is_Assistant)
      .input("Understanding_Responsabilities", sql.Int, req.body.Understanding_Responsabilities)
      .input("NC_Evaluation", sql.VarChar, req.body.NC_Evaluation)
      .input("PCAOB_Inspection_Results", sql.VarChar, req.body.PCAOB_Inspection_Results)
      .input("Indepence_Desc", sql.VarChar, req.body.Indepence_Desc)
      .input("Specific_Training", sql.VarChar, req.body.Specific_Training)
      .input("Indutry_Experience", sql.VarChar, req.body.Indutry_Experience)
      .input("Ready_to_Approve", sql.Int, req.body.Ready_to_Approve)
      .input("Created_By", sql.VarChar, req.body.Created_By)
      .query(
        `INSERT INTO EMT_tbl_Credentials (
          Is_Firm_Member,
          Employee_ID,
          Is_Assistant,
          Understanding_Responsabilities,
          NC_Evaluation,
          PCAOB_Inspection_Results,
          Indepence_Desc,
          Specific_Training,
          Indutry_Experience,
          Ready_to_Approve,
          Created_By
        ) VALUES (
          @Is_Firm_Member,
          @Employee_ID,
          @Is_Assistant,
          @Understanding_Responsabilities,
          @NC_Evaluation,
          @PCAOB_Inspection_Results,
          @Indepence_Desc,
          @Specific_Training,
          @Indutry_Experience,
          @Ready_to_Approve,
          @Created_By
        ); SELECT SCOPE_IDENTITY() as id;

        DECLARE @Deputy int,
          @CPPP int,
          @Deputy_Comment varchar(3000),
		      @CPPP_Comment varchar(3000);

        SELECT
          @Deputy = Deputy,
          @CPPP = CPPP,
          @Deputy_Comment = Deputy_Comment,
			    @CPPP_Comment = CPPP_Comment
        FROM EMT_tbl_CredentialsGenerated
        WHERE Employee_ID = @Employee_ID;

        IF (@Deputy <> 4 And @Deputy <> 1)
        BEGIN
            INSERT INTO EMT_tbl_CredentialsApprovals
            (
                Employee_ID,
                Approve_Level,
                Approve_Status,
                Approve_Comment,
                Approve_Email_Address_Business
            )
            VALUES
            (
                @Employee_ID,
                'Deputy',
                4,
                @Deputy_Comment,
                @Created_By
            );
        END;

        IF (@CPPP <> 4)
        BEGIN
            INSERT INTO EMT_tbl_CredentialsApprovals
            (
                Employee_ID,
                Approve_Level,
                Approve_Status,
                Approve_Comment,
                Approve_Email_Address_Business
            )
            VALUES
            (
                @Employee_ID,
                'CPPP',
                4,
                @CPPP_Comment,
                @Created_By
            );
        END;     
        
        exec EMT_sp_CredentialsGenerator;`
      );

    res.json({
      Is_Firm_Member, 
      Employee_ID, 
      Is_Assistant, 
      Understanding_Responsabilities, 
      NC_Evaluation, 
      PCAOB_Inspection_Results, 
      Indepence_Desc,
      Specific_Training, 
      Indutry_Experience,
      Ready_to_Approve,
      Created_By,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getCredencialByID = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("EMTCredent_PK", req.params.EMTCredent_PK)
      .query("SELECT * FROM EMT_tbl_Credentials WHERE EMTCredent_PK = @EMTCredent_PK");

    return res.json(result.recordset[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
//insertar
export const alterCredencialCurrent  = async (req, res) => {
  const { Employee_ID, Created_By } = req.body;

  if (Employee_ID == null || 
      Created_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("Employee_ID", sql.Int, req.body.Employee_ID)
      .input("Created_By", sql.VarChar, req.body.Created_By)
      .query(
        `INSERT INTO EMT_tbl_Credentials (
          Employee_ID,
          Is_Current,
          Created_By
        ) VALUES (
          @Employee_ID,
          0,
          @Created_By
        ); SELECT SCOPE_IDENTITY() as id;

        exec EMT_sp_CredentialsGenerator;`
      );

    res.json({
      Employee_ID, 
      Created_By,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

/*
export const alterCredencialCurrent = async (req, res) => {
  const { Employee_ID } = req.params;
  const { Is_Current } = req.body;

  if (!EMT_Credent_PK || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Employee_ID", sql.Int, Number(Employee_ID))
      .input("Is_Current", sql.Int, Number(Is_Current))
      .query(`
        UPDATE EMT_tbl_Credentials
        SET Modified = GETDATE(),
            Is_Current = @Is_Current
        WHERE EMT_Credent_PK = @EMT_Credent_PK;

        exec EMT_sp_CredentialsGenerator`);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMT_Credent_PK: Number(EMT_Credent_PK),
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
*/
