using System;
using System.Collections.Generic;

namespace DL;

public partial class P8fiscalYearRef
{
    public int P8FiscalYearId { get; set; }

    public int P8FiscalYearLabel { get; set; }

    public virtual ICollection<PviiiMasterHistory> PviiiMasterHistories { get; set; } = new List<PviiiMasterHistory>();
}
