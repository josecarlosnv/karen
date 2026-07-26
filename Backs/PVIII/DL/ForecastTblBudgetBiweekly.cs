using System;
using System.Collections.Generic;

namespace DL;

public partial class ForecastTblBudgetBiweekly
{
    public DateOnly? FiscalPeriodDate { get; set; }

    public int? CostCenter { get; set; }

    public int? FiscalYearPeriod { get; set; }

    public string? StaffLevel { get; set; }

    public decimal? Realization { get; set; }

    public decimal? Fee { get; set; }

    public decimal? ChargeableHours { get; set; }

    public string? FrequencyType { get; set; }

    public decimal? Revenue { get; set; }

    public int PkBudg { get; set; }
}
