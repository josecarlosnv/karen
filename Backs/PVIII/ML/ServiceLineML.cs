using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class ServiceLineML
    {
        public int SpecialistServiceLineId { get; set; }

        public string ServiceLineLabel { get; set; } = null!;

        public string ServiceLineGroup { get; set; } = null!;

        public string OfficeLabel { get; set; } = null!;

        public int ServiceLineLeadPartnerId { get; set; }

        public string ServiceLineLeadPartnerEmail { get; set; } = null!;
        public int CostCenter { get; set; }

        public string? UpdatedByUserEmail { get; set; }

        public DateTime? UpdatedDateTime { get; set; }

        public string FunctionLabel { get; set; } = null!;
    }
}
