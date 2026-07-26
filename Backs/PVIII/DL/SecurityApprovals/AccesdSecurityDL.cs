using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace DL
{
    public interface IApprovalAccessRepository
    {
        Task<bool> ExistsInApprovalsAsync(string email, CancellationToken ct = default);

        Task<int?> GetSecurityLevelIndicatorAsync(string email, CancellationToken ct = default);

    }

    public class ApprovalAccessRepository : IApprovalAccessRepository
    {
        private readonly MexItaStaBiAuditContext _context;

        public ApprovalAccessRepository(MexItaStaBiAuditContext db)
        {
            _context = db;
        }

        public async Task<bool> ExistsInApprovalsAsync(string email, CancellationToken ct = default)
        {
            var normalized = (email ?? "").Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(normalized)) return false;

            return await _context.VwPviiiTblProyectApprovals
                .AsNoTracking()
                .AnyAsync(x => x.CurrentEngagementPartnerEmail.ToLower() == normalized, ct);

        }


        public async Task<int?> GetSecurityLevelIndicatorAsync(string email, CancellationToken ct = default)
        {
            var normalized = NormalizeEmail(email);
            if (normalized == null) return null;

            // si no existe registro, null.
            return await _context.PviiiTblSecurities
                .AsNoTracking()
                .Where(x => x.UserEmail != null && x.UserEmail.ToLower() == normalized)
                .Select(x => (int?)x.LevelIndicator) // null si no hay
                .FirstOrDefaultAsync(ct);
        }

        public async Task<bool> HasSpecialRoleAsync(string email, int minLevel = 1, CancellationToken ct = default)
        {
            var normalized = NormalizeEmail(email);
            if (normalized == null) return false;

            return await _context.PviiiTblSecurities
                .AsNoTracking()
                .AnyAsync(x => x.UserEmail != null &&
                              x.UserEmail.ToLower() == normalized &&
                              x.LevelIndicator >= minLevel, ct);
        }

        private static string? NormalizeEmail(string email)
        {
            var normalized = (email ?? "").Trim().ToLowerInvariant();
            return string.IsNullOrWhiteSpace(normalized) ? null : normalized;
        }
    }
}


/*
using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace DL
{
    public interface IApprovalAccessRepository
    {
        Task<bool> ExistsInApprovalsAsync(string email, CancellationToken ct = default);

        //Task<int?> GetSecurityLevelIndicatorAsync(string email, CancellationToken ct = default);

    }

    public class ApprovalAccessRepository : IApprovalAccessRepository
    {
        private readonly MexItaStaBiAuditContext _context;

        public ApprovalAccessRepository(MexItaStaBiAuditContext db)
        {
            _context = db;
        }

        public async Task<bool> ExistsInApprovalsAsync(string email, CancellationToken ct = default)
        {
            var normalized = (email ?? "").Trim().ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(normalized)) return false;

            return await _context.VwPviiiTblProyectApprovals
                .AsNoTracking()
                .AnyAsync(x => x.CurrentEngagementPartnerEmail.ToLower() == normalized, ct);

        }
    }
}
*/
