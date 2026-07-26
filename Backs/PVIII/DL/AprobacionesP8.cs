using System;
using System.Collections.Generic;

namespace DL;

public partial class AprobacionesP8
{
    public int AprobP8Id { get; set; }

    public string IdP8 { get; set; } = null!;

    public string? CommentsHeadOfAudit { get; set; }

    public string? CommentsLeadPartner { get; set; }

    public int? Fy { get; set; }

    public int? StatusHeadOfAudit { get; set; }

    public int? StatusLeadPartner { get; set; }

    public bool? Register { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public int? EventNumber { get; set; }

    public string? ColumnE { get; set; }

    public string? ColumnF { get; set; }

    public decimal? ColumnG { get; set; }

    public int? ColumnH { get; set; }
}
