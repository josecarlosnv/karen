

// BL/SelfEvaluationBL.cs
using DL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ML;
using System.Globalization;

namespace BL
{
    public interface ISelfEvaluationsBL
    {
        // Bandeja / filtros 
        ML.Result GetResumeWithSecurity(string email, ML.ProjectsFilterVM vm);
        ML.Result GetProjectsWithSecurity(string email, ML.ProjectsFilterVM vm);
        ML.Result GetEmployeeOptionsForScope(string email, ML.ProjectsFilterVM vm);
        ML.Result LookupClientName(int clientId);

        // Extraordinarias
        ML.Result ValidateExtra(ML.ValidateExtraRequest req);
        ML.Result AddExtra(ML.ScorefyTblEvaluationsGenerateExtra vm);

        // Generación y detalle
        Task<ML.Result> GenerateEvaluationAsync(ML.MyAutoEvalAddRequest req, string email, CancellationToken ct = default);

        // **NO siembra**: solo proyecta plantilla + existentes
        Task<ML.Result> GenerateOrLoadAsync(ML.AutoEvalDetailsGenerateRequest req, CancellationToken ct = default);

        // Autosave: **solo update si existe**, no inserta
        Task<ML.Result> UpsertOneAsync(string idColabEmpProy, string email, string rolSeleccionado, ML.AutoEvalDetailItem it, CancellationToken ct = default);

        Task<(int Contestados, int Total, bool EvaluadorOk)> GetProgresoAsync(string idColabEmpProy, string rolSeleccionado, int? evaluatorId, CancellationToken ct = default);

        // Guardar = upsert masivo + cálculo de Grade (ignorando 0)
        Task<ML.Result> SaveDraftAsync(string idColabEmpProy, string email, IEnumerable<ML.AutoEvalDetailItem> items, decimal? clientFinalScore,CancellationToken ct = default);

        // Cerrar = upsert masivo + cálculo de Grade (ignorando 0) + IsClosed=true
        Task<ML.Result> SaveAndCloseAsync(string idColabEmpProy, string email, IEnumerable<ML.AutoEvalDetailItem> items, decimal? clientFinalScore, CancellationToken ct = default);

        Task<ML.Result> GetEmployeesForExtraAsync(string email, CancellationToken ct = default);

        Task<ML.Result> SoftDeleteAsync(ML.DeleteEvaluationRequest req, string userEmail, CancellationToken ct = default);
    }

    public sealed class SelfEvaluationsBL : ISelfEvaluationsBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<SelfEvaluationsBL> _logger;

        public SelfEvaluationsBL(DL.MexItaStaBiAuditContext db, ILogger<SelfEvaluationsBL> logger)
        {
            _db = db;
            _logger = logger;
        }

