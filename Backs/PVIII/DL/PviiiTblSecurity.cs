using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblSecurity
{
    public int SecurityId { get; set; }

    public string UserEmail { get; set; } = null!;

    public string UserRole { get; set; } = null!;

    public int? BusinessUnitId { get; set; }

    public string? BusinessUnitIdLabel { get; set; }

    public int? SegmentId { get; set; }

    public string? SegmentLabel { get; set; }

    public int? OfficeId { get; set; }

    public string? OfficeLabel { get; set; }

    public bool? ApproverIndicator { get; set; }

    public string? PracticeIndicator { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int? LevelIndicator { get; set; }
}
