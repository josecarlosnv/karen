using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblSchedulingConsideration
{
    public int SchedulingConId { get; set; }

    public bool TravelRequired { get; set; }

    public string? SchedulingNotes { get; set; }

    public string P8Id { get; set; } = null!;

    public string? SuggestedEmployeeId { get; set; }

    public string? SuggestedEmployeeName { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public int? EngagementSegmentId { get; set; }

    public string? EngagementSegmentLabel { get; set; }

    public virtual PviiiCatSegment? EngagementSegmentLabelNavigation { get; set; }
}
