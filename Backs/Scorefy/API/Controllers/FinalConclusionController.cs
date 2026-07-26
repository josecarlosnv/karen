using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;

[ApiController]
[Route("api/final-conclusion")]

[EnableCors("FrontPolicy")]
public class FinalConclusionController : ControllerBase
{ 
    private readonly IFinalConclusionBL _bl;
    private readonly ILogger<FinalConclusionController> _logger;

    public FinalConclusionController(IFinalConclusionBL bl, ILogger<FinalConclusionController> logger)
    {
        _bl = bl;
        _logger = logger;
    }

    private string Email() =>
        User.FindFirst(ClaimTypes.Email)?.Value ??
        User.FindFirst("preferred_username")?.Value ??
        User.FindFirst("upn")?.Value ??
        User.Identity?.Name ??
        "noreply@local";
    //private string Email() => "agonzalezchavez@kpmg.com.mx";


    // ===============================================
    // ✅ Obtener datos de seguridad del usuario actual
    // ===============================================
    [HttpGet("me")]
    public IActionResult GetCurrentUserSecurity()
    {
        try
        {
            var email = Email();
            //var email = "agonzalezchavez@kpmg.com.mx";
            var res = _bl.GetUserSecurity(email);

            if (!res.Correct)
                return StatusCode(500, new { success = false, message = res.ErrorMessage });

            return Ok(res.Object);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "FinalConclusionController.GetCurrentUserSecurity error");
            return StatusCode(500, new { success = false, message = "Unexpected error" });
        }
    }
    // ----------------------------------------------------------------------
    // SAVE: Performance Manager
    // ----------------------------------------------------------------------
    [HttpPost("performance-manager")]
    public IActionResult SavePM([FromForm] FinalConclusionSectionDTO dto)
    {
        var email = Email();
        var res = _bl.SavePerformanceManager(email, dto);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(new { success = true });
    }

    // ----------------------------------------------------------------------
    // SAVE: Committee
    // ----------------------------------------------------------------------
    [HttpPost("committee")]
    public IActionResult SaveCommittee([FromForm] FinalConclusionSectionDTO dto)
    {
        var email = Email();
        var res = _bl.SaveCommittee(email, dto);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(new { success = true });
    }

    // ----------------------------------------------------------------------
    // SAVE: Calibration
    // ----------------------------------------------------------------------
    [HttpPost("calibration")]
    public IActionResult SaveCalibration([FromForm] FinalConclusionSectionDTO dto)
    {
        var email = Email();
        var res = _bl.SaveCalibration(email, dto);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(new { success = true });
    }

    [HttpPost("delete/{section}/{employeeId:int}/{fy:int}")]
    public IActionResult DeleteSection(string section, int employeeId, int fy)
    {
        var email = Email();
        var res = _bl.DeleteSection(section, employeeId, fy, email);
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(new { success = true });
    }


    // ----------------------------------------------------------------------
    // Catalogs
    // ----------------------------------------------------------------------
    [HttpGet("promotion-categories")]
    public IActionResult GetPromotionCategories()
    {
        var res = _bl.GetPromotionCategories(Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpGet("qpr")]
    public IActionResult GetQPR()
    {
        var res = _bl.GetQPRScores(Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpGet("employee/{id:int}")]
    public IActionResult GetEmployee([FromRoute] int id)
    {
        var res = _bl.GetEmployee(id, Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpGet("pm/{employeeId:int}/{fy:int}")]
    public IActionResult GetPM(int employeeId, int fy)
    {
        var res = _bl.GetPMSection(employeeId, fy, Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpGet("committee/{employeeId:int}/{fy:int}")]
    public IActionResult GetCommittee(int employeeId, int fy)
    {
        var res = _bl.GetCommitteeSection(employeeId, fy, Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpGet("calibration/{employeeId:int}/{fy:int}")]
    public IActionResult GetCalibration(int employeeId, int fy)
    {
        var res = _bl.GetCalibrationSection(employeeId, fy, Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpGet("consolidated/{employeeId:int}/{fy:int}")]
    public IActionResult GetConsolidated(int employeeId, int fy)
    {
        var res = _bl.GetConsolidatedRatings(employeeId, fy, Email());
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }

    [HttpGet("full/{employeeId:int}/{fy:int}")]
    public IActionResult GetFull(int employeeId, int fy)
    {
        var res = _bl.GetFullFinalConclusion(employeeId, fy, Email());
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }

    [HttpGet("workflow/{employeeId:int}/{fy:int}")]
    public IActionResult GetWorkflow(int employeeId, int fy)
    {
        var res = _bl.GetWorkflow(employeeId, fy, Email());
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }

    [HttpPost("workflow/unlock-next/{employeeId:int}/{fy:int}")]
    public IActionResult UnlockNext(int employeeId, int fy)
    {
        var res = _bl.UnlockNextStep(employeeId, fy, Email());
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }
    [HttpGet("catalog/employees")]
    public IActionResult GetEmployeeCatalog()
    {
        var res = _bl.GetEmployeeCatalog(Email());
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }

    [HttpGet("catalog/employeesstatus")]
    public IActionResult GetEmployeeCatalogStatus()
    {
        var res = _bl.GetEmployeeCatalogStatus(Email());
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }


    // ----------------------------------------------------------------------
    // SEND REMINDER: Final Conclusion (Resource)
    // ----------------------------------------------------------------------
    [HttpPost("remind/{employeeId:int}/{fy:int}")]
    public IActionResult SendFinalConclusionReminder(int employeeId, int fy)
    {
        try
        {
            var email = Email(); // ✅ mismo helper

            var res = _bl.SendFinalConclusionReminder(
                email,
                employeeId,
                fy
            );

            if (!res.Correct)
                return StatusCode(500, new { success = false, message = res.ErrorMessage });

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "FinalConclusionController.SendFinalConclusionReminder error");
            return StatusCode(500, new { success = false, message = "Unexpected error" });
        }
    }

}