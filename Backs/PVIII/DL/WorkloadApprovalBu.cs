using System;
using System.Collections.Generic;

namespace DL;

public partial class WorkloadApprovalBu
{
    public int WaId { get; set; }

    public DateOnly Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int FiscalYear { get; set; }

    public string Bu { get; set; } = null!;

    public int Quarter { get; set; }

    public string? CommentsHofA { get; set; }

    public string? CommentsBupp { get; set; }

    public string Category { get; set; } = null!;

    public int? ApprovalHofA { get; set; }

    public int? ApprovalBupp { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public virtual DimBu BuNavigation { get; set; } = null!;

    public virtual DimCategory CategoryNavigation { get; set; } = null!;

    public virtual DimFiscalYear FiscalYearNavigation { get; set; } = null!;

    public virtual DimQuarter QuarterNavigation { get; set; } = null!;
}
