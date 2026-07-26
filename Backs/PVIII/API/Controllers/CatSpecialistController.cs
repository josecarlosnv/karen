using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{[Route("api/[controller]")]
    [ApiController]
    public class CatSpecialistController : Controller
    {
        private readonly CatSpecialistBL _catSpecialistBL;

        public CatSpecialistController(CatSpecialistBL catSpecialistBL)
        {
            _catSpecialistBL = catSpecialistBL;
        }

        [HttpGet("CatSpecialist")]
        public IActionResult GetCatSpecialists()
        {
            var result = _catSpecialistBL.GetCatSpecialists();
            return Ok(result);
        }
    }
}