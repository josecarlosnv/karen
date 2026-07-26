using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class CreateProjectDto
    {
        public long? EntityGroupId { get; set; }
        public string? ClientNumber { get; set; }
        public string? ClientName { get; set; }

        public int SegmentId { get; set; }
        public string? FiscalYear { get; set; }
        public string? RevenueType { get; set; }

        public string? PartnerName { get; set; }
        public int? PartnerEmployeeId { get; set; }
        public string? PartnerEmail { get; set; }  

        public string? SrManagerName { get; set; }
        public int? SrManagerEmployeeId { get; set; }
        public string? SrManagerEmail { get; set; }
        public bool P8ValidityStatus { get; set; }

        public string? AuditModality { get; set; }
        public string? ProjectServiceDesc { get; set; }
        public int? AuditYear { get; set; }
        public string? CreatedByUserEmail { get; set; }
    }
}