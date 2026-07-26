using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatReportType
{
    public int ReportTypeId { get; set; }

    public string ReportTypeLabel { get; set; } = null!;

    public bool QualityReviwerIndicator { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public virtual ICollection<PviiiTblEntityReportConfig> PviiiTblEntityReportConfigs { get; set; } = new List<PviiiTblEntityReportConfig>();
}
