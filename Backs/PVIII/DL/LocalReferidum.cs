using System;
using System.Collections.Generic;

namespace DL;

public partial class LocalReferidum
{
    public int LocalReferidaId { get; set; }

    public string LocalReferida { get; set; } = null!;

    public virtual ICollection<Generale> Generales { get; set; } = new List<Generale>();
}
