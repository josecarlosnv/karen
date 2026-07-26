using System;
using System.Collections.Generic;

namespace DL;

public partial class ProyectosP8
{
    public int IdDb { get; set; }

    public int IdPviiiVal { get; set; }

    public int? AprobP8Id { get; set; }

    public string IdP8 { get; set; } = null!;

    public string EntityGroupId { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public string Fy { get; set; } = null!;

    public int? SegmentoId { get; set; }

    public string? Segmento { get; set; }

    public string Idoficina { get; set; } = null!;

    public string? Oficina { get; set; }

    public string? Bu { get; set; }

    public int? IndustriaId { get; set; }

    public string? Industria { get; set; }

    public string? OtraIndustria { get; set; }

    public bool? PerfilEntidad { get; set; }

    public bool? EntidadRegulada { get; set; }

    public bool? EntidadListada { get; set; }

    public bool? AfiliadaSec { get; set; }

    public bool? AfiliadaNoSec { get; set; }

    public int? LocalReferidaId { get; set; }

    public int? PaisReferidaId { get; set; }

    public string Domicilio { get; set; } = null!;

    public string Cp { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string Proyecto { get; set; } = null!;

    public bool? Consolidada { get; set; }

    public bool? ReportGruop { get; set; }

    public string? PartnerName { get; set; }

    public string? PartnerId { get; set; }

    public string? PartnerMail { get; set; }

    public string? SrManagerName { get; set; }

    public string? SrManagerId { get; set; }

    public string? SrManagerMail { get; set; }

    public decimal? PartnerFee { get; set; }

    public decimal? SrManagerFee { get; set; }

    public string TipoIngreso { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public bool? SecComponent { get; set; }

    public string? Sscpm { get; set; }

    public string? Cirp { get; set; }

    public string? ModalidadAudit { get; set; }

    public string? IdP8Pfy { get; set; }

    public string? Comments { get; set; }

    public string StatusAprobacion { get; set; } = null!;

    public decimal? ThonAudit { get; set; }

    public decimal? ThonReporte { get; set; }

    public decimal? ThonFiscal { get; set; }

    public decimal? ThAudit { get; set; }

    public decimal? TotalHonProp { get; set; }

    public decimal? TotalCosto { get; set; }

    public decimal? Valuation { get; set; }

    public decimal? CuotaPaudit { get; set; }

    public decimal? CuotaNeta { get; set; }

    public decimal? ThEsp { get; set; }

    public decimal? ThonEsp { get; set; }

    public decimal? SubtotalI { get; set; }

    public decimal? TiGastos { get; set; }

    public decimal? TinAudit { get; set; }

    public decimal? ThonPy { get; set; }

    public decimal? ThPy { get; set; }

    public decimal? HImpulsa { get; set; }

    public decimal? HonImpulsa { get; set; }

    public bool? Vigencia { get; set; }

    public int? FiscalYearP8 { get; set; }

    public int? Reasignacion { get; set; }

    public string? ClientePerdido { get; set; }

    public bool? IsException { get; set; }

    public string? ApprovedComment { get; set; }

    public string? CommentsHeadOfAudit { get; set; }

    public string StatusAprobacionHofA { get; set; } = null!;

    public int? EventGenerals { get; set; }

    public int? EventApprov { get; set; }

    public int? EventValuation { get; set; }

    public string? Estatus { get; set; }
}
