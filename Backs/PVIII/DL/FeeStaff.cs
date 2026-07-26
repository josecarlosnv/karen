using System;
using System.Collections.Generic;

namespace DL;

public partial class FeeStaff
{
    public int FeeStaffId { get; set; }

    public string Oficina { get; set; } = null!;

    public string CentroCostos { get; set; } = null!;

    public string Categoria { get; set; } = null!;

    public decimal FeeAudit { get; set; }

    public int Fy { get; set; }
}
