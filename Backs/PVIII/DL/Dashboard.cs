using System;
using System.Collections.Generic;

namespace DL;

public partial class Dashboard
{
    public int? Payrollnumber { get; set; }

    public string? PartnerName { get; set; }

    public string? OfficeName { get; set; }

    public int? ConceptId { get; set; }

    public string? ConceptName { get; set; }

    public string? NameCategory { get; set; }

    public decimal? Goal { get; set; }

    public decimal? PlanValue { get; set; }

    public decimal? Percentage { get; set; }

    public decimal? AchievementValue { get; set; }

    public decimal? AchievementPercentage { get; set; }

    public decimal? PercentageToPay { get; set; }

    public decimal? EarnedPercentage { get; set; }

    public string? DescriptionGoal { get; set; }

    public string? DescriptionCalc { get; set; }

    public string? DescriptionOperator { get; set; }

    public int? FiscalYearid { get; set; }

    public int? FiscalMonthid { get; set; }
}
