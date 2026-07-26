using System;
using System.Collections.Generic;

namespace DL;

public partial class WfmDimPresupuesto
{
    public int PkPresupuestoId { get; set; }

    public int FiscalYear { get; set; }

    public string Bu { get; set; } = null!;

    public string? Oficina { get; set; }

    public string? Presupuesto { get; set; }
}
