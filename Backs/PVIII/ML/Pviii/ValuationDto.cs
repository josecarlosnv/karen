using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class ValuationDto
    {
            public int P8ValuationPk { get; set; }

            public string? P8Id { get; set; } 

            public decimal? AuditRevenue { get; set; }

            public decimal? ReportRevenue { get; set; }

            public decimal? TaxRevenue { get; set; }

            public decimal? StandardAuditHours { get; set; }

            public decimal? AverageAuditFee { get; set; } 

            public decimal? StandardAuditRevenue { get; set; }
            public decimal? SpecialistsRevenue { get; set; }

            public decimal? Expenses { get; set; }

            public bool? IsActive { get; set; }

            public long? RecordChangeSequence { get; set; }

            public decimal? Valuation { get; set; }

            public decimal? NetAuditIncome { get; set; }

            public DateTime? Create { get; set; }

            public string? CreateBy { get; set; } = null!;
        public bool? IsValidated { get; set; }



    }

}