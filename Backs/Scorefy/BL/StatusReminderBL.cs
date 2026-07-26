// BL/StatusReminderBL.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ML;
using ML.Models;

namespace BL
{
    public interface IStatusReminderBL
    {
        ML.Result GetAllWithSecurity(string email, StatusReminderFilterVM vm);

        ML.Result SendReminder(string email, ReminderRequest req);

        ML.Result GetExceptions(string email);
        ML.Result CreateException(string email, ExceptionCreateVM vm);
        ML.Result UpdateException(string email, ExceptionUpdateVM vm);
        ML.Result RestoreException(string email, int id);

        //catalogo de empleados para la funcion de cambiar de evaluador 
        ML.Result GetCatEmpleados(string email, ML.CatEmpleado.CatEmpleadoFilterVM vm);
        //para cambiar evaluador
        ML.Result ChangeEvaluator(string email, ChangeEvaluatorRequest req);
        ML.Result GetCurrentEvaluator(string email, string keyReport); // opcional si quieres soportar tu loadCurrentEvaluator()


    }

    public sealed class StatusReminderBL : IStatusReminderBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<StatusReminderBL> _logger;

        public StatusReminderBL(DL.MexItaStaBiAuditContext db, ILogger<StatusReminderBL> logger)
        {
            _db = db;
            _logger = logger;
        }

