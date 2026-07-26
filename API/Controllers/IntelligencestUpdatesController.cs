namespace API;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;

[ApiController]
[Route("api/[controller]")]
public class IntelligencestUpdatesController : ControllerBase
{
    private readonly IDbConnection _db;
    public IntelligencestUpdatesController(IDbConnection db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? type, [FromQuery] string? area)
    {
        var sql = "SELECT * FROM intelligencest_updates WHERE is_active = 1";
        if (!string.IsNullOrEmpty(type)) sql += " AND type = @Type";
        if (!string.IsNullOrEmpty(area) && area != "all")
            sql += " AND (area = @Area OR area = 'all')";
        sql += " ORDER BY display_order ASC";

        var result = await _db.QueryAsync<IntelligencestUpdate>(sql, new { Type = type, Area = area });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IntelligencestUpdateDto dto)
    {
        var sql = @"
            INSERT INTO intelligencest_updates
                (type, area, title, message, subtitle, icon, is_active, display_order, created_at, updated_at)
            VALUES
                (@Type, @Area, @Title, @Message, @Subtitle, @Icon, @IsActive, @DisplayOrder, GETDATE(), GETDATE());
            SELECT CAST(SCOPE_IDENTITY() AS INT);";
        var id = await _db.ExecuteScalarAsync<int>(sql, dto);
        return Ok(new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] IntelligencestUpdateDto dto)
    {
        var sql = @"
            UPDATE intelligencest_updates SET
                type=@Type, area=@Area, title=@Title, message=@Message,
                subtitle=@Subtitle, icon=@Icon, is_active=@IsActive,
                display_order=@DisplayOrder, updated_at=GETDATE()
            WHERE id=@Id";
        var rows = await _db.ExecuteAsync(sql, new { dto.Type, dto.Area, dto.Title, dto.Message, dto.Subtitle, dto.Icon, dto.IsActive, dto.DisplayOrder, Id = id });
        if (rows == 0) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM intelligencest_updates WHERE id=@Id", new { Id = id });
        if (rows == 0) return NotFound();
        return NoContent();
    }
}
