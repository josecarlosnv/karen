using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using static BL.EntityBL;
namespace BL
{
    //Este BL es de la tabla Dimentitis para crear  y en consumo es vwentitis
    public class EntityBL : IEntityService
    {
        private readonly MexItaStaBiAuditContext _context;

        public EntityBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public async Task<List<EntityModel>> SearchAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query) || query.Length < 0)
                return new List<EntityModel>();

            query = query.ToLower();

            return await _context.DimEntities
                .Where(e =>
                    (e.EntityDescription ?? "").ToLower().Contains(query) ||
                    (e.EntityId != null && e.EntityId.ToString().Contains(query))
                )
                .OrderBy(e => e.EntityDescription)
                .Take(20)
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

        public async Task<EntityModel?> GetByIdEntity(long id)
        {
            var entity = await _context.VwEntities
                .FirstOrDefaultAsync(x => x.EntityId == id);

            if (entity == null)
                return null;

            return new EntityModel
            {
                Id = entity.EntityId ?? 0,
                Description = entity.EntityDescription,
                GroupId = entity.EntityGroupId ?? 0,
                GroupDescription = entity.EntityGroupDescription,
                Sector = entity.EntitySector,
                Lob = entity.EntityLob
            };

        }
        
        public async Task<bool> CreateEntityAsync(EntityModel model,string email)
        {
            if (model == null) return false;
            if (model.Id == null || model.Id.ToString().Length != 10)
                return false;

            bool exists = await _context.DimEntities
                .AnyAsync(x => x.EntityId == model.Id );
            if (exists)
                return false; 

            var entity = new DimEntity
            {
                EntityId = model.Id,
                EntityDescription = model.Description,
                EntityGroupId = model.GroupId,
                EntityGroupDescription = model.GroupDescription,
                EntitySector = model.Sector,
                EntityLob = model.Lob,
                Created = DateOnly.FromDateTime(DateTime.Now),
                CreatedBy = email,
                IsValidated = true
            };

            _context.DimEntities.Add(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<StaffModel>> GetPartnersAsync() //filtrar inactivos 
        {
            return await _context.PviiiCatTeamLeaders
                .Where(x => (x.LevelLabel == "Partner" || x.LevelLabel == "Director")&& 
                x.ActiveIndicator == true)
                .OrderBy(x => x.EmployeeName)
                .Select(x => new StaffModel
                {
                    Id = x.EmployeeId,
                    Name = x.EmployeeName,
                    Email = x.EmployeeEmail
                })
                .ToListAsync();
        }
        
        public async Task<List<StaffModel>> GetManagersAsync()//filtrar inactivos 
        {
            return await _context.PviiiCatTeamLeaders
                .Where(x => (x.LevelLabel == "Senior Manager" || x.LevelLabel == "Manager")&&
                x.ActiveIndicator == true)
                .OrderBy(x => x.EmployeeName)
                .Select(x => new StaffModel
                {
                    Id = x.EmployeeId,
                    Name = x.EmployeeName,
                    Email = x.EmployeeEmail
                })
                .ToListAsync();
        }
        //Para comisario 
        public async Task<List<StaffModel>> GetPartnersComisario() //solo parners usado en comisario
        {
            return await _context.PviiiCatTeamLeaders
                .Where(x => (x.LevelLabel == "Partner" ) &&
                x.ActiveIndicator == true)
                .OrderBy(x => x.EmployeeName)
                .Select(x => new StaffModel
                {
                    Id = x.EmployeeId,
                    Name = x.EmployeeName,
                    Email = x.EmployeeEmail
                })
                .ToListAsync();
        }
        //Funcion para obtener QprResult,openPd y years in role

        public async Task<List<EstadisticasTeamLeaderML>> GetEstadisticasTeamLeadersAsync()
        {
            return await _context.PviiiCatTeamLeaders
            .Where(x => x.ActiveIndicator == true)
            .OrderBy(x => x.EmployeeName)
            .Select(x => new EstadisticasTeamLeaderML
            {
                CatTeamLeaderId = x.CatTeamLeaderId,
                EmployeeId = x.EmployeeId,
                EmployeeName = x.EmployeeName,
                EmployeeEmail = x.EmployeeEmail,
                LevelLabel = x.LevelLabel,
                QprResult = x.QprResult,
                OpenPdIndicator = x.OpenPdIndicator,
                IsFirstYear = x.IsFirstYear
            })
            .ToListAsync();
        }
        public async Task<List<OfficeML>> GetOfficesAsync()
        {
            return await _context.PviiiCatOffices
                .OrderBy(x => x.Oficina)
                .Select(x => new OfficeML
                {
                    OficinaId = x.OficinaId,
                    Oficina = x.Oficina
                })
                .ToListAsync();
        }

    }

}
