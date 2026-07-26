using System;
using System.Collections.Generic;

namespace DL;

public partial class VwProyectosP8riesgo
{
    public string EntityGroupId { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int? SegmentoId { get; set; }

    public string? Bu { get; set; }

    public string? PartnerName { get; set; }

    public string? PartnerMail { get; set; }

    public string? PartnerId { get; set; }

    public string? SrManagerName { get; set; }

    public string? SrManagerId { get; set; }

    public string? SrManagerMail { get; set; }

    public string Idoficina { get; set; } = null!;

    public string? EstatusAprob { get; set; }

    public int? FiscalYearP8 { get; set; }

    public int? EngagementId { get; set; }

    public int? CeacId { get; set; }

    public int? GisId { get; set; }

    public string? Segmento { get; set; }

    public string? Oficina { get; set; }

    public DateTime? FechaInicioP8 { get; set; }
}
