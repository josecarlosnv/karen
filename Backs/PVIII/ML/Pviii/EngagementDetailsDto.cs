using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class EngagementDetailsDto
    {
        public int? EngagementLeadEmployeeId { get; set; }
        public string? EngagementLeadName { get; set; }

        public int? EngagementManagerEmployeeId { get; set; }
        public string? EngagementManagerName { get; set; }

        public string? AuditModality { get; set; }
        public string? ResponsibleOfficeLabel { get; set; }
        public string? AddressLine { get; set; }
        public string? PostalCode { get; set; }

        public string? PhoneNumber { get; set; }

        public string? ProjectServiceDescription { get; set; }
        public short? AuditYear { get; set; }
        public string? IncomeType { get; set; }

        public bool? IsReportToGroup { get; set; }
        public bool? IsConsolidated { get; set; }
        public int? SegmentId { get; set; }
    }
}
