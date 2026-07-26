using System;
using System.Collections.Generic;

namespace DL;

public partial class SalesCreditGrupalFy
{
    public int PayrollNumber { get; set; }

    public long OpportunityId { get; set; }

    public int CreditedPartner { get; set; }

    public decimal Amount { get; set; }

    public int FiscalMonthId { get; set; }

    public int FiscalYearId { get; set; }
}
