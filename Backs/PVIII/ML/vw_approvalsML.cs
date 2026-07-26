using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Text;

namespace ML
{
    public class vw_approvalsML
    {
        public string P8Id { get; set; } = null!;

        public string? PastYearp8Id { get; set; }

        public string? CurrentEngagementManagerName { get; set; }

        public string? CurrentEngagementPartnerName { get; set; }

        public string CurrentEngagementManagerEmail { get; set; } = null!;

        public string CurrentEngagementPartnerEmail { get; set; } = null!;

        public int P8revenueTypeId { get; set; }

        public string ClientName { get; set; } = null!;

        public int P8FiscalYearLabel { get; set; }

        public string? P8StatusLabel { get; set; }

        public int? IsFinancialRisk { get; set; }

        public int? IsHighRisk { get; set; }

        public int? ApprovalLevelId { get; set; }

        public decimal? NetAuditRevenueCurrent { get; set; }

        public decimal? StandardAuditHoursCurrent { get; set; }

        public decimal? ValuationCurrent { get; set; }

        public decimal? AverageAuditFeeCurrent { get; set; }

        public decimal? StandardAuditHoursPast { get; set; }

        public decimal? NetAuditRevenuePast { get; set; }

        public decimal? ValuationPast { get; set; }

        public decimal? AverageAuditFeePast { get; set; }

        public string ApprHofA { get; set; } = null!;

        public string ApprBupp { get; set; } = null!;

        public string ApprBupic { get; set; } = null!;

        public string ApprLeap { get; set; } = null!;

        public string ApprovalsSummary { get; set; } = null!;
    }
}