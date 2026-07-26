using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipDimStaff
{
    public string? Id { get; set; }

    public string FullName { get; set; } = null!;

    public string FullTime { get; set; } = null!;

    public string? Email { get; set; }

    public decimal? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string? LocationName { get; set; }

    public string? LocalJobName { get; set; }

    public string? ProductDescription { get; set; }

    public DateOnly? JobEntryDate { get; set; }

    public decimal? Antiguedad { get; set; }

    public int? Fiscalyear { get; set; }

    public string? EmployeeSubClassName { get; set; }

    public string? Estatus { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Bu { get; set; }

    public string? Segmento { get; set; }

    public string? SegId { get; set; }

    public string? Oficina { get; set; }

    public string? IdOficina { get; set; }

    public int Hoursbylevel { get; set; }

    public string? EnglishLevel { get; set; }

    public string? Comments { get; set; }

    public int? EvaluationYear { get; set; }

    public string? EnglishTypeLevel { get; set; }

    public DateTime? TerminationDate { get; set; }

    public decimal? Latitud { get; set; }

    public decimal? Longitud { get; set; }

    public int? PostalCode { get; set; }
}
