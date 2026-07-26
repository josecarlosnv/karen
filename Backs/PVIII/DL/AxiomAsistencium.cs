using System;
using System.Collections.Generic;

namespace DL;

public partial class AxiomAsistencium
{
    public DateTime AccessDate { get; set; }

    public string NumEmpleado { get; set; } = null!;

    public int CostCenter { get; set; }

    public string CostCenterDescrip { get; set; } = null!;
}
