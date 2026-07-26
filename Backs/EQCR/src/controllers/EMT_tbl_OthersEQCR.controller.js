import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getOthersEQCR = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_OthersEQCR where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newOtherEQCR = async (req, res) => {
  const {
      First_Name,
      Last_Name,
      Email_Address_Business,
      Location_Name,
      Local_Job_Level_Name,
      Years_In_Role,
      Area_From,
      Created_By
    } = req.body;

  if (
    First_Name == null || 
    Last_Name == null || 
    Local_Job_Level_Name == null || 
    Created_By == null
  ) 
  {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("First_Name", sql.VarChar, req.body.First_Name)
      .input("Last_Name", sql.VarChar, req.body.Last_Name)
      .input("Email_Address_Business", sql.VarChar, req.body.Email_Address_Business)
      .input("Location_Name", sql.VarChar, req.body.Location_Name)
      .input("Local_Job_Level_Name", sql.VarChar, req.body.Local_Job_Level_Name)
      .input("Years_In_Role", sql.Int, req.body.Years_In_Role)
      .input("Area_From", sql.VarChar, req.body.Area_From)
      .input("Created_By", sql.VarChar, req.body.Created_By)
      .query(
        `INSERT INTO EMT_tbl_OthersEQCR (
          First_Name,
          Last_Name,
          Email_Address_Business,
          Location_Name,
          Local_Job_Level_Name,
          Years_In_Role,
          Area_From,
          Created_By
        ) VALUES (
          @First_Name,
          @Last_Name,
          @Email_Address_Business,
          @Location_Name,
          @Local_Job_Level_Name,
          @Years_In_Role,
          @Area_From,
          @Created_By
        ); SELECT SCOPE_IDENTITY() as id;
        
        exec EMT_sp_ColabsGenerator`
      );

    res.json({
      First_Name,
      Last_Name,
      Email_Address_Business,
      Location_Name,
      Local_Job_Level_Name,
      Years_In_Role,
      Area_From,
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
export const getOtherEQCRByID = async (req, res) => {
  const { EMT_Employee_ID } = req.params;

  if (!EMT_Employee_ID) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_Employee_ID", sql.Int, EMT_Employee_ID)
      .query(`
        SELECT *
        FROM EMT_tbl_OthersEQCR
        WHERE EMT_Employee_ID = @EMT_Employee_ID
      `);

    if (!result.recordset.length) return res.sendStatus(404);

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterOtherEQCRCurrent = async (req, res) => {
  const { EMT_Employee_ID } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!EMT_Employee_ID || Is_Current == null || Modified_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_Employee_ID", sql.Int, EMT_Employee_ID)
      .input("Is_Current", sql.Int, Number(Is_Current))
      .input("Modified_By", sql.VarChar, String(Modified_By))
      .query(`
        UPDATE EMT_tbl_OthersEQCR
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMT_Employee_ID = @EMT_Employee_ID
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMT_Employee_ID,
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};
