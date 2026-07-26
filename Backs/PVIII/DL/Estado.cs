using System;
using System.Collections.Generic;

namespace DL;

public partial class Estado
{
    public byte Clave { get; set; }

    public string Nombre { get; set; } = null!;

    public string Abreviacion { get; set; } = null!;

    public int CpMin { get; set; }

    public int CpMax { get; set; }

    public virtual ICollection<Municipio> Municipios { get; set; } = new List<Municipio>();
}
