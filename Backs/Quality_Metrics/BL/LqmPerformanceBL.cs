using System.Globalization;
using Microsoft.EntityFrameworkCore;

namespace BL
{
    public interface ILqmPerformanceBL
    {
        Task<ML.LqmPerformanceScopeDto> GetScopeAsync(string email, CancellationToken ct = default);
        Task<ML.LqmMetricsDto?> GetMetricsAsync(string email, string employeeId, CancellationToken ct = default);
        Task<bool> SaveMetricsAsync(string email, ML.LqmMetricsDto dto, CancellationToken ct = default);
    }

    public sealed class LqmPerformanceBL : ILqmPerformanceBL
    {
        private readonly DL.LeadershipQmContext _db;
        private const int FiscalYear = 2026;   // periodo activo

        public LqmPerformanceBL(DL.LeadershipQmContext db) => _db = db;

        private async Task<(string? myId, bool canSelect, string scope, List<DL.LqmTblLeaderDatum> people)>
            ResolveScopeAsync(string email, CancellationToken ct)
        {
            var norm = await ResolveEmailAsync(email, ct);

            var me = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.LeaderEmail != null && l.LeaderEmail.ToLower() == norm)
                .Select(l => new { l.LeaderEmployeeID, l.IsBupic, l.IsHofa, l.BusinessUnitIdLabel, l.AllowedOffices })
                .FirstOrDefaultAsync(ct);

            var myId    = me?.LeaderEmployeeID?.Trim();
            var offices = ParseOffices(me?.AllowedOffices);

            var role = await _db.LqmTblSecurities.AsNoTracking()
                .Where(s => s.UserEmail.ToLower() == norm)
                .Select(s => s.UserRole)
                .FirstOrDefaultAsync(ct);

            bool isAll   = (role ?? "").Trim().Equals("All", StringComparison.OrdinalIgnoreCase);
            bool isBuPic = me?.IsBupic == true;
            bool isHofA  = me?.IsHofa == true;
            bool canSelect = isAll || isBuPic || isHofA;
            string scope = (isAll || isHofA) ? "All" : isBuPic ? "Allegados" : "Self";

            List<DL.LqmTblLeaderDatum> people;

            if (isAll || isHofA)
            {
                // All y HofA ven a todos
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == LeaderFy)
                    .ToListAsync(ct);
            }
            else if (isBuPic)
            {
                var bu = (me?.BusinessUnitIdLabel ?? "").Trim();   // mi BU desde LeaderData (ej. "SF")
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == LeaderFy && l.BusinessUnitIdLabel == bu)
                    .ToListAsync(ct);

                // incluirme siempre, por si acaso
                if (!string.IsNullOrEmpty(myId) &&
                    !people.Any(p => (p.LeaderEmployeeID ?? "").Trim() == myId))
                {
                    var meRow = await _db.LqmTblLeaderData.AsNoTracking()
                        .FirstOrDefaultAsync(l => l.LeaderEmployeeID == myId, ct);
                    if (meRow != null) people.Insert(0, meRow);
                }
            }
            else
            {
                // partner/director normal: solo yo
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.LeaderEmployeeID == myId)
                    .ToListAsync(ct);
            }

            // Oficinas permitidas + solo Partners y Directores de Audit
            people = people
                .Where(p => InOffices(p.OfficeLabel, offices))
                .Where(InPerformanceScope)
                .ToList();

            return (myId, canSelect, scope, people);
        }



              public async Task<ML.LqmPerformanceScopeDto> GetScopeAsync(string email, CancellationToken ct = default)
        {
            var (myId, canSelect, scope, people) = await ResolveScopeAsync(email, ct);

            var ids = people.Select(p => (p.LeaderEmployeeID ?? "").Trim())
                            .Where(s => s != "").Distinct().ToList();

            var starts = await _db.LqmCatLeaderHours.AsNoTracking()
                .Where(h => h.Fy == "2026" && ids.Contains(h.LeaderEmployeeId))
                .Select(h => new { h.LeaderEmployeeId, h.JobEntryDate })
                .ToListAsync(ct);

            var startMap = starts
                .GroupBy(s => (s.LeaderEmployeeId ?? "").Trim())
                .ToDictionary(g => g.Key, g => g.First().JobEntryDate);

            // Si no soy Partner/Director de Audit no tengo formulario propio:
            // no me preselecciono (el front cae al primero de la lista).
            bool meInScope = !string.IsNullOrEmpty(myId) && ids.Contains(myId);

            return new ML.LqmPerformanceScopeDto
            {
                MyEmployeeId   = meInScope ? myId : null,      // ← único cambio
                CanSelectUsers = canSelect,
                Scope          = scope,
                People = people
                    .OrderBy(p => p.LeaderName)
                    .Select(p =>
                    {
                        var id = (p.LeaderEmployeeID ?? "").Trim();
                        startMap.TryGetValue(id, out var start);
                        return new ML.LqmPersonDto
                        {
                            EmployeeId   = id,
                            Name         = p.LeaderName,
                            Title        = p.LeaderTitle,
                            Practice     = p.Practice,
                            BusinessUnit = p.BusinessUnitIdLabel,
                            Office       = p.OfficeLabel,
                            TenureYears  = YearsSince(start),     // ← de job_EntryDate, no de EmployeeData
                            Photo        = null,
                        };
                    })
                    .ToList(),
            };
        }


                private const string LeaderFy = "2026";   // FiscalYearLabel de LeaderData es texto

        // El formulario de Performance es solo para Partners y Directores de Audit
        private static bool IsPartnerOrDirector(string? title)
        {
            var t = (title ?? "").ToLower();
            return t.Contains("partner") || t.Contains("director");
        }
        private static bool IsAudit(string? practice) =>
            (practice ?? "").Trim().Equals("Audit", StringComparison.OrdinalIgnoreCase);

        private static bool InPerformanceScope(DL.LqmTblLeaderDatum p) =>
            IsPartnerOrDirector(p.LeaderTitle)
            && IsAudit(p.Practice)
            && p.IsBupic != true;        // ← BU PICs (IsBUPIC = 1) NO llenan Performance



        public async Task<ML.LqmMetricsDto?> GetMetricsAsync(string email, string employeeId, CancellationToken ct = default)
        {
            var target = (employeeId ?? "").Trim();
            if (!await IsInScopeAsync(email, target, ct)) return null;

            var m = await _db.LqmTblPenOneMetrics.AsNoTracking()
                .FirstOrDefaultAsync(x => x.EmployeeId == target && x.FiscalYearLabel == FiscalYear, ct);

            return new ML.LqmMetricsDto
            {
                EmployeeId                    = target,
                FiscalYearLabel               = FiscalYear,
                OpenPD                        = m?.OpenPD,
                ClientsGainedText             = m?.ClientsGainedText,
                ClientsLostText               = m?.ClientsLostText,
                KeyActivitiesAssignments      = m?.KeyActivitiesAssignments,
                AcademicTeachingInstitution   = m?.AcademicTeachingInstitution,
                AdvancedDegreesCertifications = m?.AdvancedDegreesCertifications,
                IsAdvanceCapabilitiesUsed     = m?.IsAdvanceCapabilitiesUsed ?? false,
                IsMapJeUsed                   = m?.IsMapJeUsed ?? false,
                IsDatasnipperFssUsed          = m?.IsDatasnipperFssUsed ?? false,
                IsKcwRolloverUsed             = m?.IsKcwRolloverUsed ?? false,
            };
        }

        public async Task<bool> SaveMetricsAsync(string email, ML.LqmMetricsDto dto, CancellationToken ct = default)
        {
            var target = (dto.EmployeeId ?? "").Trim();
            if (!await IsInScopeAsync(email, target, ct)) return false;

            var norm = (email ?? "").Trim().ToLower();
            var now  = DateTime.Now;

            var m = await _db.LqmTblPenOneMetrics
                .FirstOrDefaultAsync(x => x.EmployeeId == target && x.FiscalYearLabel == FiscalYear, ct);

            if (m == null)
            {
                m = new DL.LqmTblPenOneMetric
                {
                    EmployeeId         = target,
                    FiscalYearLabel    = FiscalYear,
                    CreatedByUserEmail = norm,
                    CreatedDateTime    = now,
                };
                _db.LqmTblPenOneMetrics.Add(m);
            }

            // columnas NOT NULL -> nunca null, mandamos "" si viene vacío
            m.OpenPD                        = dto.OpenPD ?? "";
            m.ClientsGainedText             = dto.ClientsGainedText ?? "";
            m.ClientsLostText               = dto.ClientsLostText ?? "";
            m.KeyActivitiesAssignments      = dto.KeyActivitiesAssignments ?? "";
            m.AcademicTeachingInstitution   = dto.AcademicTeachingInstitution ?? "";
            m.AdvancedDegreesCertifications = dto.AdvancedDegreesCertifications ?? "";
            m.IsAdvanceCapabilitiesUsed     = dto.IsAdvanceCapabilitiesUsed;
            m.IsMapJeUsed                   = dto.IsMapJeUsed;
            m.IsDatasnipperFssUsed          = dto.IsDatasnipperFssUsed;
            m.IsKcwRolloverUsed             = dto.IsKcwRolloverUsed;
            m.UpdatedByUserEmail            = norm;
            m.UpdatedDateTime               = now;

            await _db.SaveChangesAsync(ct);
            return true;
        }

        private async Task<bool> IsInScopeAsync(string email, string employeeId, CancellationToken ct)
        {
            var (_, _, _, people) = await ResolveScopeAsync(email, ct);
            return people.Any(p => (p.LeaderEmployeeID ?? "").Trim() == employeeId);
        }

                private static int? YearsSince(DateTime? d)
        {
            if (d is null) return null;
            var today = DateTime.Today;
            var years = today.Year - d.Value.Year;
            if (d.Value.Date > today.AddYears(-years)) years--;
            return years < 0 ? 0 : years;
        }

                // Windows Auth (Negotiate) puede entregar "DOMINIO\networkId" en vez del UPN (correo).
        // Si no llega un correo, lo traducimos con Network_Id de LeaderData.
        private async Task<string> ResolveEmailAsync(string? raw, CancellationToken ct)
        {
            var s = (raw ?? "").Trim();
            if (s.Length == 0) return "";
            if (s.Contains('@')) return s.ToLower();                 // ya es correo (UPN)

            var nid = (s.Contains('\\') ? s[(s.IndexOf('\\') + 1)..] : s).Trim();   // quita "DOMINIO\"
            if (nid.Length == 0) return "";

            var email = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.NetworkId != null && l.NetworkId.ToLower() == nid.ToLower())
                .Select(l => l.LeaderEmail)
                .FirstOrDefaultAsync(ct);

            return (email ?? "").Trim().ToLower();
        }
        // "Mexico, Queretaro,Aguascalientes" → ["Mexico","Queretaro","Aguascalientes"]
        private static List<string> ParseOffices(string? raw) =>
            (raw ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                .ToList();

        // Lista vacía = sin restricción (ve todas las oficinas)
        private static bool InOffices(string? office, List<string> allowed) =>
            allowed.Count == 0 ||
            allowed.Any(a => string.Equals(a, (office ?? "").Trim(), StringComparison.OrdinalIgnoreCase));




  
    }
}
