using System;
using System.Collections.Generic;

namespace DL;

public partial class BonusCompliance
{
    public string EmployeeId { get; set; } = null!;

    public string? EmployeeName { get; set; }

    public string PositionName { get; set; } = null!;

    public string? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string PracticeName { get; set; } = null!;

    public string SeniorityTypeCalculation { get; set; } = null!;

    public decimal? HoursRequired { get; set; }

    public int RequiredSelfStudyPercentage { get; set; }

    public int RequiredPbpercentage { get; set; }

    public decimal? ObligatoryProgramHoursToConsider { get; set; }

    public decimal? TechnicalHoursToConsider { get; set; }

    public string ApplyBonus { get; set; } = null!;

    public decimal ObligatoryProgramPercentage { get; set; }

    public decimal? VirtualPlaybackPercentage { get; set; }

    public decimal? BonusHours { get; set; }

    public decimal? IncentiveHoursToConsider { get; set; }

    public int? RequiredPercentage { get; set; }

    public int FiscalYearName { get; set; }
}
