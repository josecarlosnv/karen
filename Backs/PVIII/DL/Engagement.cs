using System;
using System.Collections.Generic;

namespace DL;

public partial class Engagement
{
    public long EngagementNumber { get; set; }

    public string EngagementDescr { get; set; } = null!;

    public string EngagementLegacyNumber { get; set; } = null!;

    public DateTime? EngagementClosedDate { get; set; }

    public string Currency { get; set; } = null!;

    public string BusinessArea { get; set; } = null!;

    public DateTime? EngagementStatusEffectiveDate { get; set; }

    public string EmSapPersonnelNumber { get; set; } = null!;

    public string EmLegacyEmplId { get; set; } = null!;

    public string EpSapPersonnelNumber { get; set; } = null!;

    public string EpLegacyEmplId { get; set; } = null!;

    public double ErpRealizationRate { get; set; }

    public string SectorCode { get; set; } = null!;

    public string LineOfBusiness { get; set; } = null!;

    public double EstimatedRecoverableFees { get; set; }

    public long EntityNumber { get; set; }

    public DateTime? EngagementOpenDate { get; set; }

    public string ProfitCenter { get; set; } = null!;

    public string LocalServiceType { get; set; } = null!;

    public string LocalServiceTypeDescr { get; set; } = null!;

    public string CompanyCode { get; set; } = null!;

    public string SicCode { get; set; } = null!;

    public string EngagementStatus { get; set; } = null!;

    public string EngagementType { get; set; } = null!;

    public string RecurringWorkDescr { get; set; } = null!;

    public string ProfitCenterDescr { get; set; } = null!;

    public string CeacEraId { get; set; } = null!;

    public DateTime? EngagementCreateDate { get; set; }

    public string AssistantName { get; set; } = null!;

    public string AssistantSapPersonnelNumber { get; set; } = null!;

    public string AssistantLegacyEmplId { get; set; } = null!;

    public string SanNumber { get; set; } = null!;

    public string EmName { get; set; } = null!;

    public string EpName { get; set; } = null!;

    public string EngagementTypeDescr { get; set; } = null!;

    public string EntityName { get; set; } = null!;

    public string EpEmail { get; set; } = null!;

    public string Function { get; set; } = null!;

    public DateTime? EngagementUpdateDate { get; set; }

    public double MtdEngagementExpenses { get; set; }

    public double MtdEngagementFees { get; set; }

    public double MtdChargedHours { get; set; }

    public double MtdTotalRevenue { get; set; }

    public double MtdBillings { get; set; }

    public double MtdCollections { get; set; }

    public string AssociatedPartnerName { get; set; } = null!;

    public string AssociatedPartnerSapPersonnelNumber { get; set; } = null!;

    public string AssociatedPartnerLegacyEmplId { get; set; } = null!;

    public string EngagementAccreditation1 { get; set; } = null!;

    public string EngagementAccreditation2 { get; set; } = null!;

    public string EngagementAccreditation3 { get; set; } = null!;

    public string EngagementAccreditation4 { get; set; } = null!;

    public string EngagementAccreditation5 { get; set; } = null!;

    public string LeadEngagementNumber { get; set; } = null!;

    public DateTime? MtdStartDate { get; set; }

    public DateTime? MtdEndDate { get; set; }

    public bool EngagementConfidentialFlag { get; set; }

    public long OpportunityNumber { get; set; }

    public string SentinelServiceType { get; set; } = null!;

    public string SentinelServiceTypeDescription { get; set; } = null!;
}
