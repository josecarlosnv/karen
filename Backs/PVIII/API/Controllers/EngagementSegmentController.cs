using BL;
using Microsoft.AspNetCore.Mvc;
using ML;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EngagementSegmentController : Controller
    {

        private readonly EngagementSegmentBL _CatEngagementSegment;

        public EngagementSegmentController(EngagementSegmentBL EngagementSegment)
        {
            _CatEngagementSegment = EngagementSegment;
        }
        [HttpGet("EngagementSegment")]
        public IActionResult GetEngagementSegment()
        {
            var result = _CatEngagementSegment.GetEngagementSegment();
            return Ok(result);
        }
    }
   
}
