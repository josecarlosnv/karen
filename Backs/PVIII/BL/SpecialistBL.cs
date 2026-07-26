using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using ML.Pviii;
using ML.Specialist;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class SpecialistBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public SpecialistBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }

        public async Task<Result> GetAll(string email)
        {
            var result = new Result();

            try
            {
                var serviceLines = await _context.PviiiCatServiceLineSpecialists
                    .Where(x => x.ServiceLineLeadPartnerEmail == email)
                    .Select(x => x.ServiceLineLabel)
                    .ToListAsync();

                var isLeader = serviceLines.Any();

                var query = _context.VwPviiiSpecialistsConfrimations
                    .AsNoTracking()
                    .AsQueryable();


                if (isLeader)
                {
                    query = query.Where(x =>
                        serviceLines.Contains(x.ServiceLineSpecialist)
                    );
                }
                else
                {
                    query = query.Where(x =>
                        x.ServiceLineInChargeEmail.ToLower().Trim() == email.ToLower().Trim()
                    );
                }


                var data = await query.ToListAsync();

                var p8Ids = data.Select(x => x.P8Id).Distinct().ToList();

                var breakdownsAll = await _context.PviiiSubSpecialistBreakdowns
                    .AsNoTracking()
                    .Where(b => p8Ids.Contains(b.P8Id))
                    .ToListAsync();

                var grouped = data
                    .GroupBy(x => x.P8Id)
                    .ToList();

                var list = new List<SpecialistML>();

                foreach (var group in grouped)
                {
                    var first = group.First();
                    var specialists = group.ToList();

                    var totalAgreedFees = specialists
                        .Sum(s => s.AgreedFeesAmount ?? 0);

                    var hasBreakdown = breakdownsAll.Any(b => b.P8Id == first.P8Id);
                    var hasConfirm = specialists.Any(s => s.ConfirmationIndicatorId != null);

                    var dto = new SpecialistML
                    {
                        P8Id = first.P8Id,

                        CostCenter = first.CostCenter,
                        P8StatusId = first.P8StatusId,

                        ClientName = first.ClientName,
                        BusinessUnitIdLabel = first.BusinessUnitIdLabel,

                        CurrentEngagementPartnerName = first.CurrentEngagementPartnerName,
                        CurrentEngagementPartnerEmail = first.CurrentEngagementPartnerEmail,

                        ProjectDescription = first.ProjectDescription,
                        OfficeLabel = first.OfficeLabel,

                        ConfirmationComments = first.ConfirmationComments,
                        ConfirmationIndicator = first.ConfirmationIndicator,
                        ConfirmationIndicatorId = first.ConfirmationIndicatorId,

                        AgreedFeesAmount = totalAgreedFees,
                        AgreedFeesSpecialist = specialists.Sum(x => x.AgreedFeesSpecialist ?? 0),
                        FeePercentageDiff = specialists.Sum(x => x.FeePercentageDiff ?? 0),

                        ExistsBreakdown = hasBreakdown ? 1 : 0,
                        ExistsConfirm = hasConfirm ? 1 : 0,

                        LvlStatusEsp = first.LvlStatusEsp,
                        LvlStatusEspId = first.LvlStatusEspId,

                        ServiceLineInChargeLabel = first.ServiceLineInChargeLabel,
                        ServiceLineInChargeEmail = first.ServiceLineInChargeEmail,
                        ServiceLineSpecialist = first.ServiceLineSpecialist,

                        AuditingStandards = first.AuditingStandards,
                        AccountingFrameworks = first.AccountingFrameworks,

                        FunctionLabel = first.FunctionLabel,
                        SpecialistServiceLineLabel = first.SpecialistServiceLineLabel,

                        Valuation = first.Valuation
                    };

                    list.Add(dto);
                }

                result.Objects = list.Cast<object>().ToList();
                result.Correct = true;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }
        private bool HasPermission(Guid p8Id, string userEmail, string serviceLineLabel)
        {
            var email = userEmail.ToLower();

            var isInCharge = _context.VwPviiiSpecialistsConfrimations
                .Any(x => x.P8Id == p8Id.ToString()
                       && x.ServiceLineInChargeEmail.ToLower() == email);

            var isLeadPartner = _context.PviiiCatServiceLineSpecialists
                .Any(x => x.ServiceLineLeadPartnerEmail == serviceLineLabel
                       && x.ServiceLineLeadPartnerEmail.ToLower() == email);

            var isVMaster = _context.PviiiTblSecurities
                .Any(x => x.UserEmail.ToLower() == email
                       && x.UserRole == "vMaster");

            return isInCharge || isLeadPartner || isVMaster;
        }
        public Result SaveSpecialistConfirmation(Guid p8Id, SpecialistConfirmationDTO dto, string userEmail)
        {
            var result = new Result();

            try
            {
                if (!HasPermission(p8Id, userEmail, dto.SpecialistServiceLineLabel))
                {
                    result.Correct = false;
                    result.ErrorMessage = "No tienes permisos para realizar esta acción.";
                    return result;
                }

                var lastEntity = _context.PviiiSubSpecialistConfirmations
                    .Where(x => x.P8Id == p8Id.ToString()
                             && x.CostCenter == dto.CostCenter)
                    .OrderByDescending(x => x.RecordChangeSequence)
                    .FirstOrDefault();

                int nextSequence = (int)((lastEntity?.RecordChangeSequence ?? 0) + 1);

                var entity = new PviiiSubSpecialistConfirmation
                {
                    P8Id = p8Id.ToString(),
                    RecordChangeSequence = nextSequence,
                    CreatedDateTime = DateTime.Now,
                    CreatedByUserEmail = userEmail,

                    ConfirmationIndicator = dto.ConfirmationIndicator,
                    AgreedFeesSpecialist = dto.AgreedFeesSpecialist,
                    ConfirmationComments = dto.ConfirmationComments,
                    CostCenter = dto.CostCenter,
                    SpecialistServiceLineLabel = dto.SpecialistServiceLineLabel
                };

                _context.PviiiSubSpecialistConfirmations.Add(entity);
                _context.SaveChanges();

                result.Correct = true;
                result.Object = dto;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }
        public Result SaveSpecialistBreakdownBatch(Guid p8Id, SpecialistBreakdownBatchDTO dto, string userEmail)
        {
            var result = new Result();

            try
            {
                if (!HasPermission(p8Id, userEmail, dto.SpecialistServiceLineLabel))
                {
                    result.Correct = false;
                    result.ErrorMessage = "No tienes permisos para realizar esta acción.";
                    return result;
                }

                
                var lastEntity = _context.PviiiSubSpecialistBreakdowns
                    .Where(x => x.P8Id == p8Id.ToString()
                             && x.CostCenter == dto.CostCenter)
                    .OrderByDescending(x => x.RecordChangeSequence)
                    .FirstOrDefault();

                int nextSequence = (int)((lastEntity?.RecordChangeSequence ?? 0) + 1);

                foreach (var row in dto.Rows)
                {
                    var entity = new PviiiSubSpecialistBreakdown
                    {
                        P8Id = p8Id.ToString(),
                        RecordChangeSequence = nextSequence,
                        CreatedDateTime = DateTime.Now,
                        CreatedByUserEmail = userEmail,

                        SpecialistServiceLineLabel = dto.SpecialistServiceLineLabel,
                        SpecialistLevelId = row.SpecialistLevelId,

                        ResourceHoursPreliminary = row.ResourceHoursPreliminary,
                        ResourceHoursInterim = row.ResourceHoursInterim,
                        ResourceHoursFinal = row.ResourceHoursFinal,

                        CostCenter = dto.CostCenter
                    };

                    _context.PviiiSubSpecialistBreakdowns.Add(entity);
                }

                _context.SaveChanges();

                result.Correct = true;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }
       
        public async Task<Result> GetAllAhoraEsPersonal(string email, string? bu)
        {
            var result = new Result();

            try
            {
                string normalizedEmail = email.ToLower().Trim();

                var user = await _context.PviiiTblSecurities
                    .Where(u => u.UserEmail.ToLower().Trim() == normalizedEmail)
                    .Select(u => new
                    {
                        u.UserEmail,
                        u.UserRole
                    })
                    .FirstOrDefaultAsync();

                bool isVMaster = user?.UserRole == "vMaster";

                var query = _context.VwPviiiSpecialistsConfrimations
                    .AsNoTracking()
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(bu) && (bu.Equals("Advisory", StringComparison.OrdinalIgnoreCase) || 
                    bu.Equals("Tax", StringComparison.OrdinalIgnoreCase))) { 
                    query = query.Where(x =>x.FunctionLabel == bu); 
                }else{
                    if (!isVMaster)
                    {
                        var costCenters = await _context.PviiiCatServiceLineSpecialists
                            .Where(x => x.ServiceLineLeadPartnerEmail.ToLower().Trim() == normalizedEmail)
                            .Select(x => x.CostCenter)
                            .Distinct()
                            .ToListAsync();

                        if (costCenters.Any())
                        {
                            query = query.Where(x =>
                                costCenters.Contains((int)x.CostCenter) ||
                                x.ServiceLineInChargeEmail.ToLower().Trim() == normalizedEmail
                            );
                        }
                        else
                        {
                            query = query.Where(x =>
                                x.ServiceLineInChargeEmail.ToLower().Trim() == normalizedEmail
                            );
                        }
                    } 
                }

                var breakdownData = await _context.PviiiSubSpecialistBreakdowns
                    .Where(bd => _context.PviiiSubSpecialistBreakdowns
                        .Where(x => x.P8Id == bd.P8Id && x.CostCenter == bd.CostCenter)
                        .Max(x => x.RecordChangeSequence) == bd.RecordChangeSequence
                    )
                    .ToListAsync();

                var breakdownGrouped = breakdownData
                    .GroupBy(x => new { x.P8Id, x.CostCenter })
                    .ToDictionary(
                        g => $"{g.Key.P8Id}-{g.Key.CostCenter}",
                        g => g.Select(x => new SpecialistBreakdownDTO
                        {
                            SpecialistServiceLineLabel = x.SpecialistServiceLineLabel,
                            SpecialistLevelId = x.SpecialistLevelId,
                            ResourceHoursPreliminary = x.ResourceHoursPreliminary,
                            ResourceHoursInterim = x.ResourceHoursInterim,
                            ResourceHoursFinal = x.ResourceHoursFinal,
                            RecordChangeSequence = x.RecordChangeSequence,
                            CostCenter = x.CostCenter
                        }).ToList()
                    );

                var data = await query
                    .Select(x => new SpecialistML
                    {
                        P8Id = x.P8Id,
                        CostCenter = x.CostCenter,
                        P8StatusId = x.P8StatusId,
                        ClientName = x.ClientName,
                        BusinessUnitIdLabel = x.BusinessUnitIdLabel,
                        CurrentEngagementPartnerName = x.CurrentEngagementPartnerName,
                        CurrentEngagementPartnerEmail = x.CurrentEngagementPartnerEmail,
                        ProjectDescription = x.ProjectDescription,
                        OfficeLabel = x.OfficeLabel,
                        ConfirmationComments = x.ConfirmationComments,
                        AgreedFeesAmount = x.AgreedFeesAmount,
                        AgreedFeesSpecialist = x.AgreedFeesSpecialist,
                        FeePercentageDiff = x.FeePercentageDiff,
                        ConfirmationIndicator = x.ConfirmationIndicator,
                        ConfirmationIndicatorId = x.ConfirmationIndicatorId,
                        ExistsConfirm = x.ExistsConfirm,
                        ExistsBreakdown = x.ExistsBreakdown,
                        LvlStatusEsp = x.LvlStatusEsp,
                        LvlStatusEspId = x.LvlStatusEspId,
                        ServiceLineInChargeLabel = x.ServiceLineInChargeLabel,
                        ServiceLineInChargeEmail = x.ServiceLineInChargeEmail,
                        ServiceLineSpecialist = x.ServiceLineSpecialist,
                        AuditStagePreliminaryMths = x.AuditStagePreliminaryMths,
                        AuditStageInterimIndMths = x.AuditStageInterimIndMths,
                        AuditStageFinalIndMths = x.AuditStageFinalIndMths,
                        AuditingStandards = x.AuditingStandards,
                        AccountingFrameworks = x.AccountingFrameworks,
                        FunctionLabel = x.FunctionLabel,
                        SpecialistServiceLineLabel = x.SpecialistServiceLineLabel,
                        Valuation = x.Valuation,
                        PartnerDirectorFee = x.PartnerDirectorFee,
                        SeniorManagerManagerFee = x.SeniorManagerManagerFee,
                        ProfessionalStaffFee = x.ProfessionalStaffFee,

                        Breakdown = breakdownGrouped.ContainsKey(x.P8Id + "-" + x.CostCenter)
                            ? breakdownGrouped[x.P8Id + "-" + x.CostCenter]
                            : new List<SpecialistBreakdownDTO>()
                    })
                    .ToListAsync();

                result.Objects = data.Cast<object>().ToList();
                result.Correct = true;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

        public List<SpecialistRate> GetSpecialistRate()
        {
            return _context.PviiiSubCatLevelAvgRates
                .Select(x => new SpecialistRate
                {
                    LevelAvgRateId = x.LevelAvgRateId,
                    BreakdownLevel = x.BreakdownLevel,
                    ServiceLineLabel = x.ServiceLineLabel,
                    OfficeLabel = x.OfficeLabel,
                    CostCenter = x.CostCenter,
                    CostCenterLabel = x.CostCenterLabel,
                    FunctionLabel = x.FunctionLabel,
                    AverageRate = x.AverageRate
                })
                .ToList();
        }

    }
}
