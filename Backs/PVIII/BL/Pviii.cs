using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using ML.Pviii;
using System.Diagnostics.Metrics;
using static System.Net.WebRequestMethods;

namespace BL
{
    public class Pviii
    {
private readonly MexItaStaBiAuditContext _context;
private readonly IDbContextFactory<MexItaStaBiAuditContext> _contextFactory;

public Pviii(
    MexItaStaBiAuditContext context,
    IDbContextFactory<MexItaStaBiAuditContext> contextFactory)
{
    _context = context;
    _contextFactory = contextFactory;
}

        private Guid GenerateP8Id()
        {
            return Guid.NewGuid();
        }
        public async Task VersioningResetAsync(Guid p8Id, string email)
        {
            string p8 = p8Id.ToString();

            // ======================================================
            // ===================== VALUATION ======================
            // ======================================================
            var lastValuation = await _context.PviiiTblProyectValuationDetails
                .Where(x => x.P8Id == p8)
                .OrderByDescending(x => x.RecordChangeSequence)
                .FirstOrDefaultAsync();

            if (lastValuation != null)
            {
                lastValuation.IsActive = false;

                var newValuation = new PviiiTblProyectValuationDetail
                {
                    P8Id = lastValuation.P8Id,
                    ReportRevenue = 1,
                    StandardAuditHours = 1,
                    StandardAuditRevenue = 1,
                    RecordChangeSequence = (lastValuation.RecordChangeSequence ?? 0) + 1,
                    IsValidated = false,
                    Expenses=lastValuation.Expenses,
                    CreateBy = email
                };

                _context.PviiiTblProyectValuationDetails.Add(newValuation);
            }

            // ======================================================
            // ====================== REVIEW ========================
            // ======================================================
            var lastReview = await _context.PviiiTblProyectReviewDetails
                .Where(x => x.P8Id == p8)
                .OrderByDescending(x => x.RecordChangeSequence)
                .FirstOrDefaultAsync();

            if (lastReview != null)
            {
                lastReview.IsActive = false;

                var newReview = new PviiiTblProyectReviewDetail
                {
                    P8Id = lastReview.P8Id,
                    ApprovalLevelId = 0,
                    RecordChangeSequence = (lastReview.RecordChangeSequence ?? 0) + 1,
                    IsValidated = false,
                    CreateBy = email,
                };

                _context.PviiiTblProyectReviewDetails.Add(newReview);
            }

            // ======================================================
            // ===================== APPROVALS ======================
            // ======================================================
           
            var lastSequence = await _context.PviiiTblApprovalDetails
                .Where(x => x.P8Id == p8)
                .MaxAsync(x => (int?)x.RecordChangeSequence);

            if (lastSequence != null)
            {
                var lastApprovals = await _context.PviiiTblApprovalDetails
                    .Where(x => x.P8Id == p8 && x.RecordChangeSequence == lastSequence)
                    .ToListAsync();

                if (lastApprovals.Any())
                {
                    foreach (var approval in lastApprovals)
                    {
                        approval.ApprovalActiveStatus = false;
                    }

                    foreach (var approval in lastApprovals)
                    {
                        var newApproval = new PviiiTblApprovalDetail
                        {
                            P8Id = approval.P8Id,
                            ApprovalLevelId = approval.ApprovalLevelId,
                            StandardCommentsDocumentation = approval.StandardCommentsDocumentation,
                            ApprovalIndicator = false, 
                            ApproverLevel = approval.ApproverLevel,
                            ProjectRiskLevel = approval.ProjectRiskLevel,
                            ApproverId = approval.ApproverId,
                            RecordChangeSequence = (lastSequence ?? 0) + 1,
                            ApprovalActiveStatus = false,
                            CreatedByUserEmail = email,
                            CreatedDateTime = DateTime.Now
                        };
                        _context.PviiiTblApprovalDetails.Add(newApproval);
                    }
                }
            }

            // ======================================================
            // ====================== MASTER ========================
            // ======================================================

            var master = await _context.PviiiMasterCurrents
                   .FirstOrDefaultAsync(x => x.P8Id == p8);
            if(master != null)
            {
                master.UpdatedByUserEmail = email;
                master.UpdatedDateTime = DateTime.Now;
                
                var hasReview = await _context.PviiiTblProyectValuationDetails
                .AnyAsync(x => x.P8Id == p8 && x.IsActive==true);

                if (hasReview)
                {
                    master.P8StatusId = 4;
                    master.P8StatusLabel = "Progress";
                }
                else
                {
                    master.P8StatusId = 2; 
                    master.P8StatusLabel = "Draft";
                }
            }
            // ======================================================
            // SAVE
            // ======================================================
            await _context.SaveChangesAsync();
        }
        public async Task VersioningResetValuation(Guid p8Id, string email)
        {
            string p8 = p8Id.ToString();

            // ======================================================
            // ====================== REVIEW ========================
            // ======================================================
            var lastReview = await _context.PviiiTblProyectReviewDetails
                .Where(x => x.P8Id == p8)
                .OrderByDescending(x => x.RecordChangeSequence)
                .FirstOrDefaultAsync();

            if (lastReview != null)
            {
                lastReview.IsActive = false;

                var newReview = new PviiiTblProyectReviewDetail
                {
                    P8Id = lastReview.P8Id,
                    ApprovalLevelId = 0,
                    RecordChangeSequence = (lastReview.RecordChangeSequence ?? 0) + 1,
                    IsValidated = false,
                    CreateBy = email,
                };

                _context.PviiiTblProyectReviewDetails.Add(newReview);
            }

            // ======================================================
            // ===================== APPROVALS ======================
            // ======================================================
            var lastApproval = await _context.PviiiTblApprovalDetails
                .Where(x => x.P8Id == p8)
                .OrderByDescending(x => x.RecordChangeSequence)
                .FirstOrDefaultAsync();

            if (lastApproval != null)
            {
                lastApproval.ApprovalActiveStatus = false;

                var newApproval = new PviiiTblApprovalDetail
                {
                    P8Id = lastApproval.P8Id,
                    ApprovalLevelId = lastApproval.ApprovalLevelId,
                    StandardCommentsDocumentation = lastApproval.StandardCommentsDocumentation,
                    ApprovalIndicator = lastApproval.ApprovalIndicator,
                    ApproverLevel = lastApproval.ApproverLevel,
                    ProjectRiskLevel = lastApproval.ProjectRiskLevel,
                    ApproverId = lastApproval.ApproverId,
                    RecordChangeSequence = lastApproval.RecordChangeSequence + 1,
                    ApprovalActiveStatus = true,
                    CreatedByUserEmail = email,
                    CreatedDateTime = DateTime.Now
                };

                _context.PviiiTblApprovalDetails.Add(newApproval);
            }
            // ======================================================
            // ====================== MASTER ========================
            // ======================================================

            var master = await _context.PviiiMasterCurrents
                   .FirstOrDefaultAsync(x => x.P8Id == p8);
            if (master != null)
            {
                master.UpdatedByUserEmail = email;
                master.UpdatedDateTime = DateTime.Now;
                
                var hasReview = await _context.PviiiTblProyectValuationDetails
                .AnyAsync(x => x.P8Id == p8 && x.IsActive == true);

                if (hasReview)
                {
                    master.P8StatusId = 4;
                    master.P8StatusLabel = "Progress";
                }
                else
                {
                    master.P8StatusId = 2; 
                    master.P8StatusLabel = "Draft";
                }
            }
            // ======================================================
            // SAVE
            // ======================================================
            await _context.SaveChangesAsync();
        }
        public async Task VersioningResetReview(Guid p8Id, string email)
        {
            string p8 = p8Id.ToString();

            // ======================================================
            // ===================== APPROVALS ======================
            // ======================================================
            
            var lastSequence = await _context.PviiiTblApprovalDetails
                .Where(x => x.P8Id == p8)
                .MaxAsync(x => (int?)x.RecordChangeSequence);

            if (lastSequence != null)
            {
                var lastApprovals = await _context.PviiiTblApprovalDetails
                    .Where(x => x.P8Id == p8 && x.RecordChangeSequence == lastSequence)
                    .ToListAsync();

                if (lastApprovals.Any())
                {
                    foreach (var approval in lastApprovals)
                    {
                        approval.ApprovalActiveStatus = false;
                    }

                    foreach (var approval in lastApprovals)
                    {
                        var newApproval = new PviiiTblApprovalDetail
                        {
                            P8Id = approval.P8Id,
                            ApprovalLevelId = approval.ApprovalLevelId,
                            StandardCommentsDocumentation = approval.StandardCommentsDocumentation,
                            ApprovalIndicator = approval.ApprovalIndicator,
                            ApproverLevel = approval.ApproverLevel,
                            ProjectRiskLevel = approval.ProjectRiskLevel,
                            ApproverId = approval.ApproverId,
                            RecordChangeSequence = (lastSequence ?? 0) + 1,
                            ApprovalActiveStatus = true,
                            CreatedByUserEmail = email,
                            CreatedDateTime = DateTime.Now
                        };
                        _context.PviiiTblApprovalDetails.Add(newApproval);
                    }
                }
            }

            // ======================================================
            // SAVE
            // ======================================================
            await _context.SaveChangesAsync();
        }

