using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEspecialistasPfy
{
    public decimal PFee { get; set; }

    public decimal Horas { get; set; }

    public decimal HonEsp { get; set; }

    public int IdPviiiEsp { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string IdP8 { get; set; } = null!;

    public string Funcion { get; set; } = null!;

    public string Practica { get; set; } = null!;

    public string OficinaEsp { get; set; } = null!;

    public decimal CuotaEsp { get; set; }

    public string NivelEsp { get; set; } = null!;

    public bool? Vigencia { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public int? EventNumber { get; set; }
}
