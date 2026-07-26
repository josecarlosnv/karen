using System;
using System.Collections.Generic;

namespace DL;

public partial class OportunidadesAbiertasIm
{
    public string? EngagementEndDate { get; set; }

    public string? EngagementStartDate { get; set; }

    public string? EntityGroup { get; set; }

    public string? EntityGroupName { get; set; }

    public string ExpectedDecisionDate { get; set; } = null!;

    public string OpportunityBa { get; set; } = null!;

    public string OpportunityDescription { get; set; } = null!;

    public long OpportunityId { get; set; }

    public string OpportunityManager { get; set; } = null!;

    public string OpportunityPartner { get; set; } = null!;

    public long OpportunityPartnerId { get; set; }

    public string OpportunityProfitCenter { get; set; } = null!;

    public string CaopportunityStatus { get; set; } = null!;

    public string? Outcome { get; set; }

    public string EntityDescription { get; set; } = null!;

    public long EntityId { get; set; }

    public string? ProbofSuccess { get; set; }

    public string? PursuitStage { get; set; }

    public decimal LocalMemberFirmFees { get; set; }

    public string OpportunityServiceType { get; set; } = null!;

    public string? PrimaryServiceIndicator { get; set; }

    public string OpportunityProfitCenterFunction { get; set; } = null!;

    public long CompanyCode { get; set; }

    public string? SentinelServiceType { get; set; }

    public string TypeOfWork { get; set; } = null!;

    public string SaproleAmrinternal { get; set; } = null!;

    public string LedaaccessAmrinternal { get; set; } = null!;

    public string? OpportunityCreateDate { get; set; }

    public string? OpportunityModifiedDate { get; set; }
}
