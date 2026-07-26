using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class SpecialistsDto
    {
        public int KeyId { get; set; }

        public string ServiceLineLabel { get; set; } = null!;

        public decimal AgreedFeesAmount { get; set; }

        public bool AuditStagePreliminaryInd { get; set; }
        public bool AuditStageInterimInd { get; set; }
        public bool AuditStageFinalInd { get; set; }

        public string? AuditStagePreliminaryMths { get; set; }
        public string? AuditStageInterimMths { get; set; }
        public string? AuditStageFinalMths { get; set; }

        public int? ServiceLinePartnerId { get; set; }
        public string? ServiceLinePartnerLabel { get; set; }

        public string? ServiceLineInChargeEmail { get; set; } = null!;
        public int? CostCenter { get; set; }
        public string OfficeLabel { get; set; } = null!;


        public string FunctionLabel { get; set; }

        public string? CreatedByUserEmail { get; set; }
    }
}

