using System;
using System.Collections.Generic;

namespace DL;

public partial class ContingenteSociosVw
{
    public string PartnerId { get; set; } = null!;

    public string? Bu { get; set; }

    public int? ColumnA { get; set; }

    public decimal? IngresoNetoP8 { get; set; }

    public decimal? ContingenteDevengado { get; set; }

    public decimal? HorasP8 { get; set; }

    public decimal? HorasContingenteDevengado { get; set; }

    public string? LocationName { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? FullName { get; set; }
}
