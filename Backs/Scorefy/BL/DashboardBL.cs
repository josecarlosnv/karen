// BL/DashboardBL.cs
using DL;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace BL
{
    public interface IDashboardBL
    {
        Task<ML.Result> GetSummaryAsync(string email, CancellationToken ct = default);
        Task<ML.Result> GetRecentActivityAsync(string email, int top = 10, CancellationToken ct = default);
    } 

    public sealed class DashboardBL : IDashboardBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<DashboardBL> _logger;

        public DashboardBL(DL.MexItaStaBiAuditContext db, ILogger<DashboardBL> logger)
        {
            _db = db;
            _logger = logger;
        }



        //public async Task<ML.Result> GetSummaryAsync(string email, CancellationToken ct = default)
        //{
        //    var res = new ML.Result();

        //    try
        //    {
        //        // ----- 1) Seguridad -----
        //        var security = await _db.SecurityScorefies
        //            .AsNoTracking()
        //            .FirstOrDefaultAsync(s => s.Email == email, ct);

        //        IQueryable<DL.VwScorefyEmployee> q = _db.VwScorefyEmployees.AsNoTracking();

        //        // Usuario sin rol → solo ve sus datos
        //        if (security == null)
        //        {
        //            q = q.Where(e => e.EmailAddressBusiness == email);
        //        }
        //        else
        //        {
        //            var role = security.Role?.Trim().ToUpperInvariant() ?? "";

        //            if (role == "PIE")
        //            {
        //                string[] allowed = { "PCG", "IRM", "ESG" };
        //                q = q.Where(e => allowed.Contains(e.Bu));
        //            }
        //            else if (role == "HLSTM")
        //            {
        //                string[] allowedLoc = { "Hermosillo", "León", "San Luis Potosí", "Tijuana", "Mexicali" };
        //                q = q.Where(e => e.Bu == "UNO" && allowedLoc.Contains(e.LocationName));
        //            }
        //            else if (role == "COMMITTE")
        //            {
        //                q = q.Where(e => e.EmailAddressBusiness == email);
        //            }
        //            else if (role == "KEY")
        //            {
        //                string[] allowedKey = { "UNO", "UNNE", "CIM", "IRM", "TMT", "SF" };
        //                var userBu = (security.Bu ?? "").Trim().ToUpperInvariant();

        //                if (!allowedKey.Contains(userBu))
        //                {
        //                    res.Correct = true;
        //                    res.Object = new { pending = 0, completed = 0, total = 0, openExceptions = 0 };
        //                    return res;
        //                }

        //                q = q.Where(e => e.Bu == userBu);
        //            }
        //        }

        //        // ----- 2) KPIs agregados desde la vista -----
        //        int? completed = await q.SumAsync(e => e.CompletedEvaluations, ct);
        //        int? pending = await q.SumAsync(e => e.PendingEvaluations, ct);
        //        int? total = await q.SumAsync(e => e.TotalEvaluations, ct);

        //        // ----- 3) KeyReports permitidos por usuario -----
        //        var allowedEmployeeIds = q.Select(e => e.EmployeeId);

        //        var allowedKeyReports =
        //            _db.ScorefyTblEvaluationsGenerates
        //                .AsNoTracking()
        //                .Where(ev => allowedEmployeeIds.Contains(ev.EmployeeId) )
        //                .Select(ev => ev.KeyReport)
        //                .Distinct();

        //        // ----- 4) Excepciones abiertas (versión estable) -----
        //        // Traemos solo los KeyReports permitidos
        //        var keyReports = await allowedKeyReports.ToListAsync(ct);


        //        if (!keyReports.Any())
        //        {
        //            res.Correct = true;
        //            res.Object = new
        //            {
        //                pending,
        //                completed,
        //                total,
        //                openExceptions = 0
        //            };
        //            return res;
        //        }

        //        // Cargamos excepciones solo de esos KeyReports
        //        var exList = await _db.ScorefyTblExceptions
        //            .Where(ex => keyReports.Contains(ex.KeyReport))
        //            .AsNoTracking()
        //            .ToListAsync(ct);

        //        // Seleccionar el último EventNumber por KeyReport (misma lógica que tu vista Ex_Last)
        //        var lastExceptions = exList
        //            .GroupBy(ex => ex.KeyReport)
        //            .Select(g => g.OrderByDescending(x => x.EventNumber).First())
        //            .ToList();

        //        // Contar solo las abiertas y vigentes
        //        int openExceptions = lastExceptions
        //            .Count(ex => (ex.IsException ?? false) && (ex.IsCurrent ?? false));

        //        // ----- 5) Resultado final -----
        //        res.Correct = true;
        //        res.Object = new
        //        {
        //            pending,
        //            completed,
        //            total,
        //            openExceptions
        //        };

        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error obteniendo Dashboard Summary");
        //        res.Correct = false;
        //        res.ErrorMessage = ex.Message;
        //        return res;
        //    }
        //}
        public async Task<ML.Result> GetSummaryAsync(
    string email,
    CancellationToken ct = default)
        {
            var res = new ML.Result();

            try
            {
                /* =====================================================
                   1️⃣ SEGURIDAD Y FILTRO BASE (DESDE LA VISTA)
                   ===================================================== */
                var security = await _db.SecurityScorefies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Email == email, ct);

                IQueryable<DL.VwScorefyEmployee> q =
                    _db.VwScorefyEmployees.AsNoTracking();

                if (security == null)
                {
                    q = q.Where(e => e.EmailAddressBusiness == email);
                }
                else
                {
                    var role = (security.Role ?? "").Trim().ToUpperInvariant();

                    switch (role)
                    {
                        case "PIE":
                            q = q.Where(e =>
                                new[] { "PCG", "IRM", "ESG" }.Contains(e.Bu));
                            break;

                        case "HLSTM":
                            q = q.Where(e =>
                                e.Bu == "UNO" &&
                                new[]
                                {
                            "Hermosillo", "León",
                            "San Luis Potosí", "Tijuana", "Mexicali"
                                }.Contains(e.LocationName));
                            break;

                        case "COMMITTE":
                            q = q.Where(e => e.EmailAddressBusiness == email);
                            break;

                        case "KEY":
                            var validBu = new[]
                            {
                        "UNO", "UNNE", "CIM", "IRM", "TMT", "SF"
                    };

                            var bu = (security.Bu ?? "").Trim().ToUpperInvariant();
                            if (!validBu.Contains(bu))
                            {
                                res.Correct = true;
                                res.Object = new
                                {
                                    pending = 0,
                                    completed = 0,
                                    total = 0,
                                    openExceptions = 0
                                };
                                return res;
                            }

                            q = q.Where(e => e.Bu == bu);
                            break;
                    }
                }

                /* =====================================================
                   2️⃣ KPIs (LA VISTA YA LOS TIENE)
                   ===================================================== */
                int completed =
                    await q.SumAsync(e => (int?)e.CompletedEvaluations, ct) ?? 0;

                int pending =
                    await q.SumAsync(e => (int?)e.PendingEvaluations, ct) ?? 0;

                int total =
                    await q.SumAsync(e => (int?)e.TotalEvaluations, ct) ?? 0;


                //                int completed = await (
                //                    from eg in _db.ScorefyTblEvaluationsGenerates.AsNoTracking()
                //                    join r in _db.VwEvaluaColabResumes.AsNoTracking()
                //                        on eg.KeyReport equals r.KeyReport
                //                    where
                //                        allowedEmployees.Contains(eg.EmployeeId)
                //                        && eg.IsCurrent
                //                        && r.ColumnC == 0
                //                        && r.IsClosed = 0
                //                    select eg.KeyReport
                //                ).CountAsync(ct);

                //                int total = await (
                //    from eg in _db.ScorefyTblEvaluationsGenerates.AsNoTracking()
                //    where
                //        allowedEmployees.Contains(eg.EmployeeId)
                //        && eg.IsCurrent
                //        && !_db.ScorefyTblExceptions.Any(ex =>
                //            ex.KeyReport == eg.KeyReport &&
                //            ex.IsException == true &&
                //            ex.IsCurrent == true
                //        )
                //    select eg.KeyReport
                //).CountAsync(ct);
                /* =====================================================
                   3️⃣ EXCEPCIONES ABIERTAS (FORMA CORRECTA)
                   ===================================================== */

                // Empleados permitidos (SUBQUERY SQL)

                var allowedEmployees =
                    q.Select(e => e.EmployeeId);

                // KeyReports permitidos (subquery)
                var allowedKeyReports =
                    _db.ScorefyTblEvaluationsGenerates
                        .AsNoTracking()
                        .Where(ev => allowedEmployees.Contains(ev.EmployeeId))
                        .Select(ev => ev.KeyReport);

                // 3.1️⃣ Último EventNumber por KeyReport
                var lastEventPerKeyReport =
                    _db.ScorefyTblExceptions
                        .AsNoTracking()
                        .Where(ex => allowedKeyReports.Contains(ex.KeyReport))
                        .GroupBy(ex => ex.KeyReport)
                        .Select(g => new
                        {
                            KeyReport = g.Key,
                            LastEventNumber = g.Max(x => x.EventNumber)
                        });

                // 3.2️⃣ Join contra la tabla de excepciones (equivale a Ex_Last)
                var openExceptions =
                    await (
                        from ex in _db.ScorefyTblExceptions.AsNoTracking()
                        join last in lastEventPerKeyReport
                            on new { ex.KeyReport, ex.EventNumber }
                            equals new { last.KeyReport, EventNumber = last.LastEventNumber }
                        where (ex.IsException ?? false)
                           && (ex.IsCurrent ?? false)
                        select ex
                    ).CountAsync(ct);



                /* =====================================================
                   4️⃣ RESULTADO
                   ===================================================== */
                res.Correct = true;
                res.Object = new
                {
                    pending,
                    completed,
                    total,
                    openExceptions
                };

                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error obteniendo Dashboard Summary");

                res.Correct = false;
                res.ErrorMessage = ex.Message;
                return res;
            }
        }

        public async Task<ML.Result> GetRecentActivityAsync(string email, int top = 10, CancellationToken ct = default)
        {
            var res = new ML.Result();

            try
            {
                // Seguridad
                var security = await _db.SecurityScorefies
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Email == email, ct);

                IQueryable<DL.VwEvaluaColabResume> q = _db.VwEvaluaColabResumes.AsNoTracking();

                // 1) Usuario SIN registro → solo lo suyo
                if (security == null)
                {
                    q = q.Where(r => r.CreatedBy == email);
                }
                else
                {
                    string role = (security.Role ?? "").Trim().ToUpperInvariant();
                    string userBu = (security.Bu ?? "").Trim().ToUpperInvariant();

                    // 2) ROL ALL → ve todo
                    if (role == "ALL")
                    {
                        // sin filtros
                    }
                    else if (role != "COMMITTE")
                    {
                        // 3) Tiene seguridad pero no es ALL → Solo su BU
                        q = q.Where(r => (r.Bu ?? "").ToUpper() == userBu);
                    }
                    else if (role == "COMMITTE")
                    {
                        // 3) Tiene seguridad pero no es ALL → Solo su BU
                        q = q.Where(r => r.CreatedBy == email);
                    }

                }

                // Orden y top
                var rows = await q
                    .OrderByDescending(r => r.ModifiedTime ?? r.CreatedTime)
                    .Take(top)
                    .Select(r => new
                    {
                        r.ClientName,
                        r.Role,
                        r.Bu,
                        r.ColumnC,
                        r.CreatedTime,
                        r.ModifiedTime,
                        r.IsClosed // <-- Asegúrate de que esté mapeado en la entidad
                    })
                    .ToListAsync(ct);

                // Proyección a DTO de dashboard
                var list = rows.Select((r, idx) =>
                {
                    // completed cuando IsClosed == 0
                    bool completed = (r.IsClosed ?? true) == false;

                    string status = completed ? "Completed" : "In Progress";
                    string color = completed ? "var(--pacific-blue)" : "var(--cobalt-blue)";

                    string dateText = (r.ModifiedTime ?? r.CreatedTime)?.ToString(
                        "d-MMMM-yyyy",
                        CultureInfo.InvariantCulture
                    ) ?? "Unknown";

                    return new
                    {
                        id = idx + 1,
                        title = $"{r.ClientName} — {r.Role}",
                        status,
                        completed,     // <-- nuevo campo solicitado
                        date = dateText,
                        color,
                        bu = r.Bu
                    };
                }).ToList();

                res.Correct = true;
                res.Object = list;
                return res;
            }
            catch (Exception ex)
            {
                res.Correct = false;
                res.ErrorMessage = ex.Message;
                res.Ex = ex;
                return res;
            }
        }

        public class ScorefyEmployeeVm
        {
            public int Employee_Id { get; set; }
            public string Full_Name { get; set; }
            public string Email_Address_Business { get; set; }
            public int TotalEvaluations { get; set; }
            public int CompletedEvaluations { get; set; }
            public int PendingEvaluations { get; set; }
            public string AllEvaluationsCompleted { get; set; }
            public int IsActive { get; set; }
            public string BU { get; set; }
            public string Segmento { get; set; }
        }

    }
}