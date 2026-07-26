using System;
using System.Collections.Generic;

namespace DL;

public partial class RiesgoCeac
{
    public int RiesgoCeacid { get; set; }

    public string RiesgoCeac1 { get; set; } = null!;

    public virtual ICollection<Generale> Generales { get; set; } = new List<Generale>();
}
