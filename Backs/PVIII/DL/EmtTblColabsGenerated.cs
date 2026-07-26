using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblColabsGenerated
{
    public int EmtColabsGenPk { get; set; }

    public long EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string LocalJobLevelName { get; set; } = null!;

    public int LocalJobLevelId { get; set; }

    public string? Bu { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? CostCenter { get; set; }

    public string? CostCenterDescription { get; set; }

    public decimal? YearsInRole { get; set; }

    public string? LocationName { get; set; }

    public decimal? Aicpa { get; set; }

    public decimal? Pcaob { get; set; }

    public decimal? Icfr { get; set; }

    public decimal? Sec { get; set; }

    public decimal? Ifrs { get; set; }

    public decimal? Usgaap { get; set; }

    public string? Qpr1 { get; set; }

    public string? Qpr2 { get; set; }

    public string? Qpr3 { get; set; }

    public bool? EstatusId { get; set; }

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }
}
