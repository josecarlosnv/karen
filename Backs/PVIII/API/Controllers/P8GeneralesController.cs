using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;

namespace API.Controllers
{
    //[Authorize]//esto se debe comentar para subir a server 
    [ApiController]
    [Route("api/[controller]")]
    public class P8GeneralesController : ControllerBase
    {
        private readonly P8GeneralesBL _bl;

        public P8GeneralesController(P8GeneralesBL bl)
        {
            _bl = bl;
        }
        private string GetUserEmail()
        {
            var email =
                User.FindFirst(ClaimTypes.Email)?.Value ??
                User.FindFirst("preferred_username")?.Value ??
                User.FindFirst("upn")?.Value ??
                User.Identity?.Name;

            if (!string.IsNullOrWhiteSpace(email) && email.Contains("\\"))
            {
                var username = email.Split("\\")[1];
                email = $"{username}@kpmg.com.mx";
            }

            return email ?? "noreply@local";
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var email = GetUserEmail();
            
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
            var buList = User.FindAll("BU").Select(c => c.Value).Distinct().ToList();
            var segments = User.FindAll("Segment").Select(c => c.Value).Distinct().ToList();
            var offices = User.FindAll("Office").Select(c => c.Value).Distinct().ToList();
            var hasDerived = User.HasClaim("DerivedAccess", "Master_Current");
            var hasNetwork = User.HasClaim("DerivedAccess", "Employee_Level");
            var networkId = User.Identity?.Name?.Contains("\\") == true
                    ? User.Identity.Name.Split("\\")[1].ToLower()
                    : null;
            
            Result result = await _bl.GetAll(email, roles, buList, segments, offices, hasDerived, hasNetwork, networkId);

            return Ok(result);
        }
        [HttpPut("desactivate/{p8Id}")]
        public async Task<IActionResult> Deactivate(Guid p8Id)
        {
            var email = GetUserEmail();

            await _bl.Deactivate(p8Id, email);

            return NoContent();
        }
        [HttpPut("IsLost/{p8Id}")]
        public async Task<IActionResult> IsLost(Guid p8Id)
        {
            var email = GetUserEmail();

            await _bl.ClientLost(p8Id, email);

            return NoContent();
        }
        [HttpPost("Duplicate/{p8Id}")]
        public async Task<IActionResult> Duplicate(Guid p8Id)
        {
            var email = GetUserEmail();

            var result = await _bl.DuplicateProject(p8Id, email);

            if (!result.Correct)
                return BadRequest(result);

            return Ok(result);
        }

    }
}