        //funciona ya con la seguridad de filtrado 
        public ML.Result GetAllWithSecurity(string email, StatusReminderFilterVM vm)
        {
            var result = new ML.Result();
            try
            {
                var normEmail = email.Trim().ToLowerInvariant();

                // 🔹 Obtener TODOS los roles del usuario
                var roles = _db.SecurityScorefies
                    .AsNoTracking()
                    .Where(s => s.Email.ToLower() == normEmail)
                    .Select(s => (s.Role ?? string.Empty).Trim())
                    .ToList();

                // ❌ No está en seguridad
                if (!roles.Any())
                {
                    vm.HasAccess = false;
                    vm.Results = new();
                    vm.Warnings.Add("No autorizado: el usuario no está en la tabla de seguridad.");
                    result.Correct = true;
                    result.Object = vm;
                    return result;
                }

                // 🔐 Reglas de acceso
                bool hasKeyRole = roles.Any(r =>
                    r.Equals("Key", StringComparison.OrdinalIgnoreCase));

                bool hasOnlyCommitte =
                    roles.Any(r => r.Equals("COMMITTE", StringComparison.OrdinalIgnoreCase)) &&
                    !hasKeyRole &&
                    roles.Count == 1;

                // ❌ Bloqueado: solo COMMITTE
                if (hasOnlyCommitte)
                {
                    vm.HasAccess = false;
                    vm.Results = new();
                    vm.Warnings.Add("No autorizado: el rol COMMITTE no tiene acceso.");
                    result.Correct = true;
                    result.Object = vm;
                    return result;
                }
                // ✅ Acceso permitido
                vm.HasAccess = true;


                    var baseQuery = SecureVwQuery(normEmail)
                    .Where(v => v.IsException == null || v.IsException == false);

                if (!string.IsNullOrWhiteSpace(vm.Search))
                {
                    var q = vm.Search.Trim().ToLower();
                    baseQuery = baseQuery.Where(v =>
                        (v.EmployeeName ?? "").ToLower().Contains(q) ||
                        (v.ClientName ?? "").ToLower().Contains(q) ||
                        (v.EvaluatorName ?? "").ToLower().Contains(q));
                }

                if (vm.EvaluatorStatus != "all")
                {
                    var viewVal = vm.EvaluatorStatus switch
                    {
                        "pending" => "Sin Iniciar",
                        "in-progress" => "Pendiente",
                        "complete" => "Completa",
                        _ => null
                    };
                    if (viewVal != null) baseQuery = baseQuery.Where(v => v.EstatusEvaluador == viewVal);
                }

                if (vm.EmployeeStatus != "all")
                {
                    if (vm.EmployeeStatus == "pending")
                        baseQuery = baseQuery.Where(v => v.EstatusEvaluado == "Sin Iniciar");
                    else if (vm.EmployeeStatus == "complete")
                        baseQuery = baseQuery.Where(v => v.EstatusEvaluado == "Completo");
                }

                if (vm.EvaluationType != "all")
                {
                    int type = vm.EvaluationType == "extra" ? 2 : 1;
                    baseQuery = baseQuery.Where(v => v.GeneratedType == type);
                }

                IOrderedQueryable<DL.VwEstatusEvalProy> ordered;
                bool desc = vm.SortDirection.Equals("desc", StringComparison.OrdinalIgnoreCase);

                ordered = vm.SortField switch
                {
                    "employeeName" => desc ? baseQuery.OrderByDescending(v => v.EmployeeName) : baseQuery.OrderBy(v => v.EmployeeName),
                    "projectClient" => desc ? baseQuery.OrderByDescending(v => v.ClientName) : baseQuery.OrderBy(v => v.ClientName),
                    "evaluatorName" => desc ? baseQuery.OrderByDescending(v => v.EvaluatorName) : baseQuery.OrderBy(v => v.EvaluatorName),
                    "evaluatorStatus" => desc ? baseQuery.OrderByDescending(v => v.EstatusEvaluador) : baseQuery.OrderBy(v => v.EstatusEvaluador),
                    "evaluationType" => desc ? baseQuery.OrderByDescending(v => v.GeneratedType) : baseQuery.OrderBy(v => v.GeneratedType),
                    "hours" => desc ? baseQuery.OrderByDescending(v => v.TotalHours) : baseQuery.OrderBy(v => v.TotalHours),
                    "employeeStatus" => desc ? baseQuery.OrderByDescending(v => v.EstatusEvaluado) : baseQuery.OrderBy(v => v.EstatusEvaluado),
                    _ => baseQuery.OrderBy(v => v.EmployeeName)
                };

                vm.Results = ordered.Select(v => new StatusReminderRow
                {
                    Id = v.KeyReport!,
                    KeyReport = v.KeyReport!,
                    EmployeeName = v.EmployeeName ?? "",
                    ProjectClient = v.ClientName ?? "",
                    EvaluatorName = v.EvaluatorName ?? "",
                    EvaluatorStatus = MapEvaluatorStatus(v.EstatusEvaluador),
                    EmployeeStatus = MapEmployeeStatus(v.EstatusEvaluado),
                    EvaluationType = v.GeneratedType == 2 ? "extra" : "ordinary",
                    Hours = (int)Math.Round((double)(v.TotalHours ?? 0m))
                }).ToList();

                result.Correct = true;
                result.Object = vm;
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.GetAllWithSecurity error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
        private static string MapEvaluatorStatus(string? s) =>
            s switch
            {
                "Sin Iniciar" => "pending",
                "Pendiente" => "in-progress",
                "Completa" => "complete",
                _ => "pending"
            };

        private static string MapEmployeeStatus(string? s) =>
            s switch
            {
                "Completo" => "complete",
                "Sin Iniciar" => "pending",
                _ => "pending"
            };
        private void IncrementReminderCounter(string keyReport, string email)
        {
            var row = _db.EvaluaColabResumes
                .Where(x => x.KeyReport == keyReport && (x.IsCurrent == null || x.IsCurrent == true))
                .OrderByDescending(x => x.ModifiedTime ?? x.CreatedTime)
                .FirstOrDefault();

            if (row == null)
                throw new InvalidOperationException($"No existe EvaluaColabResume para KeyReport {keyReport}");

            row.ColumnD = (row.ColumnD ?? 0) + 1;
            row.ModifiedBy = email;
            row.ModifiedTime = DateTime.UtcNow;
        }


        //codigo Isaac
        //public ML.Result SendReminder(string email, ReminderRequest req)
        //{
        //    try
        //    {
        //        var info = _db.VwEstatusEvalProys.AsNoTracking()
        //            .Where(v => v.KeyReport == req.KeyReport)
        //            .Select(v => new { v.EvaluatorName, v.EvaluatorEmail })
        //            .FirstOrDefault();

        //        if (info == null)
        //            return new ML.Result { Correct = false, ErrorMessage = "No se encontró la evaluación (Key_Report)." };

        //        try
        //        {
        //            return new ML.Result
        //            {
        //                Correct = true,
        //                ErrorMessage = "Recordatorio enviado correctamente."
        //            };
        //        }
        //        catch
        //        {
        //            return new ML.Result
        //            {
        //                Correct = true,
        //                ErrorMessage = "Reminder encolado / enviado (best-effort)."
        //            };
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "StatusReminderBL.SendReminder error");
        //        return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
        //    }
        //}
        //public ML.Result SendReminder(string email, ReminderRequest req)
        //{
        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(req.KeyReport))
        //            return new ML.Result { Correct = false, ErrorMessage = "KeyReport es obligatorio." };

