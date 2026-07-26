using System;
using System.Collections.Generic;

namespace DL;

public partial class ForecastTblTimeReportMonthlyHistoric
{
    public long? Engagement { get; set; }

    public long? Client { get; set; }

    public string? StaffLevel { get; set; }

    public DateOnly? FiscalPeriodDate { get; set; }

    public int? FiscalYearPeriod { get; set; }

    public decimal? Fee { get; set; }

    public decimal? ChargeableHours { get; set; }

    public string? FrequencyType { get; set; }

    public string? DataType { get; set; }

    public decimal? CurrentEngagementErp { get; set; }

    public decimal? EstimatedRecoverableFees { get; set; }

    public int PkTimeRepoMontHistoric { get; set; }
}
