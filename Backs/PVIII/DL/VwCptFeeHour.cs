using System;
using System.Collections.Generic;

namespace DL;

public partial class VwCptFeeHour
{
    public string? EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string? EmailAddressBusiness { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public decimal? Fyc { get; set; }

    public string? TotalHours { get; set; }

    public string? HorasCargablesPropias { get; set; }
}
