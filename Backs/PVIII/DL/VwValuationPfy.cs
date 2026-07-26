using System;
using System.Collections.Generic;

namespace DL;

public partial class VwValuationPfy
{
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

    public int IdPviiiVal { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? Observaciones { get; set; }

    public decimal HImpulsa { get; set; }

    public decimal HonImpulsa { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string PartnerMail { get; set; } = null!;

    public string IdP8 { get; set; } = null!;

    public string EstatusAprob { get; set; } = null!;

    public string? SrManagerMail { get; set; }

    public bool? Vigencia { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public bool? IsException { get; set; }

    public string? ApprovedComment { get; set; }

    public int? EventNumber { get; set; }

    public long? Mayor { get; set; }
}
