using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;

namespace API.Services.Security
{
    public class P8ClaimsTransformer : IClaimsTransformation
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<P8ClaimsTransformer> _logger;
        private readonly IMemoryCache _cache;

        private static readonly HashSet<string> NivelesPermitidos =
            new(StringComparer.InvariantCultureIgnoreCase)
            { "Manager", "Senior Manager", "Director", "Partner" };

        public P8ClaimsTransformer(
            DL.MexItaStaBiAuditContext db,
            ILogger<P8ClaimsTransformer> logger,
            IMemoryCache cache)
        {
            _db = db;
            _logger = logger;
            _cache = cache;
        }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var id = principal.Identity as ClaimsIdentity;
            if (id == null || !id.IsAuthenticated)
                return principal;

            if (id.HasClaim("p8_tx", "1"))
                return principal;

            try
            {
                var email =
                       principal.FindFirst(ClaimTypes.Email)?.Value
                    ?? principal.FindFirst("preferred_username")?.Value
                    ?? principal.FindFirst("upn")?.Value
                    ?? id.Name;

                string? networkId = null;
                if (!string.IsNullOrWhiteSpace(id.Name) && id.Name.Contains("\\"))
                    networkId = id.Name.Split('\\')[1];

                email = email?.Trim().ToLower();

                var cacheKey = $"p8claims:{networkId}:{email}";
                var resolved = await _cache.GetOrCreateAsync(cacheKey, async entry =>
                {
                    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
                    return await ResolveClaimsAsync(email, networkId);
                });

                foreach (var c in resolved)
                    if (!id.HasClaim(c.Type, c.Value))
                        id.AddClaim(new Claim(c.Type, c.Value));

                id.AddClaim(new Claim("p8_tx", "1"));
                return SafePrincipal(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ERROR EN CLAIMS TRANSFORMER");
                return principal;
            }
        }

