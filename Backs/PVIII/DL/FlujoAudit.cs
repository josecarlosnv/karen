using System;
using System.Collections.Generic;

namespace DL;

public partial class FlujoAudit
{
    public int FlujoAuditId { get; set; }

    public string FlujoAudit1 { get; set; } = null!;

    public virtual ICollection<Generale> Generales { get; set; } = new List<Generale>();
}
