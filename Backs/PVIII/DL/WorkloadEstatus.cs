using System;
using System.Collections.Generic;

namespace DL;

public partial class WorkloadEstatus
{
    public int WeId { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? EmployeeId { get; set; }

    public int? FiscalYear { get; set; }

    public bool? Vigencia { get; set; }

    public string? Bu { get; set; }

    public string? UserName { get; set; }

    public string? Comments { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public int? ColumnE { get; set; }

    public int? ColumnF { get; set; }

    public string? ColumnG { get; set; }

    public string? ColumnH { get; set; }
}
