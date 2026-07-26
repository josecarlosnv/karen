using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class CreateEntityReportConfigDto
    {
        public int? KeyId { get; set; }
        public string? ReportTypeLabel { get; set; }

        public DateTime? OpinionDate { get; set; }
        public string? ReviewerTypeLabel { get; set; } = null!;
        public decimal? AuditFeeAmount { get; set; }
        public decimal? ReportFeeAmount { get; set; }
        public decimal? TaxFeeAmount { get; set; }

        public string? LsqcrReviewerName { get; set; }  
        public decimal? LsqcrReviewerHours { get; set; }
        public string? EntityName { get; set; }

        public string? Eqcrreviewer { get; set; }

        public decimal? Eqcrhours { get; set; }
        public int? EmployeeIdEqcr { get; set; }

        public int? EmployeeIdLsqcr { get; set; }
        public long? EntityId { get; set; }
        public string? CreatedByUserEmail { get; set; }

        public DateTime? CreatedDateTime { get; set; }

        public int? ReportTypeId { get; set; }

        public bool IsDeleted { get; set; }

    }

}