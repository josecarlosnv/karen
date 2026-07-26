using Microsoft.EntityFrameworkCore;

namespace BL
{
    public interface ILqmQualificationsBL
    {
        Task<ML.LqmQualScopeDto> GetScopeAsync(string email, CancellationToken ct = default);
        Task<ML.LqmQualScopeDto> GetHofaScopeAsync(string email, CancellationToken ct = default);
        Task<List<ML.LqmPersonDto>> GetBuPeopleAsync(string email, string bupicEmployeeId, CancellationToken ct = default);
        Task<ML.LqmQualificationsDto?> GetAsync(string email, string employeeId, string applicableTo, CancellationToken ct = default);
        Task<bool> SaveAsync(string email, string employeeId, string applicableTo, ML.LqmQualificationSaveDto dto, CancellationToken ct = default);
        Task<ML.LqmWorkloadDto> GetWorkloadAsync(string email, string bupicEmployeeId, CancellationToken ct = default);
        Task<bool> SaveWaiverAsync(string email, string employeeId, string waiver, CancellationToken ct = default);
        Task<List<ML.LqmHofaReportRowDto>> GetHofaReportAsync(string email, CancellationToken ct = default);
        Task<List<ML.LqmHofaReportRowDto>> GetPydReportAsync(string email, CancellationToken ct = default);

    }



    public sealed class LqmQualificationsBL : ILqmQualificationsBL
    {
        private readonly DL.LeadershipQmContext _db;
        private const string FiscalYear   = "2026";   // periodo activo (PenTwo)
        private const string ApplicablePyD  = "PyD";
        private const string ApplicableHofa = "HOFA";

        public LqmQualificationsBL(DL.LeadershipQmContext db) => _db = db;

        // Seguridad del usuario (mismo criterio que Performance)
        private async Task<(bool isAll, bool isBuPic, bool isHofA, string? myId, string? bu, string? office, List<string> offices)>
            ResolveAsync(string email, CancellationToken ct)
        {
            var norm = await ResolveEmailAsync(email, ct);     // ← Parte 1

            var me = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.LeaderEmail != null && l.LeaderEmail.ToLower() == norm)
                .Select(l => new
                {
                    l.LeaderEmployeeID,
                    l.IsBupic,
                    l.IsHofa,
                    l.BusinessUnitIdLabel,
                    l.OfficeLabel,
                    l.AllowedOffices,          // ← nuevo
                })
                .FirstOrDefaultAsync(ct);

            var role = await _db.LqmTblSecurities.AsNoTracking()
                .Where(s => s.UserEmail.ToLower() == norm)
                .Select(s => s.UserRole)
                .FirstOrDefaultAsync(ct);

            bool isAll   = (role ?? "").Trim().Equals("All", StringComparison.OrdinalIgnoreCase);
            bool isBuPic = me?.IsBupic == true;
            bool isHofA  = me?.IsHofa == true;

            return (isAll, isBuPic, isHofA,
                    me?.LeaderEmployeeID?.Trim(),
                    me?.BusinessUnitIdLabel?.Trim(),
                    me?.OfficeLabel?.Trim(),
                    ParseOffices(me?.AllowedOffices));      // ← nuevo
        }


        private static ML.LqmPersonDto ToPersonDto(DL.LqmTblLeaderDatum p) => new()
        {
            EmployeeId   = (p.LeaderEmployeeID ?? "").Trim(),
            Name         = p.LeaderName,
            Title        = p.LeaderTitle,
            Practice     = p.Practice,
            BusinessUnit = p.BusinessUnitIdLabel,
            Office       = p.OfficeLabel,
            TenureYears  = null,
            Photo        = null,
        };

        private static string CategoryFromTitle(string? title)
        {
            var t = (title ?? "").ToLower();
            if (t.Contains("director")) return "Director";
            if (t.Contains("senior manager")) return "Senior Manager";
            if (t.Contains("manager")) return "Manager";
            return "Partner";
        }


        // ¿Puedo VER a este BU PIC en Head of Audit?
        private async Task<bool> CanViewHofaAsync(
            string employeeId,
            (bool isAll, bool isBuPic, bool isHofA, string? myId, string? bu, string? office, List<string> offices) acc,
            CancellationToken ct)
        {
            var target = (employeeId ?? "").Trim();

            // el objetivo debe ser BU PIC
            var t = await _db.LqmTblLeaderData.AsNoTracking()
                .FirstOrDefaultAsync(l => l.LeaderEmployeeID == target && l.IsBupic == true, ct);
            if (t == null) return false;

            if (acc.myId == target) return true;   // ← siempre puedo verme a mí mismo

            // si tengo oficinas limitadas, solo BU PICs de esas oficinas
            if (!InOffices(t.OfficeLabel, acc.offices)) return false;


            if (acc.isAll || acc.isHofA) return true;      // HofA/All ven a cualquier BU PIC
            if (acc.isBuPic) return acc.myId == target;    // BU PIC: solo él mismo
            return false;
        }


        // ¿Puedo VER a esta persona? (yo mismo / mi BU si soy BUPIC/HofA / todos si soy All)
        private async Task<bool> CanViewAsync(
            string employeeId,
            (bool isAll, bool isBuPic, bool isHofA, string? myId, string? bu, string? office, List<string> offices) acc,
            CancellationToken ct)
        {
            var target = (employeeId ?? "").Trim();
            if (!string.IsNullOrEmpty(acc.myId) && acc.myId == target) return true;   // siempre a mí mismo

            if (acc.isAll || acc.isHofA)                          // ← + isHofA
            {
                if (acc.offices.Count == 0) return true;
                var a = await _db.LqmTblLeaderData.AsNoTracking()
                    .FirstOrDefaultAsync(l => l.LeaderEmployeeID == target, ct);
                return a != null && InOffices(a.OfficeLabel, acc.offices);
            }

            // BU PIC: cualquiera de su unidad de negocio, dentro de sus oficinas
            if (acc.isBuPic)                                      // ← ya sin isHofA
            {
                var p = await _db.LqmTblLeaderData.AsNoTracking()
                    .FirstOrDefaultAsync(l => l.LeaderEmployeeID == target
                                           && l.BusinessUnitIdLabel == acc.bu, ct);
                return p != null && InOffices(p.OfficeLabel, acc.offices);
            }

            return false;   // partner/director normal: solo su propia info
        }


