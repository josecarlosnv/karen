using API.Services.Security;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ApprovalsSegController : Controller
    {


        private readonly ApprovalsClaimsTransformer _approvalsTransformer;

        public ApprovalsSegController(ApprovalsClaimsTransformer approvalsTransformer)
        {
            _approvalsTransformer = approvalsTransformer;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var transformedUser = await _approvalsTransformer.TransformAsync(User);

            var approver = transformedUser.FindFirst("Approver")?.Value;
            var practice = transformedUser.FindFirst("Practice")?.Value;

            var businessEmail = transformedUser.FindFirst("BusinessEmail")?.Value;
            var networkId = transformedUser.FindFirst("NetworkId")?.Value;

            if (approver == null)
                return Forbid();


            return Ok(new
            {
                Name = transformedUser.Identity?.Name,
                Email = businessEmail,   
                NetworkId = networkId,   
                Level = approver,
                Practice = practice
            });

        }


        [HttpGet("debug")]
        public IActionResult Debug()
        {
            return Ok(new
            {
                Name = User.Identity?.Name,
                Claims = User.Claims.Select(c => new { c.Type, c.Value })
            });
        }


    }
}
