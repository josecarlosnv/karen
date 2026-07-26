using System;
using System.Collections.Generic;

namespace DL;

public partial class VwValuacionHorasEspecialista
{
    public string IdP8 { get; set; } = null!;

    public string NivelEsp { get; set; } = null!;

    public int? Fy { get; set; }

    public decimal? Horas { get; set; }

    public decimal? HonEsp { get; set; }

    public int? EventNumber { get; set; }
}
