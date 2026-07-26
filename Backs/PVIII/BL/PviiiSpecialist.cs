
using DL;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ML;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace BL
{

    //public interface ISpecialistBL
    //{
    //    ML.Result GetSpecialistsByUser(string userEmail);
    //    IEnumerable<ML.SpecialistRequestVM> GetSpecialistRequests();
    //    ML.Result ConfirmSpecialist(string p8Id, string? comment, string userEmail);
    //    ML.Result SubmitBreakdown(string p8Id, List<ML.ResourceBreakdownVM> breakdown, string? comments, string userEmail);
    //    ML.Result ApproveSpecialist(string p8Id, string userEmail);
    //    ML.Result RequestChanges(string p8Id, string comment, string userEmail);


    //}



    //public sealed class SpecialistBL : ISpecialistBL
    //{
    //    private readonly DL.MexItaStaBiAuditContext _db;
    //    private readonly ILogger<SpecialistBL> _logger;

    //    public SpecialistBL(
    //        DL.MexItaStaBiAuditContext db,
    //        ILogger<SpecialistBL> logger)
    //    {
    //        _db = db;
    //        _logger = logger;
    //    }

    ////    public ML.Result GetSpecialistsByUser(string userEmail)
    ////    {
    ////        var result = new ML.Result();

    ////        try
    ////        {
    ////            // 1️⃣ Seguridad
    ////            var security = _db.PviiiTblSecurities
    ////                .AsNoTracking()
    ////                .FirstOrDefault(s => s.UserEmail == userEmail);


    ////            // 2️⃣ Query base
    ////            IQueryable<DL.PviiiMasterSpecialist> query =
    ////                _db.PviiiMasterSpecialists.AsNoTracking()
    ////                .Where(s =>
    ////                    s.P8ApprStatus &&
    ////                    s.P8ValidityStatus);


    ////            if (security == null)
    ////            {
    ////                query = query.Where(s =>
    ////                        s.SpecialistPartnerEmail == userEmail);
    ////            }
    ////            else
    ////            {
    ////                var role = (security.UserRole ?? "").Trim();

    ////                if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
    ////                {
    ////                    if (security.PracticeIndicator != null)
    ////                    {
    ////                        query = query.Where(s =>
    ////                            s.FunctionLabel == security.PracticeIndicator);
    ////                    }
    ////                }
    ////                else if (role.Equals("vMaster", StringComparison.OrdinalIgnoreCase))
    ////                {
    ////                    // ve todo, no se filtra
    ////                }
    ////                else
    ////                {
    ////                    // Otros roles -> deny by default
    ////                    result.Correct = true;
    ////                    result.Object = new List<ML.SpecialistVM>();
    ////                    return result;
    ////                }

    ////                // 4️⃣ Filtro adicional por segmento (si aplica)
    ////                if (security.SegmentId.HasValue)
    ////                {
    ////                    var segmentLabel = security.SegmentLabel;
    ////                    query = query.Where(s => s.SegmentLabel == segmentLabel);
    ////                }
    ////            }

    ////            // 3️⃣ Filtros por rol


    ////            var data =
    ////                from s in query
    ////                let curr = _db.PviiiMasterCurrents
    ////                    .AsNoTracking()
    ////                    .FirstOrDefault(c => c.P8Id == s.P8Id)
    ////                let agreed = _db.PviiiTblSpecialists
    ////                    .AsNoTracking()
    ////                    .FirstOrDefault(a => a.P8Id == s.P8Id)
    ////                let valu = _db.PviiiTblProyectValuationDetails
    ////                    .AsNoTracking()
    ////                    .FirstOrDefault(a => a.P8Id == s.P8Id)
    ////                let stand = _db.PviiiTblEngagementContexts
    ////                    .AsNoTracking()
    ////                    .FirstOrDefault(a => Convert.ToString(a.P8id) == s.P8Id)

    ////                orderby s.FunctionLabel, s.ServiceLineLabel
    ////                select new ML.SpecialistVM
    ////                {
    ////                    P8Id = s.P8Id,
    ////                    MasterSpecialistId = s.MasterSpecialistId,
    ////                    FunctionLabel = s.FunctionLabel,
    ////                    ServiceLineLabel = s.ServiceLineLabel,
    ////                    BusinessUnitLabel = s.BusinessUnitIdLabel,
    ////                    SegmentLabel = s.SegmentLabel,
    ////                    SpecialistPartnerName = s.SpecialistPartnerName,
    ////                    SpecialistPartnerEmail = s.SpecialistPartnerEmail,

    ////                    ClientName = curr != null ? curr.ClientName : null,
    ////                    TargetFees = agreed != null ? agreed.AgreedFeesAmount : 0,
    ////                    ServiceLinePartnerLead = s.CurrentEngagementPartnerName,
    ////                    ValuationPercent = valu != null ? valu.Valuation : 0,
    ////                    AuditStandards = stand != null ? stand.AuditingStandards : null,
    ////                    FinancialReportingStandards = stand != null ? stand.AccountingFrameworks : null,

    ////                    IsActive = s.P8ApprStatus && s.P8ValidityStatus
    ////                };

    ////            result.Object = data.ToList();
    ////            result.Correct = true;
    ////            return result;

    ////        }
    ////        catch (Exception ex)
    ////        {
    ////            _logger.LogError(ex, "Error en GetSpecialistsByUser");
    ////            return new ML.Result
    ////            {
    ////                Correct = false,
    ////                ErrorMessage = "Error cargando especialistas",
    ////                Ex = ex
    ////            };
    ////        }
    ////    }

    ////    public IEnumerable<ML.SpecialistRequestVM> GetSpecialistRequests()
    ////    {
    ////        // 1️⃣ Base: Master Specialist
    ////        var masters = _db.PviiiMasterSpecialists
    ////            .Where(s => s.P8ValidityStatus && s.P8ApprStatus)
    ////            .Select(s => new
    ////            {
    ////                s.P8Id,
    ////                s.FunctionLabel,
    ////                s.ServiceLineLabel,
    ////                s.BusinessUnitIdLabel,
    ////                s.SegmentLabel,
    ////                s.SpecialistPartnerName,
    ////                s.SpecialistPartnerEmail,
    ////                s.SpecialistConfirmStatus,
    ////                s.SpecialistConfirmBreakdown
    ////            })
    ////            .ToList();

    ////        // 2️⃣ Confirmations
    ////        var confirmations = _db.PviiiSpecialistConfirmations
    ////            .GroupBy(c => c.P8Id)
    ////            .Select(g => g
    ////                .OrderByDescending(x => x.CreatedDateTime)
    ////                .First())
    ////            .ToDictionary(c => c.P8Id);

    ////        // 3️⃣ Breakdowns
    ////        var breakdowns = _db.PviiiResourceBreakdowns
    ////            .GroupBy(b => b.P8Id)
    ////            .ToDictionary(
    ////                g => g.Key,
    ////                g => g
    ////                    .OrderBy(x => x.RecordChangeSequence)
    ////                    .Select(b => new ML.ResourceBreakdownVM
    ////                    {
    ////                        FunctionLabel = b.FunctionLabel,
    ////                        ServiceLineLabel = b.ServiceLineLabel,
    ////                        Category = b.SpecialistLevelLabel,
    ////                        PreliminaryHours = b.ResourceHoursPreliminary ?? 0,
    ////                        InterimHours = b.ResourceHoursInterim ?? 0,
    ////                        FinalHours = b.ResourceHoursFinal ?? 0
    ////                    })
    ////                    .ToList()
    ////            );

    ////        // 4️⃣ Construcción del VM FINAL
    ////        return masters.Select(m =>
    ////        {
    ////            confirmations.TryGetValue(m.P8Id, out var confirmation);
    ////            breakdowns.TryGetValue(m.P8Id, out var breakdown);


    ////            ML.SpecialistStatusEnum status;

    ////            if (confirmation != null && breakdown == null)
    ////            {
    ////                // ✅ Confirmation completed → Resourcing
    ////                status = ML.SpecialistStatusEnum.Draft;
    ////            }
    ////            else if (confirmation != null && breakdown != null)
    ////            {
    ////                // ✅ Confirmation + Breakdown → Completed
    ////                status = ML.SpecialistStatusEnum.Approved;
    ////            }
    ////            else
    ////            {
    ////                // ❌ No confirmation yet → Confirmation
    ////                status = ML.SpecialistStatusEnum.Draft;
    ////            }



    ////            return new ML.SpecialistRequestVM
    ////            {
    ////                P8Id = m.P8Id,

    ////                FunctionLabel = m.FunctionLabel,
    ////                ServiceLineLabel = m.ServiceLineLabel,
    ////                BusinessUnitLabel = m.BusinessUnitIdLabel,
    ////                SegmentLabel = m.SegmentLabel,

    ////                SpecialistPartnerName = m.SpecialistPartnerName,
    ////                SpecialistPartnerEmail = m.SpecialistPartnerEmail,

    ////                Status = status, // ✅ Calculado correctamente
    ////                ConfirmationCompleted = confirmation != null,
    ////                BreakdownCompleted = breakdown != null,

    ////                ConfirmationComment = null,
    ////                Breakdown = breakdown ?? new List<ML.ResourceBreakdownVM>()
    ////            };

    ////        })
    ////        .OrderBy(r => r.SpecialistPartnerName)
    ////        .ToList();
    ////    }


    ////    /* ============================================================
    ////          STEP 1 – CONFIRMATION
    ////          ============================================================ */
    ////    public ML.Result ConfirmSpecialist(string p8Id, string? comment, string userEmail)
    ////    {
    ////        var result = new ML.Result();
    ////        try
    ////        {
    ////            var confirmation = new PviiiSpecialistConfirmation
    ////            {
    ////                P8Id = p8Id,
    ////                ConfirmationIndicator = true,
    ////                AgreedFeesSpecialist = _db.PviiiTblSpecialists
    ////                .Where(s => s.P8Id == p8Id)
    ////                    .Select(s => s.AgreedFeesAmount)
    ////                    .FirstOrDefault(),
    ////                ServiceLineLabel = _db.PviiiMasterSpecialists
    ////                    .Where(s => s.P8Id == p8Id)
    ////                    .Select(s => s.ServiceLineLabel)
    ////                    .FirstOrDefault(),
    ////                CreatedByUserEmail = userEmail,
    ////                CreatedDateTime = DateTime.UtcNow,
    ////                RecordChangeSequence = 1
    ////            };

    ////            _db.PviiiSpecialistConfirmations.Add(confirmation);
    ////            _db.SaveChanges();

    ////            result.Correct = true;
    ////            result.Object = confirmation;
    ////            return result;
    ////        }
    ////        catch (Exception ex)
    ////        {
    ////            _logger.LogError(ex, "ConfirmSpecialist failed");
    ////            return new ML.Result
    ////            {
    ////                Correct = false,
    ////                ErrorMessage = "Error cargando especialistas",
    ////                Ex = ex
    ////            };
    ////        }
    ////    }

    ////    /* ============================================================
    ////       STEP 2 – SUBMIT BREAKDOWN
    ////       ============================================================ */
    ////    public ML.Result SubmitBreakdown(
    ////        string p8Id,
    ////        List<ML.ResourceBreakdownVM> breakdown,
    ////        string? comments,
    ////        string userEmail)
    ////    {
    ////        var result = new ML.Result();
    ////        try
    ////        {
    ////            int sequence = 1;

    ////            foreach (var row in breakdown)
    ////            {
    ////                var entity = new PviiiResourceBreakdown
    ////                {
    ////                    P8Id = p8Id,
    ////                    FunctionLabel = row.FunctionLabel,
    ////                    ServiceLineLabel = row.ServiceLineLabel,
    ////                    SpecialistLevelLabel = row.Category,
    ////                    ResourceHoursPreliminary = row.PreliminaryHours,
    ////                    ResourceHoursInterim = row.InterimHours,
    ////                    ResourceHoursFinal = row.FinalHours,
    ////                    CreatedByUserEmail = userEmail,
    ////                    CreatedDateTime = DateTime.UtcNow,
    ////                    RecordChangeSequence = sequence++
    ////                };

    ////                _db.PviiiResourceBreakdowns.Add(entity);
    ////            }

    ////            // Mark that breakdown was submitted
    ////            var master = _db.PviiiMasterSpecialists
    ////                .First(s => s.P8Id == p8Id);

    ////            master.SpecialistConfirmBreakdown = true;
    ////            master.UpdatedByUserEmail = userEmail;
    ////            master.UpdatedDateTime = DateTime.UtcNow;

    ////            _db.SaveChanges();
    ////            result.Correct = true;
    ////            result.Object = master;
    ////            return result;
    ////        }
    ////        catch (Exception ex)
    ////        {
    ////            _logger.LogError(ex, "SubmitBreakdown failed");
    ////            return new ML.Result
    ////            {
    ////                Correct = false,
    ////                ErrorMessage = "Error cargando especialistas",
    ////                Ex = ex
    ////            };
    ////        }
    ////    }

    ////    /* ============================================================
    ////       STEP 3 – APPROVE
    ////       ============================================================ */
    ////    public ML.Result ApproveSpecialist(string p8Id, string userEmail)
    ////    {
    ////        var result = new ML.Result();
    ////        try
    ////        {
    ////            var master = _db.PviiiMasterSpecialists
    ////                .First(s => s.P8Id == p8Id);

    ////            master.SpecialistConfirmStatus = true;
    ////            master.UpdatedByUserEmail = userEmail;
    ////            master.UpdatedDateTime = DateTime.UtcNow;

    ////            _db.SaveChanges();
    ////            result.Correct = true;
    ////            result.Object = master;
    ////            return result;
    ////        }
    ////        catch (Exception ex)
    ////        {
    ////            _logger.LogError(ex, "ApproveSpecialist failed");
    ////            return new ML.Result
    ////            {
    ////                Correct = false,
    ////                ErrorMessage = "Error cargando especialistas",
    ////                Ex = ex
    ////            };
    ////        }
    ////    }

    ////    /* ============================================================
    ////       REQUEST CHANGES
    ////       ============================================================ */
    ////    public ML.Result RequestChanges(string p8Id, string comment, string userEmail)
    ////    {
    ////        var result = new ML.Result();
    ////        try
    ////        {
    ////            var master = _db.PviiiMasterSpecialists
    ////                .First(s => s.P8Id == p8Id);

    ////            master.SpecialistConfirmStatus = false;
    ////            master.SpecialistConfirmBreakdown = false;
    ////            master.UpdatedByUserEmail = userEmail;
    ////            master.UpdatedDateTime = DateTime.UtcNow;

    ////            _db.SaveChanges();
    ////            result.Correct = true;
    ////            result.Object = master;
    ////            return result;
    ////        }
    ////        catch (Exception ex)
    ////        {
    ////            _logger.LogError(ex, "RequestChanges failed");
    ////            return new ML.Result
    ////            {
    ////                Correct = false,
    ////                ErrorMessage = "Error cargando especialistas",
    ////                Ex = ex
    ////            };
    ////        }
    ////    }

    ////}

    ////public class SubmitBreakdownDto
    ////{
    ////    public List<ResourceBreakdownVM> Breakdown { get; set; } = new();
    ////    public string? Comments { get; set; }
    ////}

    ////public class RequestChangesDto
    ////{
    ////    public string Comment { get; set; }
    ////}

}
