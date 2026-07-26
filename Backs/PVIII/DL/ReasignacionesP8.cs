using System;
using System.Collections.Generic;

namespace DL;

public partial class ReasignacionesP8
{
    public int Id { get; set; }

    public string IdP8 { get; set; } = null!;

    public string PartnerName { get; set; } = null!;

    public string PartnerId { get; set; } = null!;

    public string? PartnerMail { get; set; }

    public string SrManagerName { get; set; } = null!;

    public string SrManagerId { get; set; } = null!;

    public string? SrManagerMail { get; set; }

    public string? SrId { get; set; }

    public decimal PartnerFee { get; set; }

    public decimal SrManagerFee { get; set; }

    public decimal SrFee { get; set; }

    public decimal ThAudit { get; set; }

    public decimal? ThonAudit { get; set; }

    public decimal? ThonReporte { get; set; }

    public decimal? ThonFiscal { get; set; }

    public decimal TotalHonProp { get; set; }

    public decimal TotalCosto { get; set; }

    public decimal Valuation { get; set; }

    public decimal CuotaPaudit { get; set; }

    public decimal CuotaNeta { get; set; }

    public decimal? ThEsp { get; set; }

    public decimal? ThonEsp { get; set; }

    public decimal SubtotalI { get; set; }

    public decimal TiGastos { get; set; }

    public decimal TinAudit { get; set; }

    public decimal? ThonPy { get; set; }

    public decimal? ThPy { get; set; }

    public string? Observaciones { get; set; }

    public decimal HImpulsa { get; set; }

    public decimal HonImpulsa { get; set; }

    public string EstatusAprob { get; set; } = null!;

    public string TipoMovimiento { get; set; } = null!;

    public string TipoReasignacion { get; set; } = null!;

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public decimal? ColumnD { get; set; }

    public decimal? ColumnE { get; set; }

    public decimal? ColumnF { get; set; }
}
