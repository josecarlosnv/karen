using System;
using System.Collections.Generic;

namespace DL;

public partial class IntraFunctionSalesCredit
{
    public int Id { get; set; }

    public string? EmployeeId { get; set; }

    public string? Employee { get; set; }

    public string? EmployeeLevel { get; set; }

    public string? EmployeeProfitCenterFunction { get; set; }

    public string? EmployeeProfitCenter { get; set; }

    public string? EmployeeProfitCenterServiceLine { get; set; }

    public string? EmployeeBa { get; set; }

    public string? OpportunityId { get; set; }

    public string? EntityDescription { get; set; }

    public string? EntityId { get; set; }

    public string? EntityKeyAccountTier { get; set; }

    public DateTime? OpportunityCreateDate { get; set; }

    public string? CurrentFiscalYear { get; set; }

    public string? SystemCloseFiscalYear { get; set; }

    public DateTime? ExpectedDecisionDate { get; set; }

    public DateTime? SystemCloseDate { get; set; }

    public string? OpportunityDescription { get; set; }

    public string? OpportunityPartnerId { get; set; }

    public string? OpportunityPartner { get; set; }

    public string? OpportunityProfitCenterFunction { get; set; }

    public string? OpportunityProfitCenter { get; set; }

    public string? OpportunityProfitCenterServiceLine { get; set; }

    public string? OpportunityBa { get; set; }

    public string? SalesCredit { get; set; }

    public double? SalesCreditAmount { get; set; }

    public double? OverallOpportunityValue { get; set; }

    public DateOnly? FechaProceso { get; set; }
}
