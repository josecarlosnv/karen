using BL;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/specialists")]
public class SpecialistController : ControllerBase
{
    //private readonly ISpecialistBL _bl;
    //private readonly ILogger<SpecialistController> _logger;

    //public SpecialistController(
    //    ISpecialistBL bl,
    //    ILogger<SpecialistController> logger)
    //{
    //    _bl = bl;
    //    _logger = logger;
    //}

    // -------------------------------------------------------
    // GET api/specialists
    // -------------------------------------------------------
    //[HttpGet]
    //public IActionResult GetSpecialists()
    //{
    //    try
    //    {
    //        var email = GetUserEmail2();
    //        //var email = "mpalominogomez@kpmg.com.mx";
    //        var res = _bl.GetSpecialistsByUser(email);
    //        _logger.LogInformation("Authenticated: {auth}", User.Identity?.IsAuthenticated);
    //        _logger.LogInformation("User: {name}", User.Identity?.Name);
    //        if (!res.Correct)
    //            return StatusCode(500, new { message = res.ErrorMessage });

    //        return Ok(res.Object);
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error en GetSpecialists");
    //        return StatusCode(500, new { message = "Error cargando especialistas." });
    //    }
    //}

    //[HttpGet("request")]
    //public IActionResult Get()
    //{
    //    var result = _bl.GetSpecialistRequests();
    //    return Ok(result);
    //}

    //[HttpPost("{p8Id}/submit")]
    //public IActionResult Submit(
    //       string p8Id,
    //       [FromBody] SubmitBreakdownDto dto)
    //{
    //    var email = GetUserEmail2();
    //    if (dto.Breakdown == null || !dto.Breakdown.Any())
    //    {
    //        return Ok(
    //            _bl.ConfirmSpecialist(p8Id, dto.Comments, email)
    //        );
    //    }

    //    return Ok(
    //        _bl.SubmitBreakdown(p8Id, dto.Breakdown, dto.Comments, email)
    //    );
    //}

    ///* ============================================================
    //   POST /api/specialists/{p8Id}/approve
    //   ============================================================ */
    //[HttpPost("{p8Id}/approve")]
    //public IActionResult Approve(string p8Id)
    //{
    //    var email = GetUserEmail2();
    //    return Ok(
    //        _bl.ApproveSpecialist(p8Id, email)
    //    );
    //}

    ///* ============================================================
    //   POST /api/specialists/{p8Id}/request-changes
    //   ============================================================ */
    //[HttpPost("{p8Id}/request-changes")]
    //public IActionResult RequestChanges(
    //    string p8Id,
    //    [FromBody] RequestChangesDto dto)
    //{
    //    var email = GetUserEmail2();
    //    return Ok(
    //        _bl.RequestChanges(p8Id, dto.Comment, email)
    //    );
    //}



    //// -------------------------------------------------------
    //// Utilidad: email del usuario autenticado
    //// -------------------------------------------------------
    //private string GetUserEmail()
    //{
    //    if (!User.Identity?.IsAuthenticated ?? true)
    //        return "unauthenticated@local";

    //    var email =
    //        User.FindFirst("preferred_username")?.Value ??
    //        User.FindFirst(ClaimTypes.Upn)?.Value ??
    //        User.FindFirst(ClaimTypes.Email)?.Value ??
    //        User.Identity?.Name;

    //    if (!string.IsNullOrWhiteSpace(email) && email.Contains("\\"))
    //    {
    //        var username = email.Split("\\")[1];
    //        email = $"{username}@kpmg.com.mx";
    //    }

    //    return email ?? "noreply@local";
    //}

    //private string GetUserEmail2()
    //{
    //    var email =
    //        User.FindFirst(ClaimTypes.Email)?.Value ??
    //        User.FindFirst("preferred_username")?.Value ??
    //        User.FindFirst("upn")?.Value ??
    //        User.Identity?.Name;

    //    if (!string.IsNullOrWhiteSpace(email) && email.Contains("\\"))
    //    {
    //        var username = email.Split("\\")[1];
    //        email = $"{username}@kpmg.com.mx";
    //    }

    //    return email ?? "noreply@local";
    //}
}
