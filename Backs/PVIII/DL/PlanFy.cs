using System;
using System.Collections.Generic;

namespace DL;

public partial class PlanFy
{
    public int Payrollnumber { get; set; }

    public int FiscalYearId { get; set; }

    public int ConceptId { get; set; }

    public decimal? Value { get; set; }

    public decimal? Percentage { get; set; }
}
