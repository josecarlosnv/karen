using System;
using System.Collections.Generic;

namespace DL;

public partial class AipTblProjectRisk
{
    public int RiskId { get; set; }

    public string? P8ReferenceId { get; set; }

    public string? CeacId { get; set; }

    public string? GisId { get; set; }

    public int? CeacRisk { get; set; }

    public string? EngagementId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public string? ModifiedBy { get; set; }
}
