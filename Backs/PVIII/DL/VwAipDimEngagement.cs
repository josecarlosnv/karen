using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipDimEngagement
{
    public string? CeacId { get; set; }

    public string? EngagementId { get; set; }

    public string? GisId { get; set; }

    public DateTime? InicioProyecto { get; set; }

    public string? Validacion { get; set; }

    public int? CeacRisk { get; set; }

    public int? FechaAudit { get; set; }

    public string NivelRiesgo { get; set; } = null!;

    public string P8Id { get; set; } = null!;

    public string ClienteName { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string FiscalYear { get; set; } = null!;

    public string? Bu { get; set; }

    public string EntityGroupId { get; set; } = null!;

    public string? Status { get; set; }

    public string? PartnerId { get; set; }

    public string? PartnerName { get; set; }

    public string? SrmanagerId { get; set; }

    public string? SrmanagerName { get; set; }

    public string Proyecto { get; set; } = null!;

    public string TipoIngreso { get; set; } = null!;

    public int? SegmentoId { get; set; }
}
