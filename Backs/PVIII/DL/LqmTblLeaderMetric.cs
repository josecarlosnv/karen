using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmTblLeaderMetric
{
    public int LeaderMetricsKey { get; set; }

    public string LeaderId { get; set; } = null!;

    public string LeaderName { get; set; } = null!;

    public int FiscalYearLabel { get; set; }

    public string LeaderTitle { get; set; } = null!;

    public string Practice { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public int YearsWithFirm { get; set; }

    public string? ProfileSummary { get; set; }

    public string? PhotoUrl { get; set; }

    public int RevenueAttainmentPct { get; set; }

    public int ClientsWonCount { get; set; }

    public string PortfolioHealthLabel { get; set; } = null!;

    public int QualityRatingPct { get; set; }

    public string OpenPortfolioDensity { get; set; } = null!;

    public bool ClientsGainedIndicator { get; set; }

    public string ClientsGainedText { get; set; } = null!;

    public bool ClientsLostIndicator { get; set; }

    public string ClientsLostText { get; set; } = null!;

    public string KeyActivitiesAssignments { get; set; } = null!;

    public string AcademicTeachingInstitution { get; set; } = null!;

    public string AdvancedDegreesCertifications { get; set; } = null!;

    public bool IsAdvanceCapabilitiesUsed { get; set; }

    public bool IsMapJeUsed { get; set; }

    public bool IsDatasnipperFssUsed { get; set; }

    public bool IsKcwRolloverUsed { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }
}
