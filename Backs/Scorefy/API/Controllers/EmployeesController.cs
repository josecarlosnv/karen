
using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/employees")]
[EnableCors("FrontPolicy")]
public class EmployeesController : ControllerBase 
{
    private readonly ISecurityDirectoryBL _bl;
    public EmployeesController(ISecurityDirectoryBL bl) => _bl = bl;

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? term, CancellationToken ct = default)
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local"; 
        var res = await _bl.SearchEmployeesAsync(email, term, page : 1, pageSize: int.MaxValue, ct);
        if (!res.Correct) return StatusCode(500, new { message = res.ErrorMessage ?? "Error interno de búsqueda." });

        return Ok(new
        {
            items = (IEnumerable<ML.EmployeeLookupDto>)res.Object ?? Array.Empty<ML.EmployeeLookupDto>()
        });
    }
}

