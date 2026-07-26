using System;
using System.Collections.Generic;

namespace DL;

public partial class Colonia
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public int Municipio { get; set; }

    public string Asentamiento { get; set; } = null!;

    public int CodigoPostal { get; set; }

    public decimal? Latitud { get; set; }

    public decimal? Longitud { get; set; }

    public virtual Municipio MunicipioNavigation { get; set; } = null!;
}
