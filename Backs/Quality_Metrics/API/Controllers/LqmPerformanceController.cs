using BL;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/lqm/performance")]
    [EnableCors("FrontPolicy")]
    public class LqmPerformanceController : ControllerBase
    {
        private readonly ILqmPerformanceBL _bl;
        public LqmPerformanceController(ILqmPerformanceBL bl) => _bl = bl;

        private string GetUserEmail() =>
            User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local";

        [HttpGet("scope")]
        public async Task<IActionResult> Scope(CancellationToken ct)
            => Ok(await _bl.GetScopeAsync(GetUserEmail(), ct));

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> Get(string employeeId, CancellationToken ct)
        {
            var dto = await _bl.GetMetricsAsync(GetUserEmail(), employeeId, ct);
            return dto is null
                ? StatusCode(403, new { message = "No puedes ver la información de esta persona." })
                : Ok(dto);
        }

        [HttpPut("{employeeId}")]
        public async Task<IActionResult> Save(string employeeId, [FromBody] ML.LqmMetricsDto dto, CancellationToken ct)
        {
            dto.EmployeeId = employeeId;
            var ok = await _bl.SaveMetricsAsync(GetUserEmail(), dto, ct);
            return ok ? Ok(new { saved = true })
                      : StatusCode(403, new { message = "No puedes editar la información de esta persona." });
        }
    }
}
