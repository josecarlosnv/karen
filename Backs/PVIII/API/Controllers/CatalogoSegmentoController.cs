using BL;
using DL;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogoSegmentoController : Controller
    {

        private readonly CatalogoSegmento _catalogoSegmento;

        public CatalogoSegmentoController(CatalogoSegmento catalogoSegmento)
        {
            _catalogoSegmento = catalogoSegmento;
        }
        [HttpGet("segmentos")]
            public IActionResult GetSegmentos()
            {
                var result = _catalogoSegmento.GetSegmentos();
                return Ok(result);
            }
        }
    }
