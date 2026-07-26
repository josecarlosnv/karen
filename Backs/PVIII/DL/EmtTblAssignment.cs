using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssignment
{
    public int EmtAssiPk { get; set; }

    public int EmployeeId { get; set; }

    public decimal EntityId { get; set; }

    public int Fy { get; set; }

    public Guid KeyEmt { get; set; }

    public string? KeyEmtPfy { get; set; }

    public string? EmtSsrequiDesc { get; set; }

    public int EmtAssignmentId { get; set; }

    public int EmtSectorPk { get; set; }

    public int EmtReasonId { get; set; }

    public long? CeacId { get; set; }

    public string? EngagementName { get; set; }

    public long LeadPartnerId { get; set; }

    public int YearAppointment { get; set; }

    public bool? MemberEngagement { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? HasThreats { get; set; }

    public string? HasThreatsDesc { get; set; }

    public bool? Independent { get; set; }

    public bool? AblilityObjectivityIntegrity { get; set; }

    public int? YearReappointment { get; set; }

    public bool? CompetenceCapabilities { get; set; }

    public bool? NoSignificantChangesInitial { get; set; }

    public bool? NoSignificanChangesLegalRegulatory { get; set; }

    public bool? NoChangesEntitysIndustry { get; set; }

    public bool? NoChangesComplexity { get; set; }

    public bool? SufficientTime { get; set; }

    public bool NoResponsibility { get; set; }

    public bool? NcImpactEval { get; set; }

    public bool? PcaobResults { get; set; }

    public bool? ReadyToApprove { get; set; }

    public bool? Validated { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public virtual EmtDimAssignmentType EmtAssignment { get; set; } = null!;

    public virtual EmtDimSectorType EmtSectorPkNavigation { get; set; } = null!;
}
