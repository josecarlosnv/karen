using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
namespace API.Services.Security
{
    public class ScorefyClaimsTransformer : IClaimsTransformation
    {
        private readonly DL.MexItaStaBiAuditContext _db;

        public ScorefyClaimsTransformer(DL.MexItaStaBiAuditContext db)
        {
            _db = db;
        }

        private static string? GetNetworkId(ClaimsIdentity id)
        {
            // Ejemplo: "KPMG\\mpalomino"
            var name = id.Name;
            if (string.IsNullOrWhiteSpace(name)) return null;
            if (!name.Contains('\\')) return null;

            return name.Split('\\')[1];
        }

        //public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        //{
        //    var id = principal.Identity as ClaimsIdentity;
        //    if (id == null || !id.IsAuthenticated) return principal;

        //    // Evitar duplicar en cada request
        //    if (id.HasClaim("scorefy", "roles-added")) return principal;


        //    // 1) Intentar email desde existing claims
        //    var email =
        //           principal.FindFirst(ClaimTypes.Email)?.Value
        //        ?? principal.FindFirst("preferred_username")?.Value
        //        ?? principal.FindFirst("upn")?.Value;

        //    // 2) Si no vino email, lo generamos a partir del DOMAIN\usuario
        //    if (string.IsNullOrWhiteSpace(email))
        //    {
        //        // identity.Name es "KPMG\\mpalomino"
        //        var domainUser = id.Name;

        //        if (!string.IsNullOrWhiteSpace(domainUser) && domainUser.Contains('\\'))
        //        {
        //            var username = domainUser.Split('\\')[1];
        //            email = $"{username}@kpmg.com.mx";   
        //        }
        //    }

        //    // 3) Si aún así no hay email, regresamos
        //    if (string.IsNullOrWhiteSpace(email))
        //    {
        //        id.AddClaim(new Claim("scorefy", "roles-added"));
        //        return principal;
        //    }

        //    // 2) Asegurar que el email quede en claims
        //    if (principal.FindFirst(ClaimTypes.Email) == null)
        //        id.AddClaim(new Claim(ClaimTypes.Email, email));

        //    // 3) Agregar roles desde tu BD
        //    var roles = await _db.SecurityScorefies.AsNoTracking()
        //        .Where(x => x.Email == email && x.Role != null)
        //        .Select(x => x.Role!)
        //        .Distinct()
        //        .ToListAsync();

        //    foreach (var r in roles)
        //        id.AddClaim(new Claim(ClaimTypes.Role, r));


        //    // 4) Fallback: si NO tiene roles en BD, usa nivel del empleado
        //    if (roles.Count == 0)
        //    {
        //        // Trae el nivel
        //        var nivel = await _db.VwScorefyEmployees.AsNoTracking()
        //            .Where(e => e.EmailAddressBusiness == email)
        //            .Select(e => e.LocalJobLevelName)
        //            .FirstOrDefaultAsync();

        //        if (!string.IsNullOrWhiteSpace(nivel))
        //        {
        //            var nivelNorm = nivel.Trim();
        //            var nivelesPermitidos = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase)
        //            {
        //                "Manager",
        //                "Senior Manager",
        //                "Director",
        //                "Partner"
        //            };

        //            if (nivelesPermitidos.Contains(nivelNorm))
        //            {
        //                // Agrega un rol sintético "MGMT" y un claim con el nivel para UI/log
        //                id.AddClaim(new Claim(ClaimTypes.Role, "MGMT"));
        //                id.AddClaim(new Claim("scorefy.level", nivelNorm));
        //            }
        //        }
        //    }


        //    id.AddClaim(new Claim("scorefy", "roles-added"));



        //    var adjusted = new ClaimsIdentity(
        //        id.Claims,                    
        //        id.AuthenticationType,         
        //        id.NameClaimType,             
        //        ClaimTypes.Role                
        //    );

        //    var newPrincipal = new ClaimsPrincipal(adjusted);
        //    return newPrincipal;

        //}

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var id = principal.Identity as ClaimsIdentity;
            if (id == null || !id.IsAuthenticated) return principal;

            // Evitar reprocesar en cada request
            if (id.HasClaim("scorefy", "claims-resolved"))
                return principal;

            // =================== 1) Obtener NetworkId ===================
            var networkId = GetNetworkId(id);
            //var networkId = "avillalobos";

            string? email = null;
            string? fullName = null;

            if (!string.IsNullOrWhiteSpace(networkId))
            {
                // =================== 2) Buscar en EmployeeData ===================
                var emp = await _db.EmployeeData
                    .AsNoTracking()
                    .Where(e => e.NetworkId == networkId)
                    .Select(e => new
                    {
                        e.EmailAddressBusiness,
                        e.FirstName, 
                        e.LastName,
                        e.EmployeeId
                    })
                    .FirstOrDefaultAsync();

                if (emp != null)
                {
                    email = emp.EmailAddressBusiness;
                    fullName = emp.FirstName + emp.LastName;
                }
            }

            // =================== 3) Fallback SOLO si no existe en BD ===================
            if (string.IsNullOrWhiteSpace(email))
            {
                // 1) Intentar email desde existing claims
                email =
                       principal.FindFirst(ClaimTypes.Email)?.Value
                    ?? principal.FindFirst("preferred_username")?.Value
                    ?? principal.FindFirst("upn")?.Value;

                // 2) Si no vino email, lo generamos a partir del DOMAIN\usuario
                if (string.IsNullOrWhiteSpace(email))
                {
                    // identity.Name es "MX\\mpalomino"
                    //var domainUser = "MX\\asantillan";
                    var domainUser = id.Name;

                    if (!string.IsNullOrWhiteSpace(domainUser) && domainUser.Contains('\\'))
                    {
                        var username = domainUser.Split('\\')[1];
                        email = $"{username}@kpmg.com.mx";
                    }
                }
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                // Email real garantizado
                if (id.FindFirst(ClaimTypes.Email) == null)
                    id.AddClaim(new Claim(ClaimTypes.Email, email));

                if (!string.IsNullOrWhiteSpace(fullName) &&
                    id.FindFirst(ClaimTypes.Name) == null)
                {
                    id.AddClaim(new Claim(ClaimTypes.Name, fullName));
                } 
            }

            // =================== 4) Roles desde BD ===================
            var roles = await _db.SecurityScorefies.AsNoTracking()
                .Where(x => x.Email == email && x.Role != null)
                .Select(x => x.Role!)
                .Distinct()
                .ToListAsync();

            foreach (var r in roles)
                id.AddClaim(new Claim(ClaimTypes.Role, r));

            // =================== 5) Marca final ===================
            id.AddClaim(new Claim("scorefy", "claims-resolved"));

            return new ClaimsPrincipal(
                new ClaimsIdentity(
                    id.Claims,
                    id.AuthenticationType,
                    ClaimTypes.Name,
                    ClaimTypes.Role
                )
            );
        }
    }
}


    






