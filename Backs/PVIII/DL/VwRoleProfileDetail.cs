using System;
using System.Collections.Generic;

namespace DL;

public partial class VwRoleProfileDetail
{
    public int RolePdId { get; set; }

    public int? RolePrId { get; set; }

    public string IdRoleProfile { get; set; } = null!;

    public int ReactiveNum { get; set; }

    public string? Indicador { get; set; }

    public int? EvaluatedId { get; set; }

    public string? EvaluatedName { get; set; }

    public string? EvaluatedLevel { get; set; }

    public string? EvaluatedEmail { get; set; }

    public int? Pmid { get; set; }

    public string? Pmname { get; set; }

    public string? Pmlevel { get; set; }

    public string? Pmemail { get; set; }

    public string? Bu { get; set; }

    public string? EvalStatus { get; set; }

    public string? EvaluatedComent { get; set; }

    public string? Pmcoment { get; set; }

    public bool? Aplica { get; set; }

    public bool? AutoEvaluation { get; set; }

    public bool? Confirm { get; set; }

    public bool? EvaluatedComplete { get; set; }

    public bool? Pmcomplete { get; set; }

    public string? ResumColumnA { get; set; }

    public string? ResumColumnB { get; set; }

    public int? ResumColumnC { get; set; }

    public int? ResumColumnD { get; set; }

    public string? DetaiColumnA { get; set; }

    public string? DetaiColumnB { get; set; }

    public int? DetaiColumnC { get; set; }

    public int? DetaiColumnD { get; set; }
}
