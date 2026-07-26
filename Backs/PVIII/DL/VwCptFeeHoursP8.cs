using System;
using System.Collections.Generic;

namespace DL;

public partial class VwCptFeeHoursP8
{
    public string? EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string? EmailAddressBusiness { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public decimal? Fyc { get; set; }

    public decimal? TotalHours { get; set; }

    public decimal? HorasCargablesPropias { get; set; }
}
