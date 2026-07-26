using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAprobacionesP8
{
    public string IdP8 { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int? SegmentoId { get; set; }

    public string? Segmento { get; set; }

    public string Idoficina { get; set; } = null!;

    public string? Oficina { get; set; }

    public string? Bu { get; set; }

    public string? PartnerName { get; set; }

    public string? PartnerId { get; set; }

    public string? PartnerMail { get; set; }

    public string? SrManagerName { get; set; }

    public string? SrManagerId { get; set; }

    public string? SrManagerMail { get; set; }

    public string TipoIngreso { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? IdP8Pfy { get; set; }

    public string? Comments { get; set; }

    public string StatusAprobacion { get; set; } = null!;

    public decimal? HorasCfy { get; set; }

    public decimal? HorasPfy { get; set; }

    public decimal? HonorarioCfy { get; set; }

    public decimal? HonorarioPfy { get; set; }

    public decimal? CuotaPaudit { get; set; }

    public decimal? CuotaNeta { get; set; }

    public decimal? Valuation { get; set; }

    public int? FiscalYearP8 { get; set; }

    public bool? IsException { get; set; }

    public string? ApprovedComment { get; set; }

    public string? CommentsHeadOfAudit { get; set; }

    public string StatusAprobacionHofA { get; set; } = null!;

    public int? EventApprov { get; set; }

    public string? ClientePerdido { get; set; }
}
