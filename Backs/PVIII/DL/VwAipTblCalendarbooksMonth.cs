using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblCalendarbooksMonth
{
    public string? FkUserId { get; set; }

    public string? Proyecto { get; set; }

    public int? HorasEntrenamiento { get; set; }

    public int? HorasTimeoff { get; set; }

    public int? HorasProyecto { get; set; }

    public bool? ProyectoEspecial { get; set; }

    public int? Year { get; set; }

    public int? Month { get; set; }

    public DateTime? StartOfMonth { get; set; }

    public DateOnly? EndOfMonth { get; set; }

    public int? Organizacion { get; set; }

    public string? Un { get; set; }
}
