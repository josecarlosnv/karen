using System;
using System.Collections.Generic;

namespace DL;

public partial class VwRoleProfileResuman
{
    public int RolePrId { get; set; }

    public string IdRoleProfile { get; set; } = null!;

    public int ReactivesNum { get; set; }

    public int? ReactivesNumRes { get; set; }

    public int? EvaluatedId { get; set; }

    public string? EvaluatedName { get; set; }

    public string? EvaluatedEmail { get; set; }

    public string? EvaluatedLevel { get; set; }

    public string? LocationName { get; set; }

    public string? Bu { get; set; }

    public int? Pmid { get; set; }

    public string? Pmname { get; set; }

    public string? Pmemail { get; set; }

    public string? Pmlevel { get; set; }

    public bool? EvaluatedComplete { get; set; }

    public bool? Pmcomplete { get; set; }

    public string EvalStatus { get; set; } = null!;

    public DateTime? CreatedTime { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? ModifiedTime { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ResumColumnA { get; set; }

    public string? ResumColumnB { get; set; }

    public int? ResumColumnC { get; set; }

    public int? ResumColumnD { get; set; }

    public string? DetaiColumnA { get; set; }

    public string? DetaiColumnB { get; set; }

    public int? DetaiColumnC { get; set; }

    public int? DetaiColumnD { get; set; }
}