        //        using var tx = _db.Database.BeginTransaction();

        //        // 🔹 1. Validar existencia
        //        var info = _db.VwEstatusEvalProys
        //            .AsNoTracking()
        //            .Where(v => v.KeyReport == req.KeyReport)
        //            .Select(v => new { v.EvaluatorName, v.EvaluatorEmail }) 
        //            .FirstOrDefault();

        //        if (info == null)
        //            return new ML.Result
        //            {
        //                Correct = false,
        //                ErrorMessage = "No se encontró la evaluación."
        //            };

        //        // 🔹 2. Incrementar contador ColumnD
        //        IncrementReminderCounter(req.KeyReport, email);

        //        // 🔹 3. (Opcional) Enviar correo / cola
        //        // SendEmail(info.EvaluatorEmail, ...)

        //        _db.SaveChanges();
        //        tx.Commit();

        //        return new ML.Result
        //        {
        //            Correct = true,
        //            ErrorMessage = "Recordatorio enviado correctamente."
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "StatusReminderBL.SendReminder error");
        //        return new ML.Result
        //        {
        //            Correct = false,
        //            ErrorMessage = ex.Message,
        //            Ex = ex
        //        };
        //    }
        //}

        public ML.Result SendReminder(string email, ReminderRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.KeyReport))
                    return new ML.Result { Correct = false, ErrorMessage = "KeyReport es obligatorio." };

                //using var tx = _db.Database.BeginTransaction();

                // 1️⃣ Obtener el estatus de la evaluación
                var info = _db.VwEvaluaColabResumes
                    .AsNoTracking()
                    .Where(v => v.KeyReport == req.KeyReport)
                    .Select(v => new
                    {
                        v.ColumnC,
                        v.EvaluatedName,
                        v.EvaluatedEmail,
                        v.EvaluatorName,
                        v.EvaluatorEmail
                    })
                    .FirstOrDefault();

                if (info == null)
                    return new ML.Result
                    {
                        Correct = false,
                        ErrorMessage = "No se encontró la evaluación."
                    };

                

                // ===================== DETERMINAR DESTINATARIO =====================
                bool isWithEvaluator = info.ColumnC == 0;

                string toEmail;
                string toName;
                string fromEmail = email;
                string fromName = "Resource Manager";
                string bodyEmail;

                if (isWithEvaluator)
                {
                    // Evaluador pendiente
                    toEmail = info.EvaluatorEmail ?? "";
                    toName = info.EvaluatorName ?? "Evaluador";

                    bodyEmail = $@"
                        Saludos {toName}

                        Envío este email para recordarte que tienes pendiente la evaluación de desempeño. 

                        Para revisarla a detalle y completarla, favor de ingresar a la seccion de 'Evaluations' en la aplicación Scorefy Audit.

                        Gracias por tu colaboración.

                        {fromName}
                        ";
                }
                else
                {
                    // Evaluado pendiente
                    toEmail = info.EvaluatedEmail ?? "";
                    toName = info.EvaluatedName ?? "Colaborador";

                    bodyEmail = $@"
                        Saludos {toName}

                        Envío este email para recordarte que tienes pendiente la evaluación de desempeño. 

                        Para revisarla a detalle y completarla, favor de ingresar a la seccion de 'SelfEvaluations' en la aplicación Scorefy Audit.

                        Gracias por tu colaboración.

                        {fromName}
                        ";
                }

                // ===================== INSERT EMAIL =====================
                try
                {
                    
                    var mailRow = new DL.ScorefyTblEmail
                    {
                        ToEmail = toEmail,
                        ToName = toName,
                        FromEmail = fromEmail,
                        FromName = fromName,
                        Body = bodyEmail,
                        ContextKey = req.KeyReport,
                        EmailType = "Reminder",

                        IdentitySect = 3,
                    };

                    _db.ScorefyTblEmails.Add(mailRow);
                    _db.SaveChanges();
                }
                catch (Exception mailEx)
                {
                    _logger.LogError(mailEx, "Error insertando email de recordatorio");
                }

                return new ML.Result
                {
                    Correct = true,
                    ErrorMessage = "Recordatorio enviado correctamente."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.SendReminder error");
                return new ML.Result
                {
                    Correct = false,
                    ErrorMessage = ex.Message,
                    Ex = ex
                };
            }
        }
        //Fin codigo Isaac


        public ML.Result GetExceptions(string email)
        {
            try
            {
                var any = _db.SecurityScorefies.AsNoTracking().Any(s => s.Email == email);
                if (!any)
                {
                    return new ML.Result { Correct = true, Object = new List<ExceptionItemVM>() };
                }

                var secureView = SecureVwQuery(email);

                var lastByKey =
                    _db.ScorefyTblExceptions.AsNoTracking()
                      .Select(x => new { x.KeyReport, x.EventNumber })
                      .GroupBy(x => x.KeyReport!)
                      .Select(g => new { KeyReport = g.Key!, MaxEvent = g.Max(e => e.EventNumber) });

                var q =
                    from e in _db.ScorefyTblExceptions.AsNoTracking()
                    join l in lastByKey
                      on new { e.KeyReport, e.EventNumber } equals new { l.KeyReport, EventNumber = l.MaxEvent }
                    join v in secureView
                      on e.KeyReport equals v.KeyReport

                    // ✅ AGREGADO: solo KeyReports que terminan en 2 o 3

                    where
                            e.IsException == true &&                     // ✅ Solo excepciones
                            (e.KeyReport.EndsWith("2") ||                // ✅ Terminan en 2
                             e.KeyReport.EndsWith("3"))


                    select new ExceptionItemVM
                    {
                        Id = e.PkScorExceptions,
                        KeyReport = e.KeyReport!,
                        IsException = e.IsException ?? false,
                        Reason = e.ReasonException,
                        EventNumber = e.EventNumber,
                        EmployeeName = v.EmployeeName ?? "",
                        ProjectClient = v.ClientName ?? "",
                        EvaluatorName = v.EvaluatorName,
                        ExceptionType = e.ColumnC
                    };

                var list = q.OrderByDescending(x => x.EventNumber).ToList();
                return new ML.Result { Correct = true, Object = list };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.GetExceptions error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        private void UpdateEvaluationGenerateIsCurrent(string keyReport, bool isCurrent)
        {
            var eval = _db.ScorefyTblEvaluationsGenerates
                .SingleOrDefault(e => e.KeyReport == keyReport);

            if (eval != null)
            {
                eval.IsCurrent = isCurrent;
            }
        }
        //funcion para que contabilice el eventnumber
        //public ML.Result CreateException(string email, ExceptionCreateVM vm)
        //{
        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(vm.KeyReport))
        //            return new ML.Result { Correct = false, ErrorMessage = "KeyReport es obligatorio." };

        //        int nextEv = (_db.ScorefyTblExceptions
        //            .Where(x => x.KeyReport == vm.KeyReport)
        //            .Max(e => (int?)e.EventNumber) ?? 0) + 1;

        //        var e = new DL.ScorefyTblException
        //        {
        //            KeyReport = vm.KeyReport,
        //            IsException = vm.IsException,
        //            ReasonException = vm.Reason,
        //            Fy = 2026,
        //            EventNumber = nextEv,
        //            Created = DateTime.Now,
        //            CreatedBy = email,
        //            IsCurrent = true,
        //            ColumnC = vm.ExceptionType
        //        };

        //        _db.ScorefyTblExceptions.Add(e);
        //        _db.SaveChanges();

        //        return new ML.Result
        //        {
        //            Correct = true,
        //            Object = new { e.PkScorExceptions, e.KeyReport, e.EventNumber }
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "StatusReminderBL.CreateException error");
        //        return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
        //    }
        //}
        public ML.Result CreateException(string email, ExceptionCreateVM vm)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(vm.KeyReport))
                    return new ML.Result { Correct = false, ErrorMessage = "KeyReport es obligatorio." };

                int nextEv = (_db.ScorefyTblExceptions
                    .Where(x => x.KeyReport == vm.KeyReport)
                    .Max(e => (int?)e.EventNumber) ?? 0) + 1;

                var e = new DL.ScorefyTblException
                {
                    KeyReport = vm.KeyReport,
                    IsException = vm.IsException,
                    ReasonException = vm.Reason,
                    Fy = 2026,
                    EventNumber = nextEv,
                    Created = DateTime.Now,
                    CreatedBy = email,
                    IsCurrent = true,
                    ColumnC = vm.ExceptionType
                };

                _db.ScorefyTblExceptions.Add(e);

                // ✅ ACTUALIZAR EVALUATION GENERATE
                if (vm.IsException)
                {
                    UpdateEvaluationGenerateIsCurrent(vm.KeyReport, false);
                }

                _db.SaveChanges();

                return new ML.Result
                {
                    Correct = true,
                    Object = new { e.PkScorExceptions, e.KeyReport, e.EventNumber }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.CreateException error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }



        //funciones para mantener el event y el historico 
        //public ML.Result UpdateException(string email, ExceptionUpdateVM vm)
        //{
        //    try
        //    {
        //        var prev = _db.ScorefyTblExceptions.SingleOrDefault(x => x.PkScorExceptions == vm.Id);
        //        if (prev == null)
        //            return new ML.Result { Correct = false, ErrorMessage = "No existe la excepción." };

        //        prev.IsCurrent = false;

        //        int nextEv = (_db.ScorefyTblExceptions
        //            .Where(x => x.KeyReport == prev.KeyReport)
        //            .Max(e => (int?)e.EventNumber) ?? 0) + 1;

        //        var newRecord = new DL.ScorefyTblException
        //        {
        //            KeyReport = prev.KeyReport,
        //            IsException = vm.IsException,
        //            //IsException = true,
        //            ReasonException = vm.Reason,
        //            Fy = prev.Fy,
        //            EventNumber = nextEv,
        //            Created = DateTime.Now,
        //            CreatedBy = email,
        //            IsCurrent = true,
        //            ColumnC = string.IsNullOrWhiteSpace(vm.ExceptionType) ? prev.ColumnC : vm.ExceptionType
        //        };

        //        _db.ScorefyTblExceptions.Add(newRecord);
        //        _db.SaveChanges();

        //        return new ML.Result
        //        {
        //            Correct = true,
        //            Object = new { newRecord.PkScorExceptions, newRecord.EventNumber }
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "StatusReminderBL.UpdateException error");
        //        return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
        //    }
        //}
        public ML.Result UpdateException(string email, ExceptionUpdateVM vm)
        {
            try
            {
                var prev = _db.ScorefyTblExceptions
                    .SingleOrDefault(x => x.PkScorExceptions == vm.Id);

                if (prev == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la excepción." };

                // ✅ Cerrar registro anterior
                prev.IsCurrent = false;

                int nextEv = (_db.ScorefyTblExceptions
                    .Where(x => x.KeyReport == prev.KeyReport)
                    .Max(e => (int?)e.EventNumber) ?? 0) + 1;

                var newRecord = new DL.ScorefyTblException
                {
                    KeyReport = prev.KeyReport,
                    IsException = vm.IsException,
                    ReasonException = vm.Reason,
                    Fy = prev.Fy,
                    EventNumber = nextEv,
                    Created = DateTime.Now,
                    CreatedBy = email,
                    IsCurrent = true,
                    ColumnC = string.IsNullOrWhiteSpace(vm.ExceptionType)
                        ? prev.ColumnC
                        : vm.ExceptionType
                };

                _db.ScorefyTblExceptions.Add(newRecord);

                // ✅ UPDATE EXPLÍCITO EN EVALUATIONS GENERATE
                var evaluation = _db.ScorefyTblEvaluationsGenerates
                    .SingleOrDefault(x => x.KeyReport == prev.KeyReport);

                if (evaluation != null)
                {
                    if (vm.IsException)
                    {
                        // 🔴 Se mantiene como excepción → no vigente
                        evaluation.IsCurrent = false;
                    }
                    else
                    {
                        // 🟢 Se restaura → vuelve a estar vigente
                        evaluation.IsCurrent = true;
                    }

                }

                _db.SaveChanges();

                return new ML.Result
                {
                    Correct = true,
                    Object = new
                    {
                        newRecord.PkScorExceptions,
                        newRecord.EventNumber,
                        newRecord.IsException
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.UpdateException error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
        //public ML.Result RestoreException(string email, int id)
        //{
        //    try
        //    {
        //        var prev = _db.ScorefyTblExceptions.SingleOrDefault(x => x.PkScorExceptions == id);
        //        if (prev == null)
        //            return new ML.Result { Correct = false, ErrorMessage = "No existe la excepción." };


        //        prev.IsCurrent = false;

        //        int nextEv = (_db.ScorefyTblExceptions
        //            .Where(x => x.KeyReport == prev.KeyReport)
        //            .Max(e => (int?)e.EventNumber) ?? 0) + 1;

        //        var newRecord = new DL.ScorefyTblException
        //        {
        //            KeyReport = prev.KeyReport,
        //            IsException = false,
        //            ReasonException = prev.ReasonException,
        //            Fy = prev.Fy,
        //            EventNumber = nextEv,
        //            Created = DateTime.Now,
        //            CreatedBy = email,
        //            IsCurrent = true,
        //            ColumnC = prev.ColumnC
        //        };

        //        _db.ScorefyTblExceptions.Add(newRecord);
        //        _db.SaveChanges();

        //        return new ML.Result
        //        {
        //            Correct = true,
        //            Object = new { newRecord.PkScorExceptions, newRecord.EventNumber, newRecord.IsException }
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "StatusReminderBL.RestoreException error");
        //        return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
        //    }
        //}
        public ML.Result RestoreException(string email, int id)
        {
            try
            {
                var prev = _db.ScorefyTblExceptions
                    .SingleOrDefault(x => x.PkScorExceptions == id);

                if (prev == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe la excepción." };

                // ✅ Cerrar registro previo
                prev.IsCurrent = false;

                int nextEv = (_db.ScorefyTblExceptions
                    .Where(x => x.KeyReport == prev.KeyReport)
                    .Max(e => (int?)e.EventNumber) ?? 0) + 1;

                var newRecord = new DL.ScorefyTblException
                {
                    KeyReport = prev.KeyReport,
                    IsException = false,
                    ReasonException = prev.ReasonException,
                    Fy = prev.Fy,
                    EventNumber = nextEv,
                    Created = DateTime.Now,
                    CreatedBy = email,
                    IsCurrent = true,
                    ColumnC = prev.ColumnC
                };

                _db.ScorefyTblExceptions.Add(newRecord);

                // ✅ RESTAURAR EVALUATION GENERATE
                UpdateEvaluationGenerateIsCurrent(prev.KeyReport, true);

                _db.SaveChanges();

                return new ML.Result
                {
                    Correct = true,
                    Object = new
                    {
                        newRecord.PkScorExceptions,
                        newRecord.EventNumber,
                        newRecord.IsException
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.RestoreException error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        // ====================================================
        // 4) CATÁLOGO DE EMPLEADOS (Vw_scorefy_employees)
        //     - Solo regresa EmployeeId y FullName
        //     - Sin búsqueda , para uso de funcion cambiar evaluador 
        // ====================================================
        public ML.Result GetCatEmpleados(string email, ML.CatEmpleado.CatEmpleadoFilterVM vm)
        {
            var result = new ML.Result();
            try
            {
                var security = _db.SecurityScorefies.AsNoTracking().FirstOrDefault(s => s.Email == email);
                if (security == null)
                {
                    vm.HasAccess = false;
                    vm.Results = new();
                    vm.Warnings.Add("No autorizado: el usuario no está en la tabla de seguridad.");
                    result.Correct = true;
                    result.Object = vm;
                    return result;
                }

                vm.HasAccess = true;
                var q = _db.VwScorefyEmployees
                           .AsNoTracking()
                           .Where(e => e.IsActive == 1 && e.EmployeeId != null);

                vm.Results = q
                    .Select(e => new ML.CatEmpleado.CatEmpleadoItemVM
                    {
                        EmployeeId = e.EmployeeId!,
                        FullName = e.FullName
                    })
                    .OrderBy(x => x.FullName)
                    .ToList();

                result.Correct = true;
                result.Object = vm;
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.GetCatEmpleados error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
        //cambiar evaluador 
        public ML.Result ChangeEvaluator(string email, ChangeEvaluatorRequest req)
        {
            try
            {
                var security = _db.SecurityScorefies.AsNoTracking()
                                   .FirstOrDefault(s => s.Email == email);
                if (security == null)
                {
                    return new ML.Result
                    {
                        Correct = false,
                        ErrorMessage = "No autorizado: el usuario no está en la tabla de seguridad."
                    };
                }

                if (string.IsNullOrWhiteSpace(req.KeyReport) || req.NewEvaluatorId <= 0)
                {
                    return new ML.Result
                    {
                        Correct = false,
                        ErrorMessage = "Parámetros inválidos (KeyReport o NewEvaluatorId)."
                    };
                }

                var rows = _db.EvaluaColabResumes
    .Where(x => x.KeyReport == req.KeyReport && (x.IsCurrent == null || x.IsCurrent == true))
    .ToList();

                if (rows.Count == 0)
                {
                    var last = _db.EvaluaColabResumes
                        .Where(x => x.KeyReport == req.KeyReport)
                        .OrderByDescending(x => x.ModifiedTime ?? x.CreatedTime)
                        .ToList();

                    if (last.Count == 0)
                    {
                        return new ML.Result
                        {
                            Correct = false,
                            ErrorMessage = $"No se encontró ninguna fila en EvaluaColabResume para KeyReport='{req.KeyReport}'."
                        };
                    }

                    foreach (var r in last)
                        r.IsCurrent = false;

                    var target = last.First();
                    target.IsCurrent = true;
                    rows = new List<DL.EvaluaColabResume> { target };
                }

                foreach (var r in rows)
                {
                    r.EvaluatorId = req.NewEvaluatorId;
                    r.ModifiedTime = DateTime.Now;
                    r.ModifiedBy = email;
                }

                _db.SaveChanges();

                return new ML.Result
                {
                    Correct = true,
                    Object = new
                    {
                        keyReport = req.KeyReport,
                        evaluatorId = req.NewEvaluatorId
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.ChangeEvaluator error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        public ML.Result GetCurrentEvaluator(string email, string keyReport)
        {
            try
            {
                var security = _db.SecurityScorefies.AsNoTracking()
                                   .FirstOrDefault(s => s.Email == email);
                if (security == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No autorizado." };

                var r = _db.EvaluaColabResumes.AsNoTracking()
                            .Where(x => x.KeyReport == keyReport && (x.IsCurrent == null || x.IsCurrent == true))
                            .OrderByDescending(x => x.ModifiedTime ?? x.CreatedTime)
                            .FirstOrDefault();

                if (r == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No se encontró el KeyReport actual." };

                return new ML.Result
                {
                    Correct = true,
                    Object = new { id = r.EvaluatorId, name = "" }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StatusReminderBL.GetCurrentEvaluator error");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }


        //Seguridad para que se muestren de acuerdo a el BU y Oficina que tenga el perfil
        //Reglas de Se respetar
        // - ALL: sin filtros
        // - Fila con (BU,Office) => match exacto por par
        // - Fila con (BU,!Office) => match por BU
        // - Fila con (!BU,Office) => IGNORAR (no otorga acceso)
        // - Fila con (!BU,!Office) y !ALL => IGNORAR
        private bool HasAllAccess(string email)
        {
            return _db.SecurityScorefies.AsNoTracking()
.Any(s => s.Email.ToLower() == email && s.Role != null && s.Role.ToUpper() == "ALL");
        }


 private IQueryable<DL.VwEstatusEvalProy> SecureVwQuery(string email)
{
    var view = _db.VwEstatusEvalProys.AsNoTracking();

    if (HasAllAccess(email))
        return view;

    var sec = _db.SecurityScorefies.AsNoTracking()
.Where(s => s.Email.ToLower() == email && (s.Role == null || s.Role.ToUpper() != "ALL"))
        .FirstOrDefault();

    if (sec == null)
        return view.Where(v => false); // sin acceso

    var role = (sec.Role ?? "").Trim();

    // PIE → BUs fijos
if (role.Equals("PIE", StringComparison.OrdinalIgnoreCase))
{
    return view.Where(v => v.Bu != null &&
        (v.Bu.Trim().StartsWith("PCG") ||
         v.Bu.Trim().StartsWith("IRM") ||
         v.Bu.Trim().StartsWith("ESG")));
}


    // lógica original para los demás
    var secAll = _db.SecurityScorefies.AsNoTracking()
.Where(s => s.Email.ToLower() == email && (s.Role == null || s.Role.ToUpper() != "ALL"));

    var q =
        from v in view
        join s in secAll on 1 equals 1
        where
            (s.Bu != null && s.Office != null && v.Bu == s.Bu && v.LocationName == s.Office)
            ||
            (s.Bu != null && s.Office == null && v.Bu == s.Bu)
        select v;

    return q.Distinct();
}

    }
}