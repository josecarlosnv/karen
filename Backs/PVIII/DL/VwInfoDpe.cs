using System;
using System.Collections.Generic;

namespace DL;

public partial class VwInfoDpe
{
    public int InfoDpeId { get; set; }

    public string? Evaluado { get; set; }

    public string? Nivel { get; set; }

    public string? Cliente { get; set; }

    public int? HrsAsig { get; set; }

    public decimal? CaliProyEvaluado { get; set; }

    public string? Evaluador { get; set; }

    public decimal? CaliProyEvaluador { get; set; }

    public string? ColumnA { get; set; }

    public string EstatusAprob { get; set; } = null!;

    public string TipoEvDescrip { get; set; } = null!;

    public string? Rol { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? Fy { get; set; }

    public int? EmployeeIdEvaluador { get; set; }

    public int? EmployeeIdEvaluado { get; set; }

    public string? LocationName { get; set; }

    public int? PartnerId { get; set; }

    public string PartnerName { get; set; } = null!;

    public string? EntityNumber { get; set; }

    public string? EvaluadoEmail { get; set; }

    public string? EvaluadorEmail { get; set; }

    public string? IdColabEmpProy { get; set; }

    public int? TotalReactivos { get; set; }

    public string ProyectoColab { get; set; } = null!;
}
