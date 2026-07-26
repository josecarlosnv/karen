using BL;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IndustriaController : Controller
    {
        private readonly CatalogoIndustria _CatIndustria;
        public IndustriaController(CatalogoIndustria catalogoIndustria)
        {
            _CatIndustria = catalogoIndustria;
        }
        [HttpGet("Industrias")]
        public IActionResult GetIndustrias()
        {
            var result =_CatIndustria.GetIndustrias();
            return Ok(result);
        }
        
    }
}
