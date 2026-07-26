
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace BL
{
    public interface IPersonalProfileBL
    {
        Task<ML.Result> GetOrCreateForEmailAsync(string email, CancellationToken ct = default);
        Task<ML.Result> UpdateMyProfileAsync(string email, ML.PersonalProfileUpdateDto dto, CancellationToken ct = default);
        Task<ML.Result> GetManagerOptionsAsync(string? q, int take = int.MaxValue, CancellationToken ct = default);
    }

    //para icono de usuario 

    public interface ISecurityBL
    {
        Task<ML.SecurityAccessDto> GetMyAccessAsync(string email, CancellationToken ct = default);
    }

    public sealed class PersonalProfileBL : IPersonalProfileBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<PersonalProfileBL> _logger;

        public PersonalProfileBL(DL.MexItaStaBiAuditContext db, ILogger<PersonalProfileBL> logger)
        {
            _db = db;
            _logger = logger;
        }

        // --------------------------------------------------
        // 1) Obtener el perfil o crear el inicial (Event=1)
        // --------------------------------------------------

        public async Task<ML.Result> GetOrCreateForEmailAsync(string email, CancellationToken ct = default)
        {

            try
            {

                // 0) Snapshot SIEMPRE desde la vista (para poder traer BU)
                var snap = await _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmailAddressBusiness == email)
                    .Select(e => new
                    {
                        e.EmployeeId,
                        e.FullName,
                        e.EmailAddressBusiness,
                        e.LocalJobLevelName,
                        PMEmail = e.PMEmail,
                        e.LocationName,            // <-- importante para el front
                        e.Is_Graduated,
                        e.English_Level// si lo sigues necesitando
                    })
                    .FirstOrDefaultAsync(ct);

                // 1) Obtener SIEMPRE el último registro en PersonalProfiles
                var existing = await _db.ScorefyTblPersonalProfiles
                    .AsNoTracking()
                    .Where(p => p.EvaluatedEmail == email)
                    .OrderByDescending(p => p.EventNumber)
                    .FirstOrDefaultAsync(ct);

                if (existing == null)
                {
                    if (snap == null)
                        return new ML.Result { Correct = false, ErrorMessage = "Empleado no encontrado en vista." };

                    // Resolver PM (opcional, como ya lo tenías)
                    int? pmId = null; string? pmName = null;
                    if (!string.IsNullOrWhiteSpace(snap.PMEmail))
                    {
                        var pm = await _db.VwScorefyEmployees
                            .AsNoTracking()
                            .Where(x => x.EmailAddressBusiness == snap.PMEmail)
                            .Select(x => new { x.EmployeeId, x.FullName })
                            .FirstOrDefaultAsync(ct);

                        if (pm != null) { pmId = pm.EmployeeId; pmName = pm.FullName; }
                    }

                    // Crear el primer registro (sin BU porque no lo persistimos)
                    var entity = new DL.ScorefyTblPersonalProfile
                    {
                        EmployeeId = snap.EmployeeId.ToString(),
                        EvaluatedName = snap.FullName,
                        EvaluatedEmail = snap.EmailAddressBusiness,
                        StaffLevel = snap.LocalJobLevelName,
                        CreatedBy = email,
                        Created = DateTime.UtcNow,
                        IsCurrent = true,
                        EventNumber = 1,

                        PMID = pmId,
                        PMName = pmName,
                        PMEmail = snap.PMEmail,

                        ProffesionalDegree = null,
                        CP = null
                    };

                    _db.ScorefyTblPersonalProfiles.Add(entity);
                    await _db.SaveChangesAsync(ct);
                    existing = entity;
                }

                // 2) Construir DTO
                int? empInt = null;
                if (!string.IsNullOrWhiteSpace(existing.EmployeeId) &&
                    int.TryParse(existing.EmployeeId.Trim(), out var eidParsed))
                {
                    empInt = eidParsed;
                }

                var dto = new ML.PersonalProfileDto
                {
                    ProfileId = existing.ProfileId,
                    EmployeeId = existing.EmployeeId,
                    EmployeeIdInt = empInt,
                    FullName = existing.EvaluatedName,
                    Email = existing.EvaluatedEmail,
                    StaffLevel = existing.StaffLevel,
                    Graduated = existing.ProffesionalDegree,
                    PostalCode = existing.CP,
                    PmId = existing.PMID,
                    PmName = existing.PMName,
                    PmEmail = existing.PMEmail,
                    IsCurrent = existing.IsCurrent,

                    // 👇 El front usa OfficeLocation, pero viene de BU en la vista
                    OfficeLocation = snap?.LocationName,
                    English = snap?.English_Level
                };

                return new ML.Result { Correct = true, Object = dto };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en GetOrCreateForEmailAsync");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }


        
        public async Task<ML.Result> UpdateMyProfileAsync(string email, ML.PersonalProfileUpdateDto dto, CancellationToken ct = default)
        {
            try
            {

                await using var tx = await _db.Database.BeginTransactionAsync(
                            System.Data.IsolationLevel.Serializable, ct);


                var last = await _db.ScorefyTblPersonalProfiles
                    .Where(p => p.EvaluatedEmail == email)
                    .OrderByDescending(p => p.EventNumber)
                    .FirstOrDefaultAsync(ct);

                if (last == null)
                    return new ML.Result { Correct = false, ErrorMessage = "No existe un perfil previo para este usuario." };

                int newEvent = last.EventNumber + 1;

                int? pmId = dto.PmId;
                string? pmName = dto.PmName;
                string? pmEmail = dto.PmEmail;

                if (!string.IsNullOrWhiteSpace(pmEmail))
                {
                    var pm = await _db.VwScorefyEmployees
                        .AsNoTracking()
                        .Where(x => x.EmailAddressBusiness == pmEmail)
                        .Select(x => new { x.EmployeeId, x.FullName })
                        .FirstOrDefaultAsync(ct);

                    if (pm != null)
                    {
                        pmId = pm.EmployeeId;
                        pmName = pm.FullName;
                    }
                }

                var newRow = new DL.ScorefyTblPersonalProfile
                {
                    EmployeeId = last.EmployeeId,
                    EvaluatedName = last.EvaluatedName,
                    EvaluatedEmail = last.EvaluatedEmail,
                    StaffLevel = last.StaffLevel,

                    CreatedBy = email,
                    Created = DateTime.UtcNow,
                    IsCurrent = true,

                    EventNumber = newEvent,

                    PMID = pmId,
                    PMName = pmName,
                    PMEmail = pmEmail,

                    ProffesionalDegree = dto.Graduated,
                    CP = dto.PostalCode
                };

                _db.ScorefyTblPersonalProfiles.Add(newRow);

                await _db.SaveChangesAsync(ct);

                await tx.CommitAsync(ct);


                return new ML.Result { Correct = true, ErrorMessage = "Nueva versión creada correctamente." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en UpdateMyProfileAsync");
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }

        // --------------------------------------------------
        // 3) Lista de Managers (sin límite)
        // --------------------------------------------------
        public async Task<ML.Result> GetManagerOptionsAsync(string? q, int take = int.MaxValue, CancellationToken ct = default)
        {
            try
            {
                var query = _db.VwScorefyEmployees
                    .AsNoTracking()
                    .Where(e => e.EmployeeId != 0 && e.IsActive == 1 && e.LocalJobLevelName != "Staff" &&!string.IsNullOrWhiteSpace(e.FullName));

                if (!string.IsNullOrWhiteSpace(q))
                {
                    var ql = q.ToLower();
                    query = query.Where(e =>
                        (e.FullName != null && e.FullName.ToLower().Contains(ql)) ||
                        (e.EmailAddressBusiness != null && e.EmailAddressBusiness.ToLower().Contains(ql)));
                }

                var list = await query
                    .GroupBy(g => new { g.EmployeeId, g.FullName, g.EmailAddressBusiness })
                    .Select(x => new ML.ManagerOption
                    {
                        Id = x.Key.EmployeeId,
                        Name = x.Key.FullName,
                        Email = x.Key.EmailAddressBusiness
                        //Label = x.Key.FullName,
                        //Value = x.Key.EmployeeId.ToString()
                    })
                    .OrderBy(x => x.Name)
                    .Take(take)
                    .ToListAsync(ct);

                return new ML.Result { Correct = true, Object = list };
            }
            catch (Exception ex)
            {
                return new ML.Result { Correct = false, ErrorMessage = ex.Message, Ex = ex };
            }
        }
    }

    //para icono de usuario

    public sealed class SecurityBL : ISecurityBL
    {
        private readonly DL.MexItaStaBiAuditContext _db;
        private readonly ILogger<SecurityBL> _logger;

        public SecurityBL(DL.MexItaStaBiAuditContext db, ILogger<SecurityBL> logger)
        {
            _db = db;
            _logger = logger;
        }
         
        public async Task<ML.SecurityAccessDto> GetMyAccessAsync(string email, CancellationToken ct = default)
        {
            var norm = (email ?? "").Trim().ToLower();

            var inSecurity = await _db.SecurityScorefies
                .AsNoTracking()
                .AnyAsync(s => s.Email.ToLower() == norm, ct);

            // Opcional: lo agrego para diagnóstico; NO decide permisos del ícono, solo HasSecurityAccess
            var inEmployees = await _db.VwScorefyEmployees
                .AsNoTracking()
                .AnyAsync(e => e.EmailAddressBusiness.ToLower() == norm, ct);

            return new ML.SecurityAccessDto
            {
                HasSecurityAccess = inSecurity,
                Email = norm,
                InEmployeesView = inEmployees,
                Allowed = inSecurity || inEmployees
            };
        }
    }

}