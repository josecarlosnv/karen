using System;
using System.Collections.Generic;

namespace DL;

public partial class ForecastTblTimeReportBiweekly
{
    public long? Client { get; set; }

    public int? EmployeeNumber { get; set; }

    public string? CurrentEmployeeStaffLevel { get; set; }

    public long? Engagement { get; set; }

    public decimal? ChargeableHours { get; set; }

    public int? FiscalYearPeriod { get; set; }

    public DateOnly? FiscalPeriodDate { get; set; }

    public string? FrequencyType { get; set; }

    public int PkTimeRepo { get; set; }
}
