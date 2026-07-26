using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatEngagementNature
{
    public int NatureOfEngagementId { get; set; }

    public string NatureOfEngagementLabel { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;
}
