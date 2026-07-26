using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class PviiiSpecialist
    {
        public int KeyId { get; set; }

        public string P8Id { get; set; } = null!;

        public string FunctionLabel { get; set; } = null!;

        public string ServiceLineLabel { get; set; } = null!;

        public string OfficeLabel { get; set; } = null!;

        public decimal AgreedFeesAmount { get; set; }

        public bool AuditStagePreliminaryInd { get; set; }

        public bool AuditStageInterimInd { get; set; }

        public bool AuditStageFinalInd { get; set; }

        public bool IsActive { get; set; }

        public ML.P8SumClient P8 { get; set; } = null!;
    }
}
