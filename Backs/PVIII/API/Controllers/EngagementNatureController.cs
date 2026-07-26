using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EngagementNatureController : Controller
    {
          
        private readonly NatureBL _CatNature;

        public EngagementNatureController(NatureBL CatNature)
        {
            _CatNature = CatNature;
        }
        [HttpGet("Nature")]
        public IActionResult GetSegmentos()
        {
            var result = _CatNature.GetNature();
            return Ok(result);
        }
    }
}