                public async Task<ML.LqmQualScopeDto> GetHofaScopeAsync(string email, CancellationToken ct = default)
        {
            var acc = await ResolveAsync(email, ct);

            List<DL.LqmTblLeaderDatum> people;
            bool canSelect;

            if (acc.isAll || acc.isHofA)
            {
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == FiscalYear && l.IsBupic == true)
                    .ToListAsync(ct);
                canSelect = true;
            }
            else if (acc.isBuPic)
            {
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.LeaderEmployeeID == acc.myId && l.IsBupic == true)
                    .ToListAsync(ct);
                canSelect = false;
            }
            else
            {
                people = new();
                canSelect = false;
            }

            people = people.Where(p => (p.LeaderEmployeeID ?? "").Trim() == acc.myId
                                    || InOffices(p.OfficeLabel, acc.offices)).ToList();

            var ordered = people.OrderBy(p => p.LeaderName).ToList();


            var def = ordered.FirstOrDefault(p => (p.LeaderEmployeeID ?? "").Trim() == acc.myId)?.LeaderEmployeeID?.Trim()
                      ?? ordered.FirstOrDefault()?.LeaderEmployeeID?.Trim();

            return new ML.LqmQualScopeDto
            {
                CanSelectUsers    = canSelect,
                DefaultEmployeeId = def,
                People            = ordered.Select(ToPersonDto).ToList(),
            };
        }


        public async Task<List<ML.LqmPersonDto>> GetBuPeopleAsync(string email, string bupicEmployeeId, CancellationToken ct = default)
        {
            var acc = await ResolveAsync(email, ct);
            var target = (bupicEmployeeId ?? "").Trim();

            if (!await CanViewHofaAsync(target, acc, ct)) return new();

            var bu = (await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.LeaderEmployeeID == target)
                .Select(l => l.BusinessUnitIdLabel)
                .FirstOrDefaultAsync(ct))?.Trim();
            if (string.IsNullOrEmpty(bu)) return new();

            var people = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.FiscalYearLabel == FiscalYear
                         && l.BusinessUnitIdLabel == bu
                         && (l.IsHofa == null || l.IsHofa == false)
                         && (l.IsBupic == null || l.IsBupic == false))
                .OrderBy(l => l.LeaderName)
                .ToListAsync(ct);

            return people
                .Where(p => InOffices(p.OfficeLabel, acc.offices))    // ← AGREGA ESTA LÍNEA
                .Select(ToPersonDto)
                .ToList();
        }

        public async Task<ML.LqmQualScopeDto> GetScopeAsync(string email, CancellationToken ct = default)
        {
            var acc = await ResolveAsync(email, ct);
            bool canSelect = acc.isAll || acc.isBuPic || acc.isHofA;

            List<DL.LqmTblLeaderDatum> people;

            if (acc.isAll || acc.isHofA)
            {
                // todos los P&D: sin HofA ni BU PIC, excluyéndome
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == FiscalYear
                             && (l.IsHofa == null || l.IsHofa == false)
                             && (l.IsBupic == null || l.IsBupic == false)
                             && l.LeaderEmployeeID != acc.myId)
                    .ToListAsync(ct);
            }

            else if (acc.isBuPic)

            {
                // mi BU: partners/directores sin HofA ni BU PIC, excluyéndome
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == FiscalYear
                             && l.BusinessUnitIdLabel == acc.bu
                             && (l.IsHofa == null || l.IsHofa == false)
                             && (l.IsBupic == null || l.IsBupic == false)
                             && l.LeaderEmployeeID != acc.myId)
                    .ToListAsync(ct);
            }

            else
            {
                // partner/director normal: solo yo
                people = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.LeaderEmployeeID == acc.myId)
                    .ToListAsync(ct);
            }

            people = people.Where(p => InOffices(p.OfficeLabel, acc.offices)).ToList();   // ← AGREGA ESTA

            var ordered = people.OrderBy(p => p.LeaderName).ToList();


            return new ML.LqmQualScopeDto
            {
                CanSelectUsers    = canSelect,
                DefaultEmployeeId = ordered.FirstOrDefault()?.LeaderEmployeeID?.Trim(),
                People = ordered.Select(p => new ML.LqmPersonDto
                {
                    EmployeeId   = (p.LeaderEmployeeID ?? "").Trim(),
                    Name         = p.LeaderName,
                    Title        = p.LeaderTitle,
                    Practice     = p.Practice,
                    BusinessUnit = p.BusinessUnitIdLabel,
                    Office       = p.OfficeLabel,
                    TenureYears  = null,
                    Photo        = null,
                }).ToList(),
            };
        }


        public async Task<ML.LqmQualificationsDto?> GetAsync(string email, string employeeId, string applicableTo, CancellationToken ct = default)
        {
            var target = (employeeId ?? "").Trim();
            var acc = await ResolveAsync(email, ct);

            bool canView = applicableTo == ApplicableHofa
                ? await CanViewHofaAsync(target, acc, ct)
                : await CanViewAsync(target, acc, ct);
            if (!canView) return null;

            var leader = await _db.LqmTblLeaderData.AsNoTracking()
                .FirstOrDefaultAsync(l => l.LeaderEmployeeID == target, ct);
            if (leader?.LeaderDataUniqueKey == null) return null;

            var leaderKey = leader.LeaderDataUniqueKey.Trim();
            var leaderOffices = ParseOffices(leader.AllowedOffices);   // ← oficinas del líder visto
            bool irm = IsIrm(leader.BusinessUnitIdLabel);
            bool canEditWaiver = acc.isAll || acc.isBuPic || acc.isHofA;

            // IRM: solo indicadores IsIRMApplied CON IRMMaxMeasure; los demás todos los de su ApplicableTo
            var cat = (await _db.LqmCatIndicatorsPenTwos.AsNoTracking()
                .Where(c => c.Fy == FiscalYear && c.ApplicableTo == applicableTo
                         && (!irm || c.IsIrmApplied))
                .OrderBy(c => c.IndicatorsUniqueId)
                .ToListAsync(ct))
                .Where(c => !irm || AppliesToIrm(c))     // ← descarta IRMMaxMeasure NULL
                .ToList();


            var quals = await _db.LqmTblQualificationsPenTwos.AsNoTracking()
                .Where(q => q.LeaderDataUniqueKey == leaderKey)
                .ToListAsync(ct);

            var qualByKey = quals
                .GroupBy(q => (q.IndicatorsUniqueKey ?? "").Trim())
                .ToDictionary(g => g.Key, g => g.First());

            var indicators = cat.Select(c =>
            {
                var key = (c.IndicatorsUniqueKey ?? "").Trim();
                qualByKey.TryGetValue(key, out var q);
                var maxM = irm ? c.IrmMaxMeasure : c.MaxMeasure;   // IRM usa IRMMaxMeasure
                return new ML.LqmIndicatorDto
                {
                    CatIndicatorsKey     = c.CatIndicatorsKey,
                    IndicatorsUniqueKey  = key,
                    IndicatorLabel       = c.IndicatorLabel,
                    MeasureDescription   = irm ? (c.IrmMeasure ?? c.MeasureDescription) : c.MeasureDescription,
                    IndicatorDescription = c.IndicatorDescription,
                    SourceLabel          = c.SourceLabel,
                    MaxMeasure           = maxM,
                    Target = irm ? IrmTarget(maxM) : PydTargetFor(c),
                    CanEdit              = CanEditIndicator(c.IndicatorsUniqueId, applicableTo, acc.isAll, acc.isBuPic, acc.isHofA),
                    Score                = q?.QualificationScore ?? 0m,
                    CurrentPerformance   = q?.QualificationDescription,
                    Message              = q?.QualificationMessage,
                };
            }).ToList();

            // 115/116 se CALCULAN desde complianceValidation (no se leen de qualifications)
            if (applicableTo == ApplicableHofa &&
                indicators.Any(i => (i.IndicatorsUniqueKey ?? "").StartsWith("115-")
                                 || (i.IndicatorsUniqueKey ?? "").StartsWith("116-")))
            {
                var (pdPct, mgrPct) = await WorkloadCompliancesAsync(leader.BusinessUnitIdLabel, leaderOffices, ct);
                ApplyWorkloadScores(indicators, pdPct, mgrPct);
            }

            // 113/114/118/119: si el score está NULL, se CALCULA del PyD de la BU (si tiene valor, manda el manual)
            if (applicableTo == ApplicableHofa &&
                indicators.Any(i => HofaFromPyd.ContainsKey(UidOf(i.IndicatorsUniqueKey))
                                 && (!qualByKey.TryGetValue(i.IndicatorsUniqueKey, out var qq) || qq.QualificationScore == null)))
            {
                var calcs = await HofaCalcsAsync(leader.BusinessUnitIdLabel, leaderOffices, ct);
                foreach (var ind in indicators)
                {
                    int uid = UidOf(ind.IndicatorsUniqueKey);
                    if (!HofaFromPyd.ContainsKey(uid)) continue;
                    bool hasManual = qualByKey.TryGetValue(ind.IndicatorsUniqueKey, out var q2) && q2.QualificationScore != null;
                    if (!hasManual) ind.Score = calcs[uid];
                }
            }


            return new ML.LqmQualificationsDto


            {
                EmployeeId          = target,
                LeaderDataUniqueKey = leaderKey,
                Fy                  = FiscalYear,
                CanEdit             = indicators.Any(i => i.CanEdit),
                CanEditWaiver       = canEditWaiver,
                TotalScore          = indicators.Sum(i => i.Score),
                Indicators          = indicators,
            };
        }


        // ── HOFA calculadas desde el % "on track" de la métrica PyD equivalente ──
        private static readonly System.Collections.Generic.Dictionary<int, int> HofaFromPyd = new()
        {
            [113] = 101, [114] = 105, [118] = 110, [119] = 111,
        };

        // "115-2026" → 115
        private static int UidOf(string? key) =>
            int.TryParse((key ?? "").Split('-')[0], out var n) ? n : 0;

        // ¿está "on track" (verde)? mismo criterio que el semáforo del front
        private static bool IsGreen(decimal score, decimal target, decimal? cap)
        {
            if (cap.HasValue && cap.Value < 0m) return score >= 0m;   // penalizador
            if (score <= 0m) return target <= 0m;
            return score >= target;
        }

        // escalón por métrica HOFA (recibe el % on track del PyD source)
        private static decimal HofaStep(int hofaUid, decimal onTrackPct)
        {
            if (hofaUid == 113)                       // invertida: % Not Compliant
            {
                var nc = 100m - onTrackPct;
                if (nc <= 20m) return 2m;
                if (nc <= 25m) return 1m;
                return 0m;
            }
            decimal max = hofaUid == 114 ? 1m : 2m;   // 118/119 → 2 · 114 → 1
            decimal mid = hofaUid == 114 ? 0.5m : 1m;
            if (onTrackPct < 80m) return 0m;
            if (onTrackPct < 90m) return mid;
            return max;
        }

        // Calcula 113/114/118/119 para una BU (P&D de la BU con filtro de oficinas)
        private async Task<System.Collections.Generic.Dictionary<int, decimal>> HofaCalcsAsync(
            string? bu, System.Collections.Generic.List<string> offices, CancellationToken ct)
        {
            var result = new System.Collections.Generic.Dictionary<int, decimal>
                { [113] = 0m, [114] = 0m, [118] = 0m, [119] = 0m };
            if (string.IsNullOrWhiteSpace(bu)) return result;

            bool irm = IsIrm(bu);

            // P&D de la BU (los mismos de view report PyD)
            var pd = (await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.FiscalYearLabel == FiscalYear && l.BusinessUnitIdLabel == bu
                         && (l.IsHofa == null || l.IsHofa == false)
                         && (l.IsBupic == null || l.IsBupic == false))
                .Select(l => new { l.LeaderDataUniqueKey, l.OfficeLabel })
                .ToListAsync(ct))
                .Where(x => InOffices(x.OfficeLabel, offices)).ToList();
            if (pd.Count == 0) return result;

            var pdKeys = pd.Select(x => (x.LeaderDataUniqueKey ?? "").Trim())
                           .Where(s => s != "").ToList();

            // catálogo de las 4 métricas PyD source (para target/cap)
            var pydUids = HofaFromPyd.Values.ToList();
            var cat = await _db.LqmCatIndicatorsPenTwos.AsNoTracking()
                .Where(c => c.Fy == FiscalYear && c.ApplicableTo == ApplicablePyD
                         && pydUids.Contains(c.IndicatorsUniqueId))
                .ToListAsync(ct);

            var pydKeys = cat.Select(c => (c.IndicatorsUniqueKey ?? "").Trim()).ToList();
            var quals = await _db.LqmTblQualificationsPenTwos.AsNoTracking()
                .Where(q => pdKeys.Contains(q.LeaderDataUniqueKey) && pydKeys.Contains(q.IndicatorsUniqueKey))
                .Select(q => new { q.LeaderDataUniqueKey, q.IndicatorsUniqueKey, q.QualificationScore })
                .ToListAsync(ct);

            var scoreMap = quals
                .GroupBy(q => (q.LeaderDataUniqueKey ?? "").Trim())
                .ToDictionary(g => g.Key, g => g
                    .GroupBy(x => (x.IndicatorsUniqueKey ?? "").Trim())
                    .ToDictionary(gg => gg.Key, gg => gg.First().QualificationScore ?? 0m));

            foreach (var kv in HofaFromPyd)
            {
                var c = cat.FirstOrDefault(x => x.IndicatorsUniqueId == kv.Value);
                if (c == null) continue;

                var pydKey = (c.IndicatorsUniqueKey ?? "").Trim();
                var maxM   = irm ? c.IrmMaxMeasure : c.MaxMeasure;
                var cap    = ParseMaxMeasure(maxM);
                var target = irm ? IrmTarget(maxM) : PydTargetFor(c);

                int green = 0;
                foreach (var key in pdKeys)
                {
                    decimal sc = 0m;
                    if (scoreMap.TryGetValue(key, out var byInd) && byInd.TryGetValue(pydKey, out var v)) sc = v;
                    if (IsGreen(sc, target, cap)) green++;
                }
                decimal onTrack = (decimal)green / pdKeys.Count * 100m;
                result[kv.Key] = HofaStep(kv.Key, onTrack);
            }

            return result;
        }



        public async Task<bool> SaveAsync(string email, string employeeId, string applicableTo, ML.LqmQualificationSaveDto dto, CancellationToken ct = default)
        {
            var target = (employeeId ?? "").Trim();
            var acc = await ResolveAsync(email, ct);

            bool canView = applicableTo == ApplicableHofa
                ? await CanViewHofaAsync(target, acc, ct)
                : await CanViewAsync(target, acc, ct);
            if (!canView) return false;

            var leader = await _db.LqmTblLeaderData.AsNoTracking()
                .FirstOrDefaultAsync(l => l.LeaderEmployeeID == target, ct);
            if (leader?.LeaderDataUniqueKey == null) return false;
            var leaderKey = leader.LeaderDataUniqueKey.Trim();
            bool irm = IsIrm(leader.BusinessUnitIdLabel);

            var indKey = (dto.IndicatorsUniqueKey ?? "").Trim();
            if (indKey == "") return false;

            var cat = await _db.LqmCatIndicatorsPenTwos.AsNoTracking()
                .FirstOrDefaultAsync(c => c.IndicatorsUniqueKey == indKey && c.ApplicableTo == applicableTo, ct);
            if (cat == null) return false;
            if (irm && !AppliesToIrm(cat)) return false;   // un IRM no puede guardar métricas que no le aplican

            // 115/116 son automáticos (se calculan de complianceValidation) → no se guardan a mano
            if (cat.IndicatorsUniqueId == 115 || cat.IndicatorsUniqueId == 116) return false;


            if (!CanEditIndicator(cat.IndicatorsUniqueId, applicableTo, acc.isAll, acc.isBuPic, acc.isHofA))
                return false;

            var maxM = irm ? cat.IrmMaxMeasure : cat.MaxMeasure;      // IRM usa IRMMaxMeasure
            var score = ClampToCap(dto.Score, ParseMaxMeasure(maxM));

            var norm = (email ?? "").Trim().ToLower();
            var now  = DateTime.Now;

            var row = await _db.LqmTblQualificationsPenTwos
                .FirstOrDefaultAsync(q => q.LeaderDataUniqueKey == leaderKey
                                       && q.IndicatorsUniqueKey == indKey, ct);

            if (row == null)
            {
                row = new DL.LqmTblQualificationsPenTwo
                {
                    LeaderDataUniqueKey = leaderKey,
                    IndicatorsUniqueKey = indKey,
                    QualificationScore  = score,
                    CreatedByUserEmail  = norm,
                    CreatedDateTime     = now,
                };
                _db.LqmTblQualificationsPenTwos.Add(row);
            }
            else
            {
                row.QualificationScore = score;
                row.UpdatedByUserEmail = norm;
                row.UpdatedDateTime    = now;
            }

            await _db.SaveChangesAsync(ct);
            return true;
        }


                private static decimal? ParseMaxMeasure(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return null;
            var s = raw.Replace("%", "").Replace(",", ".").Trim();
            return decimal.TryParse(s, System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture, out var v) ? v : (decimal?)null;
        }

        // cap < 0  -> rango [cap, 0]   (penalización)
        // cap > 0  -> rango [0, cap]   (bono)
        private static decimal ClampToCap(decimal score, decimal? cap)
        {
            if (cap is null || cap == 0m) return score;
            return cap < 0m
                ? Math.Max(cap.Value, Math.Min(0m, score))
                : Math.Min(cap.Value, Math.Max(0m, score));
        }

                public async Task<ML.LqmWorkloadDto> GetWorkloadAsync(string email, string bupicEmployeeId, CancellationToken ct = default)
        {
            var acc = await ResolveAsync(email, ct);
            var target = (bupicEmployeeId ?? "").Trim();
            if (!await CanViewHofaAsync(target, acc, ct)) return new();

            var leaderRow = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.LeaderEmployeeID == target)
                .Select(l => new { l.BusinessUnitIdLabel, l.AllowedOffices })
                .FirstOrDefaultAsync(ct);
            var bu = leaderRow?.BusinessUnitIdLabel?.Trim();
            if (string.IsNullOrEmpty(bu)) return new();
            var leaderOffices = ParseOffices(leaderRow?.AllowedOffices);   // ← oficinas del líder visto

            // Socios y directores de la BU
            var pd = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.FiscalYearLabel == FiscalYear
                         && l.BusinessUnitIdLabel == bu
                         && (l.IsHofa == null || l.IsHofa == false)
                         && (l.IsBupic == null || l.IsBupic == false))
                .ToListAsync(ct);

            // Gerentes de la BU
            var mgrs = await _db.LqmCatManagerData.AsNoTracking()
                .Where(m => m.Fy == FiscalYear && m.BusinessUnitIdLabel == bu)
                .ToListAsync(ct);

            pd   = pd.Where(p => InOffices(p.OfficeLabel, leaderOffices)).ToList();
            mgrs = mgrs.Where(m => InOffices(m.OfficeLabel, leaderOffices)).ToList();


            // Horas (todas viven en LeaderHours, por employeeID)
            var ids = pd.Select(p => (p.LeaderEmployeeID ?? "").Trim())
                        .Concat(mgrs.Select(m => (m.ManagerEmployeeId ?? "").Trim()))
                        .Where(s => s != "").Distinct().ToList();

            var hoursById = (await _db.LqmCatLeaderHours.AsNoTracking()
                    .Where(h => h.Fy == FiscalYear && ids.Contains(h.LeaderEmployeeId))
                    .ToListAsync(ct))
                .GroupBy(h => (h.LeaderEmployeeId ?? "").Trim())
                .ToDictionary(g => g.Key, g => g.First());

            ML.LqmWorkloadPersonDto ToWl(string id, string? name, string? title, string category)
            {
                hoursById.TryGetValue(id, out var h);
                return new ML.LqmWorkloadPersonDto
                {
                    EmployeeId  = id,
                    Name        = name,
                    Title       = title,
                    Category    = category,
                    TotalHours  = h?.TotalHours,
                    HoursTarget = h?.HoursTarget,
                    Waiver      = h?.Waiver?.Trim(),
                    ComplianceValidation = h?.ComplianceValidation,
                };
            }

            return new ML.LqmWorkloadDto
            {
                PartnersDirectors = pd.OrderBy(p => p.LeaderName)
                    .Select(p => ToWl((p.LeaderEmployeeID ?? "").Trim(), p.LeaderName, p.LeaderTitle,
                                      CategoryFromTitle(p.LeaderTitle)))
                    .ToList(),
                Managers = mgrs.OrderBy(m => m.ManagerName)
                    .Select(m => ToWl((m.ManagerEmployeeId ?? "").Trim(), m.ManagerName, m.ManagerTitle, "Manager"))
                    .ToList(),
            };
        }

        public async Task<bool> SaveWaiverAsync(string email, string employeeId, string waiver, CancellationToken ct = default)
        {
            var acc = await ResolveAsync(email, ct);
            bool canEdit = acc.isAll || acc.isBuPic || acc.isHofA;
            if (!canEdit) return false;

            var target = (employeeId ?? "").Trim();
            var w = (waiver ?? "").Trim();
            if (w != "Yes" && w != "No") return false;

            // BU de la persona (socio/director o gerente)
            var personBu = (await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.LeaderEmployeeID == target)
                    .Select(l => l.BusinessUnitIdLabel).FirstOrDefaultAsync(ct))?.Trim()
                ?? (await _db.LqmCatManagerData.AsNoTracking()
                    .Where(m => m.ManagerEmployeeId == target)
                    .Select(m => m.BusinessUnitIdLabel).FirstOrDefaultAsync(ct))?.Trim();
            if (string.IsNullOrEmpty(personBu)) return false;

            // BU PIC solo su BU; HofA/All cualquiera
            if (!acc.isAll && !acc.isHofA &&
                (!acc.isBuPic || !string.Equals(personBu, acc.bu, StringComparison.OrdinalIgnoreCase)))
                return false;

            var row = await _db.LqmCatLeaderHours
                .FirstOrDefaultAsync(h => h.LeaderEmployeeId == target && h.Fy == FiscalYear, ct);
            if (row == null) return false;

            bool wasWaived = string.Equals((row.Waiver ?? "").Trim(), "Yes", StringComparison.OrdinalIgnoreCase);

            if (w == "Yes")
            {
                // solo se perdona a quien NO cumple (cv = 2). Un 1 o 3-natural ya cumple.
                if (row.ComplianceValidation != 2) return false;
                row.ComplianceValidation = 3;   // 2 → 3 por waiver
                row.Waiver = "Yes";
            }
            else // "No"
            {
                // revierte 3 → 2 SOLO si ese 3 vino de un waiver (un 3 natural nunca se toca)
                if (wasWaived && row.ComplianceValidation == 3) row.ComplianceValidation = 2;
                row.Waiver = "No";
            }

            await _db.SaveChangesAsync(ct);
            return true;

        }

        public async Task<List<ML.LqmHofaReportRowDto>> GetHofaReportAsync(string email, CancellationToken ct = default)
        {

            var hofaCalcCache = new Dictionary<string, Dictionary<int, decimal>>(StringComparer.OrdinalIgnoreCase);

            var acc = await ResolveAsync(email, ct);
            if (!acc.isAll && !acc.isHofA && !acc.isBuPic) return new();

            var bupics = (acc.isAll || acc.isHofA)
                ? await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == FiscalYear && l.IsBupic == true).ToListAsync(ct)
                : await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.LeaderEmployeeID == acc.myId && l.IsBupic == true).ToListAsync(ct);

            bupics = bupics.Where(b => (b.LeaderEmployeeID ?? "").Trim() == acc.myId
                                    || InOffices(b.OfficeLabel, acc.offices)).ToList();

            // catálogo HOFA completo (se filtra por líder si es IRM)
            var cat = await _db.LqmCatIndicatorsPenTwos.AsNoTracking()
                .Where(c => c.Fy == FiscalYear && c.ApplicableTo == ApplicableHofa)
                .OrderBy(c => c.IndicatorsUniqueId).ToListAsync(ct);

            var keys = bupics.Select(b => (b.LeaderDataUniqueKey ?? "").Trim()).Where(s => s != "").ToList();
            var byLeader = (await _db.LqmTblQualificationsPenTwos.AsNoTracking()
                    .Where(q => keys.Contains(q.LeaderDataUniqueKey)).ToListAsync(ct))
                .GroupBy(q => (q.LeaderDataUniqueKey ?? "").Trim())
                .ToDictionary(g => g.Key, g => g
                    .GroupBy(x => (x.IndicatorsUniqueKey ?? "").Trim())
                    .ToDictionary(gg => gg.Key, gg => gg.First()));

            var rows = new List<ML.LqmHofaReportRowDto>();
            var wlCache = new Dictionary<string, (decimal pd, decimal mgr)>(StringComparer.OrdinalIgnoreCase);
            
            foreach (var b in bupics)
            {
                var lk = (b.LeaderDataUniqueKey ?? "").Trim();
                byLeader.TryGetValue(lk, out var qmap);
                bool irm = IsIrm(b.BusinessUnitIdLabel);   // ← IRM por líder

                var bOffices = ParseOffices(b.AllowedOffices);
                var buKey = (b.BusinessUnitIdLabel ?? "").Trim() + "||" + string.Join(",", bOffices);

                var inds = cat.Where(c => !irm || AppliesToIrm(c)).Select(c =>
                {
                    var key = (c.IndicatorsUniqueKey ?? "").Trim();

                    decimal sc = 0m; string? cp = null;
                    if (qmap != null && qmap.TryGetValue(key, out var q)) { sc = q.QualificationScore ?? 0m; cp = q.QualificationDescription; }
                    var maxM = irm ? c.IrmMaxMeasure : c.MaxMeasure;   // ← tope IRM
                    return new ML.LqmIndicatorDto
                    {
                        CatIndicatorsKey = c.CatIndicatorsKey,
                        IndicatorsUniqueKey = key,
                        IndicatorLabel = c.IndicatorLabel,
                        MeasureDescription = irm ? (c.IrmMeasure ?? c.MeasureDescription) : c.MeasureDescription,
                        IndicatorDescription = c.IndicatorDescription,
                        SourceLabel = c.SourceLabel,
                        MaxMeasure = maxM,
                        Target = irm ? IrmTarget(maxM) : PydTargetFor(c),
                        CanEdit = CanEditIndicator(c.IndicatorsUniqueId, ApplicableHofa, acc.isAll, acc.isBuPic, acc.isHofA),
                        Score = sc,
                        CurrentPerformance = cp,
                    };
                }).ToList();

                // 115/116 calculados por % de cumplimiento (cache por BU para no repetir queries)
                if (inds.Any(i => (i.IndicatorsUniqueKey ?? "").StartsWith("115-")
                               || (i.IndicatorsUniqueKey ?? "").StartsWith("116-")))
                {
                    if (!wlCache.TryGetValue(buKey, out var wl))
                    {
                        wl = await WorkloadCompliancesAsync(b.BusinessUnitIdLabel, bOffices, ct);
                        wlCache[buKey] = wl;
                    }
                    ApplyWorkloadScores(inds, wl.pd, wl.mgr);
                }

                // 113/114/118/119 calculados (si el score está NULL)
                if (inds.Any(i => HofaFromPyd.ContainsKey(UidOf(i.IndicatorsUniqueKey))
                               && (qmap == null || !qmap.TryGetValue(i.IndicatorsUniqueKey, out var qq) || qq.QualificationScore == null)))
                {
                    if (!hofaCalcCache.TryGetValue(buKey, out var calcs))
                    {
                        calcs = await HofaCalcsAsync(b.BusinessUnitIdLabel, bOffices, ct);
                        hofaCalcCache[buKey] = calcs;
                    }
                    foreach (var ind in inds)
                    {
                        int uid = UidOf(ind.IndicatorsUniqueKey);
                        if (!HofaFromPyd.ContainsKey(uid)) continue;
                        bool hasManual = qmap != null && qmap.TryGetValue(ind.IndicatorsUniqueKey, out var q2) && q2.QualificationScore != null;
                        if (!hasManual) ind.Score = calcs[uid];
                    }
                }




                // "perfecto" POR LÍDER (suma de sus topes positivos)
                decimal perfectSum = inds.Sum(i =>

                {
                    var cap = ParseMaxMeasure(i.MaxMeasure);
                    return cap.HasValue && cap.Value > 0 ? cap.Value : 0m;
                });

                decimal rawSum = inds.Sum(i => i.Score);
                decimal buScore = perfectSum > 0 ? Math.Max(0m, Math.Min(10m, rawSum / perfectSum * 10m)) : 0m;

                rows.Add(new ML.LqmHofaReportRowDto
                {
                    EmployeeId = (b.LeaderEmployeeID ?? "").Trim(),
                    Name = b.LeaderName,
                    Title = b.LeaderTitle,
                    BusinessUnit = b.BusinessUnitIdLabel,
                    Office = b.OfficeLabel,
                    BuScore = buScore,
                    CanEdit = inds.Any(i => i.CanEdit),
                    Indicators = inds,
                });
            }

            return rows.OrderByDescending(r => r.BuScore).ToList();
        }


        public async Task<List<ML.LqmHofaReportRowDto>> GetPydReportAsync(string email, CancellationToken ct = default)
        {
            var acc = await ResolveAsync(email, ct);

            List<DL.LqmTblLeaderDatum> pd;
            if (acc.isAll || acc.isHofA)
                pd = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == FiscalYear
                             && (l.IsHofa == null || l.IsHofa == false)
                             && (l.IsBupic == null || l.IsBupic == false)).ToListAsync(ct);
            else if (acc.isBuPic)

                pd = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.FiscalYearLabel == FiscalYear
                             && l.BusinessUnitIdLabel == acc.bu
                             && (l.IsHofa == null || l.IsHofa == false)
                             && (l.IsBupic == null || l.IsBupic == false)).ToListAsync(ct);
            else
                pd = await _db.LqmTblLeaderData.AsNoTracking()
                    .Where(l => l.LeaderEmployeeID == acc.myId).ToListAsync(ct);

            pd = pd.Where(p => InOffices(p.OfficeLabel, acc.offices)).ToList();   // ← AGREGA ESTA

            // catálogo completo de PyD (luego se filtra por líder si es IRM)
            var cat = await _db.LqmCatIndicatorsPenTwos.AsNoTracking()
                .Where(c => c.Fy == FiscalYear && c.ApplicableTo == ApplicablePyD)
                .OrderBy(c => c.IndicatorsUniqueId).ToListAsync(ct);

            var keys = pd.Select(p => (p.LeaderDataUniqueKey ?? "").Trim()).Where(s => s != "").ToList();
            var byLeader = (await _db.LqmTblQualificationsPenTwos.AsNoTracking()
                    .Where(q => keys.Contains(q.LeaderDataUniqueKey)).ToListAsync(ct))
                .GroupBy(q => (q.LeaderDataUniqueKey ?? "").Trim())
                .ToDictionary(g => g.Key, g => g
                    .GroupBy(x => (x.IndicatorsUniqueKey ?? "").Trim())
                    .ToDictionary(gg => gg.Key, gg => gg.First()));

            var rows = new List<ML.LqmHofaReportRowDto>();
            foreach (var p in pd)
            {
                var lk = (p.LeaderDataUniqueKey ?? "").Trim();
                byLeader.TryGetValue(lk, out var qmap);
                bool irm = IsIrm(p.BusinessUnitIdLabel);   // ← IRM por líder

                var inds = cat.Where(c => !irm || AppliesToIrm(c)).Select(c =>
                {
                    var key = (c.IndicatorsUniqueKey ?? "").Trim();
                    decimal sc = 0m; string? cp = null;
                    if (qmap != null && qmap.TryGetValue(key, out var q)) { sc = q.QualificationScore ?? 0m; cp = q.QualificationDescription; }
                    var maxM = irm ? c.IrmMaxMeasure : c.MaxMeasure;   // ← tope IRM
                    return new ML.LqmIndicatorDto
                    {
                        CatIndicatorsKey = c.CatIndicatorsKey,
                        IndicatorsUniqueKey = key,
                        IndicatorLabel = c.IndicatorLabel,
                        MeasureDescription = irm ? (c.IrmMeasure ?? c.MeasureDescription) : c.MeasureDescription,
                        IndicatorDescription = c.IndicatorDescription,
                        SourceLabel = c.SourceLabel,
                        MaxMeasure = maxM,
                        Target = irm ? IrmTarget(maxM) : PydTargetFor(c),
                        CanEdit = CanEditIndicator(c.IndicatorsUniqueId, ApplicablePyD, acc.isAll, acc.isBuPic, acc.isHofA),
                        Score = sc,
                        CurrentPerformance = cp,
                    };
                }).ToList();

                decimal rawSum = inds.Sum(i => i.Score);
                decimal score = Math.Max(0m, Math.Min(11m, rawSum));

                rows.Add(new ML.LqmHofaReportRowDto
                {
                    EmployeeId = (p.LeaderEmployeeID ?? "").Trim(),
                    Name = p.LeaderName,
                    Title = p.LeaderTitle,
                    BusinessUnit = p.BusinessUnitIdLabel,
                    Office = p.OfficeLabel,
                    BuScore = score,
                    CanEdit = inds.Any(i => i.CanEdit),
                    Indicators = inds,
                });
            }

            return rows.OrderByDescending(r => r.BuScore).ToList();
        }




        // Objetivos (semilla) por indicador — para el semáforo de los reportes
        private static readonly System.Collections.Generic.Dictionary<int, decimal> DefaultTargets = new()
        {
            [101]=0m,[102]=0m,[103]=1m,[104]=0m,[105]=1m,[106]=1m,[107]=1m,[108]=1m,[109]=1m,[110]=2m,[111]=2m,[112]=0m,
            [113]=2m,[114]=1m,[115]=0.5m,[116]=1m,[117]=1m,[118]=2m,[119]=2m,[120]=1m,
        };
        private static decimal TargetFor(int uid) => DefaultTargets.TryGetValue(uid, out var t) ? t : 0m;
        // Para bonos (cap positivo) el verde ES su tope real → si cambias MaxMeasure, el verde se ajusta solo.
        // PERO si el target base es 0, es un bono OPCIONAL (no penaliza no tenerlo) → se queda en 0.
        private static decimal PydTargetFor(DL.LqmCatIndicatorsPenTwo c)
        {
            var def = TargetFor(c.IndicatorsUniqueId);
            if (def <= 0m) return 0m;                  // 112: bono opcional → 0 sigue siendo verde
            var cap = ParseMaxMeasure(c.MaxMeasure);
            return cap.HasValue && cap.Value > 0 ? cap.Value : def;
        }


        // PyD: qué indicadores puede editar un BU PIC / HofA (All edita todos)
        private static readonly System.Collections.Generic.HashSet<int> BuEditablePyd = new() { 104, 105, 110, 111, 112 };

        // HOFA: las únicas manuales (113/114/118/119 son calculadas · 115/116 nunca se editan)
        private static readonly System.Collections.Generic.HashSet<int> HofaEditable = new() { 117, 120 };

        private static bool CanEditIndicator(int uid, string applicableTo, bool isAll, bool isBuPic, bool isHofA)
        {
            if (isAll) return true;                                                  // All: todo
            if (applicableTo == ApplicableHofa) return isHofA && HofaEditable.Contains(uid);   // HofA: solo 117 y 120
            if (isBuPic || isHofA) return BuEditablePyd.Contains(uid);               // PyD: BUPIC/HofA solo el subconjunto
            return false;                                                            // partner normal: nada
        }


                private static bool IsIrm(string? bu) =>
            (bu ?? "").Trim().Equals("IRM", StringComparison.OrdinalIgnoreCase);
        // IRM: el indicador aplica solo si está marcado Y tiene IRMMaxMeasure (no NULL, no vacío)
        private static bool AppliesToIrm(DL.LqmCatIndicatorsPenTwo c) =>
            c.IsIrmApplied && ParseMaxMeasure(c.IrmMaxMeasure).HasValue;

        // Objetivo IRM: si el IRMMaxMeasure es positivo (bono) = su máximo; si es negativo (penalización) = 0
        private static decimal IrmTarget(string? irmMax)
        {
            var cap = ParseMaxMeasure(irmMax);
            return cap.HasValue && cap.Value > 0 ? cap.Value : 0m;
        }

        // ── Workload (115 = Socios/Directores · 116 = Gerentes) ─────────────
        // complianceValidation: 1 y 3 cuentan como cumplimiento; 2 no. Sin dato (null) NO cuenta.
        private static decimal WorkloadScore(decimal pct, bool isPd)
        {
            if (pct < 80m)  return 0m;                       // < 80%
            if (pct < 95m)  return isPd ? 0.25m : 0.5m;      // 80–94%


            return isPd ? 0.5m : 1.0m;                       // ≥ 95% (máximo)
        }

        // % de cumplimiento de P&D y Gerentes de una BU (los IRM caen aquí porque su BU = "IRM")
        private async Task<(decimal pd, decimal mgr)> WorkloadCompliancesAsync(
            string? bu, List<string> offices, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(bu)) return (0m, 0m);

            var pdRows = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.FiscalYearLabel == FiscalYear && l.BusinessUnitIdLabel == bu
                         && (l.IsHofa == null || l.IsHofa == false)
                         && (l.IsBupic == null || l.IsBupic == false))
                .Select(l => new { l.LeaderEmployeeID, l.OfficeLabel })
                .ToListAsync(ct);

            var mgrRows = await _db.LqmCatManagerData.AsNoTracking()
                .Where(m => m.Fy == FiscalYear && m.BusinessUnitIdLabel == bu)
                .Select(m => new { m.ManagerEmployeeId, m.OfficeLabel })
                .ToListAsync(ct);

            // filtro de oficinas permitidas
            var pdIds  = pdRows.Where(x => InOffices(x.OfficeLabel, offices))
                               .Select(x => x.LeaderEmployeeID).ToList();
            var mgrIds = mgrRows.Where(x => InOffices(x.OfficeLabel, offices))
                                .Select(x => x.ManagerEmployeeId).ToList();

            var allIds = pdIds.Concat(mgrIds).Select(s => (s ?? "").Trim())
                              .Where(s => s != "").Distinct().ToList();

            var cvById = (await _db.LqmCatLeaderHours.AsNoTracking()
                    .Where(h => h.Fy == FiscalYear && allIds.Contains(h.LeaderEmployeeId))
                    .Select(h => new { h.LeaderEmployeeId, h.ComplianceValidation })
                    .ToListAsync(ct))
                .GroupBy(h => (h.LeaderEmployeeId ?? "").Trim())
                .ToDictionary(g => g.Key, g => g.First().ComplianceValidation);

            decimal Pct(List<string> ids)
            {
                var cvs = ids.Select(id => (id ?? "").Trim()).Where(id => id != "")
                             .Select(id => cvById.TryGetValue(id, out var v) ? v : null)
                             .Where(v => v.HasValue).Select(v => v!.Value)
                             .ToList();
                if (cvs.Count == 0) return 0m;
                int ok = cvs.Count(v => v == 1 || v == 3);   // 2 no cuenta
                return (decimal)ok / cvs.Count * 100m;
            }

            return (Pct(pdIds), Pct(mgrIds));
        }

        // Aplica el score calculado de 115/116 sobre la lista ya armada
        private static void ApplyWorkloadScores(List<ML.LqmIndicatorDto> inds, decimal pdPct, decimal mgrPct)
        {
            foreach (var ind in inds)
            {
                bool pd = (ind.IndicatorsUniqueKey ?? "").StartsWith("115-");
                bool mg = (ind.IndicatorsUniqueKey ?? "").StartsWith("116-");
                if (!pd && !mg) continue;

                ind.Score   = WorkloadScore(pd ? pdPct : mgrPct, pd);
                ind.CanEdit = false;   // es automático, no se edita a mano
                var cap = ParseMaxMeasure(ind.MaxMeasure);
                if (cap.HasValue && cap.Value > 0) ind.Target = cap.Value;   // verde = su tope
            }
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
