using System;
using System.Collections.Generic;

namespace DL;

public partial class NewProposalsComment
{
    public int Id { get; set; }

    public string NpcId { get; set; } = null!;

    public string? Comments { get; set; }

    public int? Fy { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public string? CreatedName { get; set; }

    public bool? Vigencia { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }
}
