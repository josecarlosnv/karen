using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSubCatSpecialistRate
{
    public int SpecialistRateId { get; set; }

    public string FunctionLabel { get; set; } = null!;

    public string ServiceLineLabel { get; set; } = null!;

    public string ServiceLineGroup { get; set; } = null!;

    public string OfficeLabel { get; set; } = null!;

    public string LevelLabel { get; set; } = null!;

    public string LevelId { get; set; } = null!;

    public int CostCenter { get; set; }

    public decimal CategoryRate { get; set; }

    public int FiscalYearLabel { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }
}
