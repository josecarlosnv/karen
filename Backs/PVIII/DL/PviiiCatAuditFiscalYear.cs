using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatAuditFiscalYear
{
    public int AuditFiscalYearId { get; set; }

    public int AuditFiscalYearLabel { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public virtual ICollection<PviiiTblProyectDetail> PviiiTblProyectDetails { get; set; } = new List<PviiiTblProyectDetail>();
}
