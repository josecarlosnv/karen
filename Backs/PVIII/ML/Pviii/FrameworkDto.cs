using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
        public class FrameworkDto
        {
            public int Id { get; set; }
            public Guid P8Id { get; set; }

            public bool FirstYearClient { get; set; }

            public List<string>? AccountingFrameworks { get; set; }
            public List<string>? AuditingStandards { get; set; }

            public bool ICOFR { get; set; }

            public string? Industry { get; set; }
            public string? IndustryRisk { get; set; }

        public string? LocalReferedLabel { get; set; }
        public string? EntityIndustryLabel { get; set; }
        public int? RecordChangeSequence { get; set; }
        public string? CreatedByUserEmail { get; set; }
        public string? PreliminaryRiskProject { get; set; } = null!;
        public string? LocalOrReferred { get; set; }
        public string? ReferredCountry { get; set; }


        public DateTime? CreatedAt { get; set; }
            public DateTime? UpdatedAt { get; set; }
        }
    
}
