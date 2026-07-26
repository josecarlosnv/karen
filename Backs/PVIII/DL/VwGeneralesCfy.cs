using System;
using System.Collections.Generic;

namespace DL;

public partial class VwGeneralesCfy
{
    public string EntityGroupId { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int? SegmentoId { get; set; }

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

    public string PartnerName { get; set; } = null!;

    public string PartnerId { get; set; } = null!;

    public string SrManagerName { get; set; } = null!;

    public string SrManagerId { get; set; } = null!;

    public decimal PartnerFee { get; set; }

    public decimal SrManagerFee { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? SrManagerMail { get; set; }

    public string? PartnerMail { get; set; }

    public string IdP8 { get; set; } = null!;

    public string Fy { get; set; } = null!;

    public string TipoIngreso { get; set; } = null!;

    public string Idoficina { get; set; } = null!;

    public bool? SecComponent { get; set; }

    public string? ModalidadAudit { get; set; }

    public string? Cirp { get; set; }

    public string? Sscpm { get; set; }

    public string? IdP8Pfy { get; set; }

    public int? FiscalYearP8 { get; set; }

    public string? Bu { get; set; }

    public int? Reasignacion { get; set; }

    public bool? Vigencia { get; set; }

    public int? EventNumber { get; set; }
}
