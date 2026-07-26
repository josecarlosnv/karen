using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblEngagementContext
{
    public int Id { get; set; }

    public Guid P8id { get; set; }

    public bool FirstYearClient { get; set; }

    public string? AccountingFrameworks { get; set; }

    public string? AuditingStandards { get; set; }

    public bool Icofr { get; set; }

    public string? Industry { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? LocalReferedLabel { get; set; }

    public string? EntityIndustryLabel { get; set; }

    public int? RecordChangeSequence { get; set; }

    public string PreliminaryRiskProject { get; set; } = null!;

    public string? CreatedByUserEmail { get; set; }
}
