using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblProyecto
{
    public string IdP8 { get; set; } = null!;

    public string? PartnerName { get; set; }

    public string? SrManagerName { get; set; }

    public int? SegmentoId { get; set; }

    public string? Segmento { get; set; }

    public string? StatusAprobacion { get; set; }

    public string ClientName { get; set; } = null!;

    public string? Bu { get; set; }

    public int? FiscalYearP8 { get; set; }

    public string Proyecto { get; set; } = null!;

    public decimal? HorasP8StaffProfesional { get; set; }

    public int? HorasAuditIp { get; set; }

    public decimal? HorasDisponibles { get; set; }

    public string Estatus { get; set; } = null!;
}
