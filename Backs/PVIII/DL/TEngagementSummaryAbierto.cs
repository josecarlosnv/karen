using System;
using System.Collections.Generic;

namespace DL;

public partial class TEngagementSummaryAbierto
{
    public string? CurrencyOfEstimatedRecoverableFees { get; set; }

    public int Engagementsummaryid { get; set; }

    public string? ReportingCurrency { get; set; }

    public string? Client { get; set; }

    public string? ClientName { get; set; }

    public string? ClientDunsNumber { get; set; }

    public string? CurrLeadEngmntProfCntrFunct { get; set; }

    public string? CurrLeadEngmntProfCntrFunctDesc { get; set; }

    public string? CurrEngmntBusinessArea { get; set; }

    public string? CurrEngmntBusinessAreaDesc { get; set; }

    public string? CurrEngmntProfCntr { get; set; }

    public string? CurrEngmntProfCntrDesc { get; set; }

    public string? CurrEngmntProfCntrFunct { get; set; }

    public string? CurrEngmntProfCntrFunctDesc { get; set; }

    public int? FiscalYear { get; set; }

    public int? FiscalPeriod { get; set; }

    public DateOnly? EngmntCreationDate { get; set; }

    public DateOnly? EngmntEndDate { get; set; }

    public DateOnly? EngmntLastTimeEntryDate { get; set; }

    public DateOnly? EngmntLastBilledDate { get; set; }

    public DateOnly? EngmntCloseDate { get; set; }

    public string? CurrEngmntManager { get; set; }

    public string? CurrEngmntManagerName { get; set; }

    public string? CurrEngmntPartner { get; set; }

    public string? CurrEngmntPartnerName { get; set; }

    public string? CurrEngmntStatus { get; set; }

    public string? CurrEngmntStatusDesc { get; set; }

    public decimal? Hours { get; set; }

    public decimal? RevenueAtRealization { get; set; }

    public decimal? WriteOnOff { get; set; }

    public decimal? GrossMargin { get; set; }

    public decimal? GrossEngmntRevenue { get; set; }

    public decimal? NetEngmntRevenue { get; set; }

    public decimal? ClosingWipBalance { get; set; }

    public decimal? WipProvision { get; set; }

    public decimal? BilledWip { get; set; }

    public decimal? OpeningWipBalance { get; set; }

    public decimal? EngmntAdminSurcharge { get; set; }

    public decimal? ErpDiscount { get; set; }

    public decimal? Expenses { get; set; }

    public decimal? NetLockup { get; set; }

    public decimal? RevenueAtStandard { get; set; }

    public decimal? CashCollected { get; set; }

    public string? Company { get; set; }

    public string? Engmnt { get; set; }

    public string? EngmntName { get; set; }

    public decimal? CurrEngmntErp { get; set; }

    public decimal? EstimatedRecoverableFees { get; set; }

    public decimal? LaborCosts { get; set; }

    public decimal? TimeBilled { get; set; }

    public decimal? BilledExpenses { get; set; }

    public decimal? ClosingReceivableBalance { get; set; }

    public DateTime FechaProceso { get; set; }
}
