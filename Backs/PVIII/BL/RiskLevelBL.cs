using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class RiskLevelBL
    {

        private readonly MexItaStaBiAuditContext _context;

        public RiskLevelBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public List<RiskLevelML> GetRiskLevel()
        {
            var RiskLevel = _context.PviiiCatRiskLevels
                .Where(x => x.RiskLevelLabel != null)
                .GroupBy(x => new
                {
                    x.RiskLevelId,
                    x.RiskLevelLabel
                })
                .Select(g => new RiskLevelML
                {
                    RiskLevelId = g.Key.RiskLevelId,
                    RiskLevelLabel = g.Key.RiskLevelLabel
                })
                .OrderBy(x => x.RiskLevelId)
                .ToList();

            return RiskLevel;
        }
    }
}
