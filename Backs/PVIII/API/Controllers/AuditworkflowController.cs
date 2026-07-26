using BL;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditworkflowController : Controller
    {
        private readonly AuditWorkFlow _CatAudit;

        public AuditworkflowController(AuditWorkFlow CatAudit)
        {
            _CatAudit = CatAudit;
        }
        [HttpGet("CatAudit")]
        public IActionResult GetSegmentos()
        {
            var result = _CatAudit.Getaudit();
            return Ok(result);
        }
    }
}
