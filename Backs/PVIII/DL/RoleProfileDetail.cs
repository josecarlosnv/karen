using System;
using System.Collections.Generic;

namespace DL;

public partial class RoleProfileDetail
{
    public int RolePdId { get; set; }

    public string IdRoleProfile { get; set; } = null!;

    public int ReactiveNum { get; set; }

    public string? EvaluatedComent { get; set; }

    public string? Pmcoment { get; set; }

    public string? Role { get; set; }

    public bool? Aplica { get; set; }

    public bool? AutoEvaluation { get; set; }

    public bool? Confirm { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public DateTime? CreatedTime { get; set; }

    public DateTime? ModifiedTime { get; set; }

    public int? Fy { get; set; }
}
