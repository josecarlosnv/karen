using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatApproval
{
    public int P8ApprStatusId { get; set; }

    public string P8ApprStatusLabel { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public virtual ICollection<PviiiMasterCurrent> PviiiMasterCurrents { get; set; } = new List<PviiiMasterCurrent>();

    public virtual ICollection<PviiiMasterHistory> PviiiMasterHistories { get; set; } = new List<PviiiMasterHistory>();
}
