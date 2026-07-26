using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiDimLevel
{
    public string LocalJobLevelName { get; set; } = null!;

    public string LocalJobLevel { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public int LevelId { get; set; }

    public virtual ICollection<PviiiFactTeamLeaderChange> PviiiFactTeamLeaderChanges { get; set; } = new List<PviiiFactTeamLeaderChange>();
}
