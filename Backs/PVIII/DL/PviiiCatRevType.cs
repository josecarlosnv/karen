using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatRevType
{
    public int P8revenueTypeId { get; set; }

    public string P8revenueTypeLabel { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public virtual ICollection<PviiiMasterCurrent> PviiiMasterCurrents { get; set; } = new List<PviiiMasterCurrent>();
}
