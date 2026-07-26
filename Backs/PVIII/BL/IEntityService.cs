using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public interface IEntityService
    {
        Task<List<EntityModel>> SearchAsync(string query);
        Task<EntityModel?> GetByIdEntity(long id);
        Task<bool> CreateEntityAsync(EntityModel model,string email);

        Task<List<StaffModel>> GetPartnersAsync();
        Task<List<StaffModel>> GetPartnersComisario();
        Task<List<StaffModel>> GetManagersAsync();
        Task<List<OfficeML>> GetOfficesAsync();
        Task<List<EstadisticasTeamLeaderML>> GetEstadisticasTeamLeadersAsync();
        
    }
}