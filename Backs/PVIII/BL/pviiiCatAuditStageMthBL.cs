using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class pviiiCatAuditStageMthBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public pviiiCatAuditStageMthBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }

        public List<PviiiCatAuditStageMthML> GetCat()
        {
            var cat = _context.PviiiCatAuditStageMths
                .Where(x => x.MonthyearLabel != null)
                .GroupBy(x => new
                {
                    x.AuditStageMthId,
                    x.MonthyearLabel,
                    x.MonthyearId
                })
                .Select(g => new PviiiCatAuditStageMthML
                {
                    AuditStageMthId = g.Key.AuditStageMthId,
                    MonthyearLabel = g.Key.MonthyearLabel,
                    MonthyearId =g.Key.MonthyearId

                })
                .OrderBy(x => x.AuditStageMthId)
                .ToList();

            return cat;
        }
    }
}
