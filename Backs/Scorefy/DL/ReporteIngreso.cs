using System;
using System.Collections.Generic;

namespace DL;

public partial class ReporteIngreso
{
    public string? EngagementNumber { get; set; }

    public string? EngagementDescr { get; set; }

    public double? NetEngagementRevenue { get; set; }

    public string? EntityName { get; set; }

    public DateTime? EngagementCreateDate { get; set; }

    public string? Function { get; set; }

    public string? PhaseStatus { get; set; }

    public string? EmName { get; set; }

    public string? EpName { get; set; }

    public int? FiscalYear { get; set; }

    public string? BusinessArea { get; set; }

    public string? ProfitCenter { get; set; }

    public string? MotivoRechazo { get; set; }

    public string? EntityGroupId { get; set; }

    public string? OpportunityNumber { get; set; }
}
