using System;
using System.Collections.Generic;

namespace DL;

public partial class TablaDpe
{
    public int DpeId { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string Competencia { get; set; } = null!;

    public string? SubCompetencia { get; set; }

    public string NumReactivo { get; set; } = null!;

    public int RespAutoeval { get; set; }

    public int RespEvaluador { get; set; }

    public string? ComenAutoeval { get; set; }

    public string? ComenEvaluador { get; set; }

    public int? Fy { get; set; }

    public int? EmployeeIdEvaluador { get; set; }

    public int? EmployeeIdEvaluado { get; set; }

    public string? EntityNumber { get; set; }

    public string? EngagementId { get; set; }

    public string? NameEvaluado { get; set; }

    public string? Nivel { get; set; }

    public int? HrsAsig { get; set; }

    public string? NameEvaluador { get; set; }

    public string? IdColabEmpProy { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public bool? TipoEvaluacion { get; set; }

    public string? Rol { get; set; }

    public int? CalProyecEvaluado { get; set; }

    public int? CalProyecEvaluador { get; set; }

    public decimal? SubCompetenciaNum { get; set; }
}
