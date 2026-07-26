using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using System;
using Microsoft.Extensions.Caching.Memory;
using System.ComponentModel.DataAnnotations;

namespace BL
{
    public class ApprovalsBL
    {
private readonly MexItaStaBiAuditContext _context;
private readonly IMemoryCache _cache;

private static long _cacheGeneration = 0;

public ApprovalsBL(MexItaStaBiAuditContext context, IMemoryCache cache)
{
    _context = context;
    _cache = cache;
}

        private async Task<string> ResolveBusinessEmail(string email)
        {
            var normalized = email.Trim().ToLower();

            var exists = await _context.VwPviiiApprovalValidations
                .AnyAsync(x => (x.CurrentEngagementPartnerEmail ?? "").ToLower() == normalized);

            if (exists)
                return normalized;

            var emp = await _context.PviiiCatColabs
                .AsNoTracking()
                .Where(e =>
                    e.EmployeeEmail.ToLower() == normalized ||
                    (normalized.Contains("@") && e.NetworkId == normalized.Split('@')[0])
                )
                .Select(e => e.EmployeeEmail)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrWhiteSpace(emp))
                return emp.Trim().ToLower();

            return normalized;
        }

        public async Task<List<VwPviiiApprovalValidation>> GetAllFiltered(string email, List<string> segments)
{
    var segs = string.Join(",", (segments ?? new List<string>()).OrderBy(s => s));
    var gen = System.Threading.Interlocked.Read(ref _cacheGeneration);
    var key = $"approvals:{gen}:{email?.Trim().ToLower()}:{segs}";

    if (_cache.TryGetValue(key, out List<VwPviiiApprovalValidation> cached))
        return cached;

    var data = await GetAllFilteredCore(email, segments);

    _cache.Set(key, data, new MemoryCacheEntryOptions
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(20)
    });

    return data;
}

private async Task<List<VwPviiiApprovalValidation>> GetAllFilteredCore(string email, List<string> segments)
{
    email = await ResolveBusinessEmail(email);   // ya devuelve en minúsculas

    var security = await _context.PviiiTblSecurities
        .AsNoTracking()
        .FirstOrDefaultAsync(x => x.UserEmail == email);

    int? level = security?.LevelIndicator;
    string role = security?.UserRole;

    if (role == "vMaster")
    {
        return await _context.VwPviiiApprovalValidations
            .AsNoTracking()
            .ToListAsync();
    }
    else if (level == null)
    {
        return await _context.VwPviiiApprovalValidations
            .AsNoTracking()
            .Where(x => x.CurrentEngagementPartnerEmail == email)   // sin ToLower → SARGable
            .ToListAsync();
    }
    else if (level == 3)
    {
        var bu = security?.BusinessUnitIdLabel;

        var rawData = await (
            from v in _context.VwPviiiApprovalValidations.AsNoTracking()
            join m in _context.PviiiMasterCurrents.AsNoTracking()
                on v.P8Id equals m.P8Id
            where
                v.ApprovalLevelId >= level &&
                bu != null &&
                m.BusinessUnitIdLabel == bu &&
                (!segments.Any() || segments.Contains(m.SegmentLabel))
            select v
        ).ToListAsync();

        var filtered = rawData.Where(v =>
        {
            if (string.IsNullOrEmpty(v.ApprovalsSummary)) return false;
            var parts = v.ApprovalsSummary.Split('/');
            if (parts.Length != 2) return false;
            if (!int.TryParse(parts[0], out int approved)) return false;
            int requiredApprovals = (level.Value - 2);
            return approved >= requiredApprovals;
        }).ToList();

        var leadData = await _context.VwPviiiApprovalValidations
            .AsNoTracking()
            .Where(x => x.CurrentEngagementPartnerEmail == email)
            .ToListAsync();

        return filtered
            .Concat(leadData)
            .GroupBy(x => x.P8Id)
            .Select(g => g.First())
            .ToList();
    }
    else if (level == 4 && security.PracticeIndicator == "HOFA")
    {
        return await _context.VwPviiiApprovalValidations
            .AsNoTracking()
            .Where(v =>
                v.ApprLeap == "Approved" &&
                v.ApprBupic == "Approved" &&
                v.ApprHofA != "N/A")
            .ToListAsync();
    }
    else if (level == 4 && security.PracticeIndicator == "BUPPP")
    {
        return await _context.VwPviiiApprovalValidations
            .AsNoTracking()
            .Where(v =>
                v.ApprLeap == "Approved" &&
                v.ApprBupic == "Approved" &&
                v.ApprBuppp != "N/A")
            .ToListAsync();
    }
    else
    {
        return new List<VwPviiiApprovalValidation>();
    }
}


        public async Task<List<VwPviiiRevConfirmML>> GetAllRevConfirm(Guid p8Id)
        {
            var p8IdStr = p8Id.ToString();

            return await _context.VwPviiiRevConfirms
                .AsNoTracking()
                .Where(x => x.P8Id == p8IdStr)
                .Select(x => new VwPviiiRevConfirmML
                {
                    P8Id = x.P8Id,

                    CurrentEngagementPartnerName = x.CurrentEngagementPartnerName,
                    CurrentEngagementManagerName = x.CurrentEngagementManagerName,

                    AccountingFrameworks = x.AccountingFrameworks,
                    AuditingStandards = x.AuditingStandards,
                    Industry = x.Industry,
                    LocalReferedLabel = x.LocalReferedLabel,

                    IsPublicEntity = x.IsPublicEntity,
                    IsRegulatedEntity = x.IsRegulatedEntity,
                    IsListedEntity = x.IsListedEntity,
                    IsSubstantialRoleGrp = x.IsSubstantialRoleGrp,
                    IsSignificantSecSubsidiary = x.IsSignificantSecSubsidiary,
                    IsSecAffiliate = x.IsSecAffiliate,

                    NatureOfEngagementLabel = x.NatureOfEngagementLabel,
                    ReviewerTypeLabel = x.ReviewerTypeLabel,
                    ReportType = x.ReportType,

                    IsHighRisk = x.IsHighRisk
                })
                .ToListAsync();
        }

        private int GetApproverId(string userEmail)
        {
            var normalizedEmail = userEmail?.Trim().ToLower();

            var networkIdFromEmail = normalizedEmail.Contains("@")
                ? normalizedEmail.Split('@')[0]
                : normalizedEmail;

            var employee = _context.PviiiCatColabs
                .AsNoTracking()
                .Where(x => (x.EmployeeEmail ?? "").ToLower() == normalizedEmail)
                .Select(x => new
                {
                    x.EmployeeId,
                    x.EmployeeEmail,
                    x.NetworkId
                })
                .FirstOrDefault();

            if (employee == null)
            {
                employee = _context.PviiiCatColabs
                    .AsNoTracking()
                    .Where(x => x.NetworkId.ToLower() == networkIdFromEmail)
                    .Select(x => new
                    {
                        x.EmployeeId,
                        x.EmployeeEmail,
                        x.NetworkId
                    })
                    .FirstOrDefault();
            }

            if (employee == null || string.IsNullOrEmpty(employee.EmployeeId.ToString()))
                throw new Exception($"No EmployeeId found for email or networkId: {userEmail}");

            if (!int.TryParse(employee.EmployeeId.ToString(), out int employeeId))
                throw new Exception($"EmployeeId is not numeric: {employee.EmployeeId}");

            return employeeId;
        }
        private string GetNextPendingRole(string p8Id, int sequence, List<string> flow)
        {
            var approvals = _context.PviiiTblApprovalDetails
                .Where(x =>
                    x.P8Id == p8Id &&
                    x.RecordChangeSequence == sequence &&
                    x.ApprovalActiveStatus == true)
                .ToList();

          
            foreach (var role in flow)
            {
                bool approved = approvals.Any(x =>
                    x.ApproverLevel.Equals(role, StringComparison.OrdinalIgnoreCase)
                    && x.ApprovalIndicator == true);

                if (!approved)
                {
                    return role;
                }
            }
            throw new Exception("All steps already approved");
        }
        private int GetCurrentSequence(string p8Id)
        {
            return _context.PviiiTblApprovalDetails
                .Where(x => x.P8Id == p8Id && x.ApprovalActiveStatus == true)
                .Select(x => (int?)x.RecordChangeSequence)
                .OrderByDescending(x => x)
                .FirstOrDefault() ?? 0;
        }



        private List<string> GetApprovalFlow(int level, string userEmail)

        {
            var security = _context.PviiiTblSecurities
            .FirstOrDefault(x => x.UserEmail.ToLower() == userEmail.ToLower());
            string practice = security?.PracticeIndicator;

            return level switch
            {
                1 => new List<string> { "LEAP" },
                2 => new List<string> { "LEAP" },
                3 => new List<string> { "LEAP", "BUPIC" },
                4 => new List<string> { "LEAP", "BUPIC", "BUPPP" },
                5 => new List<string> { "LEAP", "BUPIC", practice },
                //5 => new List<string> { "LEAP", "BUPIC", "HOFA", "BUPPP" },
                _ => throw new Exception("Invalid approval level")
            };
        }
        

        private string GetUserRole(string userEmail, string engagementLeadEmail)
        {
            var normalizedUser = userEmail?.Trim().ToLower();
            var normalizedLead = engagementLeadEmail?.Trim().ToLower();

            
            if (!string.IsNullOrEmpty(normalizedLead) &&
                normalizedUser == normalizedLead)
            {
                return "LEAP";
            }

           
            var security = _context.PviiiTblSecurities
                .AsNoTracking()
                .FirstOrDefault(x => x.UserEmail.ToLower() == normalizedUser);

            if (security == null)
                throw new Exception("User not found in security");

            if (security.LevelIndicator == 3)
                return "BUPIC";

            if (security.LevelIndicator == 4)
            {
                var role = security.PracticeIndicator?.ToUpper();

                if (role == "HOFA" || role == "BUPPP")
                    return role;

                throw new Exception("Invalid PracticeIndicator for level 4 user");
            }

            throw new Exception("User does not have a valid approval role");
        }
        private void ValidateUserCanApprove(string userRole, string dtoRole, List<string> flow, bool isVMaster)
        {
            if (isVMaster)
                return;

            if (!string.Equals(userRole, dtoRole, StringComparison.OrdinalIgnoreCase))
                throw new Exception($"User role mismatch. Expected: {dtoRole}");

            if (!flow.Any(x => string.Equals(x, dtoRole, StringComparison.OrdinalIgnoreCase)))
                throw new Exception($"Role {dtoRole} not allowed in this level");
        }
        private int EnsureApprovalFlow(string p8Id, int level, string role, string userEmail)
        {
            int currentSequence = GetCurrentSequence(p8Id);

            var existing = _context.PviiiTblApprovalDetails
                .Where(x =>
                    x.P8Id == p8Id &&
                    x.RecordChangeSequence == currentSequence &&
                    x.ApprovalActiveStatus == true)
                .ToList();

            if (!existing.Any())
            {
                return currentSequence + 1;
            }


            return currentSequence;
        }
        
        private void InsertApprovalDetail(
    string p8Id,
    int levelId,
    string approverLevel,
    int sequence,
    string userEmail,
    bool approved)
        {
            var entity = new PviiiTblApprovalDetail
            {
                P8Id = p8Id,
                ApprovalLevelId = levelId,
                ApproverLevel = approverLevel,
                ApprovalActiveStatus = true,
                ApprovalIndicator = approved,
                ApproverId = GetApproverId(userEmail),
                CreatedByUserEmail = userEmail,
                CreatedDateTime = DateTime.Now,
                RecordChangeSequence = sequence
            };

            _context.PviiiTblApprovalDetails.Add(entity);
        }
        
        private void ValidateDocumentation(string role, int level, DocumentationDTO? doc)
        {
            bool requiresDocumentation = level >= 2;

            if (!requiresDocumentation)
                return;

            if (role == "LEAP")
            {
                if (doc == null ||
string.IsNullOrWhiteSpace(doc.CompetenceDocumentation) &&
            string.IsNullOrWhiteSpace(doc.CapabilitiesDocumentation) &&
            string.IsNullOrWhiteSpace(doc.AdditionalComments) && string.IsNullOrWhiteSpace(doc.FinancialRiskDocumentation))

                {
                    throw new Exception("LEAP must provide documentation");
                }
            }
        }

        private void InsertDocumentation(string p8Id, int levelId, int sequence, DocumentationDTO dto, string userEmail)
        {
            var entity = new PviiiTblApprovalDocumentation
            {
                P8Id = p8Id,
                ApprovalLevelId = levelId,
                CompetenceDocumentation = dto.CompetenceDocumentation,
                CapabilitiesDocumentation = dto.CapabilitiesDocumentation,
                OthersDocumentation = dto.OthersDocumentation,
                FinancialRiskDocumentation = dto.FinancialRiskDocumentation,
                AdditionalComments = dto.AdditionalComments,
                ApprDocumentationActiveStatus = true,
                CreatedByUserEmail = userEmail,
                CreatedDateTime = DateTime.Now,
                RecordChangeSequence = sequence
            };

            _context.PviiiTblApprovalDocumentations.Add(entity);
        }

        //calcula el record changes
        private bool IsPreviousStepApproved(string p8Id, string currentRole, int sequence, List<string> flow)
        {
            int index = flow.FindIndex(x =>
    string.Equals(x, currentRole, StringComparison.OrdinalIgnoreCase));

            if (index == -1)
                throw new Exception("Role not part of flow");

            if (index == 0)
                return true;

            string previousRole = flow[index - 1];

            return _context.PviiiTblApprovalDetails.Any(x =>
                x.P8Id == p8Id &&
                x.ApproverLevel.ToLower() == previousRole.ToLower() &&
                x.RecordChangeSequence == sequence &&
                x.ApprovalIndicator == true &&
                x.ApprovalActiveStatus == true
            );
        }
        private int GetNextSequenceForApproval(string p8Id, string role)
        {
            var lastRoleRecord = _context.PviiiTblApprovalDetails
                .Where(x =>
                    x.P8Id == p8Id
                    //&& x.ApproverLevel == role)
                    && x.ApprovalActiveStatus)//esto comparlo con 1 
                .OrderByDescending(x => x.RecordChangeSequence)
                .FirstOrDefault();
            //var applevel = lastRoleRecord.ApproverLevel == "LEAP" ? true:false;

            if (lastRoleRecord != null &&
                lastRoleRecord.ApprovalIndicator == false && lastRoleRecord.ApproverLevel == "LEAP")
            {
                return lastRoleRecord.RecordChangeSequence + 1;
            }

            if (lastRoleRecord == null)
            {
                return  1;
            }
            //return lastRoleRecord/*?*/.RecordChangeSequence; /*?? 1;*/
            return lastRoleRecord.RecordChangeSequence; 
        }

        //hasta aca
        public Result SaveApproval(Guid p8Id, ApprovalRequestDTO dto, string userEmail)
        {
            var result = new Result();

            try
            {
                userEmail = ResolveBusinessEmail(userEmail)
                        .GetAwaiter()
                        .GetResult();
                var p8IdStr = p8Id.ToString();

                var engagement = _context.VwPviiiApprovalValidations
                    .FirstOrDefault(x => x.P8Id == p8IdStr);

                if (engagement == null)
                    throw new Exception("Engagement not found");

                int level = engagement.ApprovalLevelId;
                var flow = GetApprovalFlow(level, userEmail);  //var flow = GetApprovalFlow(level);
                int sequence = EnsureApprovalFlow(p8IdStr, level, dto.Role, userEmail);

                var userLevel = _context.PviiiTblSecurities
                    .Where(x => x.UserEmail == userEmail)
                    .Select(x => (int?)x.LevelIndicator)
                    .FirstOrDefault();

                bool isLeader = userEmail.Equals(
                    engagement.CurrentEngagementPartnerEmail,
                    StringComparison.OrdinalIgnoreCase);
                var security = _context.PviiiTblSecurities
                .FirstOrDefault(x => x.UserEmail.ToLower() == userEmail.ToLower());

                bool isVMaster = security?.UserRole == "vMaster";

                string roleToUse;

                if (isVMaster)
                {
                    roleToUse = GetNextPendingRole(p8IdStr, sequence, flow);
                }
                else
                {
                    string nextRole = GetNextPendingRole(p8IdStr, sequence, flow);

                    bool isLeap =
                        userEmail.Equals(
                            engagement.CurrentEngagementPartnerEmail,
                            StringComparison.OrdinalIgnoreCase);

                    var master = _context.PviiiMasterCurrents
                        .FirstOrDefault(x => x.P8Id == p8IdStr);

                    bool isBupic =
                        security?.LevelIndicator == 3
                        && master != null
                        && security.BusinessUnitIdLabel == master.BusinessUnitIdLabel;

                    bool isHofa =
                        security?.LevelIndicator == 4 &&
                        security?.PracticeIndicator?.ToUpper() == "HOFA";

                    bool isBuppp =
                        security?.LevelIndicator == 4 &&
                        security?.PracticeIndicator?.ToUpper() == "BUPPP";

                    switch (nextRole)
                    {
                        case "LEAP":
                            if (!isLeap)
                                throw new Exception("Only LEAP can approve this step");
                            break;



                            /*
                        case "BUPIC":

                            if (security?.LevelIndicator != 3)
                                throw new Exception("Only BUPIC can approve this step");

                            var master2 = _context.PviiiMasterCurrents
                                .FirstOrDefault(x => x.P8Id == p8IdStr);

                            if (master2 == null)
                                throw new Exception("Master record not found");
                            bool sameBU =
                                string.Equals(
                                    security.BusinessUnitIdLabel,
                                    master2.BusinessUnitIdLabel,
                                    StringComparison.OrdinalIgnoreCase);           
                            if (!sameBU)
                                throw new Exception(
                                    $"User belongs to BU {security.BusinessUnitIdLabel} and engagement belongs to {master2.BusinessUnitIdLabel}");

                            break;
                            */

                            //erstar
                            
                            case "BUPPP/HOFA":
                                bool isLevel4Approver =
                                    (security?.LevelIndicator == 4 &&
                                    (security.PracticeIndicator?.ToUpper() == "HOFA" ||
                                    security.PracticeIndicator?.ToUpper() == "BUPPP"));
                            if (!isLevel4Approver)
                                throw new Exception("Only HOFA or BUPPP can approve this step");
                            break;
                            
                        //erend

                            
                        case "HOFA":
                            if (!isHofa)
                                throw new Exception("Only HOFA can approve this step");
                            break;

                        case "BUPPP":
                            if (!isBuppp)
                                throw new Exception("Only BUPPP can approve this step");
                            break;
                            
                    }

                    roleToUse = nextRole;
                }
                if (!IsPreviousStepApproved(p8IdStr, roleToUse, sequence, flow))
                    throw new Exception("Previous step not approved");
                ValidateDocumentation(roleToUse, level, dto.Documentation);


                int approvalSequence = sequence;

                if (dto.Approve)
                {
                    approvalSequence = GetNextSequenceForApproval(
                        p8IdStr,
                        roleToUse);
                }

               
                if (dto.Documentation != null)
                {
                    InsertDocumentation(
                        p8IdStr,
                        level,
                        approvalSequence,
                        dto.Documentation,
                        userEmail
                    );
                }



                bool exists = _context.PviiiTblApprovalDetails.Any(x =>
                    x.P8Id == p8IdStr &&
                    x.ApproverLevel == roleToUse &&
                    x.RecordChangeSequence == sequence &&
                    x.ApprovalActiveStatus
                );


                /*
                bool exists = _context.PviiiTblApprovalDetails.Any(x =>
                    x.P8Id == p8IdStr &&
                    x.ApproverLevel == roleToUse &&
                    x.RecordChangeSequence == sequence &&
                    x.ApprovalActiveStatus == true
                );
                */


                if (dto.Approve)
                {
                    InsertApprovalDetail(
                        p8IdStr,
                        level,
                        roleToUse,
                        approvalSequence,
                        userEmail,
                        true
                    );
                }

                _context.SaveChanges();
                UpdateMasterIfFullyApproved(p8IdStr);
                _context.SaveChanges();

                System.Threading.Interlocked.Increment(ref _cacheGeneration); 
                result.Correct = true;
            }

            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }
       
        private bool IsFullyApproved(string p8Id, int sequence)
        {
            var approval = _context.VwPviiiApprovalValidations
                .FirstOrDefault(x => x.P8Id == p8Id);

            if (approval == null)
                return false;

            var expectedFlow = GetApprovalFlow(approval.ApprovalLevelId, (approval.ApprovalLevelId == 3 ? "HOFA" : "BUPPP"));  //var expectedFlow = GetApprovalFlow(approval.ApprovalLevelId);

            var approvedRoles = _context.PviiiTblApprovalDetails
                .Where(x =>
                    x.P8Id == p8Id &&
                    x.RecordChangeSequence == sequence &&
                    x.ApprovalActiveStatus == true &&
                    x.ApprovalIndicator == true)
                .Select(x => x.ApproverLevel)
                .ToList();

            return expectedFlow.All(role =>
                approvedRoles.Any(r =>
                    r.Equals(role, StringComparison.OrdinalIgnoreCase)));
        }
       
        private void UpdateMasterIfFullyApproved(string p8Id)
        {
            var approval = _context.VwPviiiApprovalValidations
                .AsNoTracking()
                .FirstOrDefault(x => x.P8Id == p8Id);

            if (approval == null || string.IsNullOrEmpty(approval.ApprovalsSummary))
                return;

            var parts = approval.ApprovalsSummary.Split('/');
            if (parts.Length != 2)
                return;

            if (!int.TryParse(parts[0], out int approved))
                return;

            if (!int.TryParse(parts[1], out int required))
                return;

            if (approved != required)
                return;

            var master = _context.PviiiMasterCurrents
                .FirstOrDefault(x => x.P8Id == p8Id);

            if (master != null && master.P8ValidityStatus == true)
            {
                master.P8StatusId = 1;
                master.P8StatusLabel = "Approved";
            }
        }
        public Result GetByIdDocumentation(Guid p8Id)
        {
            
            var result = new Result();

            try
            {
                var maxSequence = _context.PviiiTblApprovalDocumentations
                    .Where(x => x.P8Id == p8Id.ToString())
                    .Max(x => (int?)x.RecordChangeSequence);

                var entities = _context.PviiiTblApprovalDocumentations
                    .AsNoTracking()   

    .Where(x => x.P8Id == p8Id.ToString()
             && x.RecordChangeSequence == maxSequence)
    .ToList();

                

                if (!entities.Any())
                {
                    result.Correct = false;
                    result.ErrorMessage = "No documentation found";
                    return result;
                }

                var dtos = entities.Select(entity => new ApprovalDocumentationML
                {
                    P8Id = entity.P8Id,
                    ApprovalLevelId = entity.ApprovalLevelId,
                    CompetenceDocumentation = entity.CompetenceDocumentation,
                    CapabilitiesDocumentation = entity.CapabilitiesDocumentation,
                    OthersDocumentation = entity.OthersDocumentation,
                    FinancialRiskDocumentation = entity.FinancialRiskDocumentation,
                    ApprDocumentationActiveStatus = entity.ApprDocumentationActiveStatus,
                    CreatedByUserEmail = entity.CreatedByUserEmail,
                    CreatedDateTime = entity.CreatedDateTime,
                    RecordChangeSequence = entity.RecordChangeSequence,
                }).ToList();

                result.Correct = true;
                result.Object = dtos;
            }
            catch (Exception ex)
            {
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }
      
        public List<ApprovalStepDTO> GetApprovalStatus(string p8Id)
        {
            var maxSequence = _context.PviiiTblApprovalDetails
                .Where(x =>
                    x.P8Id == p8Id &&
                    x.ApprovalActiveStatus == true)
                .Max(x => (int?)x.RecordChangeSequence);

            return _context.PviiiTblApprovalDetails
                .AsNoTracking()
                .Where(x =>
                    x.P8Id == p8Id &&
                    x.ApprovalActiveStatus == true &&
                    x.RecordChangeSequence == maxSequence)
                .Select(x => new ApprovalStepDTO
                {
                    ApproverLevel = x.ApproverLevel,
                    Approved = x.ApprovalIndicator
                })
                .ToList();
        }
        public Result ReturnToReview(Guid p8Id, ReturnToReviewDTO dto, string userEmail)
        {
            var result = new Result();

            try
            {
                var p8IdStr = p8Id.ToString();

                var approval = _context.VwPviiiApprovalValidations
                    .FirstOrDefault(x => x.P8Id == p8IdStr);

                if (approval == null)
                    throw new Exception("Engagement not found");

                int approvalLevel = approval.ApprovalLevelId;

                var flow = GetApprovalFlow(approvalLevel, userEmail); //var flow = GetApprovalFlow(approvalLevel);

                var rejectedRole = dto.Role?.ToUpper();

                int roleIndex = flow.FindIndex(x =>
                    x.Equals(rejectedRole, StringComparison.OrdinalIgnoreCase));

                if (roleIndex == -1)
                    throw new Exception("Role does not belong to approval flow");

                int newSequence = GetCurrentSequence(p8IdStr) + 1;

                for (int i = 0; i <= roleIndex; i++)
                {
                    var role = flow[i];

                    var detail = new PviiiTblApprovalDetail
                    {
                        P8Id = p8IdStr,
                        ApprovalLevelId = approvalLevel,
                        ApproverLevel = role,
                        ApprovalIndicator = false,
                        ApprovalActiveStatus = true,
                        ApproverId = GetApproverId(userEmail),
                        CreatedByUserEmail = userEmail,
                        CreatedDateTime = DateTime.Now,
                        RecordChangeSequence = newSequence
                    };

                    _context.PviiiTblApprovalDetails.Add(detail);

                  
                }

                var master = _context.PviiiMasterCurrents
                    .FirstOrDefault(x => x.P8Id == p8IdStr);

                if (master != null)
                {
                    master.P8StatusId = 3;
                    master.P8StatusLabel = "Pending";
                }
                if (!string.IsNullOrWhiteSpace(dto.AdditionalComments))
                {
                    var documentation = new PviiiTblApprovalDocumentation
                    {
                        P8Id = p8IdStr,
                        ApprovalLevelId = approvalLevel,
                        AdditionalComments = dto.AdditionalComments,
                        ApprDocumentationActiveStatus = true,
                        CreatedByUserEmail = userEmail,
                        CreatedDateTime = DateTime.Now,
                        RecordChangeSequence = newSequence
                    };

                    _context.PviiiTblApprovalDocumentations.Add(documentation);
                }

                _context.SaveChanges();

                System.Threading.Interlocked.Increment(ref _cacheGeneration);

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