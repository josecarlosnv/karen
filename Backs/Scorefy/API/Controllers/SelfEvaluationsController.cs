// SelfEvaluationsController.cs
using BL;
using DL;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ML;
using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using static ML.HomeUiState;

[ApiController]
[Route("api/self-evaluations")]
[EnableCors("FrontPolicy")]
public class SelfEvaluationsController : ControllerBase 
{
    private readonly DL.MexItaStaBiAuditContext _db;
    private readonly ISelfEvaluationsBL _bl;
    private readonly ILogger<SelfEvaluationsController> _logger;
    private readonly IWebHostEnvironment _env;

    public SelfEvaluationsController(
        DL.MexItaStaBiAuditContext db,
        ISelfEvaluationsBL bl,
        ILogger<SelfEvaluationsController> logger, IWebHostEnvironment env)
    {
        _db = db;
        _bl = bl;
        _logger = logger;
        _env = env;
    }



    [HttpGet]
    public IActionResult GetIndex([FromQuery] ML.ProjectsFilterVM vm, [FromQuery] string? search)
    {
        var email = GetUserEmail();
        //var email = "agonzalezchavez@kpmg.com.mx";

        // 1) Resumen (evaluaciones existentes)
        var resResume = _bl.GetResumeWithSecurity(email, vm);

        var evalsFromResume = new List<object>();
        var warnings = new List<string>();
        ML.ProjectsFilterVM? outVm = null; // <- declarar fuera para usar después

        if (resResume.Correct && resResume.Object is ML.ProjectsFilterVM tmpVm && tmpVm.ResultsResume != null)
        {
            outVm = tmpVm;


            var results = tmpVm.ResultsResume ?? new List<ML.EvaluaColabResume>();




            if (!string.IsNullOrWhiteSpace(search))
            {
                results = results
                    .Where(r =>
                        (r.ClientName ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (r.Role ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (r.EvaluatorName ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (r.EntityNumber ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (r.EvaluatedName ?? "").Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (r.Bu ?? "").Contains(search, StringComparison.OrdinalIgnoreCase)
                    )
                    .ToList();
            }




            // EXISTENTES (EvaluaColabResume):
            // ColumnC: 0 = COMPLETO -> state = "completed"
            // ColumnC: 1 = PENDIENTE -> state = "continue"
            evalsFromResume = results
                .Select(r =>
                {
                    int? col = r.ColumnC;

                    var state = (col == null) ? "continue" : (col == 1) ? "submitted" : "completed";

                    var createdDt = r.CreatedTime;
                    var modifiedDt = r.ModifiedTime;

                    return new
                    {
                        id = r.IdColabEmpProy ?? string.Empty,
                        project = r.ClientName ?? string.Empty,
                        state,
                        role = r.Role ?? string.Empty,
                        createdDate = r.CreatedTime?.ToString("yyyy-MM-dd"),
                        modifiedDate = r.ModifiedTime?.ToString("yyyy-MM-dd"),
                        score = r.GradeEvaluated,
                        isClosed = r.IsClosed,
                        columnC = col,          // 0=COMPLETO, 1=PENDIENTE
                        evaluatorName = r.EvaluatorName,
                        cutOff = r.CutOff,
                        pkEvalGene = r.PkEvalGene,       // puede venir nulo en históricos
                        clientId = r.EntityNumber ?? string.Empty,
                        source = "existing",
                        createdDt,
                        modifiedDt,
                        generatedType = r.GeneratedType,
                        keyReport = r.KeyReport

                    };
                })
                .ToList<object>();
        }
        else
        {
            warnings.Add(resResume.ErrorMessage ?? "No fue posible obtener la bandeja.");
        }

        // === HashSet de PKs que YA tienen evaluación creada (para filtrar START) ===
        var existingPk = (outVm?.ResultsResume ?? new List<ML.EvaluaColabResume>())
            .Where(r => r.PkEvalGene.HasValue && r.PkEvalGene.Value > 0)
            .Select(r => r.PkEvalGene!.Value)
            .ToHashSet();

        // 2) Proyectos disponibles para INICIAR
        var roles = new List<string>();
        var projects = new List<object>();
        var evalsFromProjects = new List<object>();

        var resScope = _bl.GetProjectsWithSecurity(email, vm);
        if (resScope.Correct && resScope.Object is ML.ProjectsFilterVM scopeVm)
        {
            roles = scopeVm.JobLevelOptions = new List<string>
        {
            "Supervising Senior",
            "Senior Manager",
            "Manager",
            "Senior",
            "Staff in Charge",
            "Staff"
        };

            // STARTABLES: sin evaluación creada (GeneratedEvaluation == false) y no presentes en existingPk
            var startables = (scopeVm.Results ?? new List<ML.ScorefyTblEvaluationsGenerate>())
                .Where(x => x.GeneratedEvaluation == false
                         && x.IsCurrent == true
                         && !existingPk.Contains(x.PkEvalGene))
                .ToList();



            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim();

                startables = startables
                    .Where(x =>
                        // Strings reales
                        (x.ClientName ?? "").Contains(term, StringComparison.OrdinalIgnoreCase) ||

                        // Campos numéricos convertidos sin errores
                        Convert.ToString(x.ClientId)?.Contains(term, StringComparison.OrdinalIgnoreCase) == true ||

                        // Puede ser string o numérico → convertimos
                        Convert.ToString(x.GeneratedType)?.Contains(term, StringComparison.OrdinalIgnoreCase) == true ||

                        // KeyReport puede ser long/int/string → convertido
                        Convert.ToString(x.KeyReport)?.Contains(term, StringComparison.OrdinalIgnoreCase) == true ||

                        // Fecha convertida correctamente si existe
                        (x.CutOff?.ToString("yyyy-MM-dd") ?? "")
                            .Contains(term, StringComparison.OrdinalIgnoreCase)
                    )
                    .ToList();
            }



            // Opcional: listado para panel de "projects"
            projects = startables.Select(x => new
            {
                pkEvalGene = x.PkEvalGene.ToString(CultureInfo.InvariantCulture),
                clientId = x.ClientId,
                label = $"{(string.IsNullOrWhiteSpace(x.ClientName) ? "(No client)" : x.ClientName)}"
            })
            .OrderBy(p => p.label)
            .ToList<object>();

            // También como 'evaluations' con state="start"
            evalsFromProjects = startables
                .Select(x => new
                {
                    id = (string?)null, // aún no hay IdColabEmpProy
                    project = x.ClientName ?? string.Empty,
                    state = "start",
                    role = string.Empty,
                    createdDate = (string?)null,
                    modifiedDate = (string?)null,
                    score = (decimal?)null,
                    isClosed = (bool?)null,
                    columnC = (int?)null,
                    evaluatorName = (string?)null,
                    cutOff = x.CutOff,
                    pkEvalGene = x.PkEvalGene.ToString(CultureInfo.InvariantCulture),
                    clientId = x.ClientId,
                    source = "startable",

                    createdDt = (DateTime?)null,
                    modifiedDt = (DateTime?)null,
                    generatedType = x.GeneratedType,
                    keyReport = x.KeyReport

                })
                // Evita duplicar si ya estaba entre las existentes con la misma PK
                .Where(p => !evalsFromResume.Any(e =>
                {
                    var ePk = (e as dynamic)?.pkEvalGene;
                    return ePk != null && ePk.ToString() == p.pkEvalGene;
                }))
                .ToList<object>();
        }

        // 3) Evaluadores para el panel de inicio
        var evaluators = new List<object>();
        var resEmp = _bl.GetEmployeeOptionsForScope(email, vm);
        if (resEmp.Correct && resEmp.Object is List<ML.EmployeeOption> empList)
        {
            evaluators = empList.Select(e => new
            {
                id = e.EmployeeId.ToString(CultureInfo.InvariantCulture),
                name = e.EmployeeName ?? "",
                email = e.Email ?? "",
                initials = GetInitials(e.EmployeeName ?? "")
            }).ToList<object>();
        }

        // 4) Unificamos en 'evaluations': START (primero) + EXISTENTES
        var evaluations = new List<object>(evalsFromResume.Count + evalsFromProjects.Count);
        evaluations.AddRange(evalsFromProjects);
        evaluations.AddRange(evalsFromResume);


        var orderByState = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase)
        {
            ["continue"] = 0,
            ["start"] = 1,
            ["submitted"] = 2,
            ["completed"] = 3
        };

        var evaluationsOrdered = evaluations
            .Select(e => e as dynamic)
            .OrderBy(e => orderByState.TryGetValue((string)e.state, out var ord) ? ord : 99)
            .ThenByDescending(e => (DateTime?)e.modifiedDt) // más recientes primero
            .ThenBy(e => (string)e.project ?? string.Empty)
            .ToList();

        var evaluationsOutput = evaluationsOrdered
            .Select(e => new
            {
                e.id,
                e.project,
                e.state,
                e.role,
                e.createdDate,
                e.modifiedDate,
                e.score,
                e.isClosed,
                e.columnC,
                e.evaluatorName,
                e.cutOff,
                e.pkEvalGene,
                e.clientId,
                e.source
            })
            .ToList();


        return Ok(new { evaluations = evaluationsOutput, roles, projects, evaluators, warnings });
    }

    public record StartRequest(string PkEvalGene, string Role, string EvaluatorId);

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromForm] StartRequest request, CancellationToken ct)
    {
        if (request is null ||
            string.IsNullOrWhiteSpace(request.PkEvalGene) ||
            string.IsNullOrWhiteSpace(request.Role) ||
            string.IsNullOrWhiteSpace(request.EvaluatorId))
            return BadRequest(new { success = false, message = "Project, Role y Evaluator son obligatorios." });

        var email = GetUserEmail();

        var genReq = new ML.MyAutoEvalAddRequest
        {
            PkEvalGene = Convert.ToInt32(request.PkEvalGene, CultureInfo.InvariantCulture)
        };

        var result = await _bl.GenerateEvaluationAsync(genReq, email, ct);
        if (!result.Correct)
            return StatusCode(500, new { message = "No fue posible generar la evaluación." });

        var payload = result.Object as ML.AutoEvalGeneratedResponse;
        var idColab = payload?.ID_Colab_Emp_Proy;
        if (string.IsNullOrWhiteSpace(idColab))
            return StatusCode(500, new { message = "No se recibió el identificador de la evaluación generada." });

        // Actualiza encabezado (puede quedarse aquí o moverse al BL si prefieres)
        var header = await _db.EvaluaColabResumes.SingleOrDefaultAsync(h => h.IdColabEmpProy == idColab, ct);
        if (header != null)
        {
            header.Role = request.Role;
            if (int.TryParse(request.EvaluatorId, NumberStyles.Any, CultureInfo.InvariantCulture, out var evalInt))
                header.EvaluatorId = evalInt;
            header.ModifiedBy = email;
            header.ModifiedTime = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
        }

        // Sembrar detalles
        var detReq = new ML.AutoEvalDetailsGenerateRequest { IdColabEmpProy = idColab!, Email = email, RolSeleccionado = request.Role };
        var resGen = await _bl.GenerateOrLoadAsync(detReq, ct);
        if (!resGen.Correct)
            return StatusCode(500, new { success = false, message = resGen.ErrorMessage ?? "No fue posible preparar los reactivos." });

        return CreatedAtAction(nameof(GetForm), new { id = idColab }, new { success = true, id = idColab });
    }



