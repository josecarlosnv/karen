using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class CatSpecialistBL
    {

        private readonly MexItaStaBiAuditContext _context;

        public CatSpecialistBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public List<CatSpecialistML> GetCatSpecialists()
        {
            var specialists = _context.PviiiCatTeamLeaderSpecialists
                .Select(s => new CatSpecialistML
                {
                    SpecialistLeaderId = s.SpecialistLeaderId,
                    EmployeeId = s.EmployeeId,
                    EmployeeName = s.EmployeeName,
                    EmployeeEmail = s.EmployeeEmail,
                    LevelLabel = s.LevelLabel,
                    ServiceLineLabel = s.ServiceLineLabel,
                    UpdatedByUserEmail = s.UpdatedByUserEmail,
                    UpdatedDateTime = s.UpdatedDateTime
                })
                .OrderBy(s => s.EmployeeName)
                .ToList();

            return specialists;
        }

    }
}
