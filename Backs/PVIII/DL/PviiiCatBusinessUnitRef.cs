using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatBusinessUnitRef
{
    public string BusinessUnitIdLabel { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public int BusinessUnitId { get; set; }

    public virtual ICollection<PviiiMasterCurrent> PviiiMasterCurrents { get; set; } = new List<PviiiMasterCurrent>();
}
