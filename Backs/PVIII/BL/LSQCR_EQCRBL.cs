using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class LSQCR_EQCRBL
    {

        private readonly MexItaStaBiAuditContext _context;

        public LSQCR_EQCRBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }

       
        public List<LSQCR_EQCRML> GetRegistros()
        {
            var result =
                _context.PviiiCatTeamLeaders
                    .Where(t =>
                        t.LevelLabel == "Partner" ||
                        t.LevelLabel == "Director")
                    .Select(t => new LSQCR_EQCRML
                    {
                        FullName = t.EmployeeName,
                        EmployeeId = t.EmployeeId.ToString(),
                        EmailAddressBusiness = t.EmployeeEmail,
                        LocalJobLevelName = t.LevelLabel,
                        Fyc = t.Fyc,
                        CostCenter = t.CostCenterId.ToString(),
                        CostCenterDescrip = t.CostCenterLabel,
                        LocationName = t.OfficeLabel
                    })
                    .OrderBy(x => x.FullName)
                    .ToList();

            return result;
        }
    }

}

