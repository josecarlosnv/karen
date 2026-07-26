using BL;
using DL;
using Microsoft.AspNetCore.Mvc;
using ML;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportTypeController : Controller
    {

            private readonly ReportTypeBL _catReportTypeBL;

            public ReportTypeController(ReportTypeBL reportTypeBL)
            {
             _catReportTypeBL = reportTypeBL;
            }
            [HttpGet("ReportType")]
            public IActionResult GetReportType()
            {
                var result = _catReportTypeBL.GetCatReportTypes();
                return Ok(result);
            }
        
    }
}
