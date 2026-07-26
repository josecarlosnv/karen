using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssign
{
    public int PkEmtassi { get; set; }

    public int EmployeeId { get; set; }

    public decimal EntityId { get; set; }

    public int Fy { get; set; }

    public string KeyEmt { get; set; } = null!;

    public string? EmtssrequiId { get; set; }

    public int YearAppointment { get; set; }

    public int EmtreasonId { get; set; }

    public int EmttypeId { get; set; }

    public int? EmtsectorId { get; set; }

    public int? CeacId { get; set; }

    public string? EngagementName { get; set; }

    public int LeadPartnerId { get; set; }

    public bool? CompentenceCapabilities { get; set; }

    public bool? ProfessionalsStandars { get; set; }

    public bool? KpmgPolicies { get; set; }

    public bool? KnoledgeIndustry { get; set; }

    public bool? ExperienceSimilar { get; set; }

    public bool? SufficientTime { get; set; }

    public bool? LocalListed { get; set; }

    public bool? UsListed { get; set; }

    public bool? OtherCountry { get; set; }

    public bool? RegulatedIndustry { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? PartEngagement { get; set; }

    public bool? IndepenceEntity { get; set; }

    public bool? Objectivity { get; set; }

    public bool? Integrity { get; set; }

    public bool? Impartiality { get; set; }

    public string? HasThreats { get; set; }

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

    public virtual EmtDimAssignationReason Emtreason { get; set; } = null!;

    public virtual EmtDimAssignatType Emttype { get; set; } = null!;
}
