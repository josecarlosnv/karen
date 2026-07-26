using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblOthersEqcr
{
    public long EmtEmployeeId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? EmailAddressBusiness { get; set; }

    public int? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string? LocationName { get; set; }

    public string LocalJobLevelName { get; set; } = null!;

    public int? YearsInRole { get; set; }

    public string? AreaFrom { get; set; }

    public bool? ReadyToApprove { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
