using System;
using System.Collections.Generic;

namespace DL;

public partial class TipoInf
{
    public int TipoInfId { get; set; }

    public string TipoInf1 { get; set; } = null!;

    public virtual ICollection<Entidade> Entidades { get; set; } = new List<Entidade>();
}
