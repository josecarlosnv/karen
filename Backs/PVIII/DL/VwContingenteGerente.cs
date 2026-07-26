using System;
using System.Collections.Generic;

namespace DL;

public partial class VwContingenteGerente
{
    public string SrManagerId { get; set; } = null!;

    public string? Bu { get; set; }

    public int? FiscalYearP8 { get; set; }

    public decimal? IngresoNetoP8 { get; set; }

    public decimal? ContingenteDevengado { get; set; }

    public decimal? HorasP8 { get; set; }

    public decimal? HorasContingenteDevengado { get; set; }

    public decimal? ClientePerdido { get; set; }

    public decimal? ClientePerdidoHoras { get; set; }

    public string? Office { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? FullName { get; set; }
}
