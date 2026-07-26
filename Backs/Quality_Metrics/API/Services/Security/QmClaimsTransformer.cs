using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services.Security
{
    public class QmClaimsTransformer : IClaimsTransformation
    {
        private readonly DL.LeadershipQmContext _db;
        public QmClaimsTransformer(DL.LeadershipQmContext db) => _db = db;

        private static string? GetNetworkId(ClaimsIdentity id)
        {
            var name = id.Name;                       // ej. "MX\\jnoguez"
            if (string.IsNullOrWhiteSpace(name) || !name.Contains('\\')) return null;
            return name.Split('\\')[1];
        }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var id = principal.Identity as ClaimsIdentity;
            if (id == null || !id.IsAuthenticated) return principal;
            if (id.HasClaim("lqm", "claims-resolved")) return principal;

            var networkId = GetNetworkId(id);
            string? email = null;

            if (!string.IsNullOrWhiteSpace(networkId))
            {
                email = await _db.EmployeeData.AsNoTracking()
                    .Where(e => e.NetworkId == networkId)
                    .Select(e => e.EmailAddressBusiness)
                    .FirstOrDefaultAsync();
            }

            // Fallback: claims o DOMAIN\usuario -> usuario@kpmg.com.mx
            if (string.IsNullOrWhiteSpace(email))
            {
                email = principal.FindFirst(ClaimTypes.Email)?.Value
                     ?? principal.FindFirst("preferred_username")?.Value
                     ?? principal.FindFirst("upn")?.Value;

                if (string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(networkId))
                    email = $"{networkId}@kpmg.com.mx";
            }

            if (!string.IsNullOrWhiteSpace(email) && id.FindFirst(ClaimTypes.Email) == null)
                id.AddClaim(new Claim(ClaimTypes.Email, email));

                      // Roles desde LQM_Tbl_Security
            var roles = await _db.LqmTblSecurities.AsNoTracking()
                .Where(x => x.UserEmail == email && x.UserRole != null)
                .Select(x => x.UserRole)
                .Distinct()
                .ToListAsync();

            foreach (var r in roles)
                id.AddClaim(new Claim(ClaimTypes.Role, r));

            id.AddClaim(new Claim("lqm", "claims-resolved"));

            return new ClaimsPrincipal(
                new ClaimsIdentity(id.Claims, id.AuthenticationType, ClaimTypes.Name, ClaimTypes.Role));
        }
    }
}
