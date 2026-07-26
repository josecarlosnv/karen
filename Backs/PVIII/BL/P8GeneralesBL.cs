using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using System;
using System.Collections.Generic;
using System.Text;
// USADO PARA LA PARTE DE WORKSPACE - Select Client
namespace BL
{
    public class P8GeneralesBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public P8GeneralesBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        private Result MapToResult(List<PviiiMasterCurrent> dataList)
        {
            var result = new Result();

            result.Objects = dataList.Select(data => new P8SumClient
            {
                SumClientId = data.SumClientId,
                ClientNumber = data.ClientNumber,
                ClientName = data.ClientName,
                P8FiscalYearId = data.P8FiscalYearId,
                P8FiscalYearLabel = data.P8FiscalYearLabel,
                BusinessUnitId = data.BusinessUnitId,
                BusinessUnitIdLabel = data.BusinessUnitIdLabel,
                P8revenueTypeId = data.P8revenueTypeId,
                P8revenueTypeLabel = data.P8revenueTypeLabel,
                P8Id = data.P8Id,
                PastYearp8Id = data.PastYearp8Id,
                p8StatusId = data.P8StatusId,
                P8ApprStatusLabel = data.P8StatusLabel,
                CreatedByUserEmail = data.CreatedByUserEmail,
                CreatedDateTime = data.CreatedDateTime,
                UpdatedByUserEmail = data.UpdatedByUserEmail,
                UpdatedDateTime = data.UpdatedDateTime,
                P8ValidityStatus = data.P8ValidityStatus,
                SegmentId = data.SegmentId,
                SegmentLabel = data.SegmentLabel,
                CurrentEngagementManagerId = data.CurrentEngagementManagerId,
                CurrentEngagementManagerName = data.CurrentEngagementManagerName,
                CurrentEngagementPartnerId = data.CurrentEngagementPartnerId,
                CurrentEngagementPartnerName = data.CurrentEngagementPartnerName,
                CurrentEngagementManagerEmail = data.CurrentEngagementManagerEmail,
                CurrentEngagementPartnerEmail = data.CurrentEngagementPartnerEmail,
                IsLost = data.IsLost
            }).Cast<object>().ToList();

