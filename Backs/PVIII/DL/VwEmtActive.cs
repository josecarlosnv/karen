using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEmtActive
{
    public string KeyEmt { get; set; } = null!;

    public string? KeyEmtPfy { get; set; }

    public int EmployeeIdEqcr { get; set; }

    public string? FullNameEqcr { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? Bu { get; set; }

    public int? EmtassignmentId { get; set; }

    public string? EmtassignmentDesc { get; set; }

    public string? EmtsectorDesc { get; set; }

    public int SectorId { get; set; }

    public decimal EntityId { get; set; }

    public string? EntityName { get; set; }

    public string? EngagementName { get; set; }

    public int EmployeeIdLeap { get; set; }

    public string? FullNameLeap { get; set; }

    public int? EmployeeIdPicreassing { get; set; }

    public string? FullNamePicreassing { get; set; }

    public string? CommentPicreassing { get; set; }

    public int IdStatus { get; set; }

    public string DescriptStatus { get; set; } = null!;

    public string? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
