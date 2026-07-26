using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class PviiiMasterSpecialist
    {
        public int MasterSpecialistId { get; set; }

        public string FunctionLabel { get; set; } = null!;

        public string ServiceLineLabel { get; set; } = null!;

        public string P8Id { get; set; } = null!;

        public bool P8ApprStatus { get; set; }

        public bool P8ValidityStatus { get; set; }

        public string BusinessUnitIdLabel { get; set; } = null!;

        public string SegmentLabel { get; set; } = null!;

        public string CurrentEngagementPartnerName { get; set; } = null!;

        public string CurrentEngagementPartnerEmail { get; set; } = null!;

        public string SpecialistPartnerName { get; set; } = null!;

        public string SpecialistPartnerEmail { get; set; } = null!;

        public bool SpecialistConfirmStatus { get; set; }

        public bool SpecialistConfirmBreakdown { get; set; }

        public string? UpdatedByUserEmail { get; set; }

        public DateTime? UpdatedDateTime { get; set; }

        
    }
}
