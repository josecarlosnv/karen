using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class P8MasterHistoryCreateDto
    {
        public Guid P8Id { get; set; }

        public string ClientName { get; set; } = null!;
        public string ClientNumber { get; set; } = null!;
        public string CreatedByUserEmail { get; set; } = null!;

        public int P8FiscalYearId { get; set; }
        public int P8FiscalYearLabel { get; set; }

        public int RevenueTypeId { get; set; }
        public string RevenueTypeLabel { get; set; } = null!;

        public int SegmentId { get; set; }
        public string SegmentLabel { get; set; } = null!;

        public int BusinessUnitId { get; set; }
        public string BusinessUnitLabel { get; set; } = null!;

        public int CurrentEngagementManagerId { get; set; }
        public string CurrentEngagementManagerName { get; set; } = null!;
        public string CurrentEngagementManagerEmail { get; set; } = null!;

        public int CurrentEngagementPartnerId { get; set; }
        public string CurrentEngagementPartnerName { get; set; } = null!;
        public string CurrentEngagementPartnerEmail { get; set; } = null!;
    }
}
