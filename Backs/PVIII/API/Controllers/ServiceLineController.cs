using BL;
using Microsoft.AspNetCore.Mvc;
using ML;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceLineController : Controller
    {
        private readonly CatalogoServiceLine _catServiceLine;

        public ServiceLineController(CatalogoServiceLine catalogoServiceLine)
        {
            _catServiceLine = catalogoServiceLine;
        }

        [HttpGet("ServiceLines")]
        public IActionResult GetServiceLines()
        {
            var result = _catServiceLine.GetServiceLines();
            return Ok(result);
        }
    }
}