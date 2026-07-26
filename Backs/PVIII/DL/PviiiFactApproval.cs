using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiFactApproval
{
    public int P8ApprStatusId { get; set; }

    public string P8ApprStatusLabel { get; set; } = null!;

    public virtual ICollection<PviiiMasterHistory> PviiiMasterHistories { get; set; } = new List<PviiiMasterHistory>();
}
