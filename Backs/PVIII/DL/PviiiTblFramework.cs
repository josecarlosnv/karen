using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblFramework
{
    public int Id { get; set; }

    public Guid P8id { get; set; }

    public string? ClientName { get; set; }

    public bool FirstYearClient { get; set; }

    public string? AccountingFrameworks { get; set; }

    public string? AuditingStandards { get; set; }

    public bool Icofr { get; set; }

    public string Industry { get; set; } = null!;

    public string IndustryRisk { get; set; } = null!;

    public string PriorYearAssessment { get; set; } = null!;

    public string ExpectedCurrentYearAssessment { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string EngagementSourceLabel { get; set; } = null!;

    public string EntityIndustryLabel { get; set; } = null!;
}
