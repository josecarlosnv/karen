using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblStaffingAllocation
{
    public int KeyId { get; set; }

    public string P8Id { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string LevelLabel { get; set; } = null!;

    public int PeopleCount { get; set; }

    public bool IsActive { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public decimal? HoursPastFiscalYear { get; set; }

    public decimal? HoursCurrentFiscalYear { get; set; }

    public decimal? RateAmountPastFiscalYear { get; set; }

    public decimal? RateAmountCurrentFiscalYear { get; set; }

    public decimal? FeesAmountCurrentFiscalYear { get; set; }

    public int? WeekDays { get; set; }

    public decimal? HoursTotal { get; set; }

    public int? CostCenter { get; set; }

    public decimal? FeesAmountPastFiscalYear { get; set; }

    public decimal? RateAmountTotal { get; set; }
}
