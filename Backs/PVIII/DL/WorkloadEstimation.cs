using System;
using System.Collections.Generic;

namespace DL;

public partial class WorkloadEstimation
{
    public int EwId { get; set; }

    public DateOnly Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string EmployeeId { get; set; } = null!;

    public int FiscalYear { get; set; }

    public int Quarter { get; set; }

    public bool Validity { get; set; }

    public string Bu { get; set; } = null!;

    public string Category { get; set; } = null!;

    public string? Estimation { get; set; }

    public string? Comments { get; set; }

    public string EmailAddressBusiness { get; set; } = null!;

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public int? ColumnE { get; set; }

    public string? ColumnF { get; set; }

    public virtual DimBu BuNavigation { get; set; } = null!;

    public virtual DimCategory CategoryNavigation { get; set; } = null!;

    public virtual DimFiscalYear FiscalYearNavigation { get; set; } = null!;

    public virtual DimQuarter QuarterNavigation { get; set; } = null!;
}
