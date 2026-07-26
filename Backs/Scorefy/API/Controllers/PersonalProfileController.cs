

using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
    [Route("api/personal-profile")]
    [EnableCors("FrontPolicy")]
    public class PersonalProfileController : ControllerBase 
    {
        private readonly IPersonalProfileBL _bl;
        private readonly ILogger<PersonalProfileController> _logger;

        public PersonalProfileController(IPersonalProfileBL bl, ILogger<PersonalProfileController> logger)
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
        //private string GetUserEmail()
        //{
        //    return "irvinghernandez@kpmg.com.mx";
        //}

        // -----------------------------------------------
        // GET: /api/personal-profile/me
        // -----------------------------------------------
        [HttpGet("me")]
        public async Task<IActionResult> Me(CancellationToken ct)
        {
            var email = GetUserEmail();
            //var email = "yazminponce@kpmg.com.mx";
            var res = await _bl.GetOrCreateForEmailAsync(email, ct);

            if (!res.Correct)
                return StatusCode(500, new { message = res.ErrorMessage });

            return Ok(res.Object);
        }

        // -----------------------------------------------
        // PUT: /api/personal-profile/me
        // Insertar nueva versión (EventNumber++)
        // -----------------------------------------------
        [HttpPost("me")]
        public async Task<IActionResult> Update([FromForm] ML.PersonalProfileUpdateDto dto, CancellationToken ct)
        {
            //var email = "yazminponce@kpmg.com.mx";
            var email = GetUserEmail();
            var res = await _bl.UpdateMyProfileAsync(email, dto, ct);

            if (!res.Correct)
                return StatusCode(500, new { success = false, message = res.ErrorMessage });

            return Ok(new { success = true });
        }

        // -----------------------------------------------
        // GET: /api/personal-profile/managers
        // Sin límite, búsqueda opcional
        // -----------------------------------------------
        [HttpGet("managers")]
        public async Task<IActionResult> Managers([FromQuery] string? q, CancellationToken ct = default)
        {
            var res = await _bl.GetManagerOptionsAsync(q, int.MaxValue, ct);

            if (!res.Correct)
                return StatusCode(500, new { message = res.ErrorMessage });

            return Ok(res.Object);
        }
    }
}