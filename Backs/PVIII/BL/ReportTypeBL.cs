using DL;
using ML;
using System;
using System.Collections.Generic;
using System.Text;

namespace BL
{
    public class ReportTypeBL
    {

        private readonly MexItaStaBiAuditContext _context;

        public ReportTypeBL(MexItaStaBiAuditContext context)
        {
            _context = context;
        }

        public List<ReportTypeML> GetCatReportTypes()
        {
            var reportTypes = _context.PviiiCatReportTypes
                .Select(x => new ReportTypeML
                {
                   
                    IdCat = x.ReportTypeId,
                    TypeDescription = x.ReportTypeLabel,
                    QualityReviewIndicator = x.QualityReviwerIndicator
                })
                .OrderBy(x => x.TypeDescription)
                .ToList();

            return reportTypes;
        }

    }
}