        private async Task<List<Claim>> ResolveClaimsAsync(string? email, string? networkId)
        {
            var claims = new List<Claim>();


            //new colab
            //erik start
            /*
            var colab = string.IsNullOrWhiteSpace(networkId)
                ? null
                : await (
                    from c in _db.PviiiCatColabs.AsNoTracking()
                    where c.NetworkId == networkId
                    join s in _db.PviiiCatServiceLineSpecialists.AsNoTracking()
                        on c.EmployeeEmail equals s.ServiceLineLeadPartnerEmail into sl
                    from s in sl.DefaultIfEmpty()
                    select new
                    {

                        c.EmployeeEmail,
                        c.LevelLabel,
                        c.FunctionName,
                        CostCenter = s != null ? s.CostCenter : (int?)null,
                        ServiceLineLabel = s != null ? s.ServiceLineLabel : null

                    }
                ).FirstOrDefaultAsync();


            if (colab != null && NivelesPermitidos.Contains(colab.LevelLabel?.Trim() ?? ""))
            {
                claims.Add(new Claim(ClaimTypes.Role, "Key"));
                claims.Add(new Claim("DerivedAccess", "Employee_Level"));
                claims.Add(new Claim("EmployeeLevel", colab.LevelLabel!.Trim()));
                claims.Add(new Claim("practica", colab.FunctionName?.Trim() ?? string.Empty));
                claims.Add(new Claim("Email", colab.EmployeeEmail));

                // Obtener TODAS las Service Lines y Cost Centers del usuario
                var specialistRecords = await _db.PviiiCatServiceLineSpecialists
                    .AsNoTracking()
                    .Where(x => x.ServiceLineLeadPartnerEmail == colab.EmployeeEmail)
                    .Select(x => new
                    {
                        x.ServiceLineLabel,
                        x.CostCenter
                    })
                    .Distinct()
                    .ToListAsync();

                // Claims múltiples de ServiceLine
                foreach (var item in specialistRecords
                    .Where(x => !string.IsNullOrWhiteSpace(x.ServiceLineLabel)))
                {
                    claims.Add(new Claim(
                        "serviceLineLabel",
                        item.ServiceLineLabel.Trim()));
                }

                // Claims múltiples de CostCenter
                foreach (var item in specialistRecords)
                {
                    claims.Add(new Claim(
                        "costCenter",
                        item.CostCenter.ToString()));
                }

                return claims;
            }
            //erik end
            */


            //old colab
            
            var colab = string.IsNullOrWhiteSpace(networkId)
                ? null
                : await _db.PviiiCatColabs
                    .AsNoTracking()
                    .Where(x => x.NetworkId == networkId)
                    .Select(x => new { x.EmployeeEmail, x.LevelLabel, x.FunctionName, x.CostCenter })
                    .FirstOrDefaultAsync();

            

            

            if (colab != null && !string.IsNullOrWhiteSpace(colab.EmployeeEmail))
                email = colab.EmployeeEmail.Trim().ToLower();

            if (string.IsNullOrWhiteSpace(email))
                return claims;

            claims.Add(new Claim(ClaimTypes.Email, email));

            // -------- PRE-ACCESO GENERAL --------
            bool hasGeneralAccess = await _db.PviiiTblSecurities
                .AsNoTracking()
                .AnyAsync(x => x.UserEmail == email);

            if (!hasGeneralAccess && colab != null
                && NivelesPermitidos.Contains(colab.LevelLabel ?? ""))
            {
                hasGeneralAccess = true;
            }

            if (!hasGeneralAccess)
            {
                claims.Add(new Claim("NO_ACCESS", "true"));
                return claims;
            }

            // -------- SECURITY --------
            var securityRecords = await _db.PviiiTblSecurities
                .AsNoTracking()
                .Where(x => x.UserEmail == email)
                .ToListAsync();

            if (securityRecords.Any())
            {
                bool hasScope = false;
                bool isKey = false;

                foreach (var rec in securityRecords)
                {
                    var role = rec.UserRole?.Trim();
                    if (string.IsNullOrWhiteSpace(role)) continue;

                    if (role.Equals("vMaster", StringComparison.OrdinalIgnoreCase))
                    {
                        claims.Add(new Claim(ClaimTypes.Role, "vMaster"));
                        claims.Add(new Claim(ClaimTypes.Role, "All"));
                        claims.Add(new Claim("vMaster", "true"));
                        return claims;
                    }

                    if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
                    {
                        if (!isKey)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, "Key"));
                            isKey = true;
                        }
                        if (!string.IsNullOrWhiteSpace(rec.BusinessUnitIdLabel))
                        {
                            claims.Add(new Claim("BU", rec.BusinessUnitIdLabel));
                            hasScope = true;
                        }
                        if (!string.IsNullOrWhiteSpace(rec.SegmentLabel))
                        {
                            claims.Add(new Claim("Segment", rec.SegmentLabel));
                            hasScope = true;
                        }
                        if (!string.IsNullOrWhiteSpace(rec.OfficeLabel))
                        {
                            claims.Add(new Claim("Office", rec.OfficeLabel));
                            hasScope = true;
                        }
                        claims.Add(new Claim("Email", rec.UserEmail));
                    }
                }

                if (isKey && !hasScope)
                {
                    _logger.LogWarning("Key sin scope: {Email}", email);
                    claims.Add(new Claim("NO_ACCESS", "true"));
                }

                return claims;
            }

            // -------- MASTER CURRENT --------
            bool existsInMaster = await _db.PviiiMasterCurrents
                .AsNoTracking()
                .AnyAsync(x =>
                    (x.CurrentEngagementManagerEmail ?? "") == email ||
                    (x.CurrentEngagementPartnerEmail ?? "") == email);

            if (existsInMaster)
            {
                claims.Add(new Claim(ClaimTypes.Role, "Key"));
                claims.Add(new Claim("DerivedAccess", "Master_Current"));
                return claims;
            }

            if (colab != null && NivelesPermitidos.Contains(colab.LevelLabel?.Trim() ?? ""))
            {
                claims.Add(new Claim(ClaimTypes.Role, "Key"));
                claims.Add(new Claim("DerivedAccess", "Employee_Level"));
                claims.Add(new Claim("EmployeeLevel", colab.LevelLabel!.Trim()));
                claims.Add(new Claim("practica", colab.FunctionName?.Trim() ?? string.Empty));
                //erik start


                //claims.Add(new Claim("costCenter", colab.CostCenter?.ToString() ?? ""));


                claims.Add(new Claim("Email", colab.EmployeeEmail));
                //claims.Add(new Claim("serviceLineLabel", colab.ServiceLineLabel?.Trim() ?? string.Empty));
                //erik end
                return claims;
            }


            claims.Add(new Claim("NO_ACCESS", "true"));
            return claims;
        }

        private ClaimsPrincipal SafePrincipal(ClaimsIdentity id)
        {
            var safeClaims = id.Claims
                .Where(c => !string.IsNullOrWhiteSpace(c.Type) && c.Value != null)
                .Select(c => new Claim(c.Type, c.Value))
                .ToList();

            return new ClaimsPrincipal(
                new ClaimsIdentity(safeClaims, id.AuthenticationType, id.NameClaimType, ClaimTypes.Role));
        }
    }
}