        // ============================================================
        // 1. CREATE PROJECT 
        // ============================================================
        public Result CreateProject(CreateProjectDto dto)
        {
            var result = new Result();

            using var trx = _context.Database.BeginTransaction();

            try
            {
                Guid p8Id = GenerateP8Id();
                dto.FiscalYear = dto.FiscalYear?.Trim();

                if (!short.TryParse(dto.FiscalYear, out short fiscalYear))
                {
                    return new Result
                    {
                        Correct = false,
                        ErrorMessage = $"FiscalYear inválido: '{dto.FiscalYear}'"
                    };
                }

                // ============================================================
                // 2. Resolve Catalog Data
                // ============================================================
                var revenueTypeEntity = _context.PviiiCatRevTypes
                    .FirstOrDefault(r => r.P8revenueTypeLabel == dto.RevenueType);

                if (revenueTypeEntity == null)
                    return new Result { Correct = false, ErrorMessage = $"RevenueType '{dto.RevenueType}' no existe." };

                var segmentEntity = _context.PviiiCatSegments
    .FirstOrDefault(s => s.SegmentId == dto.SegmentId);
                if (segmentEntity == null)
                    return new Result { Correct = false, ErrorMessage = $"SegmentId '{dto.SegmentId}' no existe." };

                var fiscalYearEntity = _context.PviiiCatFiscalYearRefs
                    .FirstOrDefault(f => f.P8FiscalYearLabel == fiscalYear);

                if (fiscalYearEntity == null)
                    return new Result { Correct = false, ErrorMessage = $"FiscalYear '{dto.FiscalYear}' no existe." };

                var buCatalogEntity = _context.PviiiCatSegments
                    .FirstOrDefault(b => b.SegmentId.ToString() == dto.SegmentId.ToString());

                if (buCatalogEntity == null)
                    return new Result { Correct = false, ErrorMessage = $"No existe BU para SegmentId '{dto.SegmentId}'." };

                  var buEntity = _context.PviiiCatBusinessUnitRefs
                        .FirstOrDefault(b =>
                            b.BusinessUnitIdLabel.Trim().ToUpper() ==
                            buCatalogEntity.BusinessUnitIdLabel.Trim().ToUpper()
                        );
                if (buEntity == null)
                    return new Result { Correct = false, ErrorMessage = $"BU '{buCatalogEntity.BusinessUnitIdLabel}' no existe." };

                // ============================================================
                // 3. Resolve Users
                // ============================================================
                var managerResolved = ResolveUserByEmployeeId(dto.SrManagerEmployeeId ?? 0);
                var partnerResolved = ResolveUserByEmployeeId(dto.PartnerEmployeeId ?? 0);

                // ============================================================
                // 4. Master Current
                // ============================================================
                var master = new PviiiMasterCurrent
                {
                    ClientName = dto.ClientName!,
                    ClientNumber = dto.ClientNumber!,
                    CreatedByUserEmail = dto.CreatedByUserEmail,
                    CreatedDateTime = DateTime.Now,

                    P8Id = p8Id.ToString(),
                    PastYearp8Id = null,
                    P8FiscalYearId = fiscalYearEntity.P8FiscalYearId,
                    P8FiscalYearLabel = fiscalYear,

                    P8revenueTypeId = revenueTypeEntity.P8revenueTypeId,
                    P8revenueTypeLabel = dto.RevenueType,

                    BusinessUnitId = buEntity.BusinessUnitId,
                    BusinessUnitIdLabel = buEntity.BusinessUnitIdLabel!,

                    P8StatusId = 2,
                    P8StatusLabel = "Draft",

                    SegmentId = dto.SegmentId,
                    SegmentLabel = segmentEntity.SegmentLabel,

                    CurrentEngagementManagerId = dto.SrManagerEmployeeId ?? 0,
                    CurrentEngagementManagerName = managerResolved.Name,
                    CurrentEngagementManagerEmail = managerResolved.Email,

                    CurrentEngagementPartnerId = dto.PartnerEmployeeId ?? 0,
                    CurrentEngagementPartnerName = partnerResolved.Name,
                    CurrentEngagementPartnerEmail = partnerResolved.Email,
                    IsLost = false,
                    P8ValidityStatus = true
                };

                _context.PviiiMasterCurrents.Add(master);
                _context.SaveChanges();

                // ============================================================
                // 5. INSERT Team Leader Changes
                // ============================================================
                long recordSequence = 1;

                var teamLeaders = _context.PviiiCatTeamLeaders
                    .Where(x =>
                        x.EmployeeId == dto.PartnerEmployeeId ||
                        x.EmployeeId == dto.SrManagerEmployeeId
                    )
                    .ToList();
                foreach (var leader in teamLeaders)
                {
                    if (leader.EmployeeId == null || leader.EmployeeId < 100000)
                    {
                        throw new Exception(
                            $"EmployeeId inválido para TeamLeader. EmployeeId: {leader.EmployeeId}"
                        );
                    }
                }

                foreach (var leader in teamLeaders)
                {
                    var change = new DL.PviiiFactTeamLeaderChange
                    {
                        P8Id = p8Id.ToString(),
                        EmployeeId = leader.EmployeeId,
                        LevelId = leader.LevelCode,
                        LocalJobLevelName = leader.LevelLabel,
                        CreatedByUserEmail = dto.CreatedByUserEmail,
                        CreatedDateTime = DateTime.Now,
                        EmployeeRate = leader.Fyc,
                        CurrencyCode = leader.CurrencyCode,
                        RecordChangeSequence = recordSequence++,
                        EngagementRoleId = 1,
                        
                    };

                    _context.PviiiFactTeamLeaderChanges.Add(change);
                }

                _context.SaveChanges();

                // ============================================================
                // 6. Commit
                // ============================================================
                trx.Commit();

                result.Object = new
                {
                    p8Id = p8Id,
                    sumClientId = master.SumClientId
                };

                result.Correct = true;
            }
            catch (Exception ex)
            {
                trx.Rollback();
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
            }

            return result;
        }
        //==================================================
        // 1.2 Framework
        //==================================================
        public Result SaveFramework(Guid p8Id, FrameworkDto dto, string userEmail)
        {
            var result = new Result();

            try
            {
                var lastEntity = _context.PviiiTblEngagementContexts
                    .Where(x => x.P8id == p8Id)
                    .OrderByDescending(x => x.RecordChangeSequence)
                    .FirstOrDefault();

                int nextSequence = (int)(
    (lastEntity?.RecordChangeSequence ?? 0) + 1
);
                var entity = new PviiiTblEngagementContext
                {
                    P8id = p8Id,
                    RecordChangeSequence = nextSequence,
                    CreatedAt = DateTime.Now,

                    CreatedByUserEmail = userEmail,

                    FirstYearClient = dto.FirstYearClient,
                    AccountingFrameworks = dto.AccountingFrameworks != null
                        ? string.Join(",", dto.AccountingFrameworks)
                        : null,
                    AuditingStandards = dto.AuditingStandards != null
                        ? string.Join(",", dto.AuditingStandards)
                        : null,
                    Icofr = dto.ICOFR,
                    Industry = dto.Industry,
                    PreliminaryRiskProject = dto.PreliminaryRiskProject?.ToLower()
                };

                if (dto.LocalOrReferred == "Local")
                {
                    entity.LocalReferedLabel = "Local";
                    entity.EntityIndustryLabel = null;
                }
                else if (dto.LocalOrReferred == "Referred")
                {
                    entity.LocalReferedLabel = "Referred";
                    entity.EntityIndustryLabel = dto.ReferredCountry;
                }
                VersioningResetAsync(p8Id, userEmail).Wait();

                _context.PviiiTblEngagementContexts.Add(entity);
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
        public Result GetFramework(Guid p8Id)
        {
            var result = new Result();

            try
            {
                var master = _context.PviiiMasterCurrents
                    .FirstOrDefault(m => m.P8Id == p8Id.ToString());

                if (master == null)
                    throw new Exception("Master record not found.");

                Guid currentP8Guid = p8Id;
                Guid? pastP8Guid = string.IsNullOrEmpty(master.PastYearp8Id)
                    ? null
                    : Guid.Parse(master.PastYearp8Id);

                var entity = _context.PviiiTblEngagementContexts
                    .Where(x => x.P8id == currentP8Guid)
                    .OrderByDescending(x => x.RecordChangeSequence)
                    .FirstOrDefault();

                if (entity == null && pastP8Guid.HasValue)
                {
                    entity = _context.PviiiTblEngagementContexts
                        .Where(x => x.P8id == pastP8Guid.Value)
                        .OrderByDescending(x => x.RecordChangeSequence)
                        .FirstOrDefault();
                }

                if (entity == null)
                {
                    result.Correct = false;
                    result.ErrorMessage = "Framework no encontrado.";
                    return result;
                }

                string? localOrReferred = null;
                string? referredCountry = null;

                if (entity.LocalReferedLabel == "Local")
                    localOrReferred = "Local";
                else if (entity.LocalReferedLabel == "Referred")
                {
                    localOrReferred = "Referred";
                    referredCountry = entity.EntityIndustryLabel;
                }

                var dto = new FrameworkDto
                {
                    Id = entity.Id,
                    P8Id = entity.P8id,
                    FirstYearClient = entity.FirstYearClient,
                    AccountingFrameworks = entity.AccountingFrameworks?
                        .Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                    AuditingStandards = entity.AuditingStandards?
                        .Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                    ICOFR = entity.Icofr,
                    Industry = entity.Industry,
                    LocalOrReferred = localOrReferred,
                    ReferredCountry = referredCountry,
                    PreliminaryRiskProject = entity.PreliminaryRiskProject,
                    CreatedByUserEmail = entity.CreatedByUserEmail,
                    CreatedAt = DateTime.Now
                };

                result.Object = dto;
                result.Correct = true;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }


        //==================================================
        // 1.3 DETAILS (Engagement details)
        //==================================================

        private (string Name, string Email) ResolveUserByEmployeeId(int employeeId)
        {
            var user = _context.PviiiCatTeamLeaders
                .FirstOrDefault(u => u.EmployeeId == employeeId);

            if (user == null)
                throw new Exception($"Usuario no encontrado para EmployeeId {employeeId}");

            return (user.EmployeeName, user.EmployeeEmail);
        }

        private bool HasEngagementChanges(
            PviiiTblProyectDetail last,
            EngagementDetailsDto dto)
        {
            if (last == null) return true;

            return
                last.AuditModality != dto.AuditModality ||
                last.OfficeLabel != dto.ResponsibleOfficeLabel ||
                last.AddressLine != dto.AddressLine ||
                last.PostalCode != dto.PostalCode ||
                last.PhoneNumber != dto.PhoneNumber ||
                last.ProjectDescription != dto.ProjectServiceDescription ||
                last.AuditFiscalYear != dto.AuditYear ||
                last.ReportGroupAuditor != (dto.IsReportToGroup ?? false) ||
                last.IsConsolidated != (dto.IsConsolidated ?? false);
        }

        private long GetNextTeamLeaderBatchSequence(Guid p8Id)
        {
            var lastSequence = _context.PviiiFactTeamLeaderChanges
                .Where(x => x.P8Id == p8Id.ToString())
                .Max(x => (long?)x.RecordChangeSequence) ?? 0;

            return lastSequence + 1;
        }

        private void RegisterTeamLeaderChange(
            Guid p8Id,
            PviiiCatTeamLeader leader,
            int engagementRoleId,
            string createdByUserEmail,
            long batchSequence)
        {
            var change = new DL.PviiiFactTeamLeaderChange
            {
                P8Id = p8Id.ToString(),
                EmployeeId = leader.EmployeeId,
                LevelId = leader.LevelCode,
                LocalJobLevelName = leader.LevelLabel,
                EmployeeRate = leader.Fyc,
                CurrencyCode = leader.CurrencyCode,
                EngagementRoleId = engagementRoleId,
                CreatedByUserEmail = createdByUserEmail,
                CreatedDateTime = DateTime.Now,
                RecordChangeSequence = batchSequence
            };

            _context.PviiiFactTeamLeaderChanges.Add(change);
        }
       
        private (string SegmentLabel, int BusinessUnitId, string BusinessUnitLabel) ResolveSegmentAndBU(int segmentId)
        {
            var segment = _context.PviiiCatSegments
                .FirstOrDefault(s => s.SegmentId == segmentId);

            if (segment == null)
                throw new Exception($"Segment no encontrado para id {segmentId}");

            var buLabel = segment.BusinessUnitIdLabel?.Trim().ToUpper();

            var businessUnit = _context.PviiiCatBusinessUnitRefs
                .FirstOrDefault(b => b.BusinessUnitIdLabel == buLabel);

            if (businessUnit == null)
                throw new Exception($"BusinessUnit inválida en catálogo Segment: '{buLabel}'");

            return (
                segment.SegmentLabel,
                businessUnit.BusinessUnitId,
                businessUnit.BusinessUnitIdLabel
            );
        }

        public Result UpdateEngagementDetails(Guid p8Id, EngagementDetailsDto dto, string email)
        {
            var result = new Result();

            using var trx = _context.Database.BeginTransaction();

            try
            {
                var lastEngagement = _context.PviiiTblProyectDetails
                    .Where(e => e.P8Id == p8Id)
                    .OrderByDescending(e => e.RecordChangeSequence)
                    .FirstOrDefault();

                var master = _context.PviiiMasterCurrents
                    .FirstOrDefault(m => m.P8Id == p8Id.ToString());

                if (master == null)
                    throw new Exception("MasterHistory no encontrado.");

                // ================================
                // Early return real
                // ================================
                bool hasTeamLeaderHistory =
                    _context.PviiiFactTeamLeaderChanges
                        .Any(x => x.P8Id == p8Id.ToString());

                if (hasTeamLeaderHistory &&
                    !HasEngagementChanges(lastEngagement, dto) &&
                    !dto.EngagementManagerEmployeeId.HasValue &&
                    !dto.EngagementLeadEmployeeId.HasValue)
                {
                    result.Correct = true;
                    result.Object = lastEngagement;
                    return result;
                }

                // ================================
                // Crear engagement snapshot
                // ================================
                int nextEngagementSequence =
                    (int)((lastEngagement?.RecordChangeSequence ?? 0) + 1);

                var engagement = new PviiiTblProyectDetail
                {
                    P8Id = p8Id,
                    IsP8active = true,
                    CreatedDateTime = DateTime.Now,
                    CreatedByUserEmail = email,
                    RecordChangeSequence = nextEngagementSequence,

                    AuditModality = dto.AuditModality,
                    OfficeLabel = dto.ResponsibleOfficeLabel,
                    AddressLine = dto.AddressLine,
                    PostalCode = dto.PostalCode,
                    PhoneNumber = dto.PhoneNumber,
                    ProjectDescription = dto.ProjectServiceDescription,
                    AuditFiscalYear = dto.AuditYear,
                    ReportGroupAuditor = dto.IsReportToGroup ?? false,
                    IsConsolidated = dto.IsConsolidated ?? false,

                    UpdatedByUserEmail = email,
                    UpdatedDateTime = DateTime.Now
                };

                _context.PviiiTblProyectDetails.Add(engagement);

                // ================================
                // Resolver liderazgo efectivo
                // ================================
                int? managerId =
                    dto.EngagementManagerEmployeeId ?? master.CurrentEngagementManagerId;

                int? partnerId =
                    dto.EngagementLeadEmployeeId ?? master.CurrentEngagementPartnerId;

                bool hasValidLeadership =
                    managerId.HasValue && managerId.Value > 0 &&
                    partnerId.HasValue && partnerId.Value > 0;

                if (hasValidLeadership)
                {
                    long nextBatchSequence = GetNextTeamLeaderBatchSequence(p8Id);

                    var managerLeader = _context.PviiiCatTeamLeaders
                        .FirstOrDefault(x => x.EmployeeId == managerId.Value);

                    var partnerLeader = _context.PviiiCatTeamLeaders
                        .FirstOrDefault(x => x.EmployeeId == partnerId.Value);

                    if (managerLeader == null || partnerLeader == null)
                        throw new Exception("Manager o Partner no localizado en catálogo.");

                    RegisterTeamLeaderChange(p8Id, managerLeader, 2, email, nextBatchSequence);
                    RegisterTeamLeaderChange(p8Id, partnerLeader, 1, email, nextBatchSequence);

                    var managerInfo = ResolveUserByEmployeeId(managerId.Value);
                    master.CurrentEngagementManagerId = managerId.Value;
                    master.CurrentEngagementManagerName = managerInfo.Name;
                    master.CurrentEngagementManagerEmail = managerInfo.Email;

                    var partnerInfo = ResolveUserByEmployeeId(partnerId.Value);
                    master.CurrentEngagementPartnerId = partnerId.Value;
                    master.CurrentEngagementPartnerName = partnerInfo.Name;
                    master.CurrentEngagementPartnerEmail = partnerInfo.Email;

                    if (dto.SegmentId.HasValue && dto.SegmentId.Value > 0)
                    {
                        

                        var seg = ResolveSegmentAndBU(dto.SegmentId.Value);

                        master.SegmentId = dto.SegmentId.Value;
                        master.SegmentLabel = seg.SegmentLabel;
                        master.BusinessUnitId = seg.BusinessUnitId;
                        master.BusinessUnitIdLabel = seg.BusinessUnitLabel;

                    }
                    master.UpdatedByUserEmail = email;
                    master.UpdatedDateTime = DateTime.Now;
                }
                VersioningResetAsync(p8Id, email).Wait();

                _context.SaveChanges();
                trx.Commit();

                result.Correct = true;
                result.Object = engagement;
            }
           
            catch (Exception ex)
            {
                trx.Rollback();

                var msg = ex.ToString(); 

                result.Correct = false;
                result.ErrorMessage = msg;
            }
            return result;
        }
        // ============================================================
        // 2. Compliance (antes Quality)
        // ============================================================

        public Result UpdateQuality(Guid p8Id, QualityDto dto, string userEmail)
        {
            var result = new Result();

            try
            {
                string currentP8 = p8Id.ToString();

                // ======================================================
                // VALIDAR ENGAGEMENT ACTIVO
                // ======================================================
                var engagement = _context.PviiiTblProyectDetails
                    .Where(e => e.P8Id == p8Id)
                    .OrderByDescending(e => e.RecordChangeSequence)
                    .FirstOrDefault();

                // ======================================================
                // RESOLVER MASTER / P8 HISTÓRICO
                // ======================================================
                var master = _context.PviiiMasterCurrents
                    .FirstOrDefault(m => m.P8Id == currentP8);

                string? historicalP8 = string.IsNullOrEmpty(master?.PastYearp8Id)
                    ? null
                    : master.PastYearp8Id;

                // ======================================================
                // ÚLTIMA VERSIÓN QUALITY (GLOBAL)
                // ======================================================
                var lastQuality = _context.PviiiTblProyectQualityDetails
                    .Where(q =>
                        q.P8Id == currentP8 ||
                        (historicalP8 != null && q.P8Id == historicalP8))
                    .OrderByDescending(q => q.RecordChangeSequence)
                    .FirstOrDefault();

                int nextSequence = (int)((lastQuality?.RecordChangeSequence ?? 0) + 1);

                // ======================================================
                //  INSERTAR NUEVA VERSIÓN (SNAPSHOT)
                // ======================================================
                var quality = new PviiiTblProyectQualityDetail
                {
                    P8Id = currentP8,
                    RecordChangeSequence = nextSequence,

                    IsPublicEntity = dto.IsPublicEntity,
                    IsRegulatedEntity = dto.IsRegulatedEntity,
                    IsListedEntity = dto.IsListedEntity,
                    IsSignificantSecSubsidiary = dto.IsSignificantSecSubsidiary,
                    IsSubstantialRoleGrp = dto.IsReportGroup,
                    Aits = dto.Aits,
                    PyCeac = dto.PyCeac,
                    CyCeac = dto.CyCeac,
                    IsSecAffiliate = dto.IsSecAffiliate,
                    NatureOfEngagementLabel = dto.NatureOfEngagementLabel,
                    AuditWorkflowLabel = dto.AuditWorkflowLabel,
                    StatutoryExaminerLabel = dto.StatutoryExaminerLabel,

                    CreatedByUserEmail = userEmail,
                    CreatedDateTime = DateTime.Now
                };
                VersioningResetAsync(p8Id, userEmail).Wait();

                _context.PviiiTblProyectQualityDetails.Add(quality);
                _context.SaveChanges();

                result.Correct = true;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
            }

            return result;
        }

        // ============================================================
        // 3. Entities
        // ============================================================
        public async Task<List<EntityModel>> SearchAsync(string? query, int page, int pageSize)
        {
            int skip = (page - 1) * pageSize;

            var queryable = _context.VwEntities.AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                queryable = queryable.Where(e =>
                    EF.Functions.Like(e.EntityDescription!, $"%{query}%") ||
                    e.EntityId!.ToString().Contains(query)
                );
            }

            return await queryable
                .OrderBy(e => e.EntityDescription)
                .Skip(skip)
                .Take(pageSize)
                .Select(e => new EntityModel
                {
                    Id = e.EntityId ?? 0,
                    Description = e.EntityDescription,
                    GroupId = e.EntityGroupId ?? 0,
                    GroupDescription = e.EntityGroupDescription,
                    Sector = e.EntitySector,
                    Lob = e.EntityLob
                })
                .ToListAsync();
        }

        public Result SaveEngagementConfiguration(
            string p8Id,
            SaveClientConfigurationDto dto,
            string email)
        {
            var result = new Result();

            using var trx = _context.Database.BeginTransaction();
            try
            {
                // ===========================================================
                // QUALITY GENERAL – OBTENER ÚLTIMA VERSIÓN O CREAR BASE
                // ===========================================================

                var lastGeneral = _context.PviiiTblProyectQualityDetails
                    .Where(x => x.P8Id == p8Id)
                    .OrderByDescending(x => x.RecordChangeSequence)
                    .FirstOrDefault();

                if (lastGeneral == null)
                {
                    lastGeneral = new PviiiTblProyectQualityDetail
                    {
                        P8Id = p8Id,
                        RecordChangeSequence = 0,
                        CreatedByUserEmail = email,
                        CreatedDateTime = DateTime.Now
                    };

                    _context.PviiiTblProyectQualityDetails.Add(lastGeneral);
                    _context.SaveChanges();
                }

                // ===========================================================
                // NORMALIZACIÓN
                // ===========================================================

                string Normalize(object? val)
                {
                    if (val == null) return null;
                    if (val is IEnumerable<string> list)
                        return string.Join(", ", list);
                    return val.ToString()?.Trim();
                }

                // ===========================================================
                //  ENTITY REPORT CONFIG 
                // ===========================================================

                int nextEventSequence =
                    (_context.PviiiTblEntityReportConfigs
                        .Where(x => x.P8Id == p8Id)
                        .Select(x => (int?)x.RecordChangeSequence)
                        .Max() ?? 0) + 1;
                var actives = _context.PviiiTblEntityReportConfigs
                    .Where(x => x.P8Id == p8Id && x.IsActive)
                    .ToList();

                foreach (var a in actives)
                {
                    a.IsActive = false;
                }

                foreach (var dtoEntity in dto.EntityConfigurations)
                {
                    if (dtoEntity.IsDeleted)
                        continue;

                    
                    var opinionDate = dtoEntity.OpinionDate.HasValue
                        ? DateOnly.FromDateTime(
                            DateTime.SpecifyKind(dtoEntity.OpinionDate.Value, DateTimeKind.Unspecified)
                          )
                        : (DateOnly?)null;
                    if (dtoEntity.EntityId == null)
                    {
                        throw new Exception("EntityId viene null en el DTO");
                    }

                    _context.PviiiTblEntityReportConfigs.Add(
                        new PviiiTblEntityReportConfig
                        {
                            P8Id = p8Id,
                            ClientNumber = dtoEntity.EntityId?.ToString(),
                            ClientName = dtoEntity.EntityName,
                            ReportType = dtoEntity.ReportTypeLabel,
                            ReviewerTypeLabel =
                                string.IsNullOrWhiteSpace(dtoEntity.ReviewerTypeLabel)
                                    ? "NotApplicable"
                                    : dtoEntity.ReviewerTypeLabel,
                            OpinionDate = opinionDate,
                            AuditFeeAmount = dtoEntity.AuditFeeAmount,
                            ReportFeeAmount = dtoEntity.ReportFeeAmount,
                            TaxFeeAmount = dtoEntity.TaxFeeAmount,
                            IsActive = true,
                            CreatedByUserEmail = email,
                            CreatedDateTime = DateTime.Now,
                            RecordChangeSequence = nextEventSequence
                        });
                }
                
                // ===========================================================
                // QUALITY REVIEWS 
                // ===========================================================
                int nextQualityEventSequence =
                    (_context.PviiiTblQualityReviews
                        .Where(x => x.P8Id == p8Id)
                        .Select(x => (int?)x.RecordChangeSequence)
                        .Max() ?? 0) + 1;
                
                var activeEntities = dto.EntityConfigurations
                    .Where(x => !x.IsDeleted)
                    .ToList();

                var lsqcr = activeEntities
                    .FirstOrDefault(x => x.EmployeeIdLsqcr.HasValue);

                var eqcr = activeEntities
                    .FirstOrDefault(x => x.EmployeeIdEqcr.HasValue);


                var employeeIds = new List<int>();

                if (lsqcr?.EmployeeIdLsqcr != null)
                    employeeIds.Add(lsqcr.EmployeeIdLsqcr.Value);

                if (eqcr?.EmployeeIdEqcr != null)
                    employeeIds.Add(eqcr.EmployeeIdEqcr.Value);

                var teamLeaders = _context.PviiiCatTeamLeaders
                    .Where(x => employeeIds.Contains(x.EmployeeId))
                    .ToList();

                PviiiCatTeamLeader GetLeader(int employeeId) =>
                    teamLeaders.FirstOrDefault(x => x.EmployeeId == employeeId);

                var activeReviews = _context.PviiiTblQualityReviews
                    .Where(x => x.P8Id == p8Id && x.IsActive)
                    .ToList();

                foreach (var r in activeReviews)
                {
                    r.IsActive = false;
                }

                var now = DateTime.Now;

                // ---------- LSQCR ----------
                if (lsqcr != null)
                {
                    var leader = GetLeader(lsqcr.EmployeeIdLsqcr.Value);

                    var hours = (int)(lsqcr.LsqcrReviewerHours ?? 0);
                    var rate = leader?.Fyc ?? 0;
                    var fee = hours * rate;

                    _context.PviiiTblQualityReviews.Add(
                        new PviiiTblQualityReview
                        {
                            P8Id = p8Id,
                            ReviewerType = 1,

                            ReviewerHours = hours,
                            ReviewerRate = rate,
                            ReviewerFee = fee,
                            CurrencyCode = leader?.CurrencyCode,

                            QualityReviewerId = lsqcr.EmployeeIdLsqcr.Value,
                            QualityReviewerName = lsqcr.LsqcrReviewerName,

                            CreatedByUserEmail = email,
                            CreatedDateTime = now,

                            RecordChangeSequence = nextQualityEventSequence,
                            IsActive = true
                        });
                }

                // ---------- EQCR ----------
                if (eqcr != null)
                {
                    var leader = GetLeader(eqcr.EmployeeIdEqcr.Value);

                    var hours = (int)(eqcr.Eqcrhours ?? 0);
                    var rate = leader?.Fyc ?? 0;
                    var fee = hours * rate;

                    _context.PviiiTblQualityReviews.Add(
                        new PviiiTblQualityReview
                        {
                            P8Id = p8Id,
                            ReviewerType = 2,

                            ReviewerHours = hours,
                            ReviewerRate = rate,
                            ReviewerFee = fee,
                            CurrencyCode = leader?.CurrencyCode,

                            QualityReviewerId = eqcr.EmployeeIdEqcr.Value,
                            QualityReviewerName = eqcr.Eqcrreviewer,

                            CreatedByUserEmail = email,
                            CreatedDateTime = now,

                            RecordChangeSequence = nextQualityEventSequence,
                            IsActive = true
                        });

                }
                VersioningResetAsync(Guid.Parse(p8Id), email).Wait();

                _context.SaveChanges();

                // ===========================================================
                // COMMIT
                // ===========================================================

                trx.Commit();

                result.Correct = true;
                result.Object = new
                {
                    p8Id,
                };

                return result;
            }
            catch (Exception ex)
            {
                trx.Rollback();
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                return result;
            }
        }
        // ============================================================
        // 4. STAFFING
        // ============================================================


        private static readonly HashSet<DateTime> Holidays = new()
        {
           // 2021
            new DateTime(2021, 11, 2),
            new DateTime(2021, 11, 15),
            new DateTime(2021, 12, 25),
            new DateTime(2021, 12, 31),

            // 2022
            new DateTime(2022, 2, 7),
            new DateTime(2022, 3, 21),
            new DateTime(2022, 4, 14),
            new DateTime(2022, 4, 15),
            new DateTime(2022, 5, 10),
            new DateTime(2022, 9, 15),
            new DateTime(2022, 9, 16),
            new DateTime(2022, 11, 2),
            new DateTime(2022, 11, 21),
            new DateTime(2022, 12, 12),

            // 2023
            new DateTime(2023, 2, 6),
            new DateTime(2023, 3, 20),
            new DateTime(2023, 4, 6),
            new DateTime(2023, 4, 7),
            new DateTime(2023, 5, 1),
            new DateTime(2023, 5, 10),
            new DateTime(2023, 9, 15),
            new DateTime(2023, 11, 2),
            new DateTime(2023, 11, 20),
            new DateTime(2023, 12, 12),
            new DateTime(2023, 12, 25),

            // 2024
            new DateTime(2024, 1, 1),
            new DateTime(2024, 2, 5),
            new DateTime(2024, 3, 18),
            new DateTime(2024, 3, 28),
            new DateTime(2024, 3, 29),
            new DateTime(2024, 5, 1),
            new DateTime(2024, 5, 10),
            new DateTime(2024, 9, 16),
            new DateTime(2024, 11, 18),
            new DateTime(2024, 12, 12),
            new DateTime(2024, 12, 24),
            new DateTime(2024, 12, 25),

            // 2025
            new DateTime(2025, 1, 1),
            new DateTime(2025, 2, 3),
            new DateTime(2025, 3, 17),
            new DateTime(2025, 4, 17),
            new DateTime(2025, 4, 18),
            new DateTime(2025, 5, 1),
            new DateTime(2025, 9, 15),
            new DateTime(2025, 9, 16),
            new DateTime(2025, 11, 17),
            new DateTime(2025, 12, 12),
            new DateTime(2025, 12, 24),
            new DateTime(2025, 12, 25),
            new DateTime(2025, 12, 31),

            // 2026
            new DateTime(2026, 1, 1),
            new DateTime(2026, 2, 2),
            new DateTime(2026, 3, 16),
            new DateTime(2026, 4, 2),
            new DateTime(2026, 4, 3),
            new DateTime(2026, 5, 1),
            new DateTime(2026, 9, 15),
            new DateTime(2026, 9, 16),
            new DateTime(2026, 11, 2),
            new DateTime(2026, 11, 16),
            new DateTime(2026, 12, 24),
            new DateTime(2026, 12, 25),
            new DateTime(2026, 12, 31),

            // 2027
            new DateTime(2027, 1, 1),
            new DateTime(2027, 2, 1),
            new DateTime(2027, 3, 15),
            new DateTime(2027, 3 ,25),
            new DateTime(2027, 3, 26),
            new DateTime(2027, 5, 10),
            new DateTime(2027, 9, 15),
            new DateTime(2027, 9, 16),
            new DateTime(2027, 11, 2),
            new DateTime(2027, 12, 24),
            new DateTime(2027, 12, 31),

            // 2028
            new DateTime(2028, 1, 1),
            new DateTime(2028, 2, 7),
            new DateTime(2028, 3, 20),
            new DateTime(2028, 4, 13),
            new DateTime(2028, 4, 14),
            new DateTime(2028, 5, 1),
            new DateTime(2028, 5, 10),
            new DateTime(2028, 9, 15),
            new DateTime(2028, 9, 16),
            new DateTime(2028, 11, 20),
            new DateTime(2028, 12, 12),
            new DateTime(2028, 12, 24),
            new DateTime(2028, 12, 25),
            new DateTime(2028, 12, 31),

        };
        private static void ValidateMaxTwoFiscalYears(DateTime startDate, DateTime endDate)
        {

            

            int fyStart = GetFiscalYear(startDate);
            int fyEnd = GetFiscalYear(endDate);

            if ((fyEnd - fyStart) > 1)
            {
                throw new ApplicationException(
      $"The date range ({startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}) cannot span more than 2 fiscal years."
  );
            }
        }

        private static int GetFiscalYear(DateTime date)
        {
            return (date.Month >= 10) ? date.Year + 1 : date.Year;
        }
        private (int fypDays, int fycDays) CalculateFiscalWorkingDays(DateTime startDate,
             DateTime endDate,HashSet<DateTime> holidays)
        {
            if (startDate > endDate)
                return (0, 0);
            int fypDays = 0;
            int fycDays = 0;
            int fiscalYearStart = GetFiscalYear(startDate);
            var current = startDate.Date;
            while (current <= endDate.Date)
            {
                bool isWeekend =
                    current.DayOfWeek == DayOfWeek.Saturday ||
                    current.DayOfWeek == DayOfWeek.Sunday;
                bool isHoliday = holidays.Contains(current);
                if (!isWeekend && !isHoliday)
                {
                    //int startYear = 
                    int currentFiscalYear = GetFiscalYear(current);
                    int currentMonth = startDate.Month; 
                    int yearProgramao = startDate.Year;
                    /* past
                    if ((currentMonth < 10) && (currentFiscalYear == fiscalYearStart))
                        fypDays++;
                    else
                        fycDays++;
                    */
                    if (currentFiscalYear == 2027) //today
                        fycDays++;
                    else
                        fypDays++; 

                    Console.WriteLine(
                        $"yearProgramao={yearProgramao} && {currentFiscalYear} && {fiscalYearStart}");

                }

                current = current.AddDays(1);
            }
            return (fypDays, fycDays);

        }


        private static string NormalizeCategoria(string categoria)
        {
            return categoria switch
            {
                "Staff – Mid-time" => "Staff-Medio Tiempo",
                "Staff In Charge – Mid-time" => "Staff In Charge-Medio Tiempo",
                _ => categoria
            };
        }
        
        public List<StaffingPreviewDto> CalculateStaffingPreview(List<StaffingDto> dtos)
        {
            var previews = new List<StaffingPreviewDto>();
            var rates = _context.CatRateByCategories.ToList();

            foreach (var dto in dtos)
            {

                var start = dto.StartDate.ToDateTime(TimeOnly.MinValue);
                var end = dto.EndDate.ToDateTime(TimeOnly.MinValue);

                try
                {
                    ValidateMaxTwoFiscalYears(start, end);
                }
                catch (Exception ex)
                {
                    throw new ApplicationException(ex.Message);
                }

                int fypYear = GetFiscalYear(dto.StartDate.ToDateTime(TimeOnly.MinValue));
                int fycYear = fypYear + 1;

                var ratesByKey = rates
                    .Where(r =>
                        r.SegmentId == dto.EngagementSegmentId &&
                        r.CostCenterId == dto.CostCenter &&
                        r.LevelLabel == NormalizeCategoria(dto.LevelLabel)
                    )
                    .ToList();
                
                var fypRate = ratesByKey.FirstOrDefault(r =>
                r.FiscalYearLabel == GetFiscalYear(dto.StartDate.ToDateTime(TimeOnly.MinValue)));

                var fycRate = ratesByKey.FirstOrDefault(r =>
                    r.FiscalYearLabel == GetFiscalYear(dto.EndDate.ToDateTime(TimeOnly.MinValue)));
                if (fypRate == null && fycRate == null)
                    continue;

                var (fypDays, fycDays) = CalculateFiscalWorkingDays(
                    dto.StartDate.ToDateTime(TimeOnly.MinValue),
                    dto.EndDate.ToDateTime(TimeOnly.MinValue),
                    Holidays
                );
                

                decimal horasBase =
                    (decimal)(fypRate?.HoursByLevel ?? fycRate?.HoursByLevel ?? 8);

                decimal fypHours = fypDays * horasBase * dto.PeopleCount;
                decimal fycHours = fycDays * horasBase * dto.PeopleCount;

                decimal fypFee = fypRate != null ? fypHours * fypRate.CategoryRate : 0;
                decimal fycFee = fycRate != null ? fycHours * fycRate.CategoryRate : 0;
               

                var windowKey = $"{dto.StartDate:yyyy-MM-dd}_{dto.EndDate:yyyy-MM-dd}";

                previews.Add(new StaffingPreviewDto
                {
                    WindowKey = windowKey,
                    WindowStart = dto.StartDate,
                    WindowEnd = dto.EndDate,
                    LevelLabel = dto.LevelLabel,
                    Hours = fypHours + fycHours,
                    Fees = fypFee + fycFee
                });
            }

            return previews;
        }

        public Result SaveStaffing(
    Guid p8Id,
    DateTime cutoffDate,
    List<StaffingDto> dtos,
    SchedulingConsiderationDto schedulingDto,
    string email)
        {
            var result = new Result();
            using var trx = _context.Database.BeginTransaction();

            try
            {
                string p8 = p8Id.ToString();
                var now = DateTime.Now;

                var rates = _context.CatRateByCategories.ToList();

                // =========================================================
                // NUEVO EVENTO (SNAPSHOT)
                // =========================================================
                int nextEventSequence =
                    (_context.PviiiTblStaffingAllocations
                        .Where(x => x.P8Id == p8)
                        .Select(x => (int?)x.RecordChangeSequence)
                        .Max() ?? 0) + 1;

                // =========================================================
                // CERRAR SNAPSHOT ANTERIOR
                // =========================================================
                var activeStaffing = _context.PviiiTblStaffingAllocations
                    .Where(x => x.P8Id == p8 && x.IsActive)
                    .ToList();

                foreach (var s in activeStaffing)
                {
                    s.IsActive = false;
                }

                // =========================================================
                //  INSERTAR SNAPSHOT ACTUAL
                // =========================================================
                foreach (var dto in dtos)
                {

                    var start = dto.StartDate.ToDateTime(TimeOnly.MinValue);
                    var end = dto.EndDate.ToDateTime(TimeOnly.MinValue);

                    ValidateMaxTwoFiscalYears(start, end);

                    var ratesByKey = rates
                        .Where(r =>
                            r.SegmentId == dto.EngagementSegmentId &&
                            r.CostCenterId == dto.CostCenter &&
                            r.LevelLabel == NormalizeCategoria(dto.LevelLabel))
                        .ToList();

                    var fypRate = ratesByKey.FirstOrDefault(r =>
                        r.FiscalYearLabel ==
                        GetFiscalYear(dto.StartDate.ToDateTime(TimeOnly.MinValue)));

                    var fycRate = ratesByKey.FirstOrDefault(r =>
                        r.FiscalYearLabel ==
                        GetFiscalYear(dto.EndDate.ToDateTime(TimeOnly.MinValue)));

                    if (fypRate == null && fycRate == null)
                        continue;

                    var (fypDays, fycDays) = CalculateFiscalWorkingDays(
                        dto.StartDate.ToDateTime(TimeOnly.MinValue),
                        dto.EndDate.ToDateTime(TimeOnly.MinValue),
                        Holidays
                    );

                    decimal horasBase =
                        (decimal)(fypRate?.HoursByLevel ?? fycRate?.HoursByLevel ?? 8);

                    decimal fypHours = fypDays * horasBase * dto.PeopleCount;
                    decimal fycHours = fycDays * horasBase * dto.PeopleCount;

                    decimal fypFee = fypRate != null
                        ? fypHours * fypRate.CategoryRate
                        : 0;

                    decimal fycFee = fycRate != null
                        ? fycHours * fycRate.CategoryRate
                        : 0;

                    decimal totalHours = fypHours + fycHours;
                    decimal totalFees = fypFee + fycFee;

                    decimal RateAmountPastFiscalYearChidas = fypHours == 0 ? 0 : (fypRate?.CategoryRate ?? 0); //by er
                    decimal RateAmountCurrentFiscalYearChidas = fycHours == 0 ? 0 : (fycRate?.CategoryRate ?? 0); //by er

                    _context.PviiiTblStaffingAllocations.Add(
                        new PviiiTblStaffingAllocation
                        {
                            P8Id = p8,
                            StartDate = dto.StartDate,
                            EndDate = dto.EndDate,
                            LevelLabel = dto.LevelLabel,
                            PeopleCount = dto.PeopleCount,
                            CostCenter = dto.CostCenter,

                            HoursPastFiscalYear = fypHours,
                            HoursCurrentFiscalYear = fycHours,

                            HoursTotal = totalHours,

                            FeesAmountPastFiscalYear = 0,
                            FeesAmountCurrentFiscalYear = fycHours* fycRate?.CategoryRate,

                            RateAmountPastFiscalYear = RateAmountPastFiscalYearChidas, //by er //fypRate?.CategoryRate,

                            RateAmountCurrentFiscalYear = RateAmountCurrentFiscalYearChidas, //by er //fycRate?.CategoryRate,

                            WeekDays = fypDays + fycDays,
                            IsActive = true,
                            CreatedByUserEmail = email,
                            CreatedDateTime = now,
                            RecordChangeSequence = nextEventSequence
                        });
                }


                // =========================================================
                // SCHEDULING CONSIDERATIONS
                // =========================================================
                
                string? suggestedEmployeeIds = null;
                string? suggestedEmployeeNames = null;

                if (schedulingDto.SuggestedCollaborators != null &&
                    schedulingDto.SuggestedCollaborators.Any())
                {
                    suggestedEmployeeNames = string.Join("|",
    schedulingDto.SuggestedCollaborators
        .Select(e => e.SuggestedEmployeeName));

                    suggestedEmployeeIds = string.Join("|",
                        schedulingDto.SuggestedCollaborators
                            .Select(e => e.SuggestedEmployeeId));
                }

                _context.PviiiTblSchedulingConsiderations.Add(
                    new PviiiTblSchedulingConsideration
                    {
                        P8Id = p8,
                        TravelRequired = schedulingDto.TravelRequired,
                        SchedulingNotes = schedulingDto.SchedulingNotes,

                        SuggestedEmployeeId = suggestedEmployeeIds,
                        SuggestedEmployeeName = suggestedEmployeeNames,

                        EngagementSegmentId = schedulingDto.EngagementSegmentId,
                        EngagementSegmentLabel = schedulingDto.EngagementSegmentLabel,
                        CreatedByUserEmail = email,
                        CreatedDateTime = now,
                        RecordChangeSequence = nextEventSequence
                    });
                VersioningResetAsync(p8Id, email).Wait();

                _context.SaveChanges();
                trx.Commit();

                result.Correct = true;
                return result;
            }
            catch (Exception ex)
            {
                trx.Rollback();
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                return result;
            }
        }

        ////============================================================
        ////5. SPECIALISTS
        ////============================================================

        public Result UpsertSpecialists(
    Guid p8Id,
    List<SpecialistsDto> specialists,
    string user)
        {
            var result = new Result();
            using var trx = _context.Database.BeginTransaction();

            try
            {
                string p8 = p8Id.ToString();
                var now = DateTime.Now;

                // =========================================================
                // VALIDAR ENGAGEMENT ACTIVO (READ ONLY)
                // =========================================================
                var engagement = _context.PviiiTblProyectDetails
                    .Where(e => e.P8Id == p8Id && e.IsP8active == true)
                    .OrderByDescending(e => e.RecordChangeSequence)
                    .FirstOrDefault();
                // =========================================================
                // NUEVO EVENTO (SNAPSHOT)
                // =========================================================
                int nextEventSequence =
                    (_context.PviiiTblSpecialists
                        .Where(x => x.P8Id == p8)
                        .Select(x => (int?)x.RecordChangeSequence)
                        .Max() ?? 0) + 1;
                // =========================================================
                // CERRAR SNAPSHOT ANTERIOR
                // =========================================================
                var activeSpecialists = _context.PviiiTblSpecialists
                    .Where(x => x.P8Id == p8 && x.IsActive)
                    .ToList();

                foreach (var s in activeSpecialists)
                {
                    s.IsActive = false;
                }
                var serviceLineCostCenters =
                    _context.PviiiCatServiceLineSpecialists
                        .ToDictionary(
                            x => $"{x.ServiceLineLabel.Trim()}|{x.OfficeLabel.Trim()}",
                            x => x.CostCenter
                        );
                var specialistsEmails = _context.PviiiCatTeamLeaderSpecialists
                        .ToDictionary(x => x.SpecialistLeaderId, x => x.EmployeeEmail);
                // =========================================================
                // INSERTAR SNAPSHOT COMPLETO ACTUAL
                // =========================================================
                foreach (var dto in specialists)
                {

                    var key = $"{dto.ServiceLineLabel.Trim()}|{dto.OfficeLabel.Trim()}";
                    if (!serviceLineCostCenters.TryGetValue(key, out var costCenter))
                        throw new Exception($"CostCenter no configurado para {key}");

                    string email;

                    if (dto.ServiceLinePartnerId.HasValue &&
                        specialistsEmails.TryGetValue(dto.ServiceLinePartnerId.Value, out var resolvedEmail) &&
                        !string.IsNullOrWhiteSpace(resolvedEmail))
                    {
                        email = resolvedEmail;
                    }
                    else
                    {
                        email = "";
                    }
                    VersioningResetAsync(p8Id, user).Wait();

                    _context.PviiiTblSpecialists.Add(
                        new PviiiTblSpecialist
                        {
                            P8Id = p8,
                            ServiceLineSpecialist = dto.ServiceLineLabel,
                            AgreedFeesAmount = dto.AgreedFeesAmount,
                            AuditStagePreliminaryInd = dto.AuditStagePreliminaryInd,
                            AuditStageInterimInd = dto.AuditStageInterimInd,
                            AuditStageFinalInd = dto.AuditStageFinalInd,
                            AuditStagePreliminaryMths = dto.AuditStagePreliminaryMths,
                            AuditStageInterimIndMths = dto.AuditStageInterimMths,
                            AuditStageFinalIndMths = dto.AuditStageFinalMths,
                            ServiceLineInChargeId = dto.ServiceLinePartnerId,
                            ServiceLineInChargeLabel = dto.ServiceLinePartnerLabel,
                            ServiceLineInChargeEmail = dto.ServiceLineInChargeEmail,
                            CostCenter = costCenter,
                            IsActive = true,
                            CreatedByUserEmail = user,
                            CreatedDateTime = now,
                            RecordChangeSequence = nextEventSequence
                        });
                }
                _context.SaveChanges();
                trx.Commit();

                result.Correct = true;
                return result;
            }
            catch (Exception ex)
            {
                trx.Rollback();
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                return result;
            }
        }


        // ============================================================
        // 6. VALUATION
        // ============================================================
        private static decimal SafeDecimal(decimal? value, int scale = 2)
        {
            return Math.Round(value ?? 0, scale, MidpointRounding.AwayFromZero);
        }
        public Result UpdateProjectValuation(
    Guid p8Id,
    ML.Pviii.ValuationDto dto,
    string email)
        {
            var result = new Result();

            try
            {


                string p8 = p8Id.ToString();
                var now = DateTime.Now;
                var lastValuation = _context.PviiiTblProyectValuationDetails
                        .Where(v => v.P8Id == p8 && v.IsActive == true)
                        .OrderByDescending(v => v.RecordChangeSequence)
                        .FirstOrDefault();
                int nextSeq = (int)((lastValuation?.RecordChangeSequence ?? 0) + 1);

                if (lastValuation != null)
                {
                    lastValuation.IsActive = false;
                }

                var valuation = new PviiiTblProyectValuationDetail
                {
                    P8Id = p8,
                    AuditRevenue = SafeDecimal(dto.AuditRevenue),
                    ReportRevenue = SafeDecimal(dto.ReportRevenue),
                    TaxRevenue = SafeDecimal(dto.TaxRevenue),
                    AverageAuditFee = dto.AverageAuditFee,
                    StandardAuditHours = SafeDecimal(dto.StandardAuditHours, 2),
                    StandardAuditRevenue = SafeDecimal(dto.StandardAuditRevenue),
                    SpecialistsRevenue = SafeDecimal(dto.SpecialistsRevenue),
                    Expenses = SafeDecimal(dto.Expenses),
                    Valuation = SafeDecimal(dto.Valuation),
                    NetAuditRevenue = SafeDecimal(dto.NetAuditIncome),
                    IsActive = true,
                    RecordChangeSequence = nextSeq,

                    Create = now,
                    CreateBy = email
                };
                VersioningResetValuation(p8Id, email).Wait();
                _context.PviiiTblProyectValuationDetails.Add(valuation);
                _context.SaveChanges();
                result.Correct = true;
                return result;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                return result;
            }
        }
        
        // ============================================================
        // 6.1 vw_VALUATION breakown 
        // ============================================================
        public async Task<List<vwValuationBreakdownDtoML>> vwValuationBreakByIDP8(string idp8)
        {
            return await _context.VwPviiiValuationBreakdowns
                .AsNoTracking()
                .Where(x => x.P8Id == idp8)
                .Select(x => new vwValuationBreakdownDtoML
                {
                    p8Id = x.P8Id,
                    levelLabel = x.LevelLabel,
                    p8FiscalYear = x.P8FiscalYear,
                    hours = x.Hours,
                    fees = x.Fees,
                }
            ).ToListAsync();
        }
        // ============================================================
        // 6.2 REVIEW
        // ============================================================
        private async Task<int?> GetUserEmployeeId(string email)
        {
            return await _context.PviiiCatTeamLeaders
                .Where(x =>
                    x.EmployeeEmail == email &&
                    x.ActiveIndicator == true)
                .Select(x => (int?)x.EmployeeId)
                .FirstOrDefaultAsync();
        }
        private string GetApproverLevel(int levelId)
        {
            return levelId switch
            {
                1 => "LEAP",
                2 => "BUPIC",
                3 => "HofA",
                4 => "BUPP",
                5 => "BUPP",
                _ => "LEAP"
            };
        }
        private string GetProjectRiskLevel(bool isHighRisk)
        {
            return isHighRisk ? "High" : "Low"; 
        }
        private async Task<bool> IsVMasterUser(string email)
        {
            return await _context.PviiiTblSecurities  
                .Where(x => x.UserEmail == email)
                .Select(x => x.UserRole)
                .AnyAsync(role => role == "vMaster");
        }
       
        public async Task<Result> SaveReview(SubmitReviewDto dto, string user)
        {
            using var transaction = await _context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);

            try
            {
                // =========================================================
                // VALIDACIÓN MANAGER
                // =========================================================
                var userEmployeeId = await GetUserEmployeeId(user);
                var isVMaster = await IsVMasterUser(user);

                if (!isVMaster && !userEmployeeId.HasValue)
                {
                    return new Result
                    {
                        Correct = false,
                        ErrorCode = "NOT_MANAGER",
                        ErrorMessage = "User is not an active Manager."
                    };
                }

                var assignedManagerEmail = await _context.PviiiMasterCurrents
                    .Where(p => p.P8Id == dto.P8Id.ToString())
                    .Select(p => p.CurrentEngagementManagerEmail)
                    .FirstOrDefaultAsync();

                if (!isVMaster && assignedManagerEmail != user)
                {
                    return new Result
                    {
                        Correct = false,
                        ErrorCode = "NOT_ASSIGNED_MANAGER",
                        ErrorMessage = "Only the Engagement Manager can submit this review."
                    };
                }

                // =========================================================
                //  REVIEW ACTIVO (LOCK NATURAL POR SERIALIZABLE)
                // =========================================================
                var lastReview = await _context.PviiiTblProyectReviewDetails
                    .Where(r => r.P8Id == dto.P8Id && r.IsActive == true)
                    .OrderByDescending(r => r.RecordChangeSequence)
                    .FirstOrDefaultAsync();

                int nextSeq = (int)((lastReview?.RecordChangeSequence ?? 0) + 1);

                if (lastReview != null)
                {
                    lastReview.IsActive = false;
                }
                await VersioningResetReview(Guid.Parse(dto.P8Id), user);

                // =========================================================
                // INSERT
                // =========================================================
                _context.PviiiTblProyectReviewDetails.Add(new PviiiTblProyectReviewDetail
                {
                    P8Id = dto.P8Id,
                    IsHighRisk = dto.IsHighRisk,
                    IsFinancialRisk = dto.IsFinancialRisk,
                    IsValidated = true,
                    ApprovalLevelId = dto.ApprovalLevelId,
                    RecordChangeSequence = nextSeq,
                    IsActive = true,
                    Create = DateTime.Now,
                    CreateBy = user
                });

                // =========================================================
                // UPDATE MASTER
                // =========================================================
                var master = await _context.PviiiMasterCurrents
                    .FirstOrDefaultAsync(x => x.P8Id == dto.P8Id.ToString());

                if (master == null)
                    throw new Exception("PviiiMasterCurrent no existe para el P8Id");

                master.P8StatusId = 3;
                master.P8StatusLabel = "Pending";

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return new Result { Correct = true };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return new Result
                {
                    Correct = false,
                    ErrorCode = "TECHNICAL_ERROR",
                    ErrorMessage = ex.InnerException?.Message ?? ex.Message
                };
            }
        }
        // ============================================================
        // 7. SUBMIT PROJECT
        // ============================================================
        public Result SubmitProject(
    Guid p8Id,
    SubmitDto dto,
    string Email)
        {
            var result = new Result();

            try
            {
                // =========================================================
                //  OBTENER ÚLTIMA VERSIÓN DEL ENGAGEMENT
                // =========================================================
                var lastEngagement = _context.PviiiTblProyectDetails
                    .Where(e => e.P8Id == p8Id)
                    .OrderByDescending(e => e.RecordChangeSequence)
                    .FirstOrDefault();

                if (lastEngagement == null || lastEngagement.IsP8active != true)
                    throw new Exception("Proyecto no encontrado.");

                long nextSeq = lastEngagement.RecordChangeSequence + 1;

                // =========================================================
                // INSERTAR NUEVA VERSIÓN 
                // =========================================================
                var engagement = new PviiiTblProyectDetail
                {
                    P8Id = p8Id,
                    IsP8active = lastEngagement.IsP8active,
                    AuditModality = lastEngagement.AuditModality,
                    OfficeLabel = lastEngagement.OfficeLabel,
                    AddressLine = lastEngagement.AddressLine,
                    PostalCode = lastEngagement.PostalCode,
                    PhoneNumber = lastEngagement.PhoneNumber,
                    ProjectDescription = lastEngagement.ProjectDescription,
                    AuditFiscalYear = lastEngagement.AuditFiscalYear,
                    RevenueType = lastEngagement.RevenueType,
                    ReportGroupAuditor = lastEngagement.ReportGroupAuditor,
                    IsConsolidated = lastEngagement.IsConsolidated,

                    UpdatedByUserEmail = Email,
                    UpdatedDateTime = DateTime.Now,
                    CreatedByUserEmail = Email,
                    CreatedDateTime = DateTime.Now,

                    RecordChangeSequence = nextSeq
                };
                VersioningResetAsync(p8Id, Email).Wait();

                _context.PviiiTblProyectDetails.Add(engagement);
                _context.SaveChanges();

                result.Correct = true;
                return result;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                return result;
            }
        }
        ////=========================================
        ////GET ALL 
        ////=========================================
     
public async Task<Result> GetProjectDetail(Guid p8Id)
{
    var result = new Result();

    try
    {
        // ---------- FASE 0: master (define los IDs) ----------
        var master = await _context.PviiiMasterCurrents
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.P8Id == p8Id.ToString());

        if (master == null)
            throw new Exception("Master record not found.");

        Guid currentP8Guid = Guid.Parse(master.P8Id);
        Guid? pastP8Guid = string.IsNullOrEmpty(master.PastYearp8Id)
            ? null
            : Guid.Parse(master.PastYearp8Id);

        Guid historicalP8Guid =
            pastP8Guid == null || pastP8Guid == currentP8Guid
                ? currentP8Guid
                : pastP8Guid.Value;

        string currentP8String = currentP8Guid.ToString();
        string historicalP8String = historicalP8Guid.ToString();

        // ---------- FASE 1: currentValuation (define lockHistorical) ----------
        var currentValuation = await _context.PviiiTblProyectValuationDetails
            .AsNoTracking()
            .Where(v => v.P8Id == currentP8String && v.IsActive == true)
            .OrderByDescending(v => v.RecordChangeSequence)
            .FirstOrDefaultAsync();

        bool lockHistorical = currentValuation != null;

        // ---------- FASE 2: todo lo independiente, EN PARALELO ----------
        // Cada tarea usa su propio DbContext (EF no es thread-safe en uno solo).
        async Task<T> Q<T>(Func<MexItaStaBiAuditContext, Task<T>> fn)
        {
            await using var db = await _contextFactory.CreateDbContextAsync();
            db.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
            return await fn(db);
        }

        var engagementTask = Q(db => db.PviiiMasterCurrents
            .FirstOrDefaultAsync(e => e.P8Id == currentP8String));

        var historicalValuationTask = Q(db => db.PviiiTblProyectValuationDetails
            .Where(v => v.P8Id == historicalP8String && v.IsActive == true)
            .OrderByDescending(v => v.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var valuationBreakdownTask = Q(async db =>
        {
            var vb = await db.VwPviiiValuationBreakdowns
                .Where(v => v.P8Id == currentP8String)
                .Select(v => new vwValuationBreakdownDtoML
                {
                    levelLabel = v.LevelLabel,
                    p8FiscalYear = v.P8FiscalYear,
                    hours = v.Hours ?? 0m,
                    fees = v.Fees ?? 0m
                })
                .ToListAsync();

            if (!vb.Any() && !lockHistorical)
            {
                vb = await db.VwPviiiValuationBreakdowns
                    .Where(v => v.P8Id == historicalP8String)
                    .Select(v => new vwValuationBreakdownDtoML
                    {
                        levelLabel = v.LevelLabel,
                        p8FiscalYear = v.P8FiscalYear,
                        hours = v.Hours ?? 0m,
                        fees = v.Fees ?? 0m
                    })
                    .ToListAsync();
            }
            return vb;
        });

        var entityContextTask = Q(db => db.PviiiTblEngagementContexts
            .Where(e => e.P8id == currentP8Guid)
            .OrderByDescending(e => e.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var currentQualityReviewsTask = Q(db => db.PviiiTblQualityReviews
            .Where(q => q.P8Id == currentP8String && q.IsActive)
            .ToListAsync());

        var historicalQualityReviewsTask = Q(db => db.PviiiTblQualityReviews
            .Where(q => q.P8Id == historicalP8String && q.IsActive)
            .ToListAsync());

        var currentQualityTask = Q(db => db.PviiiTblProyectQualityDetails
            .Where(g => g.P8Id == currentP8String)
            .OrderByDescending(g => g.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var historicalQualityTask = Q(db => db.PviiiTblProyectQualityDetails
            .Where(g => g.P8Id == historicalP8String)
            .OrderByDescending(g => g.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var currentProjectDetailsTask = Q(db => db.PviiiTblProyectDetails
            .Where(p => p.P8Id == currentP8Guid)
            .OrderByDescending(p => p.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var historicalProjectDetailsTask = Q(db => db.PviiiTblProyectDetails
            .Where(p => p.P8Id == historicalP8Guid)
            .OrderByDescending(p => p.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var currentSchedulingTask = Q(db => db.PviiiTblSchedulingConsiderations
            .Where(s => s.P8Id == currentP8String)
            .OrderByDescending(s => s.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var historicalSchedulingTask = Q(db => db.PviiiTblSchedulingConsiderations
            .Where(s => s.P8Id == historicalP8String)
            .OrderByDescending(s => s.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var currentEntitiesTask = Q(db => db.PviiiTblEntityReportConfigs
            .Where(e => e.P8Id == currentP8String && e.IsActive)
            .GroupBy(e => e.KeyId)
            .Select(g => g.OrderByDescending(x => x.RecordChangeSequence).First())
            .ToListAsync());

        var historicalEntitiesTask = Q(db => db.PviiiTblEntityReportConfigs
            .Where(e => e.P8Id == historicalP8String && e.IsActive)
            .GroupBy(e => e.KeyId)
            .Select(g => g.OrderByDescending(x => x.RecordChangeSequence).First())
            .ToListAsync());

        var staffingTask = Q(async db =>
        {
            bool hasCurrentStaffing = await db.PviiiTblStaffingAllocations
                .AnyAsync(s => s.P8Id == currentP8String && s.IsActive);

            string target = (lockHistorical || hasCurrentStaffing)
                ? currentP8String
                : historicalP8String;

            return await db.PviiiTblStaffingAllocations
                .Where(s => s.P8Id == target && s.IsActive)
                .GroupBy(s => new { s.LevelLabel, s.StartDate, s.EndDate })
                .Select(g => g.OrderByDescending(x => x.RecordChangeSequence).First())
                .ToListAsync();
        });

        var step5StaffingTask = Q(db => db.PviiiTblStaffingAllocations
            .AnyAsync(s => s.P8Id == currentP8String && s.IsActive && s.RecordChangeSequence > 0));

        var historicalAuditHoursTask = Q(async db => (int)await db.PviiiTblStaffingAllocations
            .Where(s => s.P8Id == historicalP8String)
            .GroupBy(s => new { s.LevelLabel, s.StartDate, s.EndDate })
            .Select(g => g.OrderByDescending(x => x.RecordChangeSequence).First().HoursTotal)
            .SumAsync());

        var currentSpecialistsTask = Q(db => db.PviiiTblSpecialists
            .Where(s => s.P8Id == currentP8String)
            .Where(s => s.IsActive)
            .Where(s => s.RecordChangeSequence ==
                db.PviiiTblSpecialists
                    .Where(x => x.P8Id == currentP8String && x.IsActive)
                    .Max(x => x.RecordChangeSequence))
            .ToListAsync());

        var historicalSpecialistsTask = Q(db => db.PviiiTblSpecialists
            .Where(s => s.P8Id == historicalP8String)
            .Where(s => s.RecordChangeSequence ==
                db.PviiiTblSpecialists
                    .Where(x => x.P8Id == historicalP8String)
                    .Max(x => x.RecordChangeSequence))
            .ToListAsync());

        var currentReviewTask = Q(db => db.PviiiTblProyectReviewDetails
            .Where(v => v.P8Id == currentP8String && v.IsActive == true)
            .OrderByDescending(v => v.RecordChangeSequence)
            .FirstOrDefaultAsync());

        var lastYearMetricsTask = (pastP8Guid != null && pastP8Guid != currentP8Guid)
            ? Q(db => db.ProyectosP8s
                .Where(p => p.IdP8 == historicalP8String)
                .GroupBy(p => 1)
                .Select(g => new HistoricalComparisonDto
                {
                    AuditHours = g.Sum(x => (decimal?)x.ThAudit) ?? 0m,
                    NetAuditRevenue = g.Sum(x => (decimal?)x.TinAudit) ?? 0m,
                    AverageFee = g.Average(x => (decimal?)x.CuotaPaudit) ?? 0m,
                    Valuation = g.Sum(x => (decimal?)x.Valuation) ?? 0m
                })
                .FirstOrDefaultAsync())
            : Task.FromResult<HistoricalComparisonDto>(null);

        // Esperar TODO el batch en paralelo (aquí está el ahorro de tiempo)
        await Task.WhenAll(
            engagementTask, historicalValuationTask, valuationBreakdownTask, entityContextTask,
            currentQualityReviewsTask, historicalQualityReviewsTask, currentQualityTask, historicalQualityTask,
            currentProjectDetailsTask, historicalProjectDetailsTask, currentSchedulingTask, historicalSchedulingTask,
            currentEntitiesTask, historicalEntitiesTask, staffingTask, step5StaffingTask,
            historicalAuditHoursTask, currentSpecialistsTask, historicalSpecialistsTask, currentReviewTask,
            lastYearMetricsTask);

        // ---------- Recoger resultados ----------
        var engagement = engagementTask.Result;
        if (engagement == null)
            throw new Exception("Engagement not found.");

        var historicalValuationEntity = historicalValuationTask.Result;
        var valuationBreakdown = valuationBreakdownTask.Result;
        var entityContext = entityContextTask.Result;

        var activeQualityReviews = currentQualityReviewsTask.Result;
        var lsqcrReview = activeQualityReviews.FirstOrDefault(r => r.ReviewerType == 1);
        var eqcrReview = activeQualityReviews.FirstOrDefault(r => r.ReviewerType == 2);

        var historicalQualityReviews = historicalQualityReviewsTask.Result;
        var historicalLsqcrReview = historicalQualityReviews.FirstOrDefault(r => r.ReviewerType == 1);
        var historicalEqcrReview = historicalQualityReviews.FirstOrDefault(r => r.ReviewerType == 2);

        var currentQuality = currentQualityTask.Result;
        var historicalQuality = historicalQualityTask.Result;

        var currentProjectDetails = currentProjectDetailsTask.Result;
        var historicalProjectDetails = historicalProjectDetailsTask.Result;
        var projectDetails = lockHistorical
            ? currentProjectDetails
            : currentProjectDetails ?? historicalProjectDetails;

        var currentScheduling = currentSchedulingTask.Result;
        var historicalScheduling = historicalSchedulingTask.Result;
        var scheduling = lockHistorical
            ? currentScheduling
            : currentScheduling ?? historicalScheduling;

        var currentEntities = currentEntitiesTask.Result;
        var historicalEntities = historicalEntitiesTask.Result;

        var staffingList = staffingTask.Result;
        var historicalAuditHours = historicalAuditHoursTask.Result;

        var currentSpecialists = currentSpecialistsTask.Result;
        var historicalSpecialists = historicalSpecialistsTask.Result;

        var currentReview = currentReviewTask.Result;
        var lastYearMetrics = lastYearMetricsTask.Result;

        // ---------- SCHEDULING – COLLABORATORS (en memoria, igual que antes) ----------
        var schedulingSuggestedCollaborators = new List<SuggestedCollaboratorDto>();

        if (scheduling != null &&
            !string.IsNullOrWhiteSpace(scheduling.SuggestedEmployeeId) &&
            !string.IsNullOrWhiteSpace(scheduling.SuggestedEmployeeName))
        {
            var ids = scheduling.SuggestedEmployeeId.Split('|', StringSplitOptions.RemoveEmptyEntries);
            var names = scheduling.SuggestedEmployeeName.Split('|', StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < Math.Min(ids.Length, names.Length); i++)
            {
                if (int.TryParse(ids[i], out var empId))
                {
                    schedulingSuggestedCollaborators.Add(new SuggestedCollaboratorDto
                    {
                        SuggestedEmployeeId = empId,
                        SuggestedEmployeeName = names[i].Trim()
                    });
                }
            }
        }

        var engagementDetails = projectDetails == null
            ? new EngagementDetailsDto()
            : new EngagementDetailsDto
            {
                AuditModality = projectDetails.AuditModality,
                ResponsibleOfficeLabel = projectDetails.OfficeLabel,
                AddressLine = projectDetails.AddressLine,
                PostalCode = projectDetails.PostalCode,
                PhoneNumber = projectDetails.PhoneNumber,
                ProjectServiceDescription = projectDetails.ProjectDescription,
                AuditYear = (short?)projectDetails.AuditFiscalYear,
                IncomeType = projectDetails.RevenueType,
                IsReportToGroup = projectDetails.ReportGroupAuditor,
                IsConsolidated = projectDetails.IsConsolidated
            };

        var stepperStatus = new StepperStatusDto
        {
            Step1Context = entityContext != null
                && entityContext.P8id == currentP8Guid
                && entityContext.RecordChangeSequence > 0,

            Step2Details = currentProjectDetails != null
                && currentProjectDetails.RecordChangeSequence > 0,

            Step3Quality = currentQuality != null
                && currentQuality.RecordChangeSequence > 0,

            Step4Entities = currentEntities.Any(e => e.RecordChangeSequence > 0),

            Step5Staffing = step5StaffingTask.Result,

            Step6Specialists = currentSpecialists.Any(s => s.RecordChangeSequence > 0),

            Step7Valuation = currentValuation != null
                && currentValuation.RecordChangeSequence > 0 && currentValuation.IsValidated == true,

            Step8Review = currentReview != null
                && currentReview.RecordChangeSequence > 0 && currentReview.IsValidated == true,
        };

        var dto = new P8ProjectDetailDto
        {
            P8Id = p8Id,
            ClientNumber = master.ClientNumber,
            ClientName = master.ClientName,

            FirstYearClient = entityContext?.FirstYearClient,

            SegmentId = engagement.SegmentId,
            Segmento = engagement.SegmentLabel,
            CreatedByUserEmail = engagement.CreatedByUserEmail,

            CreateProject = new CreateProjectDto
            {
                PartnerName = master.CurrentEngagementPartnerName,
                PartnerEmployeeId = master.CurrentEngagementPartnerId,
                SrManagerName = master.CurrentEngagementManagerName,
                SrManagerEmployeeId = master.CurrentEngagementManagerId,
                CreatedByUserEmail = engagement.CreatedByUserEmail
            },

            Quality = (!lockHistorical && historicalQuality != null)
                ? new QualityDto
                {
                    IsPublicEntity = historicalQuality.IsPublicEntity,
                    IsRegulatedEntity = historicalQuality.IsRegulatedEntity,
                    IsListedEntity = historicalQuality.IsListedEntity,
                    IsSignificantSecSubsidiary = historicalQuality.IsSignificantSecSubsidiary,
                    IsReportGroup = historicalQuality.IsSubstantialRoleGrp,
                    IsSecAffiliate = historicalQuality.IsSecAffiliate,
                    Aits = historicalQuality.Aits ?? false,
                    PyCeac = historicalQuality.PyCeac,
                    CyCeac = historicalQuality.CyCeac,
                    NatureOfEngagementLabel = historicalQuality.NatureOfEngagementLabel,
                    AuditWorkflowLabel = historicalQuality.AuditWorkflowLabel,
                    StatutoryExaminerLabel = historicalQuality.StatutoryExaminerLabel,
                    RecordChangeSequence = historicalQuality.RecordChangeSequence,
                    CreatedByUserEmail = historicalQuality.CreatedByUserEmail,
                    CreatedDateTime = historicalQuality.CreatedDateTime
                }
                : null,

            QualityCFY = currentQuality == null ? null : new QualityDto
            {
                IsPublicEntity = currentQuality.IsPublicEntity,
                IsRegulatedEntity = currentQuality.IsRegulatedEntity,
                IsListedEntity = currentQuality.IsListedEntity,
                IsSignificantSecSubsidiary = currentQuality.IsSignificantSecSubsidiary,
                IsReportGroup = currentQuality.IsSubstantialRoleGrp,
                IsSecAffiliate = currentQuality.IsSecAffiliate,
                Aits = currentQuality.Aits ?? false,
                PyCeac = currentQuality.PyCeac,
                CyCeac = currentQuality.CyCeac,
                NatureOfEngagementLabel = currentQuality.NatureOfEngagementLabel,
                AuditWorkflowLabel = currentQuality.AuditWorkflowLabel,
                StatutoryExaminerLabel = currentQuality.StatutoryExaminerLabel,
                RecordChangeSequence = currentQuality.RecordChangeSequence,
                CreatedByUserEmail = currentQuality.CreatedByUserEmail,
                CreatedDateTime = currentQuality.CreatedDateTime
            },

            Valuation = currentValuation == null ? null : new ValuationDto
            {
                P8ValuationPk = currentValuation.P8ValuationPk,
                AverageAuditFee = currentValuation.AverageAuditFee,
                IsActive = currentValuation.IsActive,
                CreateBy = currentValuation.CreateBy,
                AuditRevenue = currentValuation.AuditRevenue,
                ReportRevenue = currentValuation.ReportRevenue,
                TaxRevenue = currentValuation.TaxRevenue,
                StandardAuditHours = currentValuation.StandardAuditHours,
                StandardAuditRevenue = currentValuation.StandardAuditRevenue,
                SpecialistsRevenue = currentValuation.SpecialistsRevenue,
                Expenses = currentValuation.Expenses,
                RecordChangeSequence = currentValuation.RecordChangeSequence,
                NetAuditIncome = currentValuation.NetAuditRevenue,
                Valuation = currentValuation.Valuation,
                IsValidated = currentValuation.IsValidated
            },

            ValuationCFY = historicalValuationEntity == null ? null : new ValuationDto
            {
                AuditRevenue = historicalValuationEntity.AuditRevenue,
                ReportRevenue = historicalValuationEntity.ReportRevenue,
                TaxRevenue = historicalValuationEntity.TaxRevenue,
                StandardAuditHours = historicalValuationEntity.StandardAuditHours,
                StandardAuditRevenue = historicalValuationEntity.StandardAuditRevenue,
                SpecialistsRevenue = historicalValuationEntity.SpecialistsRevenue,
                Expenses = historicalValuationEntity.Expenses,
                RecordChangeSequence = historicalValuationEntity.RecordChangeSequence
            },

            ProyectRisk = new FrameworkDto
            {
                P8Id = p8Id,
                AccountingFrameworks = entityContext?.AccountingFrameworks?
                    .Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                AuditingStandards = entityContext?.AuditingStandards?
                    .Split(',', StringSplitOptions.RemoveEmptyEntries).ToList(),
                Industry = entityContext?.Industry,
                PreliminaryRiskProject = entityContext?.PreliminaryRiskProject
            },

            EngagementDetails = engagementDetails,

            Staffing = staffingList.Select(s => new StaffingDto
            {
                KeyId = s.KeyId,
                P8Id = s.P8Id,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                LevelLabel = s.LevelLabel,
                PeopleCount = s.PeopleCount,
                HoursTotal = (decimal)s.HoursTotal,
                RateAmountTotal = (decimal)s.RateAmountTotal,
                EngagementSegmentId = scheduling?.EngagementSegmentId,
                EngagementSegmentLabel = scheduling?.EngagementSegmentLabel,
                IsActive = s.IsActive
            }).ToList(),

            EntitiesCurrent = currentEntities.Select(e => new CreateEntityReportConfigDto
            {
                KeyId = e.KeyId,
                ReportTypeLabel = e.ReportType,
                OpinionDate = e.OpinionDate.HasValue
                    ? e.OpinionDate.Value.ToDateTime(TimeOnly.MinValue)
                    : (DateTime?)null,
                EntityId = long.TryParse(e.ClientNumber, out var id) ? id : (long?)null,
                EntityName = e.ClientName,
                ReviewerTypeLabel = e.ReviewerTypeLabel,
                AuditFeeAmount = e.AuditFeeAmount ?? 0m,
                ReportFeeAmount = e.ReportFeeAmount ?? 0m,
                TaxFeeAmount = e.TaxFeeAmount ?? 0m,
                LsqcrReviewerName = lsqcrReview?.QualityReviewerName,
                EmployeeIdLsqcr = lsqcrReview?.QualityReviewerId,
                LsqcrReviewerHours = lsqcrReview?.ReviewerHours,
                Eqcrreviewer = eqcrReview?.QualityReviewerName,
                EmployeeIdEqcr = eqcrReview?.QualityReviewerId,
                Eqcrhours = eqcrReview?.ReviewerHours,
                CreatedByUserEmail = e.CreatedByUserEmail,
                CreatedDateTime = e.CreatedDateTime
            }).ToList(),

            Entities = (lockHistorical
                ? new List<PviiiTblEntityReportConfig>()
                : historicalEntities)
                .Select(e => new CreateEntityReportConfigDto
                {
                    KeyId = e.KeyId,
                    ReportTypeLabel = e.ReportType,
                    OpinionDate = e.OpinionDate.HasValue
                        ? e.OpinionDate.Value.ToDateTime(TimeOnly.MinValue)
                        : (DateTime?)null,
                    EntityId = long.TryParse(e.ClientNumber, out var id) ? id : (long?)null,
                    EntityName = e.ClientName,
                    ReviewerTypeLabel = e.ReviewerTypeLabel,
                    AuditFeeAmount = e.AuditFeeAmount ?? 0m,
                    ReportFeeAmount = e.ReportFeeAmount ?? 0m,
                    TaxFeeAmount = e.TaxFeeAmount ?? 0m,
                    LsqcrReviewerName = historicalLsqcrReview?.QualityReviewerName,
                    EmployeeIdLsqcr = historicalLsqcrReview?.QualityReviewerId,
                    LsqcrReviewerHours = historicalLsqcrReview?.ReviewerHours,
                    Eqcrreviewer = historicalEqcrReview?.QualityReviewerName,
                    EmployeeIdEqcr = historicalEqcrReview?.QualityReviewerId,
                    Eqcrhours = historicalEqcrReview?.ReviewerHours,
                    CreatedByUserEmail = e.CreatedByUserEmail,
                    CreatedDateTime = e.CreatedDateTime
                }).ToList(),

            valuationBreakdown = valuationBreakdown,

            Specialists = currentSpecialists.Select(s => new SpecialistsDto
            {
                KeyId = s.KeyId,
                ServiceLineLabel = s.ServiceLineSpecialist,
                AgreedFeesAmount = s.AgreedFeesAmount,
                AuditStagePreliminaryInd = s.AuditStagePreliminaryInd,
                AuditStageInterimInd = s.AuditStageInterimInd,
                AuditStageFinalInd = s.AuditStageFinalInd,
                AuditStagePreliminaryMths = s.AuditStagePreliminaryMths,
                AuditStageInterimMths = s.AuditStageInterimIndMths,
                AuditStageFinalMths = s.AuditStageFinalIndMths,
                ServiceLinePartnerId = s.ServiceLineInChargeId,
                ServiceLinePartnerLabel = s.ServiceLineInChargeLabel,
                ServiceLineInChargeEmail = s.ServiceLineInChargeEmail,
                CostCenter = s.CostCenter,
                CreatedByUserEmail = s.CreatedByUserEmail,
            }).ToList(),

            SpecialistsHistory = lockHistorical
                ? new List<SpecialistsDto>()
                : historicalSpecialists.Select(s => new SpecialistsDto
                {
                    KeyId = s.KeyId,
                    ServiceLineLabel = s.ServiceLineSpecialist,
                    AgreedFeesAmount = s.AgreedFeesAmount,
                    AuditStagePreliminaryInd = s.AuditStagePreliminaryInd,
                    AuditStageInterimInd = s.AuditStageInterimInd,
                    AuditStageFinalInd = s.AuditStageFinalInd,
                    AuditStagePreliminaryMths = s.AuditStagePreliminaryMths,
                    AuditStageInterimMths = s.AuditStageInterimIndMths,
                    AuditStageFinalMths = s.AuditStageFinalIndMths,
                    ServiceLinePartnerId = s.ServiceLineInChargeId,
                    ServiceLinePartnerLabel = s.ServiceLineInChargeLabel,
                    ServiceLineInChargeEmail = s.ServiceLineInChargeEmail,
                    CreatedByUserEmail = s.CreatedByUserEmail,
                }).ToList(),

            SubmitInfo = new SubmitDto
            {
                UpdatedByUserEmail = engagement.UpdatedByUserEmail
            },

            SchedulingConsiderations = new SchedulingConsiderationDto
            {
                TravelRequired = scheduling?.TravelRequired ?? false,
                SchedulingNotes = scheduling?.SchedulingNotes,
                EngagementSegmentId = scheduling?.EngagementSegmentId,
                EngagementSegmentLabel = scheduling?.EngagementSegmentLabel,
                SuggestedCollaborators = schedulingSuggestedCollaborators
            },

            LastYearMetrics = lastYearMetrics,
            stepperStatus = stepperStatus
        };

        result.Object = dto;
        result.Correct = true;
    }
    catch (Exception ex)
    {
        result.Correct = false;
        result.ErrorMessage = ex.Message;
    }

    return result;
}

    }
}