using System;
using System.Collections.Generic;

namespace DL;

public partial class PartnerParametrization
{
    public int PayrollNumber { get; set; }

    public int Conceptid { get; set; }

    public int OperatorId { get; set; }

    public decimal Goal { get; set; }

    public int CalculationTypeId { get; set; }

    public decimal PercentageToPay { get; set; }

    public int GoalTypeId { get; set; }

    public int FiscalYearId { get; set; }
}
