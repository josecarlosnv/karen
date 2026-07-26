using System;
using System.Collections.Generic;

namespace DL;

public partial class ConclusionsEval
{
    public int Id { get; set; }

    public string? ComentariosEval { get; set; }

    public bool? CoPm { get; set; }

    public string? CocomentariosPm { get; set; }

    public bool? PromocionPm { get; set; }

    public string? CategoriaPromocionPm { get; set; }

    public int? OpenPdPm { get; set; }

    public string? FortalezasPm { get; set; }

    public string? AreasOportunidadPm { get; set; }

    public bool? CoCj { get; set; }

    public string? CocomentariosCj { get; set; }

    public bool? PromocionCj { get; set; }

    public string? CategoriaPromocionCj { get; set; }

    public int? OpenPdCj { get; set; }

    public string? ComentariosGenerales { get; set; }

    public int? EmployeeIdEvaluado { get; set; }

    public string? EmailEvaluado { get; set; }

    public string? BuEvaluado { get; set; }

    public string? OficinaEvaluado { get; set; }

    public string? CategoriaEvaluado { get; set; }

    public int? EmployeeIdEvaluador { get; set; }

    public string? EmailEvaluador { get; set; }

    public int? EmployeeIdConclusion { get; set; }

    public string? EmailConclusion { get; set; }

    public int? Fy { get; set; }

    public string? Periodo { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public decimal? ColumnC { get; set; }

    public decimal? ColumnD { get; set; }

    public string? ColumnE { get; set; }

    public decimal? ColumnF { get; set; }

    public string? ColumnG { get; set; }

    public decimal? ColumnH { get; set; }

    public string? ColumnI { get; set; }

    public decimal? ColumnJ { get; set; }

    public bool ReunionPm { get; set; }
}
