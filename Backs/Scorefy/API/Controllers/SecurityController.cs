//este archivo solo es para mostrar/ocultar icono de usuario
using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/security")]
    [EnableCors("FrontPolicy")]
    public class SecurityController : ControllerBase
    {
        private readonly ISecurityBL _bl;
        private readonly ILogger<SecurityController> _logger;

        public SecurityController(ISecurityBL bl, ILogger<SecurityController> logger)
        {
            _bl = bl;
            _logger = logger;
        }

        private string GetUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value
                ?? User.FindFirst("preferred_username")?.Value
                ?? User.FindFirst("upn")?.Value
                ?? User.Identity?.Name
                ?? "noreply@local";
        }
        

        // GET: /api/security/me
        [HttpGet("me")]
        public async Task<IActionResult> Me(CancellationToken ct)
        {
            var email = GetUserEmail();
            //var email = "epalomino@kpmg.com.mx";
            var dto = await _bl.GetMyAccessAsync(email, ct);
            return Ok(dto); // { hasSecurityAccess: bool, email, inEmployeesView }
        }

        [HttpGet("guard")]
        public async Task<IActionResult> Guard(CancellationToken ct) 
        {
            var email = GetUserEmail();
            //var email = "epalomino@kpmg.com.mx";
            var dto = await _bl.GetMyAccessAsync(email, ct);

            if (!dto.Allowed)
                return Unauthorized(new { message = "No tienes acceso al aplicativo." });

            return Ok(dto);
        }
    }
}
