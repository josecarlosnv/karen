using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuggestedCollaboratordController : Controller
    {
        private readonly SuggestedCollaboratordBL _SuggestedCollaboratord;

        public SuggestedCollaboratordController(SuggestedCollaboratordBL SuggestedCollaboratord)
        {
            _SuggestedCollaboratord = SuggestedCollaboratord;
        }
        [HttpGet("SuggestedCollaboratord")]
        public async Task<IActionResult> GetSuggestedCollaboratord()
        {
            var result = await _SuggestedCollaboratord.GetSuggestedCollaboratord();
            return Ok(result);
        }

    }
}
