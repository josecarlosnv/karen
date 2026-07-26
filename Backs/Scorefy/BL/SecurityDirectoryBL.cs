using Microsoft.EntityFrameworkCore;
using ML;
using System;
using System.Collections.Generic;
using System.Text;
using System.Globalization;


namespace BL
{


    public interface ISecurityDirectoryBL
    {
        Task<Result> SearchEmployeesAsync(string userEmail, string? term, int page, int pageSize, CancellationToken ct = default);
    }


    public sealed class SecurityDirectoryBL : ISecurityDirectoryBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        public SecurityDirectoryBL(DL.MexItaStaBiAuditContext db) => _db = db;

        public async Task<Result> SearchEmployeesAsync(
            string userEmail, string? term, int page, int pageSize, CancellationToken ct = default)
        {
            try
            {
                // 1) Seguridad (mismo patrón que ya usas)
                var security = await _db.SecurityScorefies.AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Email == userEmail, ct); // << tabla seguridad
                // ^ patrón análogo a tu GetResumeWithSecurity(...) que parte de SecurityScorefies. [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)

                // 2) Base: vista de empleados
                var q = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId != 0 && e.FullName != null && e.EmailAddressBusiness != null && e.IsActive == 1);

                // 3) Filtros de seguridad:
                if (security == null)
                {
                    // 🔒 Sin seguridad => SOLO el propio usuario
                    q = q.Where(e => e.EmailAddressBusiness == userEmail);
                }
                else
                {
                    var role = (security.Role ?? string.Empty).Trim();
                    var bu = (security.Bu ?? string.Empty).Trim().ToUpperInvariant();

                    // ✅ Rol ALL => ve todo (explícito)
                    if (role.Equals("All", StringComparison.OrdinalIgnoreCase))
                    {
                        // Sin filtros
                    }
                    // ✅ PIE => solo BUs permitidos
                    else if (role.Equals("PIE", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedBu = { "PCG", "IRM", "ESG" };
                        q = q.Where(e => allowedBu.Contains(e.Bu));
                    }
                    // ✅ HLSTM => UNO + ubicaciones permitidas
                    else if (role.Equals("HLSTM", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedLocations =
                        {
            "Hermosillo",
            "León",
            "San Luis Potosí",
            "Tijuana",
            "Mexicali"
        };

                        q = q.Where(e =>
                            e.Bu == "UNO" &&
                            allowedLocations.Contains(e.LocationName));
                    }
                    // ✅ COMMITTE => solo él mismo
                    else if (role.Equals("COMMITTE", StringComparison.OrdinalIgnoreCase))
                    {
                        q = q.Where(e => e.EmailAddressBusiness == userEmail);
                    }
                    // ✅ KEY => solo su BU (validada)
                    else if (role.Equals("Key", StringComparison.OrdinalIgnoreCase))
                    {
                        string[] allowedKeyBUs = { "PCG", "IRM", "ESG", "UNO", "TMT", "CIM", "UNNE", "SF" };

                        if (!string.IsNullOrEmpty(bu) && allowedKeyBUs.Contains(bu))
                        {
                            q = q.Where(e => e.Bu == bu);
                        }
                        else
                        {
                            // 🚫 BU inválida => no ve nada
                            q = q.Where(e => e.EmailAddressBusiness == userEmail);
                        }
                    }
                    // 🚫 Cualquier rol desconocido => mínimo privilegio
                    else
                    {
                        q = q.Where(e => e.EmailAddressBusiness == userEmail);
                    }
                }

                // 4) Término de búsqueda (opcional) por nombre o correo
                if (!string.IsNullOrWhiteSpace(term))
                {
                    var t = term.Trim().ToLowerInvariant();
                    q = q.Where(e =>
                        e.FullName!.ToLower().Contains(t) ||
                        e.EmailAddressBusiness!.ToLower().Contains(t));
                }

                // 5) Deduplicar por EmployeeId (mismo criterio que tu BL ya usa cuando consulta vw_ScorefyEmployees) [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/SelfEvaluationBL.cs)
                var flat = await q
                    .GroupBy(e => new { e.EmployeeId, e.FullName, e.EmailAddressBusiness }) 
                    .Select(g => new EmployeeLookupDto
                    {
                        EmployeeId = g.Key.EmployeeId,
                        EmployeeName = g.Key.FullName!,
                        Email = g.Key.EmailAddressBusiness!
                    })
                    .OrderBy(r => r.EmployeeName)
                    .Skip(Math.Max(0, (page - 1)) * Math.Max(1, pageSize))
                    .Take(Math.Max(1, pageSize))
                    .ToListAsync(ct);

                return new Result { Correct = true, Object = flat };
            }
            catch (Exception ex)
            {
                return new Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
    }

}
