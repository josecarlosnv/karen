using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class SuggestedCollaboratordBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public SuggestedCollaboratordBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public async Task<List<SuggestedCollaboratordML>> GetSuggestedCollaboratord()
        {
            var validLevels = new List<string>
            {
                "Staff",
                "Staff In Charge",
                "Senior",
                "Supervising Senior"
            };

            return await _context.VwEmployeeAudits
                .Where(x => validLevels.Contains(x.LocalJobLevelName!))
                .OrderBy(x => x.FullName)
                .Select(x => new SuggestedCollaboratordML
                {
                    FullName = x.FullName,
                    LocalJobLevelName = x.LocalJobLevelName,
                    EmployeeSubClassName = x.EmployeeSubClassName,
                    CostCenterDescrip = x.CostCenterDescrip,
                    CostCenter = x.CostCenter,
                    EmployeeId = x.EmployeeId,
                    LocationName = x.LocationName,
                    EmailAddressBusiness = x.EmailAddressBusiness,
                    ProductoDescription = x.ProductoDescription,
                    Horas = x.Horas
                })
                .ToListAsync();
        }
    }
}
