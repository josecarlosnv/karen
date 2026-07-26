using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ML;

namespace BL
{

    public interface IFinalConclusionBL
    { 
        Result SavePerformanceManager(string email, FinalConclusionSectionDTO dto);
        Result SaveCommittee(string email, FinalConclusionSectionDTO dto);
        Result SaveCalibration(string email, FinalConclusionSectionDTO dto);

        Result GetPromotionCategories(string email);
        Result GetQPRScores(string email);
        Result GetEmployee(int employeeId, string email);
        Result GetPMSection(int employeeId, int fy, string email);
        Result GetCommitteeSection(int employeeId, int fy, string email);
        Result GetCalibrationSection(int employeeId, int fy, string email);
        Result GetConsolidatedRatings(int employeeId, int fy, string email);
        Result GetFullFinalConclusion(int employeeId, int fy, string email);
        Result UnlockNextStep(int employeeId, int fy, string email);
        Result GetWorkflow(int employeeId, int fy, string email);
        Result GetEmployeeCatalog(string email);
        Result GetEmployeeCatalogStatus(string email);
        Result GetUserSecurity(string email);
        Result DeleteSection(string section, int employeeId, int fy, string email);
        Result SendFinalConclusionReminder(string email, int employeeId, int fy);

    }



    public sealed class FinalConclusionBL : IFinalConclusionBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<FinalConclusionBL> _logger;

        public FinalConclusionBL(DL.MexItaStaBiAuditContext db, ILogger<FinalConclusionBL> logger)
        {
            _db = db;
            _logger = logger;
        }

        private bool HasSecurity(string email)
            => _db.SecurityScorefies.Any(x => x.Email == email);


        public ML.Result SendFinalConclusionReminder(string email, int employeeId, int fy)
        {
            try
            {
                // 1️⃣ Validar que NO exista conclusión
                bool hasConclusion = _db.ScorefyTblManagerPerformanceConclusions
                    .AsNoTracking()
                    .Any(x =>
                        x.EmployeeId == employeeId &&
                        x.FY == fy &&
                        x.IsCurrent == 1);

                if (hasConclusion)
                {
                    return new ML.Result
                    {
                        Correct = false,
                        ErrorMessage = "Final Conclusion already exists for this employee."
                    };
                }

                // 2️⃣ Obtener datos del empleado
                var emp = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId == employeeId)
                    .Select(e => new
                    {
                        e.FullName,
                        e.EmailAddressBusiness,
                        e.PMEmail,
                        PMName = e.PerformanceManager
                    })
                    .FirstOrDefault();

                if (emp == null)
                    return new ML.Result { Correct = false, ErrorMessage = "Employee not found." };

                // 3️⃣ Construir email
                var bodyEmail = $@"
                    Saludos {emp.PMName}

                    Te recordamos que se encuentra pendiente la Final Performance Conclusion
                    del colaborador {emp.FullName}.

                    Por favor ingresa a la aplicación Scorefy Audit para completarla.

                    Gracias por tu apoyo.

                    Resource Manager
                    ";

                var emailRow = new DL.ScorefyTblEmail
                {
                    ToEmail = emp.PMEmail,
                    ToName = emp.PMName,

                    FromEmail = email,
                    FromName = "Resource Manager",

                    Body = bodyEmail,

                    ContextKey = $"FINALCONCLUSION_{employeeId}_{fy}",
                    EmailType = "FinalConclusionReminder",

                    IdentitySect = 3 // ✅ Resource
                };

                _db.ScorefyTblEmails.Add(emailRow);
                _db.SaveChanges();

                return new ML.Result
                {
                    Correct = true,
                    ErrorMessage = "Final Conclusion reminder sent."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SendFinalConclusionReminder error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
        public Result GetUserSecurity(string email)
        {
            var res = new Result();

            try
            {
                // 1) Buscar seguridad normal
                var rows = _db.SecurityScorefies
                    .AsNoTracking()
                    .Where(s => s.Email == email)
                    .ToList();

                bool isInSecurity = rows.Any();

                // ✅ 2) Si NO está en SecurityScorefy, validar acceso como PM en la vista
                if (!isInSecurity)
                {
                    var pmView = _db.VwScorefyEmployees
                        .AsNoTracking()
                        .Where(e => e.PMEmail == email)
                        .ToList();

                    // ✅ Si existe en la vista como PM con Pending=0 → dar acceso mínimo
                    if (pmView.Count > 0)
                    {
                        var dtoPM = new
                        {
                            email,
                            roles = new List<string> { "PM_VIEW" }, // rol especial para PMs sin seguridad
                            bus = pmView.Select(e => e.Bu).Distinct().ToList(),
                            segmentos = pmView.Select(e => e.Segmento).Distinct().ToList(),
                            typeCommittees = new List<string>()
                        };

                        return res.Ok(dtoPM);
                    }

                    // ❌ Si no está en security ni es PM con pending=0 → acceso negado
                    return res.Fail("El usuario no tiene permisos para Final Conclusion.");
                }

                // ✅ 3) Si está en seguridad, procesar normalmente
                var roles = rows
                    .Select(r => (r.Role ?? "").Trim().ToUpper())
                    .Distinct()
                    .ToList();

                var bus = rows
                    .Where(r => r.Bu != null)
                    .Select(r => r.Bu)
                    .Distinct()
                    .ToList();

                var segmentos = rows
                    .Where(r => r.Segmento != null)
                    .Select(r => r.Segmento)
                    .Distinct()
                    .ToList();

                var typeCommittees = rows
                    .Where(r => (r.Role ?? "").Trim().ToUpper() == "COMMITTE")
                    .Select(r => (r.TypeCommittee ?? "").Trim().ToUpper())
                    .Distinct()
                    .ToList();

                string effectiveRole;

                // Prioridad de roles
                if (roles.Contains("ALL") || roles.Contains("TOP"))
                {
                    effectiveRole = "ALL";
                }
                else if (roles.Contains("KEY"))
                {
                    effectiveRole = "KEY";
                }
                else if (roles.Contains("COMMITTE"))
                {
                    effectiveRole = "COMMITTE";
                }
                else if (roles.Contains("PM_VIEW"))
                {
                    effectiveRole = "PM_VIEW";
                }
                else
                {
                    effectiveRole = "NONE";
                }

                var dto = new
                {
                    email,
                    roles,
                    bus,
                    segmentos,
                    typeCommittees,
                    effectiveRole
                };

                return res.Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetUserSecurity error");
                return res.Exception(ex);
            }
        }
        
        public Result SavePerformanceManager(string email, FinalConclusionSectionDTO dto)
        {
            var res = new Result();

            try
            {
                //if (!HasSecurity(email))
                //    return res.Fail("No autorizado.");

                var row = _db.ScorefyTblManagerPerformanceConclusions
                    .FirstOrDefault(x =>
                        x.EmployeeId == dto.EmployeeId &&
                        x.FY == dto.FY &&
                        x.IsCurrent == 1);

                DL.VwScorefyEmployee? emp;

                if (row == null)
                {
                    // 1️⃣ Obtener datos del empleado
                    emp = _db.VwScorefyEmployees
                        .AsNoTracking()
                        .FirstOrDefault(e => e.EmployeeId == dto.EmployeeId);

                    if (emp == null)
                        return res.Fail("Empleado no encontrado en catálogo.");

                    // 2️⃣ Obtener PM Email
                    var pmEmail = emp.PMEmail;

                    // 3️⃣ Obtener nivel del PM
                    var pm = _db.VwScorefyEmployees
                        .AsNoTracking()
                        .Where(e => e.EmailAddressBusiness == pmEmail)
                        .Select(e => new
                        {
                            LocalJob = (string?)e.LocalJobLevelName
                        })
                        .FirstOrDefault();

                    var pmLocalJob = pm?.LocalJob;

                    // 4️⃣ Crear registro
                    row = new DL.ScorefyTblManagerPerformanceConclusion
                    {
                        EmployeeId = dto.EmployeeId,
                        Local_Job_Level_Name = emp.LocalJobLevelName,
                        Email_Address_Business = emp.EmailAddressBusiness,
                        PM_LocalJob = pmLocalJob,
                        PM_Email = pmEmail,
                        FY = dto.FY,
                        IsCurrent = 1,
                        Created = DateTime.Now,
                        CreatedBy = email
                    };

                    _db.ScorefyTblManagerPerformanceConclusions.Add(row);
                }
                else
                {
                    // Cuando ya existe, obtener emp para validar nivel
                    emp = _db.VwScorefyEmployees
                        .AsNoTracking()
                        .FirstOrDefault(e => e.EmployeeId == dto.EmployeeId);

                    if (emp == null)
                        return res.Fail("Empleado no encontrado en catálogo.");
                }

                var d = dto.Data;

                // ✅ Validar nivel del empleado
                bool isManagerLevel =
                    emp.LocalJobLevelName == "Manager" ||
                    emp.LocalJobLevelName == "Senior Manager";

                var complianceA = d.Compliance806A;
                var complianceB = d.Compliance806B;

                // ✅ Feedback conversation
                row.ManagerFeedbackDiscussionConfirmed =
                    d.FeedbackConversationCompleted ?? false;

                // ✅ Compliance según nivel
                if (isManagerLevel)
                {
                    // -------- 806B (Managers) --------
                    row.MandatoryTrainingCompleted =
                        complianceB?.TrainingCompleted == "yes";

                    row.IndependenceEth =
                        complianceB?.IndependenceEthicsIssues == "yes";

                    row.RoleResponsibilitiesMet =
                        complianceB?.RolePerformance == "yes";

                    row.CodeOfConductIncidents =
                        complianceB?.CodeOfConductIssues == "yes";

                    row.ScoreQPR =
                        ResolveQpr(complianceB?.QPRScore);
                }
                else
                {
                    // -------- 806A (Non-managers) --------
                    row.MandatoryTrainingCompleted =
                        complianceA?.TrainingCompleted == "yes";

                    row.IndependenceEth =
                        complianceA?.IndependenceEthicsIssues == "yes";

                    row.RoleResponsibilitiesMet =
                        complianceA?.RolePerformance == "yes";

                    row.CodeOfConductIncidents =
                        complianceA?.CodeOfConductIssues == "yes";

                    // 806A no usa QPR
                    row.ScoreQPR =
                        ResolveQpr(complianceB?.QPRScore);
                }

                // ✅ Comentarios adicionales
                row.ComplianceAdditionalComments = d.ComplianceComments;

                // ✅ Promotion / CO
                row.PromotionOrCO = d.PromotionType switch
                {
                    "promotion" => 1,
                    "co" => 2,
                    _ => 0
                };

                row.PromotedToCategory =
                    ResolvePromotionCategory(d.PromotionCategory);

                row.COReason = d.Justification;

                // ✅ Evaluación final
                row.FinalOpenPDRating = d.OpenPDRating ?? 0;
                row.FinalStrengthsSummary = d.Strengths;
                row.FinalAreasOfOpportunity = d.AreasOfOpportunity;

                // ✅ Auditoría
                row.Modified = DateTime.Now;
                row.ModifiedBy = email;

                _db.SaveChanges();

                return res.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.SavePerformanceManager error");
                return res.Exception(ex);
            }
        }


        public Result GetEmployeeCatalog(string email)
        {
            var result = new Result();
            try
            {
                

                var userSecurityRows = _db.SecurityScorefies
                    .AsNoTracking()
                    .Where(s => s.Email == email)
                    .ToList();

                bool isInSecurity = userSecurityRows.Any();

                // Roles del usuario
                bool isAllOrTop = userSecurityRows.Any(r =>
                {
                    var role = (r.Role ?? "").Trim().ToUpper();
                    return role == "ALL" || role == "TOP";
                });

                bool isCommittee = userSecurityRows.Any(r =>
                {
                    var role = (r.Role ?? "").Trim().ToUpper();
                    return role == "COMMITTE";
                });

                // BU permitidos
                var allowedBUs = userSecurityRows
                    .Where(r => r.Bu != null)
                    .Select(r => r.Bu)
                    .Distinct()
                    .ToList();

                // Segmentos permitidos (solo comité)
                var allowedSegments = userSecurityRows
                    .Where(r => r.Segmento != null)
                    .Select(r => r.Segmento)
                    .Distinct()
                    .ToList();

                // TypeCommittee combinados (puede haber más de uno)
                var committeeTypes = userSecurityRows
                    .Where(r => (r.Role ?? "").Trim().ToUpper() == "COMMITTE")
                    .Select(r => (r.TypeCommittee ?? "").Trim().ToUpper())
                    .Distinct()
                    .ToList();

                // =======================================================
                // 🔹 2. Query base — solo empleados activos y BU no null
                // =======================================================
                var q = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.IsActive == 1)
                    .Where(e => e.Bu != null); // ✅ No permitir BU null


                // =======================================================
                // 🔹 3. Lógica según seguridad
                // =======================================================

                if (!isInSecurity)
                {
                    // ✅ Usuario NO está en la tabla de seguridad
                    // Solo ve empleados donde él es PM
                    q = q.Where(e => e.PMEmail == email &&
                        e.AllEvaluationsCompleted == "Yes");
                }
                else if (isAllOrTop)
                {
                    // ✅ Roles ALL / TOP → ve todo lo permitido por niveles
                    var allowedLevels = new[]
                    {
                "Manager",
                "Senior Manager",
                "Supervising Senior",
                "Senior",
                "Staff",
                "Staff In Charge"
            };

                    //q = q.Where(e =>
                    //    allowedLevels.Contains(e.LocalJobLevelName)
                    //);
                    q = q.Where(e =>
                        allowedLevels.Contains(e.LocalJobLevelName) &&
                        e.AllEvaluationsCompleted == "Yes"
                    );
                }
                else if (isCommittee)
                {
                    // ✅ Seguridad de Comité

                    // ----------------------------
                    // 3.1 Definir niveles permitidos
                    // ----------------------------
                    string[] committeeAllowedLevels;

                    if (committeeTypes.Contains("AMBOS"))
                    {
                        committeeAllowedLevels = new[]
                        {
                    "Manager",
                    "Senior Manager",
                    "Supervising Senior",
                    "Senior",
                    "Staff",
                    "Staff In Charge"
                };
                    }
                    else if (committeeTypes.Contains("STAFF"))
                    {
                        committeeAllowedLevels = new[]
                        {
                    "Supervising Senior",
                    "Senior",
                    "Staff",
                    "Staff In Charge"
                };
                    }
                    else if (committeeTypes.Contains("GERENTES"))
                    {
                        committeeAllowedLevels = new[]
                        {
                    "Manager",
                    "Senior Manager"
                };
                    }
                    else
                    {
                        committeeAllowedLevels = Array.Empty<string>();
                    }

                    // ----------------------------
                    // 3.2 Filtrar por BU (siempre)
                    // ----------------------------
                    //q = q.Where(e =>
                    //    committeeAllowedLevels.Contains(e.LocalJobLevelName) &&
                    //    allowedBUs.Contains(e.Bu)
                    //);
                    q = q.Where(e =>
                        committeeAllowedLevels.Contains(e.LocalJobLevelName) &&
                        e.AllEvaluationsCompleted == "Yes" &&
                        allowedBUs.Contains(e.Bu)
                    );

                    // ----------------------------
                    // 3.3 Si hay varios segmentos registrados → filtrar por segmento
                    // ----------------------------
                    if (allowedSegments.Count > 0)
                    {
                        q = q.Where(e => allowedSegments.Contains(e.Segmento));
                    }
                }
                else
                {
                    // ✅ Seguridad normal
                    var allowedLevels = new[]
                    {
                "Manager",
                "Senior Manager",
                "Supervising Senior",
                "Senior",
                "Staff",
                "Staff In Charge"
            };

                    //q = q.Where(e =>
                    //    allowedLevels.Contains(e.LocalJobLevelName) &&
                    //    allowedBUs.Contains(e.Bu)
                    //);
                    q = q.Where(e =>
                        allowedLevels.Contains(e.LocalJobLevelName) &&
                        e.AllEvaluationsCompleted == "Yes" &&
                        allowedBUs.Contains(e.Bu)
                    );
                }


                // =======================================================
                // 🔹 4. Selección final
                // =======================================================
                var employees = q
                    .Select(e => new
                    {
                        id = e.EmployeeId.ToString(),
                        fullName = e.FullName,
                        office = e.LocationName,
                        category = e.LocalJobLevelName,
                        email = e.EmailAddressBusiness,
                        bu = e.Bu,
                        pmEmail = e.PMEmail,
                        pmName = e.PerformanceManager,
                        segmento = e.Segmento
                    })
                    .OrderBy(e => e.fullName)
                    .ToList();

                return result.Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetEmployeeCatalog error");
                return result.Exception(ex);
            }
        }
        public Result GetEmployeeCatalogStatus(string email)
        {
            var result = new Result();
            try
            {
                // =======================================================
                // 🔹 1. Cargar TODAS las filas de seguridad del usuario
                // =======================================================
                var userSecurityRows = _db.SecurityScorefies
                    .AsNoTracking()
                    .Where(s => s.Email == email)
                    .ToList();

                bool isInSecurity = userSecurityRows.Any();

                // Roles detectados
                var roles = userSecurityRows
                    .Select(r => (r.Role ?? "").Trim().ToUpper())
                    .Distinct()
                    .ToList();

                bool hasMultipleRoles = roles.Count > 1;
                bool isKey = roles.Contains("KEY");
                bool isCommittee = roles.Contains("COMMITTE");

                // ✅ KEY manda si hay más de un rol
                bool keyOverrides = isKey && hasMultipleRoles;

                // Roles ALL / TOP
                bool isAllOrTop = roles.Any(r => r == "ALL" || r == "TOP");

                // BU permitidos
                var allowedBUs = userSecurityRows
                    .Where(r => !string.IsNullOrWhiteSpace(r.Bu))
                    .Select(r => r.Bu)
                    .Distinct()
                    .ToList();

                // Segmentos (solo comité)
                var allowedSegments = userSecurityRows
                    .Where(r => !string.IsNullOrWhiteSpace(r.Segmento))
                    .Select(r => r.Segmento)
                    .Distinct()
                    .ToList();

                // Tipos de comité
                var committeeTypes = userSecurityRows
                    .Where(r => (r.Role ?? "").Trim().ToUpper() == "COMMITTE")
                    .Select(r => (r.TypeCommittee ?? "").Trim().ToUpper())
                    .Distinct()
                    .ToList();

                // =======================================================
                // 🔹 2. Query base
                // =======================================================
                var q = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.IsActive == 1)
                    .Where(e => e.Bu != null);

                // =======================================================
                // 🔹 3. Lógica de seguridad
                // =======================================================

                if (!isInSecurity)
                {
                    // ❌ No está en seguridad → solo sus PM y sin pendientes
                    q = q.Where(e =>
                        e.PMEmail == email &&
                        e.AllEvaluationsCompleted == "Yes");
                }
                else if (keyOverrides)
                {
                    // ✅ KEY + otro rol
                    // 👉 KEY manda
                    // 👉 TODO su BU (con y sin Pending)
                    q = q.Where(e => allowedBUs.Contains(e.Bu) && e.AllEvaluationsCompleted == "Yes");
                }
                else if (isAllOrTop)
                {
                    // ✅ ALL / TOP
                    var allowedLevels = new[]
                    {
                "Manager",
                "Senior Manager",
                "Supervising Senior",
                "Senior",
                "Staff",
                "Staff In Charge"
            };

                    q = q.Where(e =>
                        allowedLevels.Contains(e.LocalJobLevelName) &&
                        e.AllEvaluationsCompleted == "Yes");
                }
                else if (isCommittee)
                {
                    // ❌ COMMITTE SOLO queda bloqueado
                    // (si llegara aquí es solo comité)
                    return result.Ok(new List<object>());
                }
                else
                {
                    // ✅ Seguridad normal (no KEY)
                    var allowedLevels = new[]
                    {
                "Manager",
                "Senior Manager",
                "Supervising Senior",
                "Senior",
                "Staff",
                "Staff In Charge"
            };

                    q = q.Where(e =>
                        allowedLevels.Contains(e.LocalJobLevelName) &&
                        e.AllEvaluationsCompleted == "Yes" &&
                        allowedBUs.Contains(e.Bu));
                }

                // =======================================================
                // 🔹 4. Selección final
                // =======================================================
                var employees = q
                    .Select(e => new
                    {
                        id = e.EmployeeId.ToString(),
                        fullName = e.FullName,
                        office = e.LocationName,
                        category = e.LocalJobLevelName,
                        email = e.EmailAddressBusiness,
                        bu = e.Bu,
                        pmEmail = e.PMEmail,
                        pmName = e.PerformanceManager,
                        segmento = e.Segmento,
                        conclusionPM = e.ManagerPerformanceConclusionStatus
                    })
                    .OrderBy(e => e.fullName)
                    .ToList();

                return result.Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetEmployeeCatalogStatus error");
                return result.Exception(ex);
            }
        }

