using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class NatureBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public NatureBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public List<NatureML> GetNature()
        {
            var Nature = _context.PviiiCatEngagementNatures
                .Where(x => x.NatureOfEngagementId != null)
                .GroupBy(x => new { x.NatureOfEngagementId, x.NatureOfEngagementLabel })
                .Select(g => new NatureML
                {
                    NaturalezaId = g.Key.NatureOfEngagementId,
                    Naturaleza1 = g.Key.NatureOfEngagementLabel,

                })
                .OrderBy(s => s.Naturaleza1)
                .ToList();

            return Nature;
        }
    }
}
