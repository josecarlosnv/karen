import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getAllBU = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT * FROM EMT_dim_BU where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getBU = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT distinct BU_ID, BU_Desc FROM EMT_dim_BU where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getSegment = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT distinct Segment_ID, Segment_Desc FROM EMT_dim_BU where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar
export const getOffice = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query("SELECT distinct Office_ID, Office_Desc, BU_ID, BU_Desc FROM EMT_dim_BU where Is_Current = 1");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//insertar
export const newBU = async (req, res) => {
  const {BU_ID,
    BU_Desc,
    Segment_ID,
    Segment_Desc,
    Office_ID,
    Office_Desc,
    CostCenter,
    CostCenter_Descrip,
    Email_Address_Business_PIC
  } = req.body;

  if (BU_ID == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
    .input("BU_ID", sql.Int, req.body.BU_ID)
    .input("BU_Desc", sql.VarChar, req.body.BU_Desc)
    .input("Segment_ID", sql.VarChar, req.body.Segment_ID)
    .input("Segment_Desc", sql.VarChar, req.body.Segment_Desc)
    .input("Office_ID", sql.VarChar, req.body.Office_ID)
    .input("Office_Desc", sql.VarChar, req.body.Office_Desc)
    .input("CostCenter", sql.Int, req.body.CostCenter)
    .input("CostCenter_Descrip", sql.VarChar, req.body.CostCenter_Descrip)
    .input("Email_Address_Business_PIC", sql.VarChar, req.body.Email_Address_Business_PIC)
    .query(`
        INSERT INTO EMT_dim_BU (
            BU_ID
            ,BU_Desc
            ,Segment_ID
            ,Segment_Desc
            ,Office_ID
            ,Office_Desc
            ,CostCenter
            ,CostCenter_Descrip
            ,Email_Address_Business_PIC
        )
        VALUES(
            @BU_ID
            ,@BU_Desc
            ,@Segment_ID
            ,@Segment_Desc
            ,@Office_ID
            ,@Office_Desc
            ,@CostCenter
            ,@CostCenter_Descrip
            ,@Email_Address_Business_PIC
        );
        SELECT SCOPE_IDENTITY() as id;`
    );
    res.json({
      BU_ID,
      id: result.recordset[0].id,
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//cambiar vigencia
export const alterBUCurrent = async (req, res) => {
  const { EMT_BU_PK } = req.params;
  const { Is_Current } = req.body;

  if (EMT_BU_PK == null) {
    return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EMT_BU_PK", sql.Int, Number(EMT_BU_PK))
      .input("Is_Current", sql.Int, Is_Current)
      .query(`
        UPDATE EMT_dim_BU
        SET Is_Current = @Is_Current
        WHERE EMT_BU_PK = @EMT_BU_PK
      `);

    if (!result.rowsAffected?.[0]) return res.sendStatus(404);

    return res.json({
      EMT_BU_PK: Number(EMT_BU_PK),
      Is_Current,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
