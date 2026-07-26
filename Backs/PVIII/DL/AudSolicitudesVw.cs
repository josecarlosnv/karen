using System;
using System.Collections.Generic;

namespace DL;

public partial class AudSolicitudesVw
{
    public DateOnly? FechaSolicitud { get; set; }

    public string? Solicitante { get; set; }

    public int NoSolicitud { get; set; }

    public string Categoría { get; set; } = null!;

    public string? Colaborador { get; set; }

    public DateOnly? Inicio { get; set; }

    public DateOnly? Fin { get; set; }

    public string? Modalidad { get; set; }

    public string? EntityGroupId { get; set; }

    public string? ClientNumber { get; set; }

    public string? Cliente { get; set; }

    public string? Proyecto { get; set; }

    public string? SocioDirector { get; set; }

    public string? Gerente { get; set; }

    public string? EstatusSolicitud { get; set; }

    public int? TipoSolicitud { get; set; }

    public bool? Viaja { get; set; }

    public string? TipoIngreso { get; set; }

    public string? StatusAprobacion { get; set; }

    public int FiscalYearP8 { get; set; }

    public string? Requerimiento { get; set; }

    public string? IdColabs { get; set; }

    public int? EnglishId { get; set; }

    public string IdP8 { get; set; } = null!;

    public string CostCenter { get; set; } = null!;

    public string? Acreditaciones { get; set; }

    public string? Observaciones { get; set; }

    public int? TimeOffId { get; set; }
}
