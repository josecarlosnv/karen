import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getAssignApprs = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_tbl_ActivesApprobals");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newAssignAppr = async (req, res) => {
  const {
      Key_EMT,
      PIC,
      PIC_Email_Address_Business,
      PIC_Comment,
      PIC_Date ,
      Deputy,
      Deputy_Email_Address_Business,
      Deputy_Comment,
      Deputy_Date,
      CPPP,
      CPPP_Email_Address_Business,
      CPPP_Comment,
      CPPP_Date,
      Created_By
    } = req.body;

  if (Key_EMT == null || Created_By == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("Key_EMT", sql.VarChar, req.body.Key_EMT)
      .input("PIC", sql.Int, req.body.PIC)
      .input("PIC_Email_Address_Business", sql.VarChar, req.body.PIC_Email_Address_Business)
      .input("PIC_Comment", sql.VarChar, req.body.PIC_Comment)
      .input("PIC_Date", sql.DateTime, req.body.PIC_Date)
      .input("Deputy", sql.Int, req.body.Deputy)
      .input("Deputy_Email_Address_Business", sql.VarChar, req.body.Deputy_Email_Address_Business)
      .input("Deputy_Comment", sql.VarChar, req.body.Deputy_Comment)
      .input("Deputy_Date", sql.DateTime, req.body.Deputy_Date)
      .input("CPPP", sql.Int, req.body.CPPP)
      .input("CPPP_Email_Address_Business", sql.VarChar, req.body.CPPP_Email_Address_Business)
      .input("CPPP_Comment", sql.VarChar, req.body.CPPP_Comment)
      .input("CPPP_Date", sql.DateTime, req.body.CPPP_Date)
      .input("Created_By", sql.VarChar, req.body.Created_By)
      .query(
        `INSERT INTO EMT_tbl_ActivesApprobals (
          Key_EMT, 
          PIC,
          PIC_Email_Address_Business,
          PIC_Comment,
          PIC_Date,
          Deputy,
          Deputy_Email_Address_Business,
          Deputy_Comment,
          Deputy_Date,
          CPPP,
          CPPP_Email_Address_Business,
          CPPP_Comment,
          CPPP_Date,
          Created_By
        ) VALUES (
          @Key_EMT,
          @PIC,
          @PIC_Email_Address_Business,
          @PIC_Comment,
          @PIC_Date,
          @Deputy,
          @Deputy_Email_Address_Business,
          @Deputy_Comment,
          @Deputy_Date,
          @CPPP,
          @CPPP_Email_Address_Business,
          @CPPP_Comment,
          @CPPP_Date,
          @Created_By
        ); SELECT SCOPE_IDENTITY() as id`
      );

    res.json({
      Key_EMT,
      PIC,
      PIC_Email_Address_Business,
      PIC_Comment,
      PIC_Date ,
      Deputy,
      Deputy_Email_Address_Business,
      Deputy_Comment,
      Deputy_Date,
      CPPP,
      CPPP_Email_Address_Business,
      CPPP_Comment,
      CPPP_Date,
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
export const getAssignApprByID = async (req, res) => {
  const { EMTActivAppr_PK } = req.params;

  if (!EMTActivAppr_PK) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTActivAppr_PK", EMTActivAppr_PK)
      .query("SELECT * FROM EMT_tbl_ActivesApprobals WHERE EMTActivAppr_PK = @EMTActivAppr_PK");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterAssignApprCurrent = async (req, res) => {
  const { EMTActivAppr_PK } = req.params;
  const { Is_Current, Modified_By } = req.body;

  if (!EMTActivAppr_PK || Modified_By == null || Is_Current == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMTActivAppr_PK", sql.Int, Number(EMTActivAppr_PK)) // usa BigInt si aplica
      .input("Is_Current", sql.Int, Number(Is_Current))
      .input("Modified_By", sql.VarChar, String(Modified_By))
      .query(`
        UPDATE EMT_tbl_ActivesApprobals
        SET Modified = GETDATE(),
            Is_Current = @Is_Current,
            Modified_By = @Modified_By
        WHERE EMTActivAppr_PK = @EMTActivAppr_PK
      `);

    if (result.rowsAffected?.[0] === 0) return res.sendStatus(404);

    return res.json({
      EMTActivAppr_PK: Number(EMTActivAppr_PK),
      Is_Current: Number(Is_Current),
      Modified_By: String(Modified_By),
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};