        public Result DeleteSection(string section, int employeeId, int fy, string email)
        {
            var res = new Result();
            try
            {
                //if (!HasSecurity(email))
                //    return res.Fail("No autorizado.");

                if (section == "performance-manager")
                {
                    var row = _db.ScorefyTblManagerPerformanceConclusions
                        .FirstOrDefault(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1);

                    if (row != null)
                    {
                        row.IsCurrent = 0; // ✅ Marcar como eliminado
                        row.Modified = DateTime.Now;
                        row.ModifiedBy = email;
                        _db.SaveChanges();
                    }
                }
                else if (section == "committee" || section == "calibration")
                {
                    var row = _db.ScorefyTblCommitePerformanceConclusions
                        .FirstOrDefault(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1);

                    if (row != null)
                    {
                        row.IsCurrent = 0;
                        row.Modified = DateTime.Now;
                        row.ModifiedBy = email;
                        _db.SaveChanges();
                    }
                }

                return res.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.DeleteSection error");
                return res.Exception(ex);
            }
        }

        // ----------------------------------------------------------------------
        // Committee Save
        // ----------------------------------------------------------------------
        public Result SaveCommittee(string email, FinalConclusionSectionDTO dto)
        {
            var res = new Result();
            try
            {
                //if (!HasSecurity(email))
                //    return res.Fail("No autorizado.");

                var row = _db.ScorefyTblCommitePerformanceConclusions
                    .FirstOrDefault(x => x.EmployeeId == dto.EmployeeId && x.FY == dto.FY && x.IsCurrent == 1);

                if (row == null)
                {
                    row = new DL.ScorefyTblCommitePerformanceConclusion
                    {
                        EmployeeId = dto.EmployeeId,
                        FY = dto.FY,
                        IsCurrent = 1,
                        Created = DateTime.Now,
                        CreatedBy = email
                    };
                    _db.ScorefyTblCommitePerformanceConclusions.Add(row);
                }

                var d = dto.Data;

                row.Cpc_PromotionOrCO = d.PromotionType switch
                {
                    "promotion" => 1,
                    "co" => 2,
                    _ => 0
                };

                row.Cpc_PromotedToCategory = ResolvePromotionCategory(d.PromotionCategory);
                row.Cpc_COReason = d.Justification;
                row.Cpc_FinalOpenPDRating = d.OpenPDRating ?? 0;
                row.Cpc_GeneralComments = d.GeneralComments;
                row.Calibration_FinalOpenPDRating = null;

                row.Modified = DateTime.Now;
                row.ModifiedBy = email;

                _db.SaveChanges();
                return res.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.SaveCommittee error");
                return res.Exception(ex);
            }
        }

