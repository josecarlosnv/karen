using System;
using System.Collections.Generic;

namespace DL;

public partial class Industrium
{
    public int IndustriaId { get; set; }

    public string Industria { get; set; } = null!;

    public virtual ICollection<Generale> Generales { get; set; } = new List<Generale>();
}
