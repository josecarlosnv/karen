using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEmtAssign
{
    public int EmtassignPk { get; set; }

    public string KeyEmt { get; set; } = null!;

    public string? KeyEmtPfy { get; set; }

    public int Fy { get; set; }

    public string? EmtssrequiDesc { get; set; }

    public int EmployeeIdEqcr { get; set; }

    public string? FullNameEqcr { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? Bu { get; set; }

    public int EmtassignmentId { get; set; }

    public string? EmtassignmentDesc { get; set; }

    public int EmtsectorId { get; set; }

    public string? EmtsectorDesc { get; set; }

    public int SectorId { get; set; }

    public int YearAppointment { get; set; }

    public int EmtreasonId { get; set; }

    public string? EmtreasonDesc { get; set; }

    public int? CeacId { get; set; }

    public decimal EntityId { get; set; }

    public string? EntityName { get; set; }

    public string? EngagementName { get; set; }

    public int EmployeeIdLeap { get; set; }

    public string? FullNameLeap { get; set; }

    public int? EmployeeIdPicreassing { get; set; }

    public string? FullNamePicreassing { get; set; }

    public string? CommentPicreassing { get; set; }

    public int CompetenceCapabilities { get; set; }

    public bool? CriteriaA { get; set; }

    public int SufficientTime { get; set; }

    public int LocalListed { get; set; }

    public int UsListed { get; set; }

    public int OtherCountryListed { get; set; }

    public int RegulatedIndustry { get; set; }

    public bool? BeenMemberEngagement { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? CriteriaB { get; set; }

    public bool? HasThreats { get; set; }

    public string? HasThreatsDesc { get; set; }

    public bool? Pic { get; set; }

    public string? PicEmailAddressBusiness { get; set; }

    public string? PicComment { get; set; }

    public DateTime? PicDate { get; set; }

    public bool? Deputy { get; set; }

    public string? DeputyEmailAddressBusiness { get; set; }

    public string? DeputyComment { get; set; }

    public DateTime? DeputyDate { get; set; }

    public bool? Cppp { get; set; }

    public string? CpppEmailAddressBusiness { get; set; }

    public string? CpppComment { get; set; }

    public DateTime? CpppDate { get; set; }

    public int IdStatus { get; set; }

    public string DescriptStatus { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
