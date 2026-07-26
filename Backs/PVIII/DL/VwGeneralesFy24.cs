using System;
using System.Collections.Generic;

namespace DL;

public partial class VwGeneralesFy24
{
    public string EntityGroupId { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int? SegmentoId { get; set; }

    public int? IndustriaId { get; set; }

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

    public decimal? TotalHonPy { get; set; }

    public decimal? TotalHPy { get; set; }

    public string PartnerName { get; set; } = null!;

    public string PartnerId { get; set; } = null!;

    public int PartnerYears { get; set; }

    public decimal PartnerHours { get; set; }

    public string SrManagerName { get; set; } = null!;

    public string SrManagerId { get; set; } = null!;

    public int SrManagerYears { get; set; }

    public decimal SrManagerHours { get; set; }

    public string? Comisario { get; set; }

    public string? ComisarioId { get; set; }

    public int? RiesgoCeacid { get; set; }

    public string? CeacNumber { get; set; }

    public string? GisId { get; set; }

    public int? FlujoAuditId { get; set; }

    public int? TipoRevId { get; set; }

    public string? SrName { get; set; }

    public decimal PartnerFee { get; set; }

    public decimal SrManagerFee { get; set; }

    public decimal TotalHEp { get; set; }

    public decimal TotalHonEp { get; set; }

    public decimal HonPartner { get; set; }

    public decimal? Hon2rv { get; set; }

    public decimal HonSrManager { get; set; }

    public int IdDb { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? SrManagerMail { get; set; }

    public string? PartnerMail { get; set; }

    public string IdPviii { get; set; } = null!;

    public string NormasAud { get; set; } = null!;

    public string NormasFin { get; set; } = null!;

    public string NaturalezaProy { get; set; } = null!;

    public string? SrId { get; set; }

    public string Fy { get; set; } = null!;

    public string TipoIngreso { get; set; } = null!;

    public decimal? SrHours { get; set; }

    public decimal? SrFee { get; set; }

    public string Idoficina { get; set; } = null!;

    public bool? Vigencia { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
