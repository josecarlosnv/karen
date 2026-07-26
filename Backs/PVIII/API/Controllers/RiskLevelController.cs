using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace BL
{
    [Route("api/[controller]")]
    [ApiController]
    public class RiskLevelController : Controller
    {

        private readonly RiskLevelBL _RiskLevel;

        public RiskLevelController(RiskLevelBL RiskLevel)
        {
            _RiskLevel = RiskLevel;
        }
        [HttpGet("RiskLevel")]
        public IActionResult GetRiskLevel()
        {
            var result = _RiskLevel.GetRiskLevel();
            return Ok(result);
        }
    }

}
