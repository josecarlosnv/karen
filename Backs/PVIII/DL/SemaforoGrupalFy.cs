using System;
using System.Collections.Generic;

namespace DL;

public partial class SemaforoGrupalFy
{
    public int PayrollNumber { get; set; }

    public long EntityId { get; set; }

    public int CreditedBy { get; set; }

    public string Semaforo { get; set; } = null!;

    public decimal Percentage { get; set; }

    public int FiscalMonthId { get; set; }

    public int FiscalYearId { get; set; }
}
