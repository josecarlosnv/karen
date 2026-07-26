using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblReappoint
{
    public int EmtreappPk { get; set; }

    public int EmployeeId { get; set; }

    public decimal EntityId { get; set; }

    public int Fy { get; set; }

    public string KeyEmt { get; set; } = null!;

    public string KeyEmtPfy { get; set; } = null!;

    public int? CeacId { get; set; }

    public string? EngagementName { get; set; }

    public int LeadPartnerId { get; set; }

    public int YearAppointment { get; set; }

    public int YearReappointment { get; set; }

    public bool? CompetenceCapabilities { get; set; }

    public bool? NoSignificantChangesInitial { get; set; }

    public bool? NoSignificanChangesLegalRegulatory { get; set; }

    public bool? NoChangesEntitysIndustry { get; set; }

    public bool? NoChangesComplexity { get; set; }

    public bool? SufficientTime { get; set; }

    public bool? Independent { get; set; }

    public bool? AblilityObjectivityIntegrity { get; set; }

    public bool? MemberEngagement { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? HasThreats { get; set; }

    public string? HasThreatsDesc { get; set; }

    public bool NoResponsibility { get; set; }

    public bool? NcImpactEval { get; set; }

    public bool? PcaobResults { get; set; }

    public string? EmtssrequiDesc { get; set; }

    public int? EmtassignmentId { get; set; }

    public int? EmtsectorId { get; set; }

    public bool? Validated { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public decimal? ColumnA { get; set; }

    public decimal? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public virtual EmtDimAssignmentType? Emtassignment { get; set; }

    public virtual EmtDimSectorType? Emtsector { get; set; }
}