        // ----------------------------------------------------------------------
        // Calibration Save
        // ----------------------------------------------------------------------
        public Result SaveCalibration(string email, FinalConclusionSectionDTO dto)
        {
            var res = new Result();
            try
            {
                //if (!HasSecurity(email))
                //    return res.Fail("No autorizado.");

                var row = _db.ScorefyTblCommitePerformanceConclusions
                    .FirstOrDefault(x => x.EmployeeId == dto.EmployeeId && x.FY == dto.FY && x.IsCurrent == 1);

                if (row == null)
                    return res.Fail("Debe existir registro de Committee antes de Calibration.");

                var d = dto.Data;

                row.Calibration_FinalOpenPDRating = d.OpenPDRating ?? 0;
                row.Calibration_GeneralComments = d.GeneralComments;

                row.Modified = DateTime.Now;
                row.ModifiedBy = email;

                _db.SaveChanges();
                return res.Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.SaveCalibration error");
                return res.Exception(ex);
            }
        }

        // ----------------------------------------------------------------------
        // Catálogos
        // ----------------------------------------------------------------------
        public Result GetPromotionCategories(string email)
        {
            var res = new Result();
            try
            {
                //if (!HasSecurity(email))
                //    return res.Fail("No autorizado.");

                var list = _db.ScorefyDimPromotionCategories
                    .Select(x => new { x.PromotionCategoryId, x.PromotionCategoryName })
                    .ToList();

                return res.Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetPromotionCategories error");
                return res.Exception(ex);
            }
        }

