using System;
using System.Collections.Generic;

namespace DL;

public partial class ClientCareFy
{
    public string PayrollNumber { get; set; } = null!;

    public long ClientId { get; set; }

    public int FiscalMonthId { get; set; }

    public int FiscalYearId { get; set; }
}