            result.Correct = true;
            return result;
        }

      
        public async Task<Result> GetAll(string email,List<string> roles,List<string> buList
            ,List<string> segments,List<string> offices, bool hasDerivedAccess,bool hasNetwork,
             string networkId)
        {

            
            IQueryable<PviiiMasterCurrent> query = _context.PviiiMasterCurrents
                .AsNoTracking()
                .Where(x => x.P8ValidityStatus == true
                && (x.IsLost == false || x.IsLost != true));

            if (!roles.Any())
                return MapToResult(new List<PviiiMasterCurrent>());

            if (roles.Any(r => r.Equals("vMaster", StringComparison.OrdinalIgnoreCase)))
                return MapToResult(await query.ToListAsync());
            if (hasDerivedAccess)
            {
                query = query.Where(x =>
                    (x.CurrentEngagementManagerEmail ?? "").ToLower() == email ||
                    (x.CurrentEngagementPartnerEmail ?? "").ToLower() == email
                );

                return MapToResult(await query.ToListAsync());
            }
            if (roles.Any(r => r.Equals("Key", StringComparison.OrdinalIgnoreCase)))
            {
                if (buList.Any())
                    query = query.Where(x => buList.Contains(x.BusinessUnitIdLabel));

                if (segments.Any())
                    query = query.Where(x => segments.Contains(x.SegmentLabel));
                if (offices.Any())
                {
                    query = query.Where(m =>
                        _context.PviiiTblProyectDetails.Any(d =>
                            d.P8Id.ToString() == m.P8Id &&
                            offices.Contains(d.OfficeLabel)
                        )
                    );
                }

            }
            if (hasNetwork)
            {
                var employeeData = await _context.PviiiCatColabs
                    .AsNoTracking()
                    .Where(e =>
                        (e.EmployeeEmail ?? "").ToLower() == email
                        || (e.NetworkId ?? "").ToLower() == networkId
                    )
                    .Select(e => new
                    {
                        e.EmployeeEmail
                    })
                    .FirstOrDefaultAsync();

                if (employeeData == null || string.IsNullOrWhiteSpace(employeeData.EmployeeEmail))
                {
                    return MapToResult(new List<PviiiMasterCurrent>());
                }

                var employeeEmail = employeeData.EmployeeEmail.ToLower();

                var buListFromSecurity = await _context.PviiiTblSecurities
                    .AsNoTracking()
                    .Where(s => (s.UserEmail ?? "").ToLower() == employeeEmail)
                    .Select(s => s.BusinessUnitIdLabel)
                    .Where(bu => !string.IsNullOrWhiteSpace(bu))
                    .Distinct()
                    .ToListAsync();


                if (buListFromSecurity.Any())
                {
                    query = query.Where(x => buListFromSecurity.Contains(x.BusinessUnitIdLabel));
                }
                else
                {
                    query = query.Where(x =>
                        (x.CurrentEngagementManagerEmail ?? "").ToLower() == employeeEmail ||
                        (x.CurrentEngagementPartnerEmail ?? "").ToLower() == employeeEmail
                    );
                }

               
            }

            return MapToResult(await query.ToListAsync());
            
        }
        public async Task Deactivate(Guid p8Id, string userEmail)
        {
            var entity = await _context.PviiiMasterCurrents
                .FirstOrDefaultAsync(x => x.P8Id == p8Id.ToString());

            if (entity == null)
                throw new Exception("P8 not found");

            entity.P8ValidityStatus = false;
            entity.UpdatedByUserEmail = userEmail;
            entity.UpdatedDateTime = DateTime.Now;

            await _context.SaveChangesAsync();
        }
        public async Task ClientLost(Guid p8Id, string userEmail)
        {
            var entity = await _context.PviiiMasterCurrents
                .FirstOrDefaultAsync(x => x.P8Id == p8Id.ToString());

            if (entity == null)
                throw new Exception("P8 not found");

            entity.IsLost = true;
            entity.UpdatedByUserEmail = userEmail;
            entity.UpdatedDateTime = DateTime.Now;

            await _context.SaveChangesAsync();
        }
        public async Task<Result> DuplicateProject(Guid p8Id, string userEmail)
        {
            var result = new Result();

            using var trx = await _context.Database.BeginTransactionAsync();

            try
            {
                var original = await _context.PviiiMasterCurrents
                    .FirstOrDefaultAsync(x => x.P8Id == p8Id.ToString());

                if (original == null)
                {
                    return new Result
                    {
                        Correct = false,
                        ErrorMessage = "Project not found"
                    };
                }

                var newP8Id = Guid.NewGuid();

                // ============================================================
                // DUPLICAR MASTER
                // ============================================================
                var copy = new PviiiMasterCurrent
                {
                    ClientName = original.ClientName,
                    ClientNumber = original.ClientNumber,

                    CreatedByUserEmail = userEmail,
                    CreatedDateTime = DateTime.Now,

                    UpdatedByUserEmail = null,
                    UpdatedDateTime = null,

                    P8Id = newP8Id.ToString(),

                    PastYearp8Id = string.IsNullOrEmpty(original.PastYearp8Id)? null : original.PastYearp8Id,

                    P8FiscalYearId = original.P8FiscalYearId,
                    P8FiscalYearLabel = original.P8FiscalYearLabel,

                    P8revenueTypeId = original.P8revenueTypeId,
                    P8revenueTypeLabel = original.P8revenueTypeLabel,

                    BusinessUnitId = original.BusinessUnitId,
                    BusinessUnitIdLabel = original.BusinessUnitIdLabel,
                    P8StatusId = 2,
                    P8StatusLabel = "Draft",

                    SegmentId = original.SegmentId,
                    SegmentLabel = original.SegmentLabel,

                    CurrentEngagementManagerId = original.CurrentEngagementManagerId,
                    CurrentEngagementManagerName = original.CurrentEngagementManagerName,
                    CurrentEngagementManagerEmail = original.CurrentEngagementManagerEmail,

                    CurrentEngagementPartnerId = original.CurrentEngagementPartnerId,
                    CurrentEngagementPartnerName = original.CurrentEngagementPartnerName,
                    CurrentEngagementPartnerEmail = original.CurrentEngagementPartnerEmail,

                    IsLost = false,
                    P8ValidityStatus = true
                };

                _context.PviiiMasterCurrents.Add(copy);

                // ============================================================
                // DUPLICAR TEAM LEADERS
                // ============================================================
                var leaders = await _context.PviiiFactTeamLeaderChanges
                    .Where(x => x.P8Id == original.P8Id)
                    .ToListAsync();

                long sequence = 1;

                foreach (var leader in leaders)
                {
                    var newLeader = new DL.PviiiFactTeamLeaderChange
                    {
                        P8Id = newP8Id.ToString(),
                        EmployeeId = leader.EmployeeId,
                        LevelId = leader.LevelId,
                        LocalJobLevelName = leader.LocalJobLevelName,
                        CreatedByUserEmail = userEmail,
                        CreatedDateTime = DateTime.Now,
                        EmployeeRate = leader.EmployeeRate,
                        CurrencyCode = leader.CurrencyCode,
                        RecordChangeSequence = sequence++,
                        EngagementRoleId = leader.EngagementRoleId
                    };

                    _context.PviiiFactTeamLeaderChanges.Add(newLeader);
                }

                await _context.SaveChangesAsync();

                await trx.CommitAsync();

                result.Object = new
                {
                    p8Id = newP8Id,
                    sumClientId = copy.SumClientId
                };

                result.Correct = true;
            }
            catch (Exception ex)
            {
                await trx.RollbackAsync();
                result.Correct = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

    }
}