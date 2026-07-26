using System;
using System.Collections.Generic;

namespace DL;

public partial class ReportDimEspecialist
{
    public int IdReportEngagement { get; set; }

    public string? Client { get; set; }

    public string? ClientName { get; set; }

    public string? CurrentLeadEngagementBusinessAreaDesc { get; set; }

    public string? CurrentLeadEngagementBusinessArea { get; set; }

    public string? CurrentLeadEngagementProfitCenterDesc { get; set; }

    public string? CurrentLeadEngagementProfitCenter { get; set; }

    public string? CurrentLeadEngagementPartnerName { get; set; }

    public string? LeadEngagement { get; set; }

    public string? LeadEngagementName { get; set; }

    public string? Engagement { get; set; }

    public string? EngagementName { get; set; }

    public string? EstimatedRecoverableFees { get; set; }

    public string? CurrencyOfEstimatedRecoverableFees { get; set; }

    public string? CurrentEngagementStatusDesc { get; set; }

    public DateOnly? EngagementCreationDate { get; set; }

    public DateOnly? EngagementCloseDate { get; set; }

    public string? CurrentEngagementBusinessAreaDesc { get; set; }

    public string? CurrentEngagementProfitCenterDesc { get; set; }

    public string? CurrentEngagementPartner { get; set; }

    public string? CurrentEngagementPartnerName { get; set; }

    public string? CurrentEngagementManager { get; set; }

    public string? CurrentEngagementManagerName { get; set; }

    public string? FiscalYearPeriod { get; set; }

    public string? CurrencyOfEstimatedRecoverableFees2 { get; set; }

    public string? EstimatedRecoverableFees2 { get; set; }

    public decimal? CurrentEngagementErpPerc { get; set; }

    public string? OpeningWipBalance { get; set; }

    public decimal? Hours { get; set; }

    public decimal? Hours1 { get; set; }

    public decimal? ErpDiscount { get; set; }

    public decimal? RevenueRealization { get; set; }

    public decimal? TimeBilled { get; set; }

    public decimal? NetEngagementRevenue { get; set; }

    public decimal? Expenses { get; set; }

    public decimal? BilledExpenses { get; set; }

    public decimal? GrossEngagementRevenue { get; set; }

    public decimal? GrossMargin { get; set; }

    public decimal? GrossMarginPerc { get; set; }

    public decimal? WriteOnOff { get; set; }

    public decimal? BilledWip { get; set; }

    public decimal? NetLockup { get; set; }

    public decimal? ClosingWipBalance { get; set; }

    public decimal? ClosingReceivableBalance { get; set; }
}
