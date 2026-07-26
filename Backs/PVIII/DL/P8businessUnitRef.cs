using System;
using System.Collections.Generic;

namespace DL;

public partial class P8businessUnitRef
{
    public int BusinessUnitId { get; set; }

    public string BusinessUnitIdLabel { get; set; } = null!;

    public virtual ICollection<PviiiMasterHistory> PviiiMasterHistories { get; set; } = new List<PviiiMasterHistory>();
}
