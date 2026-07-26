using System;
using System.Collections.Generic;

namespace DL;

public partial class VwProgramacionCfy
{
    public string IdP8 { get; set; } = null!;

    public DateTime? FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }

    public int IdPviiiProgr { get; set; }

    public string? IdColabs { get; set; }

    public int? EnglishId { get; set; }

    public int Weekdays { get; set; }

    public decimal Horas { get; set; }

    public decimal? TotalHoursPfy { get; set; }

    public decimal Honorarios { get; set; }

    public string? Colaboradores { get; set; }

    public decimal CuotaPfy { get; set; }

    public int WeekdaysPre { get; set; }

    public decimal HPost { get; set; }

    public decimal HPre { get; set; }

    public decimal HonPost { get; set; }

    public decimal HonPre { get; set; }

    public bool? Dviajes { get; set; }

    public int HxC { get; set; }

    public string CostCenter { get; set; } = null!;

    public string NivelStaff { get; set; } = null!;

    public decimal CuotaCfy { get; set; }

    public string? Observaciones { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public bool? Vigencia { get; set; }
}
