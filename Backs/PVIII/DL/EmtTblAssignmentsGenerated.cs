using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssignmentsGenerated
{
    public int EmtAssiGenePk { get; set; }

    public int EmtAssiBasicPk { get; set; }

    public Guid KeyEmt { get; set; }

    public string? KeyEmtPfy { get; set; }

    public int Fy { get; set; }

    public long EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string? EmailAddressBusiness { get; set; }

    public string LocalJobLevelName { get; set; } = null!;

    public string? Bu { get; set; }

    public string? LocationName { get; set; }

    public int YearAppointment { get; set; }

    public int? YearReappointment { get; set; }

    public int EmtTypePk { get; set; }

    public string? AssignDesc { get; set; }

    public string? SectorDesc { get; set; }

    public string? ParentSectorDesc { get; set; }

    public long? AssistantId { get; set; }

    public string? AssistantFullName { get; set; }

    public int EmtReasonId { get; set; }

    public string? EmtReasonDesc { get; set; }

    public long? CeacId { get; set; }

    public string? EngagementName { get; set; }

    public decimal EntityId { get; set; }

    public string? EntityName { get; set; }

    public long LeadPartnerId { get; set; }

    public string LeadPartnerFullName { get; set; } = null!;

    public string? EmtSsrequiIdConcat { get; set; }

    public bool? AssistantRequired { get; set; }

    public int? CompetencesCapabilites { get; set; }

    public bool? ProfessionalStandards { get; set; }

    public bool? KpmgPolices { get; set; }

    public bool? KnowledgeIndustry { get; set; }

    public bool? SimilarExperience { get; set; }

    public bool? SufficientTime { get; set; }

    public bool? LocalListed { get; set; }

    public bool? UsListed { get; set; }

    public bool? OtherCountryListed { get; set; }

    public bool? RegulatedIndustry { get; set; }

    public bool? MemberEgagement { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? IndependentFromEntity { get; set; }

    public bool? HasObjectivity { get; set; }

    public bool? HasIntegrity { get; set; }

    public bool? HasImpartiality { get; set; }

    public bool? HasThreats { get; set; }

    public string? HasThreatsDesc { get; set; }

    public bool? NcEvaluation { get; set; }

    public bool? PcaobResultsImpact { get; set; }

    public bool? NoChangesNature { get; set; }

    public bool? NoChangesLegalRegulatory { get; set; }

    public bool? NoChangesIndustry { get; set; }

    public bool? NoChangesComplexity { get; set; }

    public bool? NoResponsibility { get; set; }

    public bool? ReadyToApprove { get; set; }

    public long? ReassingEmployeeId { get; set; }

    public string? ReassingFullName { get; set; }

    public int? Pic { get; set; }

    public int? Deputy { get; set; }

    public int? Cppp { get; set; }

    public string? PicEmailAddressBusiness { get; set; }

    public string? DeputyEmailAddressBusiness { get; set; }

    public string? CpppEmailAddressBusiness { get; set; }

    public string? PicComment { get; set; }

    public string? DeputyComment { get; set; }

    public string? CpppComment { get; set; }

    public int StatusId { get; set; }

    public string StatusLabel { get; set; } = null!;

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
