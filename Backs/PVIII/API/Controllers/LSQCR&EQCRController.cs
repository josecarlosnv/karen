using BL;
using Microsoft.AspNetCore.Mvc;
using ML;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LSQCR_EQCRController : Controller
    {
            private readonly LSQCR_EQCRBL _lsqcrEqcrBL;

            public LSQCR_EQCRController(LSQCR_EQCRBL lsqcrEqcrBL)
            {
                _lsqcrEqcrBL = lsqcrEqcrBL;
            }
            [HttpGet("LSQCR&EQCR")]
            public IActionResult GetSegmentos()
            {
            var result = _lsqcrEqcrBL.GetRegistros();
            return Ok(result);
            }
    }
}