        public Result GetQPRScores(string email)
        {
            var res = new Result();
            try
            {
                //if (!HasSecurity(email))
                //    return res.Fail("No autorizado.");

                var list = _db.ScorefyDimScoreQprs
                    .Select(x => new { x.ScoreQPRId, x.ScoreDetail })
                    .ToList();

                return res.Ok(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetQPRScores error");
                return res.Exception(ex);
            }
        }

        public Result GetEmployee(int employeeId, string email)
        {
            var result = new Result();
            try
            {
                // Seguridad igual a todo tu backend
                //var security = _db.SecurityScorefies
                //    .AsNoTracking()
                //    .FirstOrDefault(s => s.Email == email);

                //if (security == null)
                //{
                //    return result.Fail("No autorizado: el usuario no está en la tabla de seguridad.");
                //}

                // SELECT seguro (igual estilo a GetCatEmpleados)
                var q = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId == employeeId);

                var data = q.Select(e => new
                {
                    EmployeeId = e.EmployeeId,
                    FullName = e.FullName,
                    Office = e.LocationName,
                    Category = e.LocalJobLevelName,
                    Email = e.EmailAddressBusiness,
                    Bu = e.Bu,
                    IsActive = 1, // si es NULL tu view igual no truena porque el tipo C# es nullable
                })
                .FirstOrDefault();

                return result.Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetEmployee error");
                return result.Exception(ex);
            }
        }



