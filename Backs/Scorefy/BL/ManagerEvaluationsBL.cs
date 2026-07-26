using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ML;
using System.Globalization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BL
{

    public interface IManagerEvaluationsBL
    {
        // Bandeja (ya lo tienes) 
        ML.Result GetInboxWithSecurity(string evaluatorEmail, ML.ProjectsFilterVM vm);

        // CARGA RÁPIDA: plantilla + pesos (sin valores)
        Task<ML.Result> GenerateSkeletonAsync(string idColabEmpProy, string evaluatorEmail, string? role, CancellationToken ct = default);
        Task<ML.Result> GetFormAsync(string idColabEmpProy, string evaluatorEmail, string? role, CancellationToken ct = default);
        Task<ML.Result> GetFormManager(string idColabEmpProy, string evaluatorEmail, string? role, CancellationToken ct = default);

        // VALORES DIFERIDOS: Evaluated/Evaluator (por subCompetence o "all")
        Task<ML.Result> GetValuesAsync(string idColabEmpProy, decimal? subCompetence, CancellationToken ct = default);

        // Guardar (manager) — acepta el final del front
        Task<ML.Result> SaveDraftAsync(string idColabEmpProy, string evaluatorEmail, IEnumerable<ML.AutoEvalDetailItem> items, decimal? clientFinalScore, CancellationToken ct = default);
        Task<ML.Result> SaveAndCloseAsync(string idColabEmpProy, string evaluatorEmail, IEnumerable<ML.AutoEvalDetailItem> items, decimal? clientFinalScore, CancellationToken ct = default);
        Task<ML.Result> SoftDeleteAsync(ML.DeleteEvaluationRequest req, string userEmail, CancellationToken ct = default);
    }

    public sealed class ManagerEvaluationsBL : IManagerEvaluationsBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<ManagerEvaluationsBL> _logger;

        public ManagerEvaluationsBL(DL.MexItaStaBiAuditContext db, ILogger<ManagerEvaluationsBL> logger)
        {
            _db = db;
            _logger = logger;
        }

        // ------------------------------------------------------------
        // HELPERS
        // ------------------------------------------------------------
        private async Task<int?> GetEmployeeIdByEmailAsync(string email, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;

            return await _db.VwEvaluaColabResumes
                .AsNoTracking()
                .Where(e => e.IsClosed == null || true && e.EvaluatorEmail != null &&
                            e.EvaluatorEmail.ToLower() == email.Trim().ToLower())
                .OrderByDescending(e => e.PkEvalGene)
                .Select(e => (int?)e.EvaluatorId)
                .FirstOrDefaultAsync(ct);
        }

        
        public ML.Result GetInboxWithSecurity(string evaluatorEmail, ML.ProjectsFilterVM vm)
        {
            var result = new ML.Result();
            //evaluatorEmail = "agonzalezchavez@kpmg.com.mx";

            try
            {
                var security = _db.SecurityScorefies
                    .FirstOrDefault(s => s.Email == evaluatorEmail);

                string[] allowedKeyBUs = { "UNO", "UNNE", "CIM", "IRM", "TMT", "SF" };

                var evaluatorId = GetEmployeeIdByEmailAsync(evaluatorEmail)
                    .GetAwaiter()
                    .GetResult();

                bool hasAccess = false; // 🔐 deny by default

                // ---- BASE QUERY ----
                IQueryable<DL.VwEvaluaColabResume> query =
                    _db.VwEvaluaColabResumes.AsNoTracking()
                    .Where(v => v.ColumnC == 0 && v.IdColabEmpProy != "");

                // ---------- SIN SECURITY ----------
                if (security == null)
                {
                    vm.ShowFilters = false;
                    vm.BUIsFixed = false;

                   
                        query = query.Where(v => v.EvaluatorEmail == evaluatorEmail);
                        hasAccess = true;
                    
                }
                // ---------- CON SECURITY ----------
                else
                {
                    vm.ShowFilters = true;
                    var role = (security.Role ?? "").Trim();
                    hasAccess = true;

                    if (role.Equals("PIE", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedBu = { "PCG", "IRM", "ESG" };
                        query = query.Where(v => allowedBu.Contains(v.Bu));
                        hasAccess = true;
                    }
                    else if (role.Equals("HLSTM", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedLoc = { "Hermosillo", "León", "San Luis Potosí", "Tijuana", "Mexicali" };
                        query = query.Where(v => v.Bu == "UNO" && allowedLoc.Contains(v.Office));
                        hasAccess = true;
                    }
                    else if (role.Equals("COMMITTE", StringComparison.OrdinalIgnoreCase))
                    {
                        query = query.Where(v => v.EvaluatorEmail == evaluatorEmail);
                        hasAccess = true;
                    }
                    else if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
                    {
                        var keyBu = (security.Bu ?? "").Trim().ToUpperInvariant();

                        if (!string.IsNullOrEmpty(keyBu) && allowedKeyBUs.Contains(keyBu))
                        {
                            vm.BUIsFixed = true;
                            vm.BU = keyBu;
                            query = query.Where(v => v.Bu == keyBu);
                            hasAccess = true;
                        }
                    }

                    // ---- Filtros opcionales SOLO si hay acceso ----
                    if (hasAccess)
                    {
                        if (!string.IsNullOrWhiteSpace(vm.BU))
                            query = query.Where(v => v.Bu == vm.BU);

                        if (!string.IsNullOrWhiteSpace(vm.Location_Name))
                            query = query.Where(v => v.Office == vm.Location_Name);

                        if (!string.IsNullOrWhiteSpace(vm.Local_Job_Level_Name))
                            query = query.Where(v => v.Role == vm.Local_Job_Level_Name);

                        if (!string.IsNullOrWhiteSpace(vm.Employee_Name))
                        {
                            var emp = vm.Employee_Name.Trim().ToLower();
                            query = query.Where(v =>
                                v.EvaluatedName != null &&
                                v.EvaluatedName.ToLower().Contains(emp));
                        }
                    }
                }

                // ---------- BLOQUE FINAL DE SEGURIDAD ----------
                if (!hasAccess)
                {
                    result.Correct = true;
                    result.Object = new
                    {
                        pending = new List<object>(),
                        submitted = new List<object>(),
                        completed = new List<object>()
                    };
                    return result;
                }

                // ---------- PROYECCIÓN ----------
                var rows = query
                    .OrderByDescending(v => v.CreatedTime)
                    .Select(v => new
                    {
                        id = v.IdColabEmpProy,
                        personName = v.EvaluatedName,
                        role = v.Role,
                        clientName = v.ClientName,
                        clientNumber = v.EntityNumber,
                        state = v.IsClosed == null
                            ? "pending"
                            : (v.IsClosed == true ? "submitted" : "completed"),
                        cutoffPeriod = v.CutOff,
                        evaluatedHours = v.TotalHours,
                        dueDate = v.ModifiedTime.HasValue
                            ? v.ModifiedTime.Value.ToString("yyyy-MM-dd")
                            : v.CreatedTime.HasValue
                                ? v.CreatedTime.Value.ToString("yyyy-MM-dd")
                                : "",
                        pkEvalGene = v.PkEvalGene,
                        keyReport = v.KeyReport,
                        generatedType = v.GeneratedType,
                        isClosed = v.IsClosed
                    })
                    .ToList();

                var pending = rows.Where(x => x.state == "pending").ToList<object>();
                var submitted = rows.Where(x => x.state == "submitted").ToList<object>();
                var completed = rows.Where(x => x.state == "completed").ToList<object>();

                result.Correct = true;
                result.Object = new { pending, submitted, completed };
                return result;
            }
            catch (Exception ex)
            {
                return new ML.Result
                {
                    Correct = false,
                    ErrorMessage = "Error cargando los datos",
                    Ex = ex
                };
            }
        }

        // ------------------------------------------------------------
        // 2) FORMULARIO — carga lo que llenó el EVALUATED
        // ------------------------------------------------------------
        public async Task<Result> GetFormAsync(string idColabEmpProy, string evaluatorEmail, string? role, CancellationToken ct = default)
        {
            try
            {
                var security = await _db.SecurityScorefies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Email == evaluatorEmail, ct);

                if (security == null)
                {
                    var evaluatorId = await GetEmployeeIdByEmailAsync(evaluatorEmail, ct);
                    if (!evaluatorId.HasValue)
                        return new ML.Result { Correct = false, ErrorMessage = "Evaluator no identificado." };

                    var header = await _db.VwEvaluaColabResumes.AsNoTracking()
                        .SingleOrDefaultAsync(v =>
                            v.IdColabEmpProy == idColabEmpProy &&
                            v.EvaluatorId == evaluatorId.Value &&
                            v.IsClosed == null, ct);

                    if (header == null)
                        return new ML.Result { Correct = false, ErrorMessage = "No autorizado o no existe la evaluación." };
                }
                var rows = await _db.VwEvaluaColabDetails.AsNoTracking()
                    .Where(d => d.IdColabEmpProy == idColabEmpProy)
                    .Select(d => new
                    {
                        d.EcdId,
                        d.Competence,
                        d.SubCompetence,
                        d.ReactiveNum,
                        d.EvaluatedResp,
                        d.EvaluatedComent,
                        // Si agregas columnas EvaluatorResp/EvaluatorComent:
                        d.EvaluatorResp,
                        d.EvaluatorComent
                    }).ToListAsync(ct);

                var incisos = await _db.VwReactivosEdpincisos.AsNoTracking()
                    .Select(i => new
                    {
                        i.Competencia,
                        i.SubCompetencia,
                        i.NumReactivo,
                        i.SubCompetenciaDescrip,
                        i.ReactivoDescrip,
                        i.CompetenciaDescrip
                    }).ToListAsync(ct);

                var idx = incisos.GroupBy(i => (i.Competencia, i.SubCompetencia, i.NumReactivo ?? ""))
                    .ToDictionary(g => g.Key,
                                  g => (g.First().SubCompetenciaDescrip, g.First().CompetenciaDescrip, g.First().ReactivoDescrip));

                var items = new List<ML.AutoEvalDetailItem>();
                foreach (var r in rows)
                {
                    idx.TryGetValue((r.Competence, r.SubCompetence, r.ReactiveNum ?? ""), out var d);

                    items.Add(new ML.AutoEvalDetailItem
                    {
                        EcdId = r.EcdId,
                        Competence = r.Competence.ToString(),
                        SubCompetence = r.SubCompetence?.ToString(),
                        ReactiveNum = r.ReactiveNum,
                        EvaluatedResp = r.EvaluatedResp,
                        EvaluatedComent = r.EvaluatedComent,
                        EvaluatorResp = r.EvaluatorResp,
                        EvaluatorComent = r.EvaluatorComent,
                        SubCompetenceDescrip = d.SubCompetenciaDescrip,
                        ReactiveDescrip = d.ReactivoDescrip,
                        CompetenciaDescrip = d.CompetenciaDescrip
                        // Si agregas EvaluatorResp/EvaluatorComent, mapea aquí.
                    });
                }

                return new ML.Result
                {
                    Correct = true,
                    Object = new { IdColabEmpProy = idColabEmpProy, Items = items }
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
        public async Task<Result> GetFormManager(string idColabEmpProy, string evaluatorEmail, string? role, CancellationToken ct = default)
        {
            try
            {

                var headerVw = await _db.VwEvaluaColabResumes
                   .AsNoTracking()
                   .SingleOrDefaultAsync(h => h.IdColabEmpProy == idColabEmpProy, ct);
                if (headerVw == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                // ========= 2) Rol y FY =========
                var roleRaw = headerVw.Role;
                if (string.IsNullOrWhiteSpace(roleRaw))
                    return new ML.Result { Correct = false, ErrorMessage = "No hay rol definido para cargar la plantilla." };

                var headerTbl = await _db.EvaluaColabResumes
                    .AsNoTracking()
                    .Where(x => x.IdColabEmpProy == idColabEmpProy)
                    .Select(x => new { x.Fy })
                    .FirstOrDefaultAsync(ct);

                int fy = headerTbl?.Fy > 0 ? headerTbl.Fy.Value : (headerVw.CreatedTime?.Year ?? DateTime.UtcNow.Year);
                string roleNorm = NormalizeJobLevel(roleRaw);




                // ========= 3) PLANTILLA (ReactivosEdp) – NO insert =========
                var plantilla = await _db.Set<DL.ReactivosEdp>()
                    .AsNoTracking()
                    .Where(t => t.Vigencia && t.Nivel == roleRaw)
                    .Select(t => new { t.Competencia, t.SubCompetencia, t.NumReactivo })
                    .ToListAsync(ct);

                // ========= 4) EXISTENTES (si los hubiera) =========

                var existentes = await _db.EvaluaColabDetails
                    .AsNoTracking()
                    .Where(d => d.IdColabEmpProy == idColabEmpProy)
                    .Select(d => new { d.EcdId, d.Competence, d.SubCompetence, d.ReactiveNum, d.EvaluatedResp, d.EvaluatedComent, d.EvaluatorComent, d.EvaluatorResp })
                    .ToListAsync(ct);

                var existIdx = existentes.ToDictionary(
                    d => (Comp: d.Competence, Sub: d.SubCompetence, RN: d.ReactiveNum ?? ""),
                    d => d
                );



                var incisos = await _db.VwReactivosEdpincisos.AsNoTracking()
                     .Where(i => i.Nivel == roleRaw)
                     .Select(i => new { i.Competencia, i.SubCompetencia, i.NumReactivo, i.SubCompetenciaDescrip, i.ReactivoDescrip, i.CompetenciaDescrip })
                     .ToListAsync(ct);

                var incIdx = new Dictionary<(int? C, decimal? S, string RN), (string? SubDesc, string? CompDesc, string? ReactDesc)>();
                foreach (var i in incisos)
                {
                    var key = (i.Competencia, i.SubCompetencia, i.NumReactivo ?? "");
                    if (!incIdx.ContainsKey(key))
                        incIdx[key] = (i.SubCompetenciaDescrip, i.CompetenciaDescrip, i.ReactivoDescrip);
                }

                //var compWeights = await _db.ScorefyDimProfileCompetencyWeights
                //    .AsNoTracking()
                //    .Where(w => w.Fy == fy && w.Local_Job_Level_Name == roleNorm)
                //    .ToDictionaryAsync(w => w.CompetenciaId, w => w.Weight, ct);
                var compWeights = await _db.ScorefyDimProfileCompetencyWeights
                    .AsNoTracking()
                    .Where(w => w.Fy == fy && w.Local_Job_Level_Name == roleNorm)
                    .GroupBy(w => w.CompetenciaId)
                    .ToDictionaryAsync(
                        g => g.Key,
                        g => g.First().Weight,
                        ct
                    );

                // normaliza % -> 0..1
                foreach (var k in compWeights.Keys.ToList())
                {
                    var w = compWeights[k];
                    if (w > 1m) compWeights[k] = Math.Round(w / 100m, 6);
                }


                var items = new List<ML.AutoEvalDetailItem>(plantilla.Count);
                foreach (var p in plantilla)
                {
                    var key = (Comp: (int?)p.Competencia, Sub: p.SubCompetencia, RN: p.NumReactivo ?? "");
                    existIdx.TryGetValue((p.Competencia, p.SubCompetencia, p.NumReactivo ?? ""), out var d);
                    incIdx.TryGetValue(key, out var desc);

                    decimal? weight = null;
                    if (p.Competencia != 0 && compWeights.TryGetValue(p.Competencia, out var w))
                        weight = w; // 0..1

                    items.Add(new ML.AutoEvalDetailItem
                    {
                        EcdId = d?.EcdId ?? 0,
                        Competence = p.Competencia.ToString(),
                        SubCompetence = p.SubCompetencia.ToString(),
                        ReactiveNum = p.NumReactivo,
                        EvaluatedResp = d?.EvaluatedResp,   // puede ser null; no insertamos aquí
                        EvaluatedComent = d?.EvaluatedComent,
                        EvaluatorComent = d?.EvaluatorComent,
                        EvaluatorResp = d?.EvaluatorResp,
                        SubCompetenceDescrip = desc.SubDesc,
                        ReactiveDescrip = desc.ReactDesc,
                        CompetenciaDescrip = desc.CompDesc,
                        Weight = weight           // ← **AHORA sí** viaja el peso por competencia (0..1)
                    });
                }

                return new ML.Result
                {
                    Correct = true,
                    Object = new { IdColabEmpProy = idColabEmpProy, Items = items, Header = headerVw }
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }





        // BL/ManagerEvaluationsBL.cs (fragmentos clave)
        public async Task<ML.Result> GenerateSkeletonAsync(
    string idColabEmpProy,
    string evaluatorEmail,
    string? role,
    CancellationToken ct = default)
        {
            try
            {
                // Seguridad: si el usuario está en SecurityScorefies, puede ver el form
                var security = await _db.SecurityScorefies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Email == evaluatorEmail, ct);

                if (security == null)
                {
                    // Validación estricta: debe ser el evaluador asignado
                    var evaluatorId = await GetEmployeeIdByEmailAsync(evaluatorEmail, ct);
                    if (!evaluatorId.HasValue)
                        return new ML.Result { Correct = false, ErrorMessage = "Evaluator no identificado." };

                    var headerStrict = await _db.VwEvaluaColabResumes.AsNoTracking()
                        .SingleOrDefaultAsync(x =>
                            x.IdColabEmpProy == idColabEmpProy &&
                            x.EvaluatorId == evaluatorId.Value &&
                            x.IsClosed == true, ct);

                    if (headerStrict == null)
                        return new ML.Result { Correct = false, ErrorMessage = "No autorizado." };
                }

                // Header (FY, Rol)
                var header = await _db.VwEvaluaColabResumes.AsNoTracking()
                    .SingleOrDefaultAsync(v => v.IdColabEmpProy == idColabEmpProy, ct);

                int fy = await _db.EvaluaColabResumes.AsNoTracking()
                    .Where(r => r.IdColabEmpProy == idColabEmpProy)
                    .Select(r => (int?)r.Fy)
                    .FirstOrDefaultAsync(ct)
                    ?? (header.CreatedTime?.Year ?? DateTime.UtcNow.Year);

                string roleRaw = header.Role ?? role ?? "";
                string roleNorm = NormalizeJobLevel(roleRaw);

                // Pesos
                var weights = await _db.ScorefyDimProfileCompetencyWeights
                    .AsNoTracking()
                    .Where(w => w.Fy == fy && w.Local_Job_Level_Name == roleNorm)
                    .ToDictionaryAsync(w => w.CompetenciaId, w => (w.Weight > 1 ? w.Weight / 100m : w.Weight), ct);

                // Plantilla
                var incisos = await _db.VwReactivosEdpincisos.AsNoTracking()
                    .Where(i => i.Nivel == roleRaw)
                    .ToListAsync(ct);

                var items = new List<ML.AutoEvalDetailItem>();
                foreach (var i in incisos)
                {
                    weights.TryGetValue(i.Competencia ?? 0, out var w);

                    items.Add(new ML.AutoEvalDetailItem
                    {
                        EcdId = 0,
                        Competence = i.Competencia?.ToString(),
                        SubCompetence = i.SubCompetencia?.ToString(),
                        ReactiveNum = i.NumReactivo,
                        EvaluatedResp = null,
                        EvaluatedComent = null,
                        EvaluatorResp = null,
                        EvaluatorComent = null,
                        SubCompetenceDescrip = i.SubCompetenciaDescrip,
                        ReactiveDescrip = i.ReactivoDescrip,
                        CompetenciaDescrip = i.CompetenciaDescrip,
                        Weight = w
                    });
                }

                return new ML.Result
                {
                    Correct = true,
                    Object = new
                    {
                        IdColabEmpProy = idColabEmpProy,
                        Items = items,
                        Header = header,
                        LazyValues = true
                    }
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        // VALORES DIFERIDOS (mínimo select, directo a tabla, con filtro opcional por sub)
        public async Task<ML.Result> GetValuesAsync(
    string idColabEmpProy,
    decimal? subCompetence,
    CancellationToken ct = default)
        {
            try
            {
                decimal? sub = null;
                if (!(subCompetence.HasValue) &&
                    decimal.TryParse(subCompetence.Value.ToString(CultureInfo.InvariantCulture), NumberStyles.Any, CultureInfo.InvariantCulture, out var sc))
                    sub = sc;

                var query = _db.VwEvaluaColabDetails.AsNoTracking()
                    .Where(d => d.IdColabEmpProy == idColabEmpProy);

                if (sub.HasValue)
                    query = query.Where(d => d.SubCompetence == sub);

                var values = await query
                    .Select(d => new
                    {
                        d.SubCompetence,
                        d.ReactiveNum,
                        d.EvaluatedResp,
                        d.EvaluatedComent,
                        d.EvaluatorResp,
                        d.EvaluatorComent
                    })
                    .OrderBy(d => d.SubCompetence)
                    .ThenBy(d => d.ReactiveNum)
                    .ToListAsync(ct);

                return new ML.Result { Correct = true, Object = values };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        public async Task<ML.Result> GenerateOrLoadAsync(
    string idColabEmpProy,
    string evaluatorEmail,
    string? role,
    CancellationToken ct = default)
        {
            try
            {
                // 1) Autoriza: que el header pertenezca al evaluador y esté cerrado por el evaluated
                var evaluatorId = await GetEmployeeIdByEmailAsync(evaluatorEmail, ct);
                if (!evaluatorId.HasValue)
                    return new ML.Result { Correct = false, ErrorMessage = "Evaluator no identificado." };

                var headerVw = await _db.VwEvaluaColabResumes.AsNoTracking()
                    .SingleOrDefaultAsync(v =>
                        v.IdColabEmpProy == idColabEmpProy &&
                        v.EvaluatorId == evaluatorId.Value &&
                        v.IsClosed == null, ct);
                if (headerVw == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No autorizado o no existe la evaluación." }; // mismo patrón que ya tenías
                                                                                                                         // [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/ManagerEvaluationsBL.cs)

                // 2) FY + rol normalizado (igual que Self)
                var headerTblFy = await _db.EvaluaColabResumes.AsNoTracking()
                    .Where(x => x.IdColabEmpProy == idColabEmpProy)
                    .Select(x => (int?)x.Fy)
                    .FirstOrDefaultAsync(ct);

                int fy = headerTblFy ?? (headerVw.CreatedTime?.Year ?? DateTime.UtcNow.Year);
                string roleRaw = headerVw.Role ?? role ?? "";
                string roleNorm = NormalizeJobLevel(roleRaw); // helper idéntico a Self
                                                              // [2](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)

                // 3) Pesos por competencia (normalizados 0..1)
                var weights = await _db.ScorefyDimProfileCompetencyWeights.AsNoTracking()
                    .Where(w => w.Fy == fy && w.Local_Job_Level_Name == roleNorm)
                    .ToDictionaryAsync(w => w.CompetenciaId, w => w.Weight, ct);
                foreach (var k in weights.Keys.ToList())
                {
                    var w = weights[k];
                    if (w > 1m) weights[k] = Math.Round(w / 100m, 6); // 47 -> 0.47
                }
                // [2](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)

                // 4) Detalles (incluye Evaluated y Evaluator)
                var rows = await _db.EvaluaColabDetails.AsNoTracking()
                    .Where(d => d.IdColabEmpProy == idColabEmpProy)
                    .Select(d => new
                    {
                        d.EcdId,
                        d.Competence,
                        d.SubCompetence,
                        d.ReactiveNum,
                        d.EvaluatedResp,
                        d.EvaluatedComent,
                        d.EvaluatorResp,
                        d.EvaluatorComent
                    })
                    .ToListAsync(ct);
                // [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/ManagerEvaluationsBL.cs)

                // 5) Catálogo de textos
                var incisosList = await _db.VwReactivosEdpincisos.AsNoTracking()
                    .Where(i => i.Nivel == roleRaw)
                    .Select(i => new
                    {
                        i.Competencia,
                        i.SubCompetencia,
                        i.NumReactivo,
                        i.SubCompetenciaDescrip,
                        i.ReactivoDescrip,
                        i.CompetenciaDescrip
                    })
                    .ToListAsync(ct);

                var incisosIdx = incisosList
                    .GroupBy(i => (i.Competencia, i.SubCompetencia, i.NumReactivo ?? ""))
                    .ToDictionary(g => g.Key,
                                  g => (g.First().SubCompetenciaDescrip, g.First().CompetenciaDescrip, g.First().ReactivoDescrip));
                // [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/ManagerEvaluationsBL.cs)

                // 6) Mapear salida
                var items = new List<ML.AutoEvalDetailItem>();
                foreach (var r in rows)
                {
                    incisosIdx.TryGetValue((r.Competence, r.SubCompetence, r.ReactiveNum ?? ""), out var dsc);
                    decimal? weight = null;
                    if (weights.TryGetValue(r.Competence, out var w)) weight = w;

                    items.Add(new ML.AutoEvalDetailItem
                    {

                        EcdId = r.EcdId,
                        Competence = r.Competence.ToString(),
                        SubCompetence = r.SubCompetence?.ToString(),
                        ReactiveNum = r.ReactiveNum,
                        // Evaluated (solo lectura)
                        EvaluatedResp = r.EvaluatedResp,
                        EvaluatedComent = r.EvaluatedComent,
                        // Evaluator (captura)
                        EvaluatorResp = r.EvaluatorResp,
                        EvaluatorComent = r.EvaluatorComent,
                        // Descripciones/peso
                        SubCompetenceDescrip = dsc.SubCompetenciaDescrip,
                        ReactiveDescrip = dsc.ReactivoDescrip,
                        CompetenciaDescrip = dsc.CompetenciaDescrip,
                        Weight = weight // 0..1
                    });
                }

                return new ML.Result
                {
                    Correct = true,
                    Object = new { IdColabEmpProy = idColabEmpProy, Items = items, Header = headerVw }
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }


        // ------------------------------------------------------------
        // 3) UPSERT — solo para campos del EVALUATOR
        // ------------------------------------------------------------
        public async Task<Result> UpsertItemAsync(string idColabEmpProy, string evaluatorEmail, string role, ML.AutoEvalDetailItem dto, CancellationToken ct = default)
        {
            try
            {
                var evaluatorId = await GetEmployeeIdByEmailAsync(evaluatorEmail, ct);
                if (!evaluatorId.HasValue)
                    return new Result { Correct = false, ErrorMessage = "Evaluator no identificado." };

                var headerOk = await _db.EvaluaColabResumes.AsNoTracking()
                    .AnyAsync(h =>
                        h.IdColabEmpProy == idColabEmpProy &&
                        h.EvaluatorId == evaluatorId.Value &&
                        h.IsClosed == true, ct);

                if (!headerOk)
                    return new Result { Correct = false, ErrorMessage = "No autorizado." };

                var row = await _db.EvaluaColabDetails
                    .SingleOrDefaultAsync(d => d.EcdId == dto.EcdId && d.IdColabEmpProy == idColabEmpProy, ct);

                if (row == null)
                    return new Result { Correct = false, ErrorMessage = "No existe el detalle." };

                // TODO: agregar tus columnas reales:
                // row.EvaluatorResp = dto.EvaluatorResp;
                // row.EvaluatorComent = dto.EvaluatorComent;

                row.ModifiedBy = evaluatorEmail;
                row.ModifiedTime = DateTime.UtcNow;

                await _db.SaveChangesAsync(ct);

                return new Result { Correct = true };
            }
            catch (Exception ex)
            {
                return new Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }




        public async Task<ML.Result> SaveDraftAsync(
    string idColabEmpProy,
    string evaluatorEmail,
    IEnumerable<ML.AutoEvalDetailItem> items,
    decimal? clientFinalScore,
    CancellationToken ct = default)
        {
            try
            {
                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                // 1) Header rastreado (¡sin AsNoTracking!)
                var header = await _db.EvaluaColabResumes
                    .SingleOrDefaultAsync(h => h.IdColabEmpProy == idColabEmpProy, ct);

                if (header == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                // 2) Validar score antes de tocar datos
                if (!clientFinalScore.HasValue)
                    return new ML.Result { Correct = false, ErrorMessage = "ClientFinalScore es obligatorio." };

                // 3) SOLO UPDATE en detalles (no insertar)
                foreach (var it in items)
                {
                    string rn = it.ReactiveNum ?? "";

                    decimal? sub = null;
                    if (!string.IsNullOrWhiteSpace(it.SubCompetence) &&
                        decimal.TryParse(it.SubCompetence, NumberStyles.Any, CultureInfo.InvariantCulture, out var sc))
                        sub = sc;

                    var row = await _db.EvaluaColabDetails.SingleOrDefaultAsync(d =>
                        d.IdColabEmpProy == idColabEmpProy &&
                        d.ReactiveNum == rn &&
                        d.SubCompetence == sub, ct);

                    if (row == null)
                        continue; // no insertar

                    // Guardar como EVALUADOR
                    row.EvaluatorResp = (int)(it.EvaluatorResp ?? 0);
                    row.EvaluatorComent = it.EvaluatorComent;
                    row.Role = row.Role ?? header.Role;
                    row.ModifiedBy = evaluatorEmail;
                    row.ModifiedTime = DateTime.UtcNow;
                }

                await _db.SaveChangesAsync(ct);

                // 4) Actualizar header con datos del evaluador (Borrador)
                var final = Truncate2(clientFinalScore.Value);

                // (Opcional) contar reactivos del rol solo para referencia
                var totalReactivos = await _db.Set<DL.ReactivosEdp>().AsNoTracking()
                    .CountAsync(t => t.Vigencia && t.Nivel == (header.Role ?? ""), ct);

                header.ReactivesNum = totalReactivos;
                header.GradeEvaluator = final;            // ← nota: evaluador, no evaluado
                header.ModifiedBy = evaluatorEmail;
                header.ModifiedTime = DateTime.UtcNow;
                header.IsClosed = true;            // ← queda como borrador del evaluador
                                                   // ← “In Progress” (ajusta a tu convención)

                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);

                return new ML.Result
                {
                    Correct = true,
                    Object = new { GradeEvaluator = header.GradeEvaluator, ReactivesNum = header.ReactivesNum },
                    ErrorMessage = "Borrador del evaluador guardado."
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }



        public async Task<ML.Result> SaveAndCloseAsync(
    string idColabEmpProy,
    string evaluatorEmail,
    IEnumerable<ML.AutoEvalDetailItem> items,
    decimal? clientFinalScore,
    CancellationToken ct = default)
        {
            try
            {
                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                // 1) Header rastreado (¡sin AsNoTracking!)
                var header = await _db.EvaluaColabResumes
                    .SingleOrDefaultAsync(h => h.IdColabEmpProy == idColabEmpProy, ct);

                if (header == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                // 2) Validar score antes de tocar datos
                if (!clientFinalScore.HasValue)
                    return new ML.Result { Correct = false, ErrorMessage = "ClientFinalScore es obligatorio." };

                // 3) SOLO UPDATE en detalles (no insertar)
                foreach (var it in items)
                {
                    string rn = it.ReactiveNum ?? "";

                    decimal? sub = null;
                    if (!string.IsNullOrWhiteSpace(it.SubCompetence) &&
                        decimal.TryParse(it.SubCompetence, NumberStyles.Any, CultureInfo.InvariantCulture, out var sc))
                        sub = sc;

                    var row = await _db.EvaluaColabDetails.SingleOrDefaultAsync(d =>
                        d.IdColabEmpProy == idColabEmpProy &&
                        d.ReactiveNum == rn &&
                        d.SubCompetence == sub, ct);

                    if (row == null)
                        continue; // no insertar

                    // Guardar como EVALUADOR
                    row.EvaluatorResp = (int)(it.EvaluatorResp ?? 0);
                    row.EvaluatorComent = it.EvaluatorComent;
                    row.Role = row.Role ?? header.Role;
                    row.ModifiedBy = evaluatorEmail;
                    row.ModifiedTime = DateTime.UtcNow;
                }

                await _db.SaveChangesAsync(ct);

                // 4) Actualizar header con datos del evaluador (Borrador)
                var final = Truncate2(clientFinalScore.Value);

                // (Opcional) contar reactivos del rol solo para referencia
                var totalReactivos = await _db.Set<DL.ReactivosEdp>().AsNoTracking()
                    .CountAsync(t => t.Vigencia && t.Nivel == (header.Role ?? ""), ct);

                header.ReactivesNum = totalReactivos;
                header.GradeEvaluator = final;            // ← nota: evaluador, no evaluado
                header.ModifiedBy = evaluatorEmail;
                header.ModifiedTime = DateTime.UtcNow;
                header.IsClosed = false;            // ← queda como borrador del evaluador
                                                    // ← “In Progress” (ajusta a tu convención)

                await _db.SaveChangesAsync(ct);
                await tx.CommitAsync(ct);


                var info = await _db.VwEvaluaColabResumes
                            .AsNoTracking()
                            .FirstOrDefaultAsync(v => v.IdColabEmpProy == idColabEmpProy, ct);

                string evaluadorNombre = info?.EvaluatorName ?? "Evaluador";
                string evaluadoNombre = info?.EvaluatedName ?? "Colaborador";
                string evaluadoEmail = info?.EvaluatedEmail ?? "";

                // ================= INSERT EMAIL =================
                try
                {
                    var bodyEmail = $@"
                        Saludos {evaluadoNombre}

                        Envío este email para informar que he completado la evaluación de desempeño del proyecto.

                        Para revisar a detalle favor de ingresar a la seccion de 'Reportes' en la aplicación Scorefy Audit.

                         Gracias por tu colaboración.

                        {evaluadorNombre}
                        ";

                    var emailRow = new DL.ScorefyTblEmail
                    {
                        // Destinatario
                        ToEmail = evaluadoEmail,
                        ToName = evaluadoNombre,

                        // Remitente
                        FromEmail = evaluatorEmail,
                        FromName = evaluadorNombre,

                        // Contenido
                        Body = bodyEmail,

                        // 🔐 CONTROL DE NEGOCIO
                        ContextKey = idColabEmpProy,      // Evento
                        EmailType = "EvalCompleted", // Tipo de correo

                        // 👤 ORIGEN
                        IdentitySect = 2                 // 1 = Evaluado
                                                         // CreatedUtc lo asigna la BD
                    };

                    _db.ScorefyTblEmails.Add(emailRow);
                    await _db.SaveChangesAsync(ct);
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Error insertando ScorefyTblEmail en SaveAndCloseAsync (Evaluador)");
                }


                return new ML.Result
                {
                    Correct = true,
                    Object = new { GradeEvaluator = header.GradeEvaluator, ReactivesNum = header.ReactivesNum },
                    ErrorMessage = "Borrador del evaluador guardado."
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        public async Task<ML.Result> SoftDeleteAsync(ML.DeleteEvaluationRequest req, string userEmail, CancellationToken ct = default)
        {
            try
            {
                if (req == null) return new ML.Result { Correct = false, ErrorMessage = "Solicitud vacía." };

                // Id efectivo (acepta ECR_Id o IdColabEmpProy)
                var id = !string.IsNullOrWhiteSpace(req.IdColabEmpProy) ? req.IdColabEmpProy : req.EcrIdAlias;
                if (string.IsNullOrWhiteSpace(id) && string.IsNullOrWhiteSpace(req.KeyReport))
                    return new ML.Result { Correct = false, ErrorMessage = "IdColabEmpProy (ECR_Id) o KeyReport es obligatorio." };

                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                // 1) Header (EvaluaColabResume)
                var header = await _db.EvaluaColabResumes
                    .SingleOrDefaultAsync(h => h.IdColabEmpProy == id, ct);

                // ✅ AGREGADO: Búsqueda por KeyReport directamente en EvaluaColabResume
                if (header == null && !string.IsNullOrWhiteSpace(req.KeyReport))
                {
                    header = await _db.EvaluaColabResumes
                        .SingleOrDefaultAsync(h => h.KeyReport == req.KeyReport, ct);

                    if (header != null)
                    {
                        id = header.IdColabEmpProy; // ✅ obtener ID real
                    }
                }

                if (header == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                header.IsCurrent = false;
                header.ModifiedBy = userEmail;
                header.ModifiedTime = DateTime.UtcNow;

                await _db.SaveChangesAsync(ct);

                // 2) Revertir flags de generación, según GeneratedType
                if (req.PkEvalGene.HasValue)
                {
                    var gen = await _db.ScorefyTblEvaluationsGenerates
                        .Where(p => p.PkEvalGene == req.PkEvalGene.Value && p.IsCurrent == true)
                        .FirstOrDefaultAsync(ct);

                    if (gen != null)
                    {
                        gen.GeneratedEvaluation = false;
                        if ((req.GeneratedType ?? 0) != 1)
                        {
                            gen.IsCurrent = true;
                        }
                        _db.ScorefyTblEvaluationsGenerates.Update(gen);
                        await _db.SaveChangesAsync(ct);
                    }
                }
                else if (!string.IsNullOrWhiteSpace(req.KeyReport))
                {
                    // ✅ AGREGADO: Si NO hay PkEvalGene pero sí KeyReport → buscar en EvaluationsGenerates
                    var genFromKey = await _db.ScorefyTblEvaluationsGenerates
                        .Where(p => p.KeyReport == req.KeyReport && p.IsCurrent == true)
                        .FirstOrDefaultAsync(ct);

                    if (genFromKey != null)
                    {
                        genFromKey.GeneratedEvaluation = false;

                        if ((req.GeneratedType ?? 0) != 1)
                        {
                            genFromKey.IsCurrent = true;
                        }

                        _db.ScorefyTblEvaluationsGenerates.Update(genFromKey);
                        await _db.SaveChangesAsync(ct);
                    }
                }

                // 3) Revertir EXTRAS (tu bloque original)
                if (!string.IsNullOrWhiteSpace(req.KeyReport) && (req.GeneratedType ?? 0) != 1)
                {
                    var extra = await _db.ScorefyTblEvaluationsGenerateExtras
                        .Where(x => x.KeyReport == req.KeyReport && x.IsCurrent == true)
                        .FirstOrDefaultAsync(ct);

                    if (extra != null)
                    {
                        extra.GeneratedEvaluation = false;
                        extra.IsCurrent = true;
                        _db.ScorefyTblEvaluationsGenerateExtras.Update(extra);
                        await _db.SaveChangesAsync(ct);
                    }
                }

                await tx.CommitAsync(ct);

                return new ML.Result
                {
                    Correct = true,
                    ErrorMessage = "Evaluación eliminada (soft delete).",
                    Object = new
                    {
                        IdColabEmpProy = id,
                        Affected = new
                        {
                            EvaluaColabResume = true,
                            ScorefyTblEvaluationsGenerates = true,
                            ScorefyTblEvaluationsGenerateExtra = (!string.IsNullOrWhiteSpace(req.KeyReport) && (req.GeneratedType ?? 0) != 1)
                        }
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en SoftDeleteAsync");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
        //public async Task<ML.Result> SoftDeleteAsync(ML.DeleteEvaluationRequest req, string userEmail, CancellationToken ct = default)
        //{
        //    try
        //    {
        //        if (req == null) return new ML.Result { Correct = false, ErrorMessage = "Solicitud vacía." };

        //        // Id efectivo (acepta ECR_Id o IdColabEmpProy)
        //        var id = !string.IsNullOrWhiteSpace(req.IdColabEmpProy) ? req.IdColabEmpProy : req.EcrIdAlias;
        //        if (string.IsNullOrWhiteSpace(id))
        //            return new ML.Result { Correct = false, ErrorMessage = "IdColabEmpProy (ECR_Id) es obligatorio." };

        //        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        //        // 1) Header (EvaluaColabResume)
        //        var header = await _db.EvaluaColabResumes
        //            .SingleOrDefaultAsync(h => h.IdColabEmpProy == id, ct);

        //        if (header == null)
        //            return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

        //        header.IsCurrent = false;
        //        header.ModifiedBy = userEmail;
        //        header.ModifiedTime = DateTime.UtcNow;

        //        await _db.SaveChangesAsync(ct);

        //        // 2) Revertir flags de generación, según GeneratedType
        //        if (req.PkEvalGene.HasValue)
        //        {
        //            var gen = await _db.ScorefyTblEvaluationsGenerates
        //                .Where(p => p.PkEvalGene == req.PkEvalGene.Value && p.IsCurrent == true)
        //                .FirstOrDefaultAsync(ct);

        //            if (gen != null)
        //            {
        //                gen.GeneratedEvaluation = false;
        //                if ((req.GeneratedType ?? 0) != 1)
        //                {
        //                    gen.IsCurrent = true;
        //                }
        //                _db.ScorefyTblEvaluationsGenerates.Update(gen);
        //                await _db.SaveChangesAsync(ct);
        //            }
        //        }

        //        if (!string.IsNullOrWhiteSpace(req.KeyReport) && (req.GeneratedType ?? 0) != 1)
        //        {
        //            var extra = await _db.ScorefyTblEvaluationsGenerateExtras
        //                .Where(x => x.KeyReport == req.KeyReport && x.IsCurrent == true)
        //                .FirstOrDefaultAsync(ct);

        //            if (extra != null)
        //            {
        //                extra.GeneratedEvaluation = false;
        //                extra.IsCurrent = true;
        //                _db.ScorefyTblEvaluationsGenerateExtras.Update(extra);
        //                await _db.SaveChangesAsync(ct);
        //            }
        //        }

        //        await tx.CommitAsync(ct);

        //        return new ML.Result
        //        {
        //            Correct = true,
        //            ErrorMessage = "Evaluación eliminada (soft delete).",
        //            Object = new
        //            {
        //                IdColabEmpProy = id,
        //                Affected = new
        //                {
        //                    EvaluaColabResume = true,
        //                    ScorefyTblEvaluationsGenerates = req.PkEvalGene.HasValue,
        //                    ScorefyTblEvaluationsGenerateExtra = (!string.IsNullOrWhiteSpace(req.KeyReport) && (req.GeneratedType ?? 0) != 1)
        //                }
        //            }
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error en SoftDeleteAsync");
        //        return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
        //    }
        //}




        private static string NormalizeJobLevel(string role)
        {
            if (string.IsNullOrWhiteSpace(role)) return "";

            var r = role.Trim().ToUpperInvariant();

            if (r.Contains("STAFF") && r.Contains("IN CHARGE")) return "Staff In Charge";
            if (r == "STAFF") return "Staff";
            if (r.Contains("SUPERVISING") && r.Contains("SENIOR")) return "Supervising Senior";
            if (r.Contains("SENIOR MANAGER")) return "Senior Manager";
            if (r.Contains("MANAGER") && !r.Contains("SENIOR")) return "Manager";
            if (r.Contains("SENIOR")) return "Senior";

            return role.Trim();
        }



        private static decimal Truncate2(decimal value)
        {
            return Math.Truncate(value * 100m) / 100m; // 2 decimales sin redondeo
        }
    }


}