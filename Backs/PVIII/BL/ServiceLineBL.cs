using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{

    public class CatalogoServiceLine
    {
        private readonly MexItaStaBiAuditContext _context;

        public CatalogoServiceLine(MexItaStaBiAuditContext context)
        {
            _context = context;
        }


        public List<ServiceLineML> GetServiceLines()
        {
            var serviceLines = _context.PviiiCatServiceLineSpecialists
                .Where(x => x.ServiceLineLabel != null)
                .GroupBy(x => new
                {
                    x.SpecialistServiceLineId,
                    x.ServiceLineLabel,
                    x.ServiceLineGroup,
                    x.FunctionLabel,
                    x.OfficeLabel,
                    x.ServiceLineLeadPartnerId,
                    x.ServiceLineLeadPartnerEmail,
                    x.UpdatedByUserEmail,
                    x.CostCenter,
                    x.UpdatedDateTime
                })
                .Select(g => new ServiceLineML
                {
                    SpecialistServiceLineId = g.Key.SpecialistServiceLineId,
                    ServiceLineLabel = g.Key.ServiceLineLabel,
                    ServiceLineGroup = g.Key.ServiceLineGroup,
                    FunctionLabel = g.Key.FunctionLabel,
                    OfficeLabel = g.Key.OfficeLabel,
                    ServiceLineLeadPartnerId = g.Key.ServiceLineLeadPartnerId,
                    ServiceLineLeadPartnerEmail = g.Key.ServiceLineLeadPartnerEmail,
                    UpdatedByUserEmail = g.Key.UpdatedByUserEmail,
                    CostCenter = g.Key.CostCenter,
                    UpdatedDateTime = g.Key.UpdatedDateTime
                })
                .OrderBy(x => x.ServiceLineLabel)
                .ToList();

            return serviceLines;
        }

    }

}
