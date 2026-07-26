using DL;
using Microsoft.EntityFrameworkCore;
using ML;
using System.Collections.Generic;
using System.Linq;

namespace BL
{
    public class CatalogoSegmento
    {
        private readonly MexItaStaBiAuditContext _context;

        public CatalogoSegmento(MexItaStaBiAuditContext context)
        {
            _context = context;
        }
        public List<SegmentoML> GetSegmentos()
        {
            var segmentos = _context.PviiiCatSegments
                .Where(x => x.SegmentLabel != null)
                .GroupBy(x => new { x.SegmentId, x.SegmentLabel, x.BusinessUnitIdLabel })
                .Select(g => new SegmentoML
                {
                    SegmentoId = g.Key.SegmentId.ToString(),
                    SegmentoNombre = g.Key.SegmentLabel,
                    BusinessUnitIdLabel = g.Key.BusinessUnitIdLabel.Trim('\r', '\n'),

                })
                .OrderBy(s => s.SegmentoNombre)
                .ToList();

            return segmentos;
        }
    }
}