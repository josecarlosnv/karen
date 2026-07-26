using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class AuditWorkFlow
    {
        
            private readonly MexItaStaBiAuditContext _context;

            public AuditWorkFlow(MexItaStaBiAuditContext context)
            {
                _context = context;
            }
            public List<AuditWorkFlowML> Getaudit()
            {
                var Audit = _context.PviiiCatAuditWfs 
                    .Where(x => x.AuditWorkflowId != null)
                    .GroupBy(x => new { x.AuditWorkflowId, x.AuditWorkflowLabel })
                    .Select(g => new AuditWorkFlowML
                    {
                        FlujoAuditId = g.Key.AuditWorkflowId,
                        FlujoAudit1 = g.Key.AuditWorkflowLabel,
                        
                    })
                    .OrderBy(s => s.FlujoAudit1)
                    .ToList();

                return Audit;
            }
        
    }
}
