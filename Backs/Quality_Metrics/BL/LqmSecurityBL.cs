using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BL
{
    public interface ILqmSecurityBL
    {
        Task<ML.LqmAccessDto> GetMyAccessAsync(string email, CancellationToken ct = default);
    }

    public sealed class LqmSecurityBL : ILqmSecurityBL
    {
        private readonly DL.LeadershipQmContext _db;
        private readonly ILogger<LqmSecurityBL> _logger;

        private static readonly string[] AllowedLevels    = { "Partner", "Director" };
        private static readonly string[] AllowedPractices = { "Audit", "Nacional" };

        public LqmSecurityBL(DL.LeadershipQmContext db, ILogger<LqmSecurityBL> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<ML.LqmAccessDto> GetMyAccessAsync(string email, CancellationToken ct = default)
        {
            var norm = (email ?? "").Trim().ToLower();

            // 1) Portón base desde LQM_Tbl_LeaderData (el networkId solo resolvió el correo)
            var leader = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.LeaderEmail != null && l.LeaderEmail.ToLower() == norm)
                .Select(l => new { l.LeaderTitle, l.Practice, l.BusinessUnitIdLabel, l.OfficeLabel })
                .FirstOrDefaultAsync(ct);

            bool leaderGate =
                leader != null &&
                AllowedLevels.Contains((leader.LeaderTitle ?? "").Trim()) &&
                AllowedPractices.Contains((leader.Practice ?? "").Trim());

            // 2) Fila de seguridad (opcional): All / BU PIC / HofA
            var sec = await _db.LqmTblSecurities.AsNoTracking()
                .FirstOrDefaultAsync(s => s.UserEmail.ToLower() == norm, ct);

                        // bupic/hofa del usuario para el acceso a HofA -> desde LeaderData
            var leaderLD = await _db.LqmTblLeaderData.AsNoTracking()
                .Where(l => l.LeaderEmail != null && l.LeaderEmail.ToLower() == norm)
                .Select(l => new { l.IsBupic, l.IsHofa })
                .FirstOrDefaultAsync(ct);
            bool isBuPicLD = leaderLD?.IsBupic == true;
            bool isHofaLD  = leaderLD?.IsHofa == true;


            var role = (sec?.UserRole ?? "").Trim();
            bool isAll = role.Equals("All", StringComparison.OrdinalIgnoreCase);

            // BU PIC / HofA: cuentan tanto los de Security como los de LeaderData (el sistema ya migró a LeaderData)
            bool isBuPic = sec?.IsBupic == true || isBuPicLD;
            bool isHofA  = sec?.IsHofa  == true || isHofaLD;

            // combobox: solo All o BU PIC (HofA ve solo lo suyo)
            bool canSelectUsers = isAll || isBuPic;

            string scope =
                isAll   ? "All"        :
                isBuPic ? "Allegados"  :
                          "Self";       // normal y HofA: solo su info

            return new ML.LqmAccessDto
            {
                Email  = norm,
                Role   = sec?.UserRole,
                Bu     = sec?.BusinessUnitIdLabel ?? leader?.BusinessUnitIdLabel,
                Office = sec?.OfficeLabel         ?? leader?.OfficeLabel,
                IsBuPic = isBuPic,
                IsHofA  = isHofA,

                InEmployeeGate = leaderGate,
                HasSecurityRow = sec != null,
                IsAll          = isAll,

                Allowed              = isAll || leaderGate || isBuPic || isHofA,
                CanAccessPerformance = isAll || leaderGate || isBuPic || isHofA,
                CanAccessBuEvaluation = isAll || isBuPic,

                CanSelectUsers = canSelectUsers,
                Scope          = scope,

                CanAccessHofA     = isAll || isBuPic || isHofA,
                CanAccessPartners = isAll || isBuPic || isHofA || leaderGate,
            };

        }
    }
}
