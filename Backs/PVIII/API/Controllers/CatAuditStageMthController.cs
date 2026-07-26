using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatAuditStageMthController : Controller
    {
      
            private readonly pviiiCatAuditStageMthBL _pviiiCatAuditStageMthBL;
            public CatAuditStageMthController(pviiiCatAuditStageMthBL pviiiCatAuditStageMthBL)
            {
            _pviiiCatAuditStageMthBL = pviiiCatAuditStageMthBL;
            }
            [HttpGet("CatAuditMth")]
            public IActionResult GetCatAuditMth()
            {
            var result = _pviiiCatAuditStageMthBL.GetCat();
                return Ok(result);
            }

        }
    }

