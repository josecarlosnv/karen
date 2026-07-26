using System;
using System.Collections.Generic;

namespace DL;

public partial class TasasAudit
{
    public string? Nivel { get; set; }

    public string? Categoria { get; set; }

    public decimal? Horas { get; set; }

    public string? CentroCostos { get; set; }

    public string? CentroCostosDescrip { get; set; }

    public string? Oficina { get; set; }

    public string? OficinaDescrip { get; set; }

    public decimal? Fyp { get; set; }

    public decimal? Fyc { get; set; }

    public bool? Vigencia { get; set; }

    public int? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int IdDb { get; set; }
}
