import {getConnection, sql} from "../database/connection.js";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consultar 
//consumo por medio de paginacion 
//para consumirlo es asi -> vw_Entities?page=1&limit=24
export const getvwEntities = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    const offset = (page - 1) * limit;

    const pool = await getConnection();

    const result = await pool
      .request()
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(`
        SELECT *
        FROM vw_Entities
        ORDER BY EntityID
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    res.json(result.recordset);

  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//consulta especifica
export const getvwEntiteByID = async (req, res) => {
  const { EntityID } = req.params;

  if (EntityID == null || String(EntityID).trim() === "" || isNaN(Number(EntityID))) {
    return res.status(400).json({ msg: "Bad Request. Please provide a valid EntityID" });
  }

  try {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input("EntityID", sql.Int, Number(EntityID))
      .query("SELECT * FROM vw_Entities WHERE EntityID = @EntityID");

    if (!result.recordset?.length) {
      return res.status(404).json({ msg: "Not found" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};