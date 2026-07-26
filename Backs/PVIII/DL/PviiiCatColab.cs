using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatColab
{
    public int ColabsCatalogKey { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public int CostCenter { get; set; }

    public string FunctionName { get; set; } = null!;

    public string EmployeeEmail { get; set; } = null!;

    public string NetworkId { get; set; } = null!;

    public string LevelLabel { get; set; } = null!;

    public string BussinesUnitLabel { get; set; } = null!;

    public string OfficeLabel { get; set; } = null!;
}
