using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services.Security
{
    public class ApprovalsClaimsTransformer : IClaimsTransformation
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<ApprovalsClaimsTransformer> _logger;

        public ApprovalsClaimsTransformer(
            DL.MexItaStaBiAuditContext db,
            ILogger<ApprovalsClaimsTransformer> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var id = principal.Identity as ClaimsIdentity;

            if (id == null || !id.IsAuthenticated)
                return principal;

            try
            {
                var email =
                       principal.FindFirst(ClaimTypes.Email)?.Value
                    ?? principal.FindFirst("preferred_username")?.Value
                    ?? principal.FindFirst("upn")?.Value
                    ?? id.Name;

                if (!string.IsNullOrWhiteSpace(email) && email.Contains("\\"))
                    email = $"{email.Split('\\')[1]}@kpmg.com.mx";

                email = email?.Trim().ToLower();

                if (string.IsNullOrWhiteSpace(email))
                    return principal;

                string? networkId = null;
                string? businessEmail = null;

                if (!string.IsNullOrWhiteSpace(id.Name) &&
                    id.Name.Contains("\\"))
                {
                    networkId = id.Name.Split('\\')[1]
                        ?.Trim()
                        .ToLower();
                }

                // -------------------------------------------------
                // Obtener BusinessEmail desde PVIII_Cat_Colabs
                // -------------------------------------------------
                if (!string.IsNullOrWhiteSpace(networkId))
                {
                    var emp = await _db.PviiiCatColabs
                        .AsNoTracking()
                        .Where(x => x.NetworkId == networkId)
                        .Select(x => x.EmployeeEmail)
                        .FirstOrDefaultAsync();

                    if (!string.IsNullOrWhiteSpace(emp))
                    {
                        businessEmail = emp.Trim().ToLower();
                    }
                }

                if (!string.IsNullOrWhiteSpace(networkId) &&
                    !id.HasClaim(c => c.Type == "NetworkId"))
                {
                    id.AddClaim(new Claim("NetworkId", networkId));
                }

                if (!string.IsNullOrWhiteSpace(businessEmail) &&
                    !id.HasClaim(c => c.Type == "BusinessEmail"))
                {
                    id.AddClaim(new Claim("BusinessEmail", businessEmail));
                }

                foreach (var c in id.Claims
                    .Where(c =>
                        c.Type == "Approver" ||
                        c.Type == "NO_APPROVAL_ACCESS")
                    .ToList())
                {
                    id.RemoveClaim(c);
                }

                bool hasAccess = false;
                //Hereda el acceso general 
                var hasP8Access =
                       principal.IsInRole("Key")
                    || principal.IsInRole("vMaster");

                _logger.LogInformation(
                    "Usuario {Email} - P8Access: {HasP8Access}",
                    email,
                    hasP8Access);

                var emailForSecurity =
                    !string.IsNullOrWhiteSpace(businessEmail)
                        ? businessEmail
                        : email;

                var security = await _db.PviiiTblSecurities
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x =>
                        x.UserEmail.Trim().ToLower() == emailForSecurity);

                if (security != null)
                {
                    var role = security.UserRole?.Trim();

                    if (!string.IsNullOrWhiteSpace(role) &&
                        role.Equals("vMaster",
                            StringComparison.OrdinalIgnoreCase))
                    {
                        id.AddClaim(
                            new Claim("Approver", "vMaster"));

                        hasAccess = true;
                    }
                    else if (security.LevelIndicator == 4)
                    {
                        var practice = security.PracticeIndicator;

                        if (!string.IsNullOrWhiteSpace(practice))
                        {
                            id.AddClaim(
                                new Claim("Approver", "Level4"));

                            if (!id.HasClaim(c =>
                                c.Type == "Practice" &&
                                c.Value == practice))
                            {
                                id.AddClaim(
                                    new Claim("Practice", practice));
                            }

                            hasAccess = true;
                        }
                    }
                    else if (security.LevelIndicator == 3)
                    {
                        id.AddClaim(
                            new Claim("Approver", "Level3"));

                        hasAccess = true;
                    }
                }

                // -------------------------------------------------
                // Acceso para LEAP
                // -------------------------------------------------
                if (!hasAccess)
                {
                    //var existsInApprovals =
                    //    await _db.VwPviiiApprovalValidations
                    //        .AsNoTracking()
                    //        .AnyAsync(x =>
                    //            (x.CurrentEngagementPartnerEmail ?? "")
                    //            .ToLower() == email);

                    //if (existsInApprovals)
                    //{
                    //    id.AddClaim(
                    //        new Claim("Approver", "lead-partner"));

                    //    hasAccess = true;
                    //}

                    var existsInApprovals =
                        await _db.VwPviiiApprovalValidations
                            .AsNoTracking()
                            .AnyAsync(x =>
                                (x.CurrentEngagementPartnerEmail ?? "")
                                .ToLower() == email);

                    var existsLevel99 =
                        await (
                            from m in _db.PviiiMasterCurrents
                            join r in _db.PviiiTblProyectReviewDetails
                                on m.P8Id equals r.P8Id
                            where
                                m.CurrentEngagementPartnerEmail.ToLower() == email
                                && r.ApprovalLevelId == 99
                                && r.IsActive == true
                            select r.P8Id
                        )
                        .AnyAsync();

                    if (existsInApprovals || existsLevel99)
                    {
                        id.AddClaim(
                            new Claim("Approver", "lead-partner"));

                        hasAccess = true;
                    }

                }

                // -------------------------------------------------
                // Fallback 
                // -------------------------------------------------
                if (!hasAccess)
                {
                    if (!string.IsNullOrWhiteSpace(networkId))
                    {
                        var emp = await _db.PviiiCatColabs
                            .AsNoTracking()
                            .Where(x => x.NetworkId == networkId)
                            .Select(x => new
                            {
                                x.EmployeeEmail
                            })
                            .FirstOrDefaultAsync();

                        if (emp != null &&
                            !string.IsNullOrWhiteSpace(emp.EmployeeEmail))
                        {
                            businessEmail =
                                emp.EmployeeEmail.Trim().ToLower();

                            _logger.LogInformation(
                                "Fallback Approvals con BusinessEmail: {Email}",
                                businessEmail);

                            var existsInApprovals =
                                await _db.VwPviiiApprovalValidations
                                .AsNoTracking()
                                .AnyAsync(x =>
                                    (x.CurrentEngagementPartnerEmail ?? "")
                                    .ToLower() == businessEmail);

                            var existsLevel99 =
                                await (
                                    from m in _db.PviiiMasterCurrents
                                    join r in _db.PviiiTblProyectReviewDetails
                                        on m.P8Id equals r.P8Id
                                    where
                                        m.CurrentEngagementPartnerEmail.ToLower() == businessEmail
                                        && r.ApprovalLevelId == 99
                                        && r.IsActive == true
                                    select r.P8Id
                                )
                                .AnyAsync();

                            if (existsInApprovals || existsLevel99)
                            {
                                id.AddClaim(
                                    new Claim("Approver",
                                        "lead-partner"));

                                if (!id.HasClaim(c =>
                                    c.Type == "DerivedAccess" &&
                                    c.Value == "EmployeeDataEmail"))
                                {
                                    id.AddClaim(
                                        new Claim("DerivedAccess",
                                            "EmployeeDataEmail"));
                                }

                                hasAccess = true;
                            }

                            if (!hasAccess)
                            {
                                var securityFallback =
                                    await _db.PviiiTblSecurities
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(x =>
                                        x.UserEmail.Trim().ToLower()
                                        == businessEmail);

                                if (securityFallback != null)
                                {
                                    var role =
                                        securityFallback.UserRole?.Trim();

                                    if (!string.IsNullOrWhiteSpace(role) &&
                                        role.Equals(
                                            "vMaster",
                                            StringComparison.OrdinalIgnoreCase))
                                    {
                                        id.AddClaim(
                                            new Claim(
                                                "Approver",
                                                "vMaster"));

                                        hasAccess = true;
                                    }
                                    else if (
                                        securityFallback.LevelIndicator == 4)
                                    {
                                        id.AddClaim(
                                            new Claim(
                                                "Approver",
                                                "Level4"));

                                        var practice =
                                            securityFallback
                                            .PracticeIndicator;

                                        if (!string.IsNullOrWhiteSpace(practice)
                                            &&
                                            !id.HasClaim(c =>
                                                c.Type == "Practice" &&
                                                c.Value == practice))
                                        {
                                            id.AddClaim(
                                                new Claim(
                                                    "Practice",
                                                    practice));
                                        }

                                        hasAccess = true;
                                    }
                                    else if (
                                        securityFallback.LevelIndicator == 3)
                                    {
                                        id.AddClaim(
                                            new Claim(
                                                "Approver",
                                                "Level3"));

                                        hasAccess = true;
                                    }
                                }
                            }
                        }
                        else
                        {
                            _logger.LogWarning(
                                "No se encontró EmployeeEmail en PviiiCatColabs para {NetworkId}",
                                networkId);
                        }
                    }
                }

                if (!hasAccess)
                {
                    if (!hasP8Access)
                    {
                        id.AddClaim(
                            new Claim(
                                "NO_APPROVAL_ACCESS",
                                "true"));
                    }
                }

                return new ClaimsPrincipal(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error en ApprovalsClaimsTransformer");

                return principal;
            }
        }
    }
}