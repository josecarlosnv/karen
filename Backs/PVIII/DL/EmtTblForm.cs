using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblForm
{
    public int EmtFormPk { get; set; }

    public int EmtTypePk { get; set; }

    public string KeyEmt { get; set; } = null!;

    public long EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string LocalJobLevelName { get; set; } = null!;

    public string Bu { get; set; } = null!;

    public string Office { get; set; } = null!;

    public decimal EntityId { get; set; }

    public string EntityName { get; set; } = null!;

    public int? YearAppointment { get; set; }

    public bool? CriteriaA { get; set; }

    public string? CriteriaAComments { get; set; }

    public bool? CriteriaB { get; set; }

    public string? CriteriaBComments { get; set; }

    public bool? PerfomanceRequirements { get; set; }

    public string? PerfomanceRequirementsComments { get; set; }

    public bool? DocumentationRequirements { get; set; }

    public string? DocumentationRequirementsComments { get; set; }

    public bool? Assistant { get; set; }

    public bool? ConductRequirements { get; set; }

    public string? ConductRequirementsComments { get; set; }

    public bool? ReadyToApprove { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public virtual EmtDimAssignmentType EmtTypePkNavigation { get; set; } = null!;
}
