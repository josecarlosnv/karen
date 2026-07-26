using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssignmentsBasicInformation
{
    public int EmtAssiBasicPk { get; set; }

    public string KeyEmt { get; set; } = null!;

    public string? KeyEmtPfy { get; set; }

    public int FiscalYearEmt { get; set; }

    public long EmployeeId { get; set; }

    public int YearAppointment { get; set; }

    public int? YearReappointment { get; set; }

    public int EmtTypePk { get; set; }

    public long? AssistantId { get; set; }

    public int EmtReasonId { get; set; }

    public long? CeacId { get; set; }

    public string? EngagementName { get; set; }

    public decimal EntityId { get; set; }

    public long LeadPartnerId { get; set; }

    public bool? ReadyToComplete { get; set; }

    public bool? ReadyToApprove { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public virtual EmtDimAssignationReason EmtReason { get; set; } = null!;

    public virtual EmtDimAssignmentType EmtTypePkNavigation { get; set; } = null!;
}
