using System;
using System.Collections.Generic;

namespace DL;

public partial class AsistenciaContactosEventosPatrociniosFy
{
    public int PayrollNumber { get; set; }

    public string? EventoPatrocinio { get; set; }

    public DateOnly? Fecha { get; set; }

    public string? Contacto { get; set; }

    public string? Tipo { get; set; }

    public int FiscalMonthId { get; set; }

    public int FiscalYearId { get; set; }
}
