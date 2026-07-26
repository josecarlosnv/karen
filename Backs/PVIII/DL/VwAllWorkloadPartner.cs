using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAllWorkloadPartner
{
    public string? PartnerName { get; set; }

    public string? PartnerId { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? LocationName { get; set; }

    public string? LocalJobTitle { get; set; }

    public string? Bu { get; set; }

    public int? NonClientFacingHours { get; set; }

    public string? Activities { get; set; }

    public int? Fy { get; set; }

    public decimal? TotalThAudit { get; set; }

    public decimal? TotalTinAudit { get; set; }

    public int? ReportesFiscal { get; set; }

    public int HoursEqcr { get; set; }

    public int ReportsEqcr { get; set; }

    public int HoursLsqcr { get; set; }

    public int ReportsLsqcr { get; set; }

    public int? ReportsLeap { get; set; }

    public decimal? Monto { get; set; }

    public decimal? PorcentajeContingente { get; set; }

    public string? Comments { get; set; }

    public bool? Waiver { get; set; }
}
