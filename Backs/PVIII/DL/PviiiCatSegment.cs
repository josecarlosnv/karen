using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatSegment
{
    public int SegmentId { get; set; }

    public string SegmentLabel { get; set; } = null!;

    public int SegmentPastId { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public string? BusinessUnitIdLabel { get; set; }

    public virtual ICollection<PviiiMasterCurrent> PviiiMasterCurrents { get; set; } = new List<PviiiMasterCurrent>();

    public virtual ICollection<PviiiTblSchedulingConsideration> PviiiTblSchedulingConsiderations { get; set; } = new List<PviiiTblSchedulingConsideration>();
}
