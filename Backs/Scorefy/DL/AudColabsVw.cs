using System;
using System.Collections.Generic;

namespace DL;

public partial class AudColabsVw
{
    public string EmployeeId { get; set; } = null!;

    public DateOnly FechaInicio { get; set; }

    public string? UserName { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public DateOnly? HireDate { get; set; }

    public DateOnly? OriginalHireDate { get; set; }

    public DateOnly? SeniorityDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public DateOnly? LastDateWorked { get; set; }

    public string? ServiceLine { get; set; }

    public string? ServiceLineName { get; set; }

    public string? FiServiceNetwork { get; set; }

    public string? FiServiceNetworkName { get; set; }

    public string? EstatusEmployee { get; set; }

    public string? LocalJobTitle { get; set; }

    public bool? FullTime { get; set; }

    public DateOnly? ProbationaryPeriodo { get; set; }

    public DateOnly? ProbationaryEndDate { get; set; }

    public string? EmployeeClassName { get; set; }

    public string? EmployeeSubClass { get; set; }

    public string? EmployeeSubClassName { get; set; }

    public string? LocalJobLevel { get; set; }

    public string? LocalJobLevelName { get; set; }

    public DateTime? FechaUltimaAct { get; set; }

    public string? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string? PracticaDescription { get; set; }

    public string? ProductoDescription { get; set; }

    public string? LocationName { get; set; }

    public DateOnly? JobEntryDate { get; set; }

    public string FullName { get; set; } = null!;

    public decimal? YearsInRole { get; set; }
}
