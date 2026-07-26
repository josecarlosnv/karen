using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class CatalogoIndustria
    {
        private readonly MexItaStaBiAuditContext _context;

        public CatalogoIndustria(MexItaStaBiAuditContext context)
        {
            _context = context;
        }

        public List<IndustriaML> GetIndustrias()
        {
            var industrias = _context.PviiiCatIndustryRisks
                .Where(x => x.IndustryLabel != null)
                .GroupBy(x => new
                {
                    x.IndustryRiskId,
                    x.IndustryLabel,
                    x.RiskLevelLabel
                })
                .Select(g => new IndustriaML
                {
                    IndustryRiskId = g.Key.IndustryRiskId,
                    IndustryLabel = g.Key.IndustryLabel,
                    RiskLevelLabel = g.Key.RiskLevelLabel
                })
                .OrderBy(x => x.IndustryLabel)
                .ToList();

            return industrias;
        }

    }
}
