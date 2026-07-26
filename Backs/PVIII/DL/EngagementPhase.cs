using System;
using System.Collections.Generic;

namespace DL;

public partial class EngagementPhase
{
    public long EngagementNumber { get; set; }

    public int PhaseNumber { get; set; }

    public string PhaseDescr { get; set; } = null!;

    public double PhaseErp { get; set; }

    public string LocalServiceType { get; set; } = null!;

    public string LocalServiceTypeDescr { get; set; } = null!;

    public string PhaseAccreditation1 { get; set; } = null!;

    public string PhaseAccreditation2 { get; set; } = null!;

    public string PhaseAccreditation3 { get; set; } = null!;

    public string PhaseAccreditation4 { get; set; } = null!;

    public string PhaseAccreditation5 { get; set; } = null!;

    public string PhaseStatus { get; set; } = null!;

    public DateOnly? PhaseStatusEffectiveDate { get; set; }
}
