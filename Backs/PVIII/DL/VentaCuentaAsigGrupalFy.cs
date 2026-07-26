using System;
using System.Collections.Generic;

namespace DL;

public partial class VentaCuentaAsigGrupalFy
{
    public int PayrollNumber { get; set; }

    public string EntityGroupNumber { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int CreditedBy { get; set; }

    public string Indicatortype { get; set; } = null!;

    public long OpportunityId { get; set; }

    public decimal Amount { get; set; }

    public int FiscalMonthId { get; set; }

    public int FiscalYearId { get; set; }
}
