using System;
using System.Collections.Generic;

namespace DL;

public partial class InfoDpe
{
    public int InfoDpeId { get; set; }

    public string? NameEvaluado { get; set; }

    public string? Nivel { get; set; }

    public string? NameCliente { get; set; }

    public int? HrsAsig { get; set; }

    public decimal? CaliProyEvaluado { get; set; }

    public string? NameEvaluador { get; set; }

    public decimal? CaliProyEvaluador { get; set; }

    public int? IdProyect { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public bool? TipoEvaluacion { get; set; }

    public string? Rol { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? Fy { get; set; }

    public int? EmployeeIdEvaluador { get; set; }

    public int? EmployeeIdEvaluado { get; set; }

    public string? EntityNumber { get; set; }

    public string? EngagementId { get; set; }

    public string? EvaluadoEmail { get; set; }

    public string? EvaluadorEmail { get; set; }

    public string? IdColabEmpProy { get; set; }

    public int? ManagerId { get; set; }

    public int? PartnerId { get; set; }

    public int? ColumnG { get; set; }

    public string? ColumnH { get; set; }
}
