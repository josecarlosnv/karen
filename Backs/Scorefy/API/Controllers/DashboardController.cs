// Controllers/DashboardController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [ApiController]
   
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly BL.IDashboardBL _bl;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(BL.IDashboardBL bl, ILogger<DashboardController> logger)
        {
            _bl = bl;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> Get(CancellationToken ct)
        {
            //var email = "yazminponce@kpmg.com.mx";
            var email = GetUserEmail();

            var summary = await _bl.GetSummaryAsync(email, ct);
            if (!summary.Correct)
                return StatusCode(500, new { summary.ErrorMessage });

            var recent = await _bl.GetRecentActivityAsync(email, 3, ct);
            if (!recent.Correct)
                return StatusCode(500, new { recent.ErrorMessage });

            return Ok(new
            {
                summary = summary.Object,
                recent = recent.Object
            });
        }
         
        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int top = 10, CancellationToken ct = default)
        {
            var email = GetUserEmail();
            //var email = "yazminponce@kpmg.com.mx";
            var recent = await _bl.GetRecentActivityAsync(email, top, ct);

            return recent.Correct
                ? Ok(recent.Object)
                : StatusCode(500, new { recent.ErrorMessage });
        }

        private string GetUserEmail()
        {
            return User.FindFirst(ClaimTypes.Email)?.Value
                ?? User.FindFirst("preferred_username")?.Value
                ?? User.FindFirst("upn")?.Value
                ?? User.Identity?.Name
                ?? "noreply@local";
        }
    }
}