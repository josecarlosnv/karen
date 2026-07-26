using System;
using System.Collections.Generic;

namespace DL;

public partial class VwWorkloadManager
{
    public string? SrManagerName { get; set; }

    public string? SrManagerId { get; set; }

    public string ClientName { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public decimal? ThAudit { get; set; }

    public int? RiesgoCeacid { get; set; }

    public string LocalPublicClient { get; set; } = null!;

    public bool? AfiliadaSec { get; set; }

    public string Gaas { get; set; } = null!;

    public string Gaap { get; set; } = null!;

    public int? StatutoryFs { get; set; }

    public int? Interoffice { get; set; }

    public int? Interfirm { get; set; }

    public int? ReportsToBeIssued { get; set; }

    public string? Bu { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? LocationName { get; set; }

    public int? FiscalYear { get; set; }

    public decimal? TinAudit { get; set; }

    public string TipoIngreso { get; set; } = null!;

    public string? Bup8 { get; set; }

    public int? ReportesEdosFin { get; set; }

    public int? ReportesFiscal { get; set; }

    public bool? SecComponent { get; set; }
}
