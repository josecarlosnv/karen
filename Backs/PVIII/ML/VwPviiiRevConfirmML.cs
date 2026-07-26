using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class VwPviiiRevConfirmML
    {
            public string P8Id { get; set; } = null!;
            public string? CurrentEngagementPartnerName { get; set; }
            public string? CurrentEngagementManagerName { get; set; }
            public string? AccountingFrameworks { get; set; }
            public string? AuditingStandards { get; set; }
            public string? Industry { get; set; }
            public string? LocalReferedLabel { get; set; }
            public bool? IsPublicEntity { get; set; }
            public bool? IsRegulatedEntity { get; set; }
            public bool? IsListedEntity { get; set; }
            public bool? IsSubstantialRoleGrp { get; set; }
            public bool? IsSignificantSecSubsidiary { get; set; }
            public bool? IsSecAffiliate { get; set; }
            public string? NatureOfEngagementLabel { get; set; }
            public string? ReviewerTypeLabel { get; set; }
            public string? ReportType { get; set; }
            public int? IsHighRisk { get; set; }

    }
}
