namespace API;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;

[ApiController]
[Route("api/[controller]")]
public class IntelligencestResearchLibraryController : ControllerBase
{
    private readonly IDbConnection _db;
    public IntelligencestResearchLibraryController(IDbConnection db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var sql = "SELECT * FROM intelligencest_research_library WHERE is_active = 1";
        if (!string.IsNullOrEmpty(category)) sql += " AND category = @Category";
        sql += " ORDER BY display_order ASC";

        var result = await _db.QueryAsync<IntelligencestResearchLibrary>(sql, new { Category = category });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IntelligencestResearchLibraryDto dto)
    {
        var sql = @"
            INSERT INTO intelligencest_research_library
                (category, title, description, badge, external_link, is_active, display_order, created_at, updated_at)
            VALUES
                (@Category, @Title, @Description, @Badge, @ExternalLink, @IsActive, @DisplayOrder, GETDATE(), GETDATE());
            SELECT CAST(SCOPE_IDENTITY() AS INT);";
        var id = await _db.ExecuteScalarAsync<int>(sql, dto);
        return Ok(new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] IntelligencestResearchLibraryDto dto)
    {
        var sql = @"
            UPDATE intelligencest_research_library SET
                category=@Category, title=@Title, description=@Description,
                badge=@Badge, external_link=@ExternalLink, is_active=@IsActive,
                display_order=@DisplayOrder, updated_at=GETDATE()
            WHERE id=@Id";
        var rows = await _db.ExecuteAsync(sql, new { dto.Category, dto.Title, dto.Description, dto.Badge, dto.ExternalLink, dto.IsActive, dto.DisplayOrder, Id = id });
        if (rows == 0) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var rows = await _db.ExecuteAsync("DELETE FROM intelligencest_research_library WHERE id=@Id", new { Id = id });
        if (rows == 0) return NotFound();
        return NoContent();
    }
}
