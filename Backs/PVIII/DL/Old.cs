using System;
using System.Collections.Generic;

namespace DL;

public partial class Old
{
    public int SegmentId { get; set; }

    public string SegmentLabel { get; set; } = null!;

    public int SegmentPastId { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;
}
