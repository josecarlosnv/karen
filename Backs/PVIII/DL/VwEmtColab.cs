using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEmtColab
{
    public string? EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public DateOnly? FechaInicio { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? LocalJobLevelName { get; set; }

    public int LocalJobLevelId { get; set; }

    public string? Bu { get; set; }

    public string? CostCenter { get; set; }

    public string? LocationName { get; set; }

    public int? HireDate { get; set; }

    public int? OriginalHireDate { get; set; }

    public int? SeniorityDate { get; set; }

    public int? JobEntryDate { get; set; }

    public int? YearsInRole { get; set; }

    public int EstatusId { get; set; }
}
