using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatFiscalYearRef
{
    public int P8FiscalYearId { get; set; }

    public int P8FiscalYearLabel { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public virtual ICollection<PviiiMasterCurrent> PviiiMasterCurrents { get; set; } = new List<PviiiMasterCurrent>();
}
