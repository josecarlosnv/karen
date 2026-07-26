using System;
using System.Collections.Generic;

namespace DL;

public partial class Municipio
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public byte Estado { get; set; }

    public int CpMin { get; set; }

    public int CpMax { get; set; }

    public string? HusoHorario { get; set; }

    public virtual ICollection<Colonia> Colonia { get; set; } = new List<Colonia>();

    public virtual Estado EstadoNavigation { get; set; } = null!;
}
