using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class EngagementSegmentBL
    {
        private readonly MexItaStaBiAuditContext _context;

        public EngagementSegmentBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }

        public List<EngagementSegmentML> GetEngagementSegment()
        {
            var engagementSegment = _context.VwTasasCatalogoBus
                .Where(x => x.SegmentoId != null)
                .Select(x => new EngagementSegmentML
                {
                    Id = x.Id,
                    Bu = x.Bu,
                    SegmentoId = x.SegmentoId,
                    Segmento = x.Segmento,
                    OficinaId = x.OficinaId,
                    Oficina = x.Oficina,
                    CostCenter = x.CostCenter,
                    CostCenterDescrip = x.CostCenterDescrip,
                    Categoria = x.Categoria,
                    Horas = x.Horas,
                    Fyc = x.Fyc,
                    Fyp = x.Fyp
                })
                .OrderBy(o => o.Segmento)
                .ToList();

            return engagementSegment;
        }

    }
}
