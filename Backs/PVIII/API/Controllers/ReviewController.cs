using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewBL _reviewBL;

        public ReviewController(ReviewBL reviewBL)
        {
            _reviewBL = reviewBL;
        }

        [HttpGet("index")]
        public IActionResult Index()
        {
            return Ok("Review API working");
        }
    }
}