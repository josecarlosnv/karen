using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController : Controller
    {
        private readonly CountryBL _Country;

        public CountryController(CountryBL country)
        {
            _Country = country;
        }
        [HttpGet("Country")]
        public IActionResult GetCountry()
        {
            var result = _Country.GetCountry();
            return Ok(result);
        }
    }


    
}
