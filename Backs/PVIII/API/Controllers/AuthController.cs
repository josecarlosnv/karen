using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        [HttpGet("claims")]
        public IActionResult GetClaims()
        {
            var claims = User.Claims
                .GroupBy(c => c.Type)
                .ToDictionary(
                    g => g.Key,
                    g => g.Count() == 1
                         ? (object)g.First().Value
                         : g.Select(x => x.Value).ToList()
                );

            return Ok(claims);
        }
    }
}
