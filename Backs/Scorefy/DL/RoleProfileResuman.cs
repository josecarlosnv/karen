using System;
using System.Collections.Generic;

namespace DL;

public partial class RoleProfileResuman
{
    public int RolePrId { get; set; }

    public string IdRoleProfile { get; set; } = null!;

    public int ReactivesNum { get; set; }

    public int? EvaluatedId { get; set; }

    public int? Pmid { get; set; }

    public string? EvaluatedName { get; set; }

    public string? Pmname { get; set; }

    public string? EvaluatedEmail { get; set; }

    public string? Pmemail { get; set; }

    public bool? EvaluatedComplete { get; set; }

    public bool? Pmcomplete { get; set; }

    public int? Fy { get; set; }

    public int? Period { get; set; }

    public bool? IsCurrent { get; set; }

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
}
