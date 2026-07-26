using System;
using System.Collections.Generic;

namespace DL;

public partial class P8segment
{
    public int SegmentId { get; set; }

    public string SegmentLabel { get; set; } = null!;

    public int SegmentPastId { get; set; }

    public virtual ICollection<PviiiMasterHistory> PviiiMasterHistories { get; set; } = new List<PviiiMasterHistory>();
}