        private int? ResolvePromotionCategory(string? name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            return _db.ScorefyDimPromotionCategories
                .Where(x => x.PromotionCategoryName == name)
                .Select(x => (int?)x.PromotionCategoryId)
                .FirstOrDefault();
        }


        private int ResolveQpr(string? qpr)
        {
            return qpr switch
            {
                "compliance" => 1,
                "not-compliance" => 2,
                "improvement-needed" => 3,
                _ => 0
            };
        }

        public Result GetPMSection(int employeeId, int fy, string email)
        {
            var result = new Result();
            try
            {

                var q = _db.ScorefyTblManagerPerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1);

                var data = q
.Select(x => new FinalConclusionSectionGetDTO
{
    EmployeeId = x.EmployeeId,
    FY = x.FY,
    Data = new SectionDataDTO
    {
        FeedbackConversationCompleted = x.ManagerFeedbackDiscussionConfirmed,

        PromotionType = x.PromotionOrCO == 1 ? "promotion" :
                        x.PromotionOrCO == 2 ? "co" : null,

        PromotionCategory = _db.ScorefyDimPromotionCategories
            .Where(c => c.PromotionCategoryId == x.PromotedToCategory)
            .Select(c => c.PromotionCategoryName)
            .FirstOrDefault(),

        Justification = x.COReason,
        OpenPDRating = x.FinalOpenPDRating,
        Strengths = x.FinalStrengthsSummary,
        AreasOfOpportunity = x.FinalAreasOfOpportunity,

        Compliance806A = new Compliance806ADTO
        {
            TrainingCompleted = x.MandatoryTrainingCompleted ? "yes" : "no",
            IndependenceEthicsIssues = x.IndependenceEth ? "yes" : "no",
            RolePerformance = x.RoleResponsibilitiesMet ? "yes" : "no",
            CodeOfConductIssues = x.CodeOfConductIncidents ? "yes" : "no"
        },

        Compliance806B = new Compliance806BDTO
        {
            QPRScore = ResolveQprName(x.ScoreQPR)
        },

        ComplianceComments = x.ComplianceAdditionalComments
    },
    Editor = x.ModifiedBy ?? x.CreatedBy,
    LastUpdate = x.Modified ?? x.Created
})

                .FirstOrDefault();

                return result.Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetPMSection error");
                return result.Exception(ex);
            }
        }

        public Result GetCommitteeSection(int employeeId, int fy, string email)
        {
            var result = new Result();
            try
            {
                //var security = _db.SecurityScorefies.AsNoTracking()
                //    .FirstOrDefault(s => s.Email == email);

                //if (security == null)
                //    return result.Fail("No autorizado.");

                var q = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1);

                var data = q.Select(x => new FinalConclusionSectionGetDTO
                {
                    EmployeeId = x.EmployeeId,
                    FY = x.FY,
                    Data = new SectionDataDTO
                    {
                        PromotionType = x.Cpc_PromotionOrCO == 1 ? "promotion" :
                        x.Cpc_PromotionOrCO == 2 ? "co" : null,


                        PromotionCategory = _db.ScorefyDimPromotionCategories
    .Where(c => c.PromotionCategoryId == x.Cpc_PromotedToCategory)
    .Select(c => c.PromotionCategoryName)
    .FirstOrDefault(),

                        Justification = x.Cpc_COReason,
                        OpenPDRating = x.Cpc_FinalOpenPDRating,
                        GeneralComments = x.Cpc_GeneralComments
                    },
                    Editor = x.ModifiedBy ?? x.CreatedBy,
                    LastUpdate = x.Modified ?? x.Created
                })
                .FirstOrDefault();
                //var data = q.Select(x => new FinalConclusionSectionGetDTO
                //{
                //    EmployeeId = x.EmployeeId,
                //    FY = x.FY,
                //    PromotionType = x.Cpc_PromotionOrCO == 1 ? "promotion" :
                //                    x.Cpc_PromotionOrCO == 2 ? "co" : null,
                //    PromotionCategory = _db.ScorefyDimPromotionCategories
                //                           .Where(c => c.PromotionCategoryId == x.Cpc_PromotedToCategory)
                //                           .Select(c => c.PromotionCategoryName)
                //                           .FirstOrDefault(),
                //    Justification = x.Cpc_COReason,
                //    OpenPDRating = x.Cpc_FinalOpenPDRating,
                //    Strengths = null,
                //    AreasOfOpportunity = null,
                //    GeneralComments = x.Cpc_GeneralComments,
                //    COReason = x.Cpc_COReason,
                //    Editor = x.ModifiedBy ?? x.CreatedBy,
                //    LastUpdate = x.Modified ?? x.Created
                //})
                //.FirstOrDefault();

                return result.Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetCommitteeSection error");
                return result.Exception(ex);
            }
        }

        public Result GetCalibrationSection(int employeeId, int fy, string email)
        {
            var result = new Result();
            try
            {
                

                var q = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1);

                var data = q.Select(x => new FinalConclusionSectionGetDTO
                {
                    EmployeeId = x.EmployeeId,
                    FY = x.FY,
                    Data = new SectionDataDTO
                    {
                        OpenPDRating = x.Calibration_FinalOpenPDRating,
                        GeneralComments = x.Calibration_GeneralComments
                    },
                    Editor = x.ModifiedBy ?? x.CreatedBy,
                    LastUpdate = x.Modified ?? x.Created
                })
                .FirstOrDefault();
                //var data = q.Select(x => new FinalConclusionSectionGetDTO
                //{
                //    EmployeeId = x.EmployeeId,
                //    FY = x.FY,
                //    PromotionType = null, // no aplica en Calibration
                //    PromotionCategory = null,
                //    Justification = null,
                //    OpenPDRating = x.Calibration_FinalOpenPDRating,
                //    Strengths = null,
                //    AreasOfOpportunity = null,
                //    GeneralComments = x.Calibration_GeneralComments,
                //    COReason = null,
                //    Editor = x.ModifiedBy ?? x.CreatedBy,
                //    LastUpdate = x.Modified ?? x.Created
                //})
                //.FirstOrDefault();

                return result.Ok(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetCalibrationSection error");
                return result.Exception(ex);
            }
        }
        public Result GetConsolidatedRatings(int employeeId, int fy, string email)
        {
            var result = new Result();
            try
            {
                //var security = _db.SecurityScorefies
                //    .AsNoTracking()
                //    .FirstOrDefault(s => s.Email == email);

                //if (security == null)
                //    return result.Fail("No autorizado.");

                // Performance Manager
                var pm = _db.ScorefyTblManagerPerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => x.FinalOpenPDRating)
                    .FirstOrDefault();

                // Committee
                var committee = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => x.Cpc_FinalOpenPDRating)
                    .FirstOrDefault();

                // Calibration (usa la misma tabla de Committee)
                var calibration = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => x.Calibration_FinalOpenPDRating)
                    .FirstOrDefault();

                var dto = new FinalConclusionConsolidatedDTO
                {
                    EmployeeId = employeeId,
                    FY = fy,
                    PMRating = pm == 0 ? null : pm,
                    CommitteeRating = committee == 0 ? null : committee,
                    CalibrationRating = calibration == 0 ? null : calibration
                };

                return result.Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetConsolidatedRatings error");
                return result.Exception(ex);
            }
        }

        public Result GetFullFinalConclusion(int employeeId, int fy, string email)
        {
            var result = new Result();

            try
            {
                // ============================================================
                // 1) Employee info
                // ============================================================
                var emp = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId == employeeId)
                    .Select(e => new
                    {
                        EmployeeId = e.EmployeeId,
                        FullName = e.FullName,
                        Office = e.LocationName,
                        Category = e.LocalJobLevelName,
                        Email = e.EmailAddressBusiness,
                        Bu = e.Bu
                    })
                    .FirstOrDefault();

                // ============================================================
                // 2) Performance Manager Section
                // ============================================================
                var pm = _db.ScorefyTblManagerPerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => new FinalConclusionSectionGetDTO
                    {
                        EmployeeId = x.EmployeeId,
                        FY = x.FY,
                        Data = new SectionDataDTO
                        {
                            FeedbackConversationCompleted = x.ManagerFeedbackDiscussionConfirmed,

                            PromotionType = x.PromotionOrCO == 1 ? "promotion"
                                           : x.PromotionOrCO == 2 ? "co"
                                           : null,

                            PromotionCategory = _db.ScorefyDimPromotionCategories
                                .Where(c => c.PromotionCategoryId == x.PromotedToCategory)
                                .Select(c => c.PromotionCategoryName)
                                .FirstOrDefault(),

                            Justification = x.COReason,
                            OpenPDRating = x.FinalOpenPDRating,
                            Strengths = x.FinalStrengthsSummary,
                            AreasOfOpportunity = x.FinalAreasOfOpportunity,

                            Compliance806A = new Compliance806ADTO
                            {
                                TrainingCompleted = x.MandatoryTrainingCompleted ? "yes" : "no",
                                IndependenceEthicsIssues = x.IndependenceEth ? "yes" : "no",
                                RolePerformance = x.RoleResponsibilitiesMet ? "yes" : "no",
                                CodeOfConductIssues = x.CodeOfConductIncidents ? "yes" : "no"
                            },

                            Compliance806B = new Compliance806BDTO
                            {
                                TrainingCompleted = x.MandatoryTrainingCompleted ? "yes" : "no",
                                IndependenceEthicsIssues = x.IndependenceEth ? "yes" : "no",
                                RolePerformance = x.RoleResponsibilitiesMet ? "yes" : "no",
                                CodeOfConductIssues = x.CodeOfConductIncidents ? "yes" : "no",
                                QPRScore = x.ScoreQPR == 1 ? "compliance"
                                         : x.ScoreQPR == 2 ? "not-compliance"
                                         : x.ScoreQPR == 3 ? "improvement-needed"
                                         : null
                            },

                            ComplianceComments = x.ComplianceAdditionalComments
                        },
                        Editor = x.ModifiedBy ?? x.CreatedBy,
                        LastUpdate = x.Modified ?? x.Created
                    })
                    .FirstOrDefault();

                // ============================================================
                // 3) Committee Section
                // ============================================================
                var committee = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => new FinalConclusionSectionGetDTO
                    {
                        EmployeeId = x.EmployeeId,
                        FY = x.FY,
                        Data = new SectionDataDTO
                        {
                            PromotionType = x.Cpc_PromotionOrCO == 1 ? "promotion"
                                           : x.Cpc_PromotionOrCO == 2 ? "co"
                                           : null,

                            PromotionCategory = _db.ScorefyDimPromotionCategories
                                .Where(c => c.PromotionCategoryId == x.Cpc_PromotedToCategory)
                                .Select(c => c.PromotionCategoryName)
                                .FirstOrDefault(),

                            Justification = x.Cpc_COReason,
                            OpenPDRating = x.Cpc_FinalOpenPDRating,
                            GeneralComments = x.Cpc_GeneralComments
                        },
                        Editor = x.ModifiedBy ?? x.CreatedBy,
                        LastUpdate = x.Modified ?? x.Created
                    })
                    .FirstOrDefault();

                // ============================================================
                // 4) Calibration Section
                // ============================================================
                var calibration = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => new FinalConclusionSectionGetDTO
                    {
                        EmployeeId = x.EmployeeId,
                        FY = x.FY,
                        Data = new SectionDataDTO
                        {
                            OpenPDRating = x.Calibration_FinalOpenPDRating,
                            GeneralComments = x.Calibration_GeneralComments
                        },
                        Editor = x.ModifiedBy ?? x.CreatedBy,
                        LastUpdate = x.Modified ?? x.Created
                    })
                    .FirstOrDefault();

                // ============================================================
                // 5) Consolidated Ratings
                // ============================================================
                var consolidated = new FinalConclusionConsolidatedDTO
                {
                    EmployeeId = employeeId,
                    FY = fy,
                    PMRating = pm?.Data?.OpenPDRating,
                    CommitteeRating = committee?.Data?.OpenPDRating,
                    CalibrationRating = calibration?.Data?.OpenPDRating
                };

                // ============================================================
                // 6) Final Object
                // ============================================================
                var full = new FinalConclusionFullDTO
                {
                    Employee = emp,
                    PerformanceManager = pm,
                    Committee = committee,
                    Calibration = calibration,
                    Consolidated = consolidated
                };

                return result.Ok(full);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetFullFinalConclusion error");
                return result.Exception(ex);
            }
        }


        public Result UnlockNextStep(int employeeId, int fy, string email)
        {
            var result = new Result();
            try
            {
                //var security = _db.SecurityScorefies
                //    .AsNoTracking()
                //    .FirstOrDefault(x => x.Email == email);

                //if (security == null)
                //    return result.Fail("No autorizado.");

                // same checks as GetWorkflow
                var pmCompleted = _db.ScorefyTblManagerPerformanceConclusions
                    .Any(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1 && x.FinalOpenPDRating > 0);

                var committeeCompleted = _db.ScorefyTblCommitePerformanceConclusions
                    .Any(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1 && x.Cpc_FinalOpenPDRating > 0);

                var calibrationCompleted = _db.ScorefyTblCommitePerformanceConclusions
                    .Any(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1 && x.Calibration_FinalOpenPDRating > 0);

                // PM must be completed before committee is unlocked
                if (!pmCompleted)
                    return result.Fail("La sección PM no está completa. No se puede avanzar.");

                if (!committeeCompleted)
                    return result.Ok(new { next = "committee" });

                if (!calibrationCompleted)
                    return result.Ok(new { next = "calibration" });

                return result.Ok(new { next = "none" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.UnlockNextStep error");
                return result.Exception(ex);
            }
        }
        private string? ResolveQprName(int? qpr)
        {
            return qpr switch
            {
                1 => "compliance",
                2 => "not-compliance",
                3 => "improvement-needed",
                _ => null
            };
        }
        public Result GetWorkflow(int employeeId, int fy, string email)
        {
            var result = new Result();
            try
            {
                //var security = _db.SecurityScorefies
                //    .AsNoTracking()
                //    .FirstOrDefault(x => x.Email == email);

                //if (security == null)
                //    return result.Fail("No autorizado.");

                // Check PM
                var pm = _db.ScorefyTblManagerPerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => x.FinalOpenPDRating)
                    .FirstOrDefault();

                bool pmCompleted = pm > 0;

                // Check Committee
                var committee = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => x.Cpc_FinalOpenPDRating)
                    .FirstOrDefault();

                bool committeeCompleted = committee > 0;

                // Check Calibration
                var calibration = _db.ScorefyTblCommitePerformanceConclusions
                    .AsNoTracking()
                    .Where(x => x.EmployeeId == employeeId && x.FY == fy && x.IsCurrent == 1)
                    .Select(x => x.Calibration_FinalOpenPDRating)
                    .FirstOrDefault();

                bool calibrationCompleted = calibration > 0;

                string currentStep =
                    !pmCompleted ? "pm" :
                    !committeeCompleted ? "committee" :
                    !calibrationCompleted ? "calibration" :
                    "done";

                string nextStep =
                    !pmCompleted ? "committee" :
                    !committeeCompleted ? "calibration" :
                    "none";

                var dto = new FinalConclusionWorkflowDTO
                {
                    EmployeeId = employeeId,
                    FY = fy,
                    PMCompleted = pmCompleted,
                    CommitteeCompleted = committeeCompleted,
                    CalibrationCompleted = calibrationCompleted,
                    CurrentStep = currentStep,
                    NextStep = nextStep
                };

                return result.Ok(dto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "FinalConclusionBL.GetWorkflow error");
                return result.Exception(ex);
            }
        }

    }

}