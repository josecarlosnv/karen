using System;
using System.Collections.Generic;

namespace DL;

public partial class EvaluacRp
{
    public int EvaluacRpId { get; set; }

    public int? Fy { get; set; }

    public int? Periodo { get; set; }

    public DateOnly? Modified { get; set; }

    public DateOnly? Created { get; set; }

    public int? EmployeeIdE { get; set; }

    public string? CreatedBy { get; set; }

    public string? ModifiedBy { get; set; }

    public string? MailGdD { get; set; }

    public string? MailE { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public bool? Ae { get; set; }

    public string? NivelE { get; set; }

    public string? NameE { get; set; }

    public string? NivelGdD { get; set; }

    public string? NameGdD { get; set; }

    public int? EmployeeIdGdD { get; set; }

    public bool? CgdD1 { get; set; }

    public int NoIndic { get; set; }

    public bool? Aplica { get; set; }

    public string? ComentariosE { get; set; }

    public string? ComentariosGdD { get; set; }
}
