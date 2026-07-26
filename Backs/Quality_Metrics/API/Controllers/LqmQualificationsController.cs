using BL;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/lqm/qualifications")]
    [EnableCors("FrontPolicy")]
    public class LqmQualificationsController : ControllerBase
    {
        private readonly ILqmQualificationsBL _bl;
        public LqmQualificationsController(ILqmQualificationsBL bl) => _bl = bl;

        private string GetUserEmail() =>
            User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local";

        [HttpGet("scope")]
        public async Task<IActionResult> Scope(CancellationToken ct)
            => Ok(await _bl.GetScopeAsync(GetUserEmail(), ct));

        [HttpGet("hofascope")]
        public async Task<IActionResult> HofaScope(CancellationToken ct)
            => Ok(await _bl.GetHofaScopeAsync(GetUserEmail(), ct));

        [HttpGet("{employeeId}/bu-people")]
        public async Task<IActionResult> BuPeople(string employeeId, CancellationToken ct)
            => Ok(await _bl.GetBuPeopleAsync(GetUserEmail(), employeeId, ct));

        [HttpGet("{employeeId}")]
        public async Task<IActionResult> Get(string employeeId, [FromQuery] string? set, CancellationToken ct)
        {
            var applicableTo = string.Equals(set, "HOFA", StringComparison.OrdinalIgnoreCase) ? "HOFA" : "PyD";
            var dto = await _bl.GetAsync(GetUserEmail(), employeeId, applicableTo, ct);
            return dto is null
                ? StatusCode(403, new { message = "No puedes ver la información de esta persona." })
                : Ok(dto);
        }

        [HttpPut("{employeeId}")]
        public async Task<IActionResult> Save(string employeeId, [FromQuery] string? set, [FromBody] ML.LqmQualificationSaveDto dto, CancellationToken ct)
        {
            var applicableTo = string.Equals(set, "HOFA", StringComparison.OrdinalIgnoreCase) ? "HOFA" : "PyD";
            var ok = await _bl.SaveAsync(GetUserEmail(), employeeId, applicableTo, dto, ct);
            return ok ? Ok(new { saved = true })
                      : StatusCode(403, new { message = "No puedes editar la información de esta persona." });
        }
        
        [HttpGet("{employeeId}/workload")]
        public async Task<IActionResult> Workload(string employeeId, CancellationToken ct)
            => Ok(await _bl.GetWorkloadAsync(GetUserEmail(), employeeId, ct));

        [HttpPut("workload/{employeeId}/waiver")]
        public async Task<IActionResult> SaveWaiver(string employeeId, [FromBody] ML.LqmWaiverSaveDto dto, CancellationToken ct)
        {
            var ok = await _bl.SaveWaiverAsync(GetUserEmail(), employeeId, dto.Waiver, ct);
            return ok ? Ok(new { saved = true })
                      : StatusCode(403, new { message = "No puedes editar el waiver." });
        }


        [HttpGet("hofa/report")]
        public async Task<IActionResult> HofaReport(CancellationToken ct)
            => Ok(await _bl.GetHofaReportAsync(GetUserEmail(), ct));

        [HttpGet("pyd/report")]
        public async Task<IActionResult> PydReport(CancellationToken ct)
            => Ok(await _bl.GetPydReportAsync(GetUserEmail(), ct));

    }
}