        // ===========================================================
        // 1) BANDEJA (resumen) — basado en tu BL previo
        // ===========================================================
        public ML.Result GetResumeWithSecurity(string email, ML.ProjectsFilterVM vm)
        {
            var result = new ML.Result();
            try
            {
                var security = _db.SecurityScorefies.FirstOrDefault(s => s.Email == email); // DbSet real  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)
                string[] allowedKeyBUs = { "UNO", "UNNE", "CIM", "IRM", "TMT", "SF" };

                IQueryable<DL.VwEvaluaColabResume> query = _db.VwEvaluaColabResumes
                    .AsNoTracking()
                    .Where(p => p.IdColabEmpProy != ""); //  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)

                if (security == null)
                {
                    vm.ShowFilters = false;
                    vm.BUIsFixed = false;
                    query = query.Where(p => p.EvaluatedEmail == email);
                }
                else
                {
                    vm.ShowFilters = true;
                    var role = (security.Role ?? string.Empty).Trim();

                    if (role.Equals("PIE", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedBu = { "PCG", "IRM", "ESG" };
                        query = query.Where(p => allowedBu.Contains(p.Bu));
                    }
                    else if (role.Equals("HLSTM", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedLocations = { "Hermosillo", "León", "San Luis Potosí", "Tijuana", "Mexicali" };
                        query = query.Where(p => p.Bu == "UNO" && allowedLocations.Contains(p.Office));
                    }
                    else if (role.Equals("COMMITTE", StringComparison.OrdinalIgnoreCase))
                    {
                        query = query.Where(p => p.EvaluatedEmail == email);
                    }
                    else if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
                    {
                        var keyBu = (security.Bu ?? string.Empty).Trim().ToUpperInvariant();
                        if (string.IsNullOrEmpty(keyBu) || !allowedKeyBUs.Contains(keyBu))
                        {
                            vm.ShowFilters = false;
                            vm.BUIsFixed = false;
                            vm.ResultsResume = new List<ML.EvaluaColabResume>();
                            result.Correct = true;
                            result.Object = vm;
                            return result;
                        }
                        vm.BUIsFixed = true;
                        vm.BU = keyBu;
                        query = query.Where(p => p.Bu == keyBu);
                    }

                    if (!string.IsNullOrWhiteSpace(vm.BU)) query = query.Where(p => p.Bu == vm.BU);
                    if (!string.IsNullOrWhiteSpace(vm.Location_Name)) query = query.Where(p => p.Office == vm.Location_Name);
                    if (!string.IsNullOrWhiteSpace(vm.Local_Job_Level_Name)) query = query.Where(p => p.Role == vm.Local_Job_Level_Name);
                    if (!string.IsNullOrWhiteSpace(vm.Employee_Name))
                    {
                        var emp = vm.Employee_Name.Trim().ToLower();
                        query = query.Where(p => p.EvaluatedName != null && p.EvaluatedName.ToLower().Contains(emp));
                    }

                    vm.BUOptions = query.Select(p => p.Bu).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    vm.LocationOptions = query.Select(p => p.Office).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    vm.JobLevelOptions = query.Select(p => p.Role).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    vm.EmployeeOptions = query.Select(p => p.EvaluatedName).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    if (vm.BUIsFixed && !string.IsNullOrWhiteSpace(vm.BU))
                        vm.BUOptions = new List<string> { vm.BU };
                }

                query = query.OrderBy(p => p.ClientName);
                vm.ResultsResume = query.Select(p => new ML.EvaluaColabResume
                {
                    IdColabEmpProy = p.IdColabEmpProy,
                    ClientName = p.ClientName,
                    Role = p.Role,
                    EntityNumber = p.EntityNumber,
                    CutOff = p.CutOff,
                    GradeEvaluated = p.GradeEvaluated,
                    GradeEvaluator = p.GradeEvaluator,
                    CreatedTime = p.CreatedTime,
                    EcrId = p.EcrId,
                    EvaluatedId = p.EvaluatedId,
                    EvaluatorName = p.EvaluatorName,
                    EvaluatorId = p.EvaluatorId,
                    IsClosed = p.IsClosed,
                    ColumnC = p.ColumnC,
                    PkEvalGene = p.PkEvalGene,
                    KeyReport = p.KeyReport,
                    GeneratedType = p.GeneratedType
                }).ToList();

                result.Correct = true;
                result.Object = vm;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = "Error al cargar los datos";
                result.Ex = ex;
            }
            return result;
        }

        // ===========================================================
        // 2) PROYECTOS (para generar) — basado en tu BL previo
        // ===========================================================
        public ML.Result GetProjectsWithSecurity(string email, ML.ProjectsFilterVM vm)
        {
            var result = new ML.Result();
            try
            {
                var security = _db.SecurityScorefies.FirstOrDefault(s => s.Email == email); //  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)
                string[] allowedKeyBUs = { "UNO", "UNNE", "CIM", "IRM", "TMT", "SF" };

                IQueryable<DL.ScorefyTblEvaluationsGenerate> query = _db.ScorefyTblEvaluationsGenerates
                    .AsNoTracking()
                    .Where(p => p.GeneratedEvaluation == false && p.IsCurrent == true);

                if (security == null)
                {
                    vm.ShowFilters = false;
                    vm.BUIsFixed = false;
                    query = query.Where(p => p.EmailAddressBusiness == email);
                }
                else
                {
                    vm.ShowFilters = true;
                    var role = (security.Role ?? string.Empty).Trim();

                    if (role.Equals("PIE", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedBu = { "PCG", "IRM", "ESG" };
                        query = query.Where(p => allowedBu.Contains(p.Bu));
                    }
                    else if (role.Equals("HLSTM", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedLocations = { "Hermosillo", "León", "San Luis Potosí", "Tijuana", "Mexicali" };
                        query = query.Where(p => p.Bu == "UNO" && allowedLocations.Contains(p.LocationName));
                    }
                    else if (role.Equals("COMMITTE", StringComparison.OrdinalIgnoreCase))
                    {
                        query = query.Where(p => p.EmailAddressBusiness == email);
                    }
                    else if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
                    {
                        var keyBu = (security.Bu ?? string.Empty).Trim().ToUpperInvariant();
                        if (string.IsNullOrEmpty(keyBu) || !allowedKeyBUs.Contains(keyBu))
                        {
                            vm.ShowFilters = false;
                            vm.BUIsFixed = false;
                            vm.Results = new List<ML.ScorefyTblEvaluationsGenerate>();
                            result.Correct = true;
                            result.Object = vm;
                            return result;
                        }
                        vm.BUIsFixed = true;
                        vm.BU = keyBu;
                        query = query.Where(p => p.Bu == keyBu);
                    }

                    if (!string.IsNullOrWhiteSpace(vm.BU)) query = query.Where(p => p.Bu == vm.BU);
                    if (!string.IsNullOrWhiteSpace(vm.Location_Name)) query = query.Where(p => p.LocationName == vm.Location_Name);
                    if (!string.IsNullOrWhiteSpace(vm.Local_Job_Level_Name)) query = query.Where(p => p.LocalJobLevelName == vm.Local_Job_Level_Name);
                    if (!string.IsNullOrWhiteSpace(vm.Employee_Name))
                    {
                        var emp = vm.Employee_Name.Trim().ToLower();
                        query = query.Where(p => p.EmployeeName != null && p.EmployeeName.ToLower().Contains(emp));
                    }

                    vm.BUOptions = query.Select(p => p.Bu).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    vm.LocationOptions = query.Select(p => p.LocationName).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    vm.JobLevelOptions = query.Select(p => p.LocalJobLevelName).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    vm.EmployeeOptions = query.Select(p => p.EmployeeName).Where(v => v != null).Distinct().OrderBy(v => v).ToList();
                    if (vm.BUIsFixed && !string.IsNullOrWhiteSpace(vm.BU))
                        vm.BUOptions = new List<string> { vm.BU };
                }

                query = query.OrderBy(p => p.ClientName);
                vm.Results = query
                    .Select(p => new ML.ScorefyTblEvaluationsGenerate
                    {
                        PkEvalGene = p.PkEvalGene,
                        ClientName = p.ClientName,
                        ClientId = p.ClientId,
                        LocalJobLevelName = p.LocalJobLevelName,
                        TotalHours = p.TotalHours,
                        CutOff = p.CutOff,
                        GeneratedEvaluation = p.GeneratedEvaluation,
                        IsCurrent = p.IsCurrent,
                        BU = p.Bu,
                        LocationName = p.LocationName,
                        EmployeeName = p.EmployeeName,
                        EmployeeId = p.EmployeeId,
                        EmailAddressBusiness = p.EmailAddressBusiness
                    })
                    .ToList();

                result.Correct = true;
                result.Object = vm;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = "Error al cargar los proyectos";
                result.Ex = ex;
            }
            return result;
        }

        public ML.Result GetEmployeeOptionsForScope(string email, ML.ProjectsFilterVM vm)
        {
            var result = new ML.Result();
            try
            {
                var options = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId != 0 && e.IsActive == 1 && !string.IsNullOrWhiteSpace(e.FullName) && e.LocalJobLevelName != "Staff")
                    .GroupBy(e => new { e.EmployeeId, e.FullName, e.EmailAddressBusiness })
                    .Select(g => new ML.EmployeeOption { EmployeeId = g.Key.EmployeeId, EmployeeName = g.Key.FullName, Email = g.Key.EmailAddressBusiness })
                    .OrderBy(o => o.EmployeeName)
                    .ToList();

                result.Correct = true;
                result.Object = options;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = "Error al obtener la lista completa de empleados.";
                result.Ex = ex;
            }
            return result;
        }

        public ML.Result LookupClientName(int clientId)
        {
            var result = new ML.Result();
            try
            {
                var name = _db.VwEntities
                    .AsNoTracking()
                    .Where(e => e.EntityId == clientId && e.EntityDescription != null)
                    .Select(e => e.EntityDescription!)
                    .Distinct()
                    .OrderBy(n => n)
                    .FirstOrDefault();

                result.Correct = true;
                result.Object = new ML.ClientLookupResult { ClientId = clientId, ClientName = name, Found = !string.IsNullOrWhiteSpace(name) };
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = "Error al obtener el nombre del cliente.";
                result.Ex = ex;
            }
            return result;
        }

        // ===========================================================
        // 3) GENERAR evaluación (no cambia lógica de inserción del header)
        // ===========================================================
        public async Task<ML.Result> GenerateEvaluationAsync(ML.MyAutoEvalAddRequest req, string email, CancellationToken ct = default)
        {
            var result = new ML.Result();
            try
            {
                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                var proj = await _db.ScorefyTblEvaluationsGenerates.SingleOrDefaultAsync(p => p.PkEvalGene == req.PkEvalGene, ct);
                if (proj == null)
                    return new ML.Result { Correct = false, ErrorMessage = $"No se encontró el proyecto con PK {req.PkEvalGene}." };

                if (proj.GeneratedEvaluation == true)
                    return new ML.Result { Correct = false, ErrorMessage = "La evaluación ya fue generada para este proyecto." };

                

                var newId = Guid.NewGuid().ToString();
                var resume = new DL.EvaluaColabResume
                {
                    IdColabEmpProy = newId,
                    ClientName = proj.ClientName,
                    EntityNumber = Convert.ToString(proj.ClientId, CultureInfo.InvariantCulture),
                    EvaluatedId = req.EmployeeId ?? proj.EmployeeId,
                    CutOff = req.CutOff != 0 ? req.CutOff : proj.CutOff,
                    GeneratedType = proj.GeneratedType,
                    Fy = DateTime.UtcNow.Year,
                    CreatedBy = email,
                    CreatedTime = DateTime.UtcNow,
                    GradeEvaluated = 0,
                    GradeEvaluator = 0
                    //IsClosed = false
                    //ColumnC = null
                };
                _db.EvaluaColabResumes.Add(resume);
                await _db.SaveChangesAsync(ct);

                await tx.CommitAsync(ct);

                var vwItems = await _db.VwEvaluaColabResumes.AsNoTracking()
                    .Where(v => v.EvaluatedEmail == email || v.CreatedBy == email)
                    .Select(v => new { v.KeyReport, v.GradeEvaluator, v.CutOff, v.IdColabEmpProy })
                    .ToListAsync(ct);

                result.Correct = true;
                result.Object = new ML.AutoEvalGeneratedResponse
                {
                    ID_Colab_Emp_Proy = newId,
                    Items = vwItems
                };
                result.ErrorMessage = "New Evaluation Generated";
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = "Error al generar la evaluación";
                result.Ex = ex;
            }
            return result;
        }

        // ===========================================================
        // 4) FORM: **NO inserta** detalles (solo proyecta)
        // ===========================================================
        
        public async Task<ML.Result> GenerateOrLoadAsync(ML.AutoEvalDetailsGenerateRequest req, CancellationToken ct = default)
        {
            var result = new ML.Result();
            try
            {
                // ========= 1) Encabezado (vista) =========
                var headerVw = await _db.VwEvaluaColabResumes
                    .AsNoTracking()
                    .SingleOrDefaultAsync(h => h.IdColabEmpProy == req.IdColabEmpProy, ct);
                if (headerVw == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                // ========= 2) Rol y FY =========
                var roleRaw = headerVw.Role ?? req.RolSeleccionado ?? "";
                if (string.IsNullOrWhiteSpace(roleRaw))
                    return new ML.Result { Correct = false, ErrorMessage = "No hay rol definido para cargar la plantilla." };

                var headerTbl = await _db.EvaluaColabResumes
                    .AsNoTracking()
                    .Where(x => x.IdColabEmpProy == req.IdColabEmpProy)
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
                    .Where(d => d.IdColabEmpProy == req.IdColabEmpProy)
                    .Select(d => new { d.EcdId, d.Competence, d.SubCompetence, d.ReactiveNum, d.EvaluatedResp, d.EvaluatedComent })
                    .ToListAsync(ct);

                var existIdx = existentes.ToDictionary(
                    d => (Comp: d.Competence, Sub: d.SubCompetence, RN: d.ReactiveNum ?? ""),
                    d => d
                );

                // ========= 5) Descripciones =========
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

                // ========= 6) WEIGHTS por COMPETENCIA (FY + Rol) =========
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

                // ========= 7) Mezcla plantilla + existentes (NO insert) =========
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
                        SubCompetenceDescrip = desc.SubDesc,
                        ReactiveDescrip = desc.ReactDesc,
                        CompetenciaDescrip = desc.CompDesc,
                        Weight = weight           // ← **AHORA sí** viaja el peso por competencia (0..1)
                    });
                }

                // ========= 8) Flags previo/cierre =========
                var existePrevio = await _db.EvaluaColabResumes.AsNoTracking()
                    .Where(r => r.EvaluatedId == headerVw.EvaluatedId && r.EntityNumber == headerVw.EntityNumber && r.EvaluationType == false)
                    .Select(r => r.GradeEvaluated)
                    .AnyAsync(v => v.HasValue && v.Value > 0, ct);

                var existeCierre = await _db.EvaluaColabResumes.AsNoTracking()
                    .Where(r => r.EvaluatedId == headerVw.EvaluatedId && r.EntityNumber == headerVw.EntityNumber && r.EvaluationType == true)
                    .Select(r => r.GradeEvaluated)
                    .AnyAsync(v => v.HasValue && v.Value > 0, ct);


                

                var response = new ML.AutoEvalDetailsGenerateResponse
                {
                    IdColabEmpProy = req.IdColabEmpProy!,
                    ExistePrevio = existePrevio,
                    ExisteCierre = existeCierre,
                    Items = items,
                    Header = new ML.AutoEvalHeaderDto
                    {
                        ClientName = headerVw.ClientName,
                        Role = roleRaw,
                        EvaluatorId = headerVw.EvaluatorId,
                        EvaluatorName = headerVw.EvaluatorName,
                        // (Opcional) si quieres mandar estos datos:
                        ClientId = int.TryParse(headerVw.EntityNumber, out var cid) ? cid : (int?)null,
                        EvaluatorEmail = headerVw.EvaluatorEmail,
                        IsClosed = headerVw.IsClosed,
                        Column_C = headerVw.ColumnC
                    }
                };

                result.Correct = true;
                result.Object = response;
                return result;


            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = "Error al cargar o generar los datos", Ex = ex };
            }
        }
        // ===========================================================
        // 5) AUTOSAVE: solo UPDATE si ya existe (no inserta)
        // ===========================================================
        public async Task<ML.Result> UpsertOneAsync(string idColabEmpProy, string email, string rolSeleccionado, ML.AutoEvalDetailItem it, CancellationToken ct = default)
        {
            try
            {
                string reactiveNumAsText = it.ReactiveNum?.ToString(CultureInfo.InvariantCulture) ?? "";
                decimal? subCompetenceDec = null;
                if (!string.IsNullOrWhiteSpace(it.SubCompetence) &&
                    decimal.TryParse(it.SubCompetence, NumberStyles.Any, CultureInfo.InvariantCulture, out var sc))
                    subCompetenceDec = sc;

                int resp = (int)(it.EvaluatedResp ?? 0m);

                var row = await _db.EvaluaColabDetails.SingleOrDefaultAsync(d =>
                    d.IdColabEmpProy == idColabEmpProy &&
                    d.ReactiveNum == reactiveNumAsText &&
                    d.SubCompetence == subCompetenceDec, ct);

                if (row != null)
                {
                    row.EvaluatedResp = resp;
                    row.EvaluatedComent = it.EvaluatedComent;
                    row.Role = rolSeleccionado;
                    row.ModifiedBy = email;
                    row.ModifiedTime = DateTime.UtcNow;
                    await _db.SaveChangesAsync(ct);
                }
                // si no existe, NO insertamos (defer a guardar)

                return new ML.Result { Correct = true, ErrorMessage = "Autosave aplicado (sin inserción)" };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage ="Error al guardar", Ex = ex };
            }
        }

        // ===========================================================
        // 6) PROGRESO
        // ===========================================================
        public async Task<(int Contestados, int Total, bool EvaluadorOk)> GetProgresoAsync(string idColabEmpProy, string rolSeleccionado, int? evaluatorId, CancellationToken ct = default)
        {
            int contestados = await _db.EvaluaColabDetails.AsNoTracking()
                .CountAsync(d => d.IdColabEmpProy == idColabEmpProy && d.EvaluatedResp > 0, ct);

            int total = await _db.Set<DL.ReactivosEdp>().AsNoTracking()
                .CountAsync(t => t.Vigencia && t.Nivel == rolSeleccionado, ct);

            bool evalOk = evaluatorId.HasValue && evaluatorId.Value > 0;
            return (contestados, total, evalOk);
        }

        // ===========================================================
        // 7) Guardar (DRAFT): upsert + grade (ignorando 0)
        // ===========================================================
        // BL/SelfEvaluationsBL.cs (fragmentos de SaveDraftAsync y SaveAndCloseAsync)

        private static decimal Truncate2(decimal value)
        {
            return Math.Truncate(value * 100m) / 100m; // 2 decimales sin redondeo
        }

        public async Task<ML.Result> SaveDraftAsync(
            string idColabEmpProy,
            string email,
            IEnumerable<ML.AutoEvalDetailItem> items,
            decimal? clientFinalScore = null,
            CancellationToken ct = default)
        {
            try
            {
                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                var header = await _db.EvaluaColabResumes.SingleOrDefaultAsync(h => h.IdColabEmpProy == idColabEmpProy, ct);
                if (header == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                // 1) Upsert masivo de detalles (tu lógica actual)
                foreach (var it in items)
                {
                    string rn = it.ReactiveNum ?? "";
                    decimal? sub = null;
                    if (!string.IsNullOrWhiteSpace(it.SubCompetence) &&
                        decimal.TryParse(it.SubCompetence, NumberStyles.Any, CultureInfo.InvariantCulture, out var sc))
                        sub = sc;

                    int resp = (int)(it.EvaluatedResp ?? 0);

                    var row = await _db.EvaluaColabDetails.SingleOrDefaultAsync(d =>
                        d.IdColabEmpProy == idColabEmpProy && d.ReactiveNum == rn && d.SubCompetence == sub, ct);

                    if (row != null)
                    {
                        row.EvaluatedResp = resp;
                        row.EvaluatorResp = resp;
                        row.EvaluatedComent = it.EvaluatedComent;
                        row.Role = row.Role ?? header.Role;
                        row.ModifiedBy = email;
                        row.ModifiedTime = DateTime.UtcNow;
                    }
                    else
                    {
                        var nuevo = new DL.EvaluaColabDetail
                        {
                            IdColabEmpProy = idColabEmpProy,
                            Competence = int.TryParse(it.Competence, out var comp) ? comp : 0,
                            SubCompetence = sub,
                            ReactiveNum = rn,
                            EvaluatedResp = resp,
                            EvaluatorResp = resp,
                            EvaluatedComent = it.EvaluatedComent,
                            Role = header.Role,
                            CreatedBy = email,
                            CreatedTime = DateTime.UtcNow
                        };
                        await _db.EvaluaColabDetails.AddAsync(nuevo, ct);
                    }
                }
                await _db.SaveChangesAsync(ct);

                // 2) Persistir el grade EXACTO que viene del front
                if (!clientFinalScore.HasValue)
                    return new ML.Result { Correct = false, ErrorMessage = "ClientFinalScore es obligatorio." };

                // (Opcional) truncar a 2 decimales para consistencia con UI
                var final = Truncate2(clientFinalScore.Value);

                // Si quieres preservar tu ReactivesNum:
                var totalReactivos = await _db.Set<DL.ReactivosEdp>().AsNoTracking()
                    .CountAsync(t => t.Vigencia && t.Nivel == (header.Role ?? ""), ct);

                header.ReactivesNum = totalReactivos;
                header.GradeEvaluated = final;  // ← ← GUARDAMOS LO DEL FRONT
                //header.GradeEvaluator = final;  // ← ← GUARDAMOS LO DEL FRONT
                //header.IsClosed = null;
                header.ColumnC = 1; 
                header.ModifiedBy = email;
                header.ModifiedTime = DateTime.UtcNow;

                await _db.SaveChangesAsync(ct);

                // === Marcar el proyecto como "generado" HASTA guardar (DRAFT) ===
                try
                {
                    // Resolver ClientId desde EntityNumber del header
                    int clientId = 0;
                    if (!string.IsNullOrWhiteSpace(header.EntityNumber))
                        int.TryParse(header.EntityNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out clientId);

                    // Buscar el proyecto correspondiente
                    var project = await _db.ScorefyTblEvaluationsGenerates
                        .Where(p => p.IsCurrent
                                 && !p.GeneratedEvaluation
                                 && p.ClientId == clientId
                                 && p.EmployeeId == header.EvaluatedId
                                 && p.CutOff == (header.CutOff ?? 0))
                        .OrderByDescending(p => p.PkEvalGene)
                        .FirstOrDefaultAsync(ct);

                    if (project != null && !project.GeneratedEvaluation)
                    {
                        project.GeneratedEvaluation = true;
                        _db.ScorefyTblEvaluationsGenerates.Update(project);
                        await _db.SaveChangesAsync(ct);
                    }
                }
                catch (Exception ex2)
                {
                    // Opcional: logger
                    _logger.LogError(ex2, "Error marcando GeneratedEvaluation en SaveDraftAsync");
                }



                await tx.CommitAsync(ct);

                return new ML.Result
                {
                    Correct = true,
                    ErrorMessage = "Borrador guardado (grade desde front).",
                    Object = new { IdColabEmpProy = idColabEmpProy, GradeEvaluated = final, ReactivesNum = totalReactivos }
                };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        public async Task<ML.Result> SaveAndCloseAsync(
            string idColabEmpProy,
            string email,
            IEnumerable<ML.AutoEvalDetailItem> items,
            decimal? clientFinalScore = null,
            CancellationToken ct = default)
        {
            try
            {
                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                var header = await _db.EvaluaColabResumes.SingleOrDefaultAsync(h => h.IdColabEmpProy == idColabEmpProy, ct);
                if (header == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la evaluación (EvaluaColabResume)." };

                // Upsert masivo (idéntico a SaveDraft)
                foreach (var it in items)
                {
                    string rn = it.ReactiveNum ?? "";
                    decimal? sub = null;
                    if (!string.IsNullOrWhiteSpace(it.SubCompetence) &&
                        decimal.TryParse(it.SubCompetence, NumberStyles.Any, CultureInfo.InvariantCulture, out var sc))
                        sub = sc;

                    int resp = (int)(it.EvaluatedResp ?? 0);

                    var row = await _db.EvaluaColabDetails.SingleOrDefaultAsync(d =>
                        d.IdColabEmpProy == idColabEmpProy && d.ReactiveNum == rn && d.SubCompetence == sub, ct);

                    if (row != null)
                    {
                        row.EvaluatedResp = resp;
                        row.EvaluatorResp = resp;
                        row.EvaluatedComent = it.EvaluatedComent;
                        row.Role = row.Role ?? header.Role;
                        row.ModifiedBy = email;
                        row.ModifiedTime = DateTime.UtcNow;
                    }
                    else
                    {
                        var nuevo = new DL.EvaluaColabDetail
                        {
                            IdColabEmpProy = idColabEmpProy,
                            Competence = int.TryParse(it.Competence, out var comp) ? comp : 0,
                            SubCompetence = sub,
                            ReactiveNum = rn,
                            EvaluatedResp = resp,
                            EvaluatorResp = resp,
                            EvaluatedComent = it.EvaluatedComent,
                            Role = header.Role,
                            CreatedBy = email,
                            CreatedTime = DateTime.UtcNow
                        };
                        await _db.EvaluaColabDetails.AddAsync(nuevo, ct);
                    }
                }
                await _db.SaveChangesAsync(ct);

                if (!clientFinalScore.HasValue)
                    return new ML.Result { Correct = false, ErrorMessage = "ClientFinalScore es obligatorio." };

                var final = Truncate2(clientFinalScore.Value);

                var totalReactivos = await _db.Set<DL.ReactivosEdp>().AsNoTracking()
                    .CountAsync(t => t.Vigencia && t.Nivel == (header.Role ?? ""), ct);

                header.ReactivesNum = totalReactivos;
                header.GradeEvaluated = final;     // ← ← GUARDAMOS LO DEL FRONT
                //header.GradeEvaluator = final;
                //header.IsClosed = null;
                header.ColumnC = 0;
                header.ModifiedBy = email;
                header.ModifiedTime = DateTime.UtcNow;

                await _db.SaveChangesAsync(ct);

                // === Marcar el proyecto como "generado" HASTA guardar y cerrar ===
                try
                {
                    int clientId = 0;
                    if (!string.IsNullOrWhiteSpace(header.EntityNumber))
                        int.TryParse(header.EntityNumber, NumberStyles.Any, CultureInfo.InvariantCulture, out clientId);

                    var project = await _db.ScorefyTblEvaluationsGenerates
                        .Where(p => p.IsCurrent
                                 && !p.GeneratedEvaluation
                                 && p.ClientId == clientId
                                 && p.EmployeeId == header.EvaluatedId
                                 && p.CutOff == (header.CutOff ?? 0))
                        .OrderByDescending(p => p.PkEvalGene)
                        .FirstOrDefaultAsync(ct);

                    if (project != null && !project.GeneratedEvaluation)
                    {
                        project.GeneratedEvaluation = true;
                        _db.ScorefyTblEvaluationsGenerates.Update(project);
                        await _db.SaveChangesAsync(ct);
                    }
                }
                catch (Exception ex2)
                {
                    _logger.LogError(ex2, "Error marcando GeneratedEvaluation en SaveAndCloseAsync");
                }

                await tx.CommitAsync(ct);

                
                var info = await _db.VwEvaluaColabResumes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(v => v.IdColabEmpProy == idColabEmpProy, ct);

                // Fallbacks si la vista no trae el evaluador:
                string clienteNombre = info?.ClientName ?? "(Proyecto)";
                string evaluadorEmail = info?.EvaluatorEmail ?? info?.EvaluatedEmail ?? email; // último recurso: quien cierra
                string evaluadorNombre = info?.EvaluatorName ?? "Evaluador";
                string nombreColab = info?.EvaluatedName ?? email;


                // ================= INSERT EMAIL =================
                try
                {
                    var bodyEmail = $@"
                    Saludos {evaluadorNombre}

                    Envío este email para informar que he completado la autoevaluación de desempeño del proyecto.

                    Agradecería tu apoyo para completar mi evaluación en la aplicación Scorefy Audit.

                    Gracias por tu colaboración.

                    {nombreColab}
                    ";


                    var emailRow = new DL.ScorefyTblEmail
                    {
                        // Destinatario
                        ToEmail = evaluadorEmail,
                        ToName = evaluadorNombre,

                        // Remitente
                        FromEmail = info?.EvaluatedEmail ?? email,
                        FromName = nombreColab,

                        // Contenido
                        Body = bodyEmail,

                        // 🔐 CONTROL DE NEGOCIO
                        ContextKey = idColabEmpProy,      // Evento
                        EmailType = "AutoEvalCompleted", // Tipo de correo

                        // 👤 ORIGEN
                        IdentitySect = 1                 // 1 = Evaluado
                                                         // CreatedUtc lo asigna la BD
                    };


                    _db.ScorefyTblEmails.Add(emailRow);
                    await _db.SaveChangesAsync(ct);
                }

                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Error insertando ScorefyTblEmail en SaveAndCloseAsync");
                }

                var summary = new ML.CloseSummaryDto
                {
                    IdColabEmpProy = idColabEmpProy,
                    GradeEvaluated = final,
                    ReactivesNum = totalReactivos,
                    ColaboradorNombre = nombreColab,
                    ColaboradorEmail = info?.EvaluatedEmail ?? email,
                    EvaluadorNombre = evaluadorNombre,
                    EvaluadorEmail = evaluadorEmail,
                    ClienteNombre = clienteNombre,
                    FechaCierreUtc = DateTime.UtcNow,
                    Resumen = null // ya no usamos reactivos
                };

                return new ML.Result
                {
                    Correct = true,
                    ErrorMessage = "Autoevaluación guardada y enviada (grade desde front).",
                    Object = summary
                };

            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }


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

        // ===========================================================
        // EXTRA (opcional que ya traías en tu BL): Validate & Add Extra
        // ===========================================================
        public ML.Result ValidateExtra(ML.ValidateExtraRequest req)
        {
            var result = new ML.Result();
            try
            {
                if (req.ClientId <= 0 || req.EmployeeId <= 0)
                    return new ML.Result { Correct = false, ErrorMessage = "ClientId y EmployeeId son obligatorios." };

                // CutOff por nivel
                int cutOff = DetermineCutOffForEmployee(req.EmployeeId);

                bool exists = _db.ScorefyTblEvaluationsGenerates
                    .AsNoTracking()
                    .Any(e => e.ClientId == req.ClientId && e.EmployeeId == req.EmployeeId && e.IsCurrent && e.CutOff == cutOff);

                result.Correct = true;
                result.Object = new ML.ValidateExtraInfo
                {
                    Available = !exists,
                    Message = exists ? "Generation not available" : "Generation available"
                };
                return result;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = "Error al validar duplicados.";
                result.Ex = ex;
                return result;
            }
        }

        public ML.Result AddExtra(ML.ScorefyTblEvaluationsGenerateExtra vm)
        {
            try
            {
                if (vm.ClientId <= 0 || vm.EmployeeId <= 0)
                    return new ML.Result { Correct = false, ErrorMessage = "ClientId y EmployeeId son obligatorios." };

                var snap = GetEmployeeSnapshot(vm.EmployeeId);
                vm.EmployeeName ??= snap.EmpName;
                vm.LocalJobLevelName ??= snap.JobLevel;
                vm.EmailAddressBusiness ??= snap.Email;
                vm.BU ??= snap.Bu;
                vm.LocationName ??= snap.Loc;

                int cutOff = DetermineCutOffForEmployee(vm.EmployeeId);

                bool exists = _db.ScorefyTblEvaluationsGenerates
                    .AsNoTracking()
                    .Any(e => e.ClientId == vm.ClientId && e.EmployeeId == vm.EmployeeId && e.IsCurrent && e.CutOff == cutOff);
                if (exists)
                    return new ML.Result { Correct = false, ErrorMessage = "Generation not available (duplicado)." };

                var now = DateTime.UtcNow;
                int generatedType = 2;
                string keyReport = $"{vm.ClientId}{vm.EmployeeId}{generatedType}{cutOff}";

                using var tx = _db.Database.BeginTransaction();

                bool existsInside = _db.ScorefyTblEvaluationsGenerates
                    .Any(e => e.ClientId == vm.ClientId && e.EmployeeId == vm.EmployeeId && e.IsCurrent && e.CutOff == cutOff);
                if (existsInside)
                {
                    tx.Rollback();
                    return new ML.Result { Correct = false, ErrorMessage = "Generation not available (duplicado)." };
                }

                var gen = new DL.ScorefyTblEvaluationsGenerate
                {
                    ClientId = vm.ClientId,
                    ClientName = vm.ClientName,
                    EmployeeId = vm.EmployeeId,
                    EmployeeName = vm.EmployeeName,
                    LocalJobLevelName = vm.LocalJobLevelName,
                    EmailAddressBusiness = vm.EmailAddressBusiness,
                    Bu = vm.BU,
                    LocationName = vm.LocationName,
                    TotalHours = vm.TotalHours,
                    ChargeableHours = vm.TotalHours,
                    GeneratedEvaluation = false,
                    GeneratedType = generatedType,
                    CutOff = cutOff,
                    KeyReport = keyReport,
                    IsCurrent = true,
                    Created = now,
                    CreatedBy = vm.CreatedBy
                };
                _db.ScorefyTblEvaluationsGenerates.Add(gen);

                _db.ScorefyTblEvaluationsGenerateExtras.Add(new DL.ScorefyTblEvaluationsGenerateExtra
                {
                    ClientId = vm.ClientId,
                    ClientName = vm.ClientName,
                    EmployeeId = vm.EmployeeId,
                    EmployeeName = vm.EmployeeName,
                    LocalJobLevelName = vm.LocalJobLevelName,
                    EmailAddressBusiness = vm.EmailAddressBusiness,
                    Bu = vm.BU,
                    LocationName = vm.LocationName,
                    TotalHours = vm.TotalHours,
                    ChargeableHours = vm.TotalHours,
                    GeneratedEvaluation = false,
                    GeneratedType = generatedType,
                    GeneratedDocumentation = vm.GeneratedDocumentation,
                    CutOff = cutOff,
                    Created = now,
                    CreatedBy = vm.CreatedBy
                });

                _db.SaveChanges();
                tx.Commit();



                //return new ML.Result
                //{
                //    Correct = true,
                //    Object = new {PkEvalGene= gen.PkEvalGene, KeyReport = keyReport, CutOff = cutOff }
                //};


                var label = $"{gen.ClientName} — {gen.EmployeeName}";

                return new ML.Result
                {
                    Correct = true,
                    Object = new { PkEvalGene = gen.PkEvalGene, KeyReport = keyReport, CutOff = cutOff, Label = label }
                };

            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = "Error al crear la evaluación extraordinaria.", Ex = ex };
            }
        }

        private static bool IsManagerOrSenior(string? jobLevel)
        {
            if (string.IsNullOrWhiteSpace(jobLevel)) return false;
            var s = jobLevel.Trim().ToUpperInvariant();
            return s == "MANAGER" || s == "SR MANAGER" || s == "SENIOR MANAGER";
        }

        private (string? EmpName, string? JobLevel, string? Email, string? Bu, string? Loc) GetEmployeeSnapshot(int employeeId)
        {
            var row = _db.VwScorefyEmployees
                .AsNoTracking()
                .Where(e => e.EmployeeId == employeeId)
                .Select(e => new
                {
                    e.FullName,
                    e.LocalJobLevelName,
                    e.EmailAddressBusiness,
                    Bu = e.Bu,
                    e.LocationName
                })
                .FirstOrDefault();

            return (row?.FullName, row?.LocalJobLevelName, row?.EmailAddressBusiness, row?.Bu, row?.LocationName);
        }

        private int DetermineCutOffForEmployee(int employeeId)
        {
            var s = GetEmployeeSnapshot(employeeId);
            return IsManagerOrSenior(s.JobLevel) ? 3 : 2;
        }

        public async Task<ML.Result> GetEmployeesForExtraAsync(string email, CancellationToken ct = default)
        {
            try
            {
                var security = await _db.SecurityScorefies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Email == email, ct);

                // Query base
                IQueryable<VwScorefyEmployee> query = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId != 0 && e.FullName != null);

                // 🔒 SIN SEGURIDAD → solo el usuario
                if (security == null)
                {
                    query = query.Where(e => e.EmailAddressBusiness == email);
                }
                else
                {
                    var role = (security.Role ?? string.Empty).Trim();

                    if (role.Equals("PIE", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedBu = { "PCG", "IRM", "ESG" };
                        query = query.Where(e => allowedBu.Contains(e.Bu));
                    }
                    else if (role.Equals("HLSTM", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedLocations =
                        {
                    "Hermosillo", "León", "San Luis Potosí",
                    "Tijuana", "Mexicali"
                };

                        query = query.Where(e =>
                            e.Bu == "UNO" &&
                            allowedLocations.Contains(e.LocationName));
                    }
                    else if (role.Equals("COMMITTE", StringComparison.OrdinalIgnoreCase))
                    {
                        query = query.Where(e => e.EmailAddressBusiness == email);
                    }
                    else if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
                    {
                        var keyBu = (security.Bu ?? string.Empty).Trim().ToUpperInvariant();
                        string[] allowedKeyBUs = { "PCG", "IRM", "ESG", "UNO", "TMT", "CIM", "UNNE", "SF" };

                        if (string.IsNullOrEmpty(keyBu) || !allowedKeyBUs.Contains(keyBu))
                        {
                            return new ML.Result
                            {
                                Correct = true,
                                Object = new List<ML.EmployeeOption>()
                            };
                        }

                        query = query.Where(e => e.Bu == keyBu);
                    }
                    else
                    {
                        // 🚫 Rol desconocido → no devolver nada
                        query = query.Where(e => e.EmailAddressBusiness == email);
                    }
                }

                var list = await query
                    .GroupBy(e => new
                    {
                        e.EmployeeId,
                        e.FullName,
                        e.EmailAddressBusiness
                    })
                    .Select(g => new ML.EmployeeOption
                    {
                        EmployeeId = g.Key.EmployeeId,
                        EmployeeName = g.Key.FullName,
                        Email = g.Key.EmailAddressBusiness
                    })
                    .OrderBy(e => e.EmployeeName)
                    .ToListAsync(ct);

                return new ML.Result
                {
                    Correct = true,
                    Object = list
                };
            }
            catch (Exception ex)
            {
                return new ML.Result
                {
                    Correct = false,
                    ErrorMessage = ex.Message,
                    Ex = ex
                };
            }
        }

        public async Task<ML.Result> SoftDeleteAsync(ML.DeleteEvaluationRequest req, string userEmail, CancellationToken ct = default)
        {
            try
            {
                if (req == null) return new ML.Result { Correct = false, ErrorMessage = "Solicitud vacía." };

                // Id efectivo (acepta ECR_Id o IdColabEmpProy)
                var id = !string.IsNullOrWhiteSpace(req.IdColabEmpProy) ? req.IdColabEmpProy : req.EcrIdAlias;
                if (string.IsNullOrWhiteSpace(id))
                    return new ML.Result { Correct = false, ErrorMessage = "IdColabEmpProy (ECR_Id) es obligatorio." };

                await using var tx = await _db.Database.BeginTransactionAsync(ct);

                // 1) Header (EvaluaColabResume)
                var header = await _db.EvaluaColabResumes
                    .SingleOrDefaultAsync(h => h.IdColabEmpProy == id, ct);

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
                            ScorefyTblEvaluationsGenerates = req.PkEvalGene.HasValue,
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

    }
}