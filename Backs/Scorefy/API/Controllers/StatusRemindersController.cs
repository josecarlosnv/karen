// API/Controllers/StatusRemindersController.cs
using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ML;
using ML.Models;
using System.Security.Claims;

[ApiController]
//[Authorize(Roles ="ALL")]
[Route("api/status-reminders")]

[EnableCors("FrontPolicy")] 
public class StatusRemindersController : ControllerBase
{
    private readonly IStatusReminderBL _bl;
    private readonly ILogger<StatusRemindersController> _logger;

    public StatusRemindersController(IStatusReminderBL bl, ILogger<StatusRemindersController> logger)
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
    //private string Email() => "vhernandezgil@kpmg.com.mx";


    [HttpGet]
    public IActionResult GetAll([FromQuery] StatusReminderFilterVM vm)
    {
        var res = _bl.GetAllWithSecurity(Email(), vm);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpPost("remind")]
    public IActionResult SendReminder([FromForm] ReminderRequest req)
    {
        var res = _bl.SendReminder(Email(), req);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(new { success = true });
    }

    [HttpGet("exceptions")]
    public IActionResult GetExceptions()
    {
        var res = _bl.GetExceptions(Email());
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }
    
    [HttpPost("exceptions")]
    public IActionResult CreateException([FromForm] ExceptionCreateVM vm)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { success = false, message = "Invalid request" });

        var email = Email();

        var res = _bl.CreateException(email, vm);

        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }
    //fin controlador Isaac


    [HttpPost("exceptions/{id:int}")]
    public IActionResult UpdateException([FromRoute] int id, [FromForm] ExceptionUpdateVM vm)
    {
        if (id != vm.Id) return BadRequest(new { message = "Id inconsistente" });
        var res = _bl.UpdateException(Email(), vm);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(res.Object);
    }

    [HttpPost("exceptions/{id:int}/restore")]
    public IActionResult RestoreException([FromRoute] int id)
    {
        var res = _bl.RestoreException(Email(), id);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(new { success = true });
    }

    // ====================================================
    // 4) Catálogo de empleados
    //    
    // ====================================================
    [HttpGet("cat-empleados")]
    public IActionResult GetCatEmpleados([FromQuery] ML.CatEmpleado.CatEmpleadoFilterVM vm)
    {
        var res = _bl.GetCatEmpleados(Email(), vm);
        if (!res.Correct)
            return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }
    //cambiar evaluador 
    [HttpPost("change-evaluator")]
    public IActionResult ChangeEvaluator([FromForm] ChangeEvaluatorRequest req)
    {
        if (!ModelState.IsValid || string.IsNullOrWhiteSpace(req.KeyReport) || req.NewEvaluatorId <= 0)
            return BadRequest(new { success = false, message = "Invalid request" });

        var res = _bl.ChangeEvaluator(Email(), req);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(new { success = true, data = res.Object });
    }

    [HttpGet("{keyReport}/current-evaluator")]
    public IActionResult GetCurrentEvaluator([FromRoute] string keyReport)
    {
        if (string.IsNullOrWhiteSpace(keyReport))
            return BadRequest(new { success = false, message = "KeyReport requerido" });

        var res = _bl.GetCurrentEvaluator(Email(), keyReport);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });

        return Ok(res.Object);
    }
}