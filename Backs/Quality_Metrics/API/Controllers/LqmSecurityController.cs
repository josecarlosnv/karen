using BL;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/lqm/security")]
    [EnableCors("FrontPolicy")]
    public class LqmSecurityController : ControllerBase
    {
        private readonly ILqmSecurityBL _bl;
        public LqmSecurityController(ILqmSecurityBL bl) => _bl = bl;

        private string GetUserEmail() =>
            User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local";

        [HttpGet("me")]
        public async Task<IActionResult> Me(CancellationToken ct)
            => Ok(await _bl.GetMyAccessAsync(GetUserEmail(), ct));

        [HttpGet("guard")]
        public async Task<IActionResult> Guard(CancellationToken ct)
        {
            var dto = await _bl.GetMyAccessAsync(GetUserEmail(), ct);
            return dto.Allowed ? Ok(dto)
                 : Unauthorized(new { message = "No tienes acceso al aplicativo." });
        }

        [HttpGet("performance/guard")]
        public async Task<IActionResult> PerformanceGuard(CancellationToken ct)
        {
            var dto = await _bl.GetMyAccessAsync(GetUserEmail(), ct);
            return dto.CanAccessPerformance ? Ok(dto)
                 : StatusCode(403, new { message = "Solo Partner/Director (o All) entran a Performance." });
        }

        [HttpGet("bu-evaluation/guard")]
        public async Task<IActionResult> BuEvaluationGuard(CancellationToken ct)
        {
            var dto = await _bl.GetMyAccessAsync(GetUserEmail(), ct);
            return dto.CanAccessBuEvaluation ? Ok(dto)
                 : StatusCode(403, new { message = "Solo BU PIC (o All) entran a la evaluación de BU." });
        }
        [HttpGet("hofa/guard")]
        public async Task<IActionResult> HofaGuard(CancellationToken ct)
        {
            var dto = await _bl.GetMyAccessAsync(GetUserEmail(), ct);
            return dto.CanAccessHofA ? Ok(dto)
                 : StatusCode(403, new { message = "Solo BU PIC o HofA pueden acceder a esta sección." });
        }
        [HttpGet("partners/guard")]
        public async Task<IActionResult> PartnersGuard(CancellationToken ct)
        {
            var dto = await _bl.GetMyAccessAsync(GetUserEmail(), ct);
            return dto.CanAccessPartners ? Ok(dto)
                 : StatusCode(403, new { message = "Solo BU PIC o HofA pueden acceder a Partners & Directors." });
        }


    }
}