    [HttpGet("{id}/form")]
    public async Task<IActionResult> GetForm([FromRoute] string id, [FromQuery] string? role, [FromQuery] int? evaluatorId)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(new { message = "Falta el identificador de la evaluación." });

        var email = GetUserEmail();
        var req = new ML.AutoEvalDetailsGenerateRequest
        {
            IdColabEmpProy = id,
            Email = email,
            RolSeleccionado = role
        };

        var res = await _bl.GenerateOrLoadAsync(req);
        if (!res.Correct || res.Object is not ML.AutoEvalDetailsGenerateResponse payload)
            return StatusCode(500, new { message = res.ErrorMessage ?? "No fue posible cargar la autoevaluación." });

        return Ok(new
        {
            header = payload.Header,           // <-- ahora existe
            items = payload.Items,
            existePrevio = payload.ExistePrevio,
            existeCierre = payload.ExisteCierre,
            id = payload.IdColabEmpProy
        });
    }

    [HttpPost("{id}/items")]
    public async Task<IActionResult> UpsertItem([FromRoute] string id, [FromQuery] string role, [FromForm] ML.AutoEvalDetailItem dto)
    {
        var email = GetUserEmail();
        var res = await _bl.UpsertOneAsync(id, email, role, dto);
        if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage });
        return Ok(new { success = true });
    }

    [HttpGet("{id}/progress")]
    public async Task<IActionResult> Progress([FromRoute] string id, [FromQuery] string role, [FromQuery] int? evaluatorId)
    {
        var (contestados, total, evalOk) = await _bl.GetProgresoAsync(id, role, evaluatorId);
        return Ok(new { contestados, total, evaluatorOk = evalOk, completo = (total > 0 && contestados == total && evalOk) });
    }

    //[HttpPost("{id}")]
    //public async Task<IActionResult> Save([FromRoute] string id, [FromQuery] string accion, [FromForm] ML.AutoEvaluationPostModel form)
    //{
    //    if (form == null || string.IsNullOrWhiteSpace(form.IdColabEmpProy) || !string.Equals(id, form.IdColabEmpProy, StringComparison.Ordinal))
    //        return BadRequest(new { message = "Datos incompletos o ID inconsistente." });

    //    var email = GetUserEmail();
    //    var items = (form.Detalles ?? new List<ML.AutoEvaluationPostDetail>())
    //        .Select(d => new ML.AutoEvalDetailItem
    //        {
    //            EcdId = d.EcdId,
    //            Competence = d.Competence,
    //            SubCompetence = d.SubCompetence,
    //            ReactiveNum = d.ReactiveNum.ToString(CultureInfo.InvariantCulture),
    //            EvaluatedResp = d.EvaluatedResp.HasValue ? (int?)Convert.ToInt32(d.EvaluatedResp.Value) : 0,
    //            EvaluatorResp = d.EvaluatedResp.HasValue ? (int?)Convert.ToInt32(d.EvaluatedResp.Value) : 0,
    //            EvaluatedComent = d.EvaluatedComent
    //        });

    //    ML.Result res = string.Equals(accion, "cerrar", StringComparison.OrdinalIgnoreCase)
    //        ? await _bl.SaveAndCloseAsync(form.IdColabEmpProy, email, items, clientFinalScore: form.ClientFinalScore)
    //        : await _bl.SaveDraftAsync(form.IdColabEmpProy, email, items, clientFinalScore: form.ClientFinalScore);



    //    if (!res.Correct) return StatusCode(500, new { success = false, message = res.ErrorMessage ?? "No fue posible guardar." });


    //    var msg = string.Equals(accion, "cerrar", StringComparison.OrdinalIgnoreCase)
    //        ? "Autoevaluación guardada y enviada."
    //        : "Borrador guardado correctamente.";
    //    return Ok(new { success = true, message = msg });
    //}


    [HttpPost("{id}")]
    public async Task<IActionResult> Save(
        [FromRoute] string id,
        [FromQuery] string accion,
        [FromForm] ML.AutoEvaluationPostModel form)
    {
        // ✅ Validaciones básicas
        if (form == null ||
            string.IsNullOrWhiteSpace(form.IdColabEmpProy) ||
            !string.Equals(id, form.IdColabEmpProy, StringComparison.Ordinal))
        {
            return BadRequest(new { message = "Datos incompletos o ID inconsistente." });
        }

        var email = GetUserEmail();

        // ✅ 1) Parseo seguro de Detalles (vienen como JSON string)
        List<ML.AutoEvaluationPostDetail> detalles;

        try
        {
            detalles = string.IsNullOrWhiteSpace(form.Detalles)
                ? new List<ML.AutoEvaluationPostDetail>()
                : JsonSerializer.Deserialize<List<ML.AutoEvaluationPostDetail>>(
                    form.Detalles,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    }
                ) ?? new List<ML.AutoEvaluationPostDetail>();
        }
        catch (JsonException)
        {
            return BadRequest(new { message = "Formato inválido en los detalles de la evaluación." });
        }

        // ✅ 2) Mapear a items del modelo BL
        var items = detalles.Select(d => new ML.AutoEvalDetailItem
        {
            EcdId = d.EcdId,
            Competence = d.Competence,
            SubCompetence = d.SubCompetence,
            ReactiveNum = Convert.ToString(d.ReactiveNum, CultureInfo.InvariantCulture),
            EvaluatedResp = d.EvaluatedResp.HasValue
                ? (int?)Convert.ToInt32(d.EvaluatedResp.Value)
                : 0,
            EvaluatorResp = d.EvaluatedResp.HasValue
                ? (int?)Convert.ToInt32(d.EvaluatedResp.Value)
                : 0,
            EvaluatedComent = d.EvaluatedComent
        });

        // ✅ 3) Guardar (draft o cerrar)
        ML.Result res = string.Equals(accion, "cerrar", StringComparison.OrdinalIgnoreCase)
            ? await _bl.SaveAndCloseAsync(
                form.IdColabEmpProy,
                email,
                items,
                clientFinalScore: form.ClientFinalScore)
            : await _bl.SaveDraftAsync(
                form.IdColabEmpProy,
                email,
                items,
                clientFinalScore: form.ClientFinalScore);

        if (!res.Correct)
        {
            return StatusCode(500, new
            {
                success = false,
                message = res.ErrorMessage ?? "No fue posible guardar."
            });
        }

        var msg = string.Equals(accion, "cerrar", StringComparison.OrdinalIgnoreCase)
            ? "Autoevaluación guardada y enviada."
            : "Borrador guardado correctamente.";

        return Ok(new { success = true, message = msg });
    }

    public record ValidateExtraDto(int ClientId, int EmployeeId);
    public record AddExtraDto(int ClientId, string ClientName, int EmployeeId, int? TotalHours, string? GeneratedDocumentation);

    // --- VALIDATE ---
    [HttpPost("extra/validate")]
    public IActionResult ValidateExtra([FromForm] ValidateExtraDto dto)
    {
        var req = new ML.ValidateExtraRequest { ClientId = dto.ClientId, EmployeeId = dto.EmployeeId };
        var res = _bl.ValidateExtra(req); // <- ahora por BL
        if (!res.Correct || res.Object is not ML.ValidateExtraInfo info)
            return StatusCode(500, new { available = false, message = res.ErrorMessage ?? "Validation error" });

        return Ok(new { available = info.Available, message = info.Message });
    }

    // --- ADD EXTRA ---
    [HttpPost("extra")]
    public IActionResult AddExtra([FromForm] AddExtraDto dto)
    {
        var vm = new ML.ScorefyTblEvaluationsGenerateExtra
        {
            ClientId = dto.ClientId,
            ClientName = dto.ClientName,                  // El BL lo reemplaza por el de la vista
            EmployeeId = dto.EmployeeId,
            TotalHours = dto.TotalHours ?? 0,
            GeneratedDocumentation = dto.GeneratedDocumentation,
            CreatedBy = GetUserEmail()
        };

        var res = _bl.AddExtra(vm); // <- ahora por BL
        if (!res.Correct) return StatusCode(500, new { message = res.ErrorMessage ?? "Error al crear el proyecto extra." });





        // Lectura segura del payload, evitando dynamic para no repetir el RuntimeBinderException
        object? payload = res.Object;
        int? pkEvalGene = null;
        string? keyReport = null;
        int? cutOff = null;
        string? label = null;

        if (payload != null)
        {
            var t = payload.GetType();
            var pkProp = t.GetProperty("PkEvalGene");
            var keyProp = t.GetProperty("KeyReport");
            var cutProp = t.GetProperty("CutOff");
            var lblProp = t.GetProperty("Label");

            if (pkProp != null)
            {
                var val = pkProp.GetValue(payload);
                if (val != null && int.TryParse(Convert.ToString(val, CultureInfo.InvariantCulture), out var pk))
                    pkEvalGene = pk;
            }
            if (keyProp != null)
                keyReport = Convert.ToString(keyProp.GetValue(payload), CultureInfo.InvariantCulture);

            if (cutProp != null)
            {
                var val = cutProp.GetValue(payload);
                if (val != null && int.TryParse(Convert.ToString(val, CultureInfo.InvariantCulture), out var co))
                    cutOff = co;
            }
            if (lblProp != null)
                label = Convert.ToString(lblProp.GetValue(payload), CultureInfo.InvariantCulture);
        }

        // Compatibilidad: si el BL aún no regresa 'Label', construimos uno básico con lo que llegó en la petición
        if (string.IsNullOrWhiteSpace(label))
            label = vm.ClientName ?? "Client";

        // Respuesta para la modal (AddExtra.tsx espera { pkEvalGene, label }, y podemos añadir extras)
        return Ok(new
        {
            pkEvalGene,     // identity real (int?) — si BL ya está actualizado, vendrá con valor
            label,          // "Cliente — Empleado" si el BL lo mandó; de lo contrario 'ClientName'
            keyReport,      // útil para rastreo si pkEvalGene aún no viaja
            cutOff          // cut-off asignado por la lógica del BL
        });

    }

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

    // GET: /api/self-evaluations/lookup-client?clientId=123
    [HttpGet("lookup-client")]
    public IActionResult LookupClient([FromQuery] int clientId)
    {
        if (clientId <= 0)
            return BadRequest(new { found = false, message = "ClientId inválido." });

        var res = _bl.LookupClientName(clientId); // usa BL.LookupClientName
        if (!res.Correct || res.Object is not ML.ClientLookupResult info)
            return StatusCode(500, new { found = false, message = res.ErrorMessage ?? "No fue posible consultar el cliente." });

        return Ok(new { clientId = info.ClientId, clientName = info.ClientName, found = info.Found });
    }

    private string GetUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value
            ?? User.FindFirst("preferred_username")?.Value
            ?? User.FindFirst("upn")?.Value
            ?? User.Identity?.Name
            ?? "noreply@local";
    }

    private static string GetInitials(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return "NA";
        var p = name.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return string.Concat(p[0][0], (p.Length > 1 ? p[^1][0] : p[0][0])).ToUpperInvariant();
    }

    [HttpGet("employees/options")]
    public async Task<IActionResult> GetEmployeesForExtra(CancellationToken ct)
    {
        var email = GetUserEmail();
        //var email = "vhernandezgil@kpmg.com.mx";

        var res = await _bl.GetEmployeesForExtraAsync(email, ct);

        if (!res.Correct)
            return StatusCode(500, new { message = res.ErrorMessage });

        return Ok(res.Object);
    }
}
