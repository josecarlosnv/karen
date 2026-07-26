using System;
using System.Collections.Generic;

namespace DL;

public partial class IntraFunctionSalesCreditFy
{
    public int PayrollNumber { get; set; }

    public string EntityId { get; set; } = null!;

    public string EntityDescription { get; set; } = null!;

    public int OpportunityId { get; set; }

    public string OpportunityDescription { get; set; } = null!;

    public int OpportunityPartnerId { get; set; }

    public string OpportunityPartner { get; set; } = null!;

    public decimal SalesCreditAmount { get; set; }

    public int FiscalMonthId { get; set; }

    public int FiscalYearId { get; set; }
}
