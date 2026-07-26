

using BL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ML;
using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using static ManagerEvaluationsController;

[ApiController]
[Route("api/manager-evaluations")]

[EnableCors("FrontPolicy")] 
public class ManagerEvaluationsController : ControllerBase
{
    private readonly IManagerEvaluationsBL _bl;
    private readonly ILogger<ManagerEvaluationsController> _logger;

    public ManagerEvaluationsController(
        IManagerEvaluationsBL bl,
        ILogger<ManagerEvaluationsController> logger)
    {
        _bl = bl;
        _logger = logger;
    }

    // --------------------------------------------------------------
    // 1) BANDEJA DEL EVALUADOR (igual que antes)
    // GET /api/manager-evaluations
    // --------------------------------------------------------------
    [HttpGet]
    public IActionResult GetInbox([FromQuery] ML.ProjectsFilterVM vm)
    {
        try
        {
            var email = GetUserEmail();
            //var email = "agonzalezchavez@kpmg.com.mx";
            var res = _bl.GetInboxWithSecurity(email, vm);

            if (!res.Correct)
                return StatusCode(500, new { message = res.ErrorMessage });

            return Ok(res.Object);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en GetInbox (manager-evaluations)");
            return StatusCode(500, new { message = "Error cargando bandeja del evaluador." });
        }
    }

    // --------------------------------------------------------------
    // 2) FORMULARIO DEL EVALUADOR (CARGA RÁPIDA)
    // GET /api/manager-evaluations/{id}/form
    // --------------------------------------------------------------
    [HttpGet("{id}/form")]
    public async Task<IActionResult> GetForm(
        [FromRoute] string id,
        [FromQuery] string? role)
    {
        try
        {
            var email = GetUserEmail();

            var res = await _bl.GetFormManager(id, email, role);

            if (!res.Correct)
                return StatusCode(500, new { message = res.ErrorMessage });

            return Ok(res.Object);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error en GetForm para IdColabEmpProy={id}");
            return StatusCode(500, new { message = "Error cargando formulario del evaluador." });
        }
    }

    // --------------------------------------------------------------
    // 2.1) VALORES DIFERIDOS (Evaluated + Evaluator)
    // GET /api/manager-evaluations/{id}/values?sub=1.10
    // --------------------------------------------------------------
    [HttpGet("{id}/values")]
    public async Task<IActionResult> GetValues(
        [FromRoute] string id,
        [FromQuery] decimal? sub)
    {
        try
        {
            var res = await _bl.GetValuesAsync(id, sub);

            if (!res.Correct)
                return StatusCode(500, new { message = res.ErrorMessage });

            return Ok(res.Object);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error en GetValues para IdColabEmpProy={id}");
            return StatusCode(500, new { message = "Error cargando valores del evaluador." });
        }
    }



    // --------------------------------------------------------------
    // 4) GUARDAR DRAFT / CERRAR EVALUACIÓN
    // POST /api/manager-evaluations/{id}?accion=guardar|cerrar
    // --------------------------------------------------------------

    public class ManagerEvalPostModel
    {
        public string IdColabEmpProy { get; set; } = string.Empty;

        // 👇 llega como JSON string desde x-www-form-urlencoded
        public string? Detalles { get; set; }

        public decimal? ClientFinalScore { get; set; }
    }

    //[HttpPost("{id}")]
    //public async Task<IActionResult> Save(
    //    [FromRoute] string id,
    //    [FromQuery] string accion,
    //    [FromForm] ManagerEvalPostModel form)
    //{
    //    try
    //    {
    //        if (form == null ||
    //            string.IsNullOrWhiteSpace(form.IdColabEmpProy) ||
    //            !string.Equals(form.IdColabEmpProy, id, StringComparison.Ordinal))
    //        {
    //            return BadRequest(new { message = "Datos inválidos o ID inconsistente." });
    //        }

    //        //var email = "ysenburg.albrecht@kpmg.com.mx";
    //        var email = GetUserEmail();

    //        ML.Result res = accion?.ToLower() switch
    //        {
    //            "cerrar" => await _bl.SaveAndCloseAsync(form.IdColabEmpProy, email, form.Detalles, form.ClientFinalScore),
    //            _ => await _bl.SaveDraftAsync(form.IdColabEmpProy, email, form.Detalles, form.ClientFinalScore)
    //        };

    //        if (!res.Correct)
    //            return StatusCode(500, new { message = res.ErrorMessage });

    //        string message = accion?.ToLower() == "cerrar"
    //            ? "Evaluación enviada."
    //            : "Borrador guardado.";

    //        return Ok(new { success = true, message, res.Object });
    //    }
    //    catch (Exception ex)
    //    {
    //        _logger.LogError(ex, "Error en guardar/cerrar evaluación del manager.");
    //        return StatusCode(500, new { message = "Error guardando evaluación del manager." });
    //    }
    //}

    [HttpPost("{id}")]
    public async Task<IActionResult> Save(
        [FromRoute] string id,
        [FromQuery] string accion,
        [FromForm] ManagerEvalPostModel form)
    {
        try
        {
            // ✅ Validación básica
            if (form == null ||
                string.IsNullOrWhiteSpace(form.IdColabEmpProy) ||
                !string.Equals(form.IdColabEmpProy, id, StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Datos inválidos o ID inconsistente." });
            }

            var email = GetUserEmail();

            // ✅ Parseo de Detalles (JSON string → lista)
            List<ML.AutoEvalDetailItem> detalles;

            try
            {
                detalles = string.IsNullOrWhiteSpace(form.Detalles)
                    ? new List<ML.AutoEvalDetailItem>()
                    : JsonSerializer.Deserialize<List<ML.AutoEvalDetailItem>>(
                        form.Detalles,
                        new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        }
                    ) ?? new List<ML.AutoEvalDetailItem>();
            }
            catch (JsonException)
            {
                return BadRequest(new { message = "Formato inválido en los detalles del evaluador." });
            }

            // ✅ Guardar / cerrar
            ML.Result res = accion?.ToLowerInvariant() switch
            {
                "cerrar" => await _bl.SaveAndCloseAsync(
                    form.IdColabEmpProy,
                    email,
                    detalles,
                    form.ClientFinalScore),

                _ => await _bl.SaveDraftAsync(
                    form.IdColabEmpProy,
                    email,
                    detalles,
                    form.ClientFinalScore)
            };

            if (!res.Correct)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = res.ErrorMessage ?? "Error guardando evaluación del manager."
                });
            }

            var message = accion?.ToLowerInvariant() == "cerrar"
                ? "Evaluación enviada."
                : "Borrador guardado.";

            return Ok(new { success = true, message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en guardar/cerrar evaluación del manager.");
            return StatusCode(500, new { message = "Error guardando evaluación del manager." });
        }
    }



    // ELIMINAR (soft delete)
    // POST /api/manager-evaluations/delete
    // --------------------------------------------------------------
    [HttpPost("delete")]
    public async Task<IActionResult> SoftDelete([FromForm] DeleteEvaluationRequest body, CancellationToken ct)
    {
        try
        {
            var email = GetUserEmail();

            var res = await _bl.SoftDeleteAsync(body, email, ct);
            if (!res.Correct)
                return StatusCode(400, new { success = false, message = res.ErrorMessage });

            return Ok(new { success = true, message = res.ErrorMessage, res.Object });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en SoftDelete (manager-evaluations/delete)");
            return StatusCode(500, new { success = false, message = "Error al eliminar la evaluación." });
        }
    }


    // --------------------------------------------------------------
    // UTILIDAD: Obtener email del usuario autenticado
    // --------------------------------------------------------------
    private string GetUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local";
    }
}
