import { getConnection, sql } from "../database/connection.js";

export const getDashboardKPIs = async (req, res) => {
  try {
    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT

      (
        SELECT COUNT(*)
        FROM EMT_tbl_CredentialsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'CPPP Pending',
            'CPPP returned to review',
            'CPPP and Deputy returned to review'
          )
      ) AS CredentialsCPPPPending,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_CredentialsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'CPPP Pending',
            'CPPP returned to review',
            'CPPP and Deputy returned to review'
          )
      ) AS CredentialsCPPPTotal,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_CredentialsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'Deputy Pending',
            'Deputy returned to review',
            'CPPP and Deputy returned to review'
          )
      ) AS CredentialsDeputyPending,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_CredentialsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'Deputy Pending',
            'Deputy returned to review',
            'CPPP and Deputy returned to review'
          )
      ) AS CredentialsDeputyTotal,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'CPPP Pending',
            'CPPP returned to review',
            'CPPP, Deputy and PIC returned to review'
          )
      ) AS AssignmentsCPPPPending,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'CPPP Pending',
            'CPPP returned to review',
            'CPPP, Deputy and PIC returned to review'
          )
      ) AS AssignmentsCPPPTotal,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'Deputy Pending',
            'Deputy returned to review',
            'CPPP, Deputy and PIC returned to review'
          )
      ) AS AssignmentsDeputyPending,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_Label IN (
            'Deputy Pending',
            'Deputy returned to review',
            'CPPP, Deputy and PIC returned to review'
          )
      ) AS AssignmentsDeputyTotal,

      
      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_ID IN (4,7)
      ) AS DonutPending,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_ID = 1
      ) AS DonutApproved,

      (
        SELECT COUNT(*)
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Is_Current = 1
          AND Status_ID IN (5,6)
      ) AS DonutDraft
    `);

    res.json(result.recordset[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
////////////////////////////////////////////////////////////////
//////////para consultar el link de dash de EQCR
export const getEQCRDashboardLink = async (req, res) => {
  try {

    const pool = await getConnection();

    const result = await pool.request().query(`
      SELECT TOP 1
        title,
        external_link
      FROM intelligencest_research_library
      WHERE category = 'EQCR'
        AND is_active = 1
      ORDER BY display_order ASC
    `);

    return res.json(
      result.recordset[0] || null
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};