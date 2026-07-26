using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblCalendarbooksWeek
{
    public string? FkUserId { get; set; }

    public string? Proyecto { get; set; }

    public int? HorasEntrenamiento { get; set; }

    public int? HorasTimeoff { get; set; }

    public int? HorasProyecto { get; set; }

    public bool? ProyectoEspecial { get; set; }

    public int? Year { get; set; }

    public int? WeekOfYear { get; set; }

    public int? Organizacion { get; set; }

    public DateTime? StartOfWeek { get; set; }

    public DateTime? EndOfWeek { get; set; }

    public string? Un { get; set; }
}
