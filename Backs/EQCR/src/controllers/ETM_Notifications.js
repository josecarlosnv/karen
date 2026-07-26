import { getConnection } from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// notifications
export const getNotifications = async (req, res) => {
  try {

    const roles = req.user?.roles || [];
    const isAll = req.user?.isAll || false;

    let assignmentsQuery = "";
    let credentialsQuery = "";

    if (isAll || roles.includes("ALL")) {

      assignmentsQuery = `
        SELECT COUNT(*) AS Total
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Status_Label IN ('CPPP Pending', 'Deputy Pending')
          AND Is_Current = 1
      `;

      credentialsQuery = `
        SELECT COUNT(*) AS Total
        FROM EMT_tbl_CredentialsGenerated
        WHERE Status_Label IN ('CPPP Pending', 'Deputy Pending')
          AND Is_Current = 1
      `;

    } else if (roles.includes("CPPP")) {

      assignmentsQuery = `
        SELECT COUNT(*) AS Total
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Status_Label = 'CPPP Pending'
          AND Is_Current = 1
      `;

      credentialsQuery = `
        SELECT COUNT(*) AS Total
        FROM EMT_tbl_CredentialsGenerated
        WHERE Status_Label = 'CPPP Pending'
          AND Is_Current = 1
      `;

    } else if (roles.includes("Deputy")) {

      assignmentsQuery = `
        SELECT COUNT(*) AS Total
        FROM EMT_tbl_AssignmentsGenerated
        WHERE Status_Label = 'Deputy Pending'
          AND Is_Current = 1
      `;

      credentialsQuery = `
        SELECT COUNT(*) AS Total
        FROM EMT_tbl_CredentialsGenerated
        WHERE Status_Label = 'Deputy Pending'
          AND Is_Current = 1
      `;

    } else {

      return res.json({
        assignments: 0,
        credentials: 0,
        total: 0
      });

    }

    const pool = await getConnection();

    const assignmentsResult = await pool
      .request()
      .query(assignmentsQuery);

    const credentialsResult = await pool
      .request()
      .query(credentialsQuery);

    const assignments =
      assignmentsResult.recordset[0]?.Total || 0;

    const credentials =
      credentialsResult.recordset[0]?.Total || 0;

    return res.json({
      assignments,
      credentials,
      total: assignments + credentials
    });

  } catch (error) {

    return res.status(500).json({
      msg: error.message
    });

  }
};