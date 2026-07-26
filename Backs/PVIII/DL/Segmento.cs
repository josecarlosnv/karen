using System;
using System.Collections.Generic;

namespace DL;

public partial class Segmento
{
    public int SegmentoId { get; set; }

    public string Segmento1 { get; set; } = null!;

    public virtual ICollection<Generale> Generales { get; set; } = new List<Generale>();
}
