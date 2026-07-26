using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssignmentsApproval
{
    public int EmtAssiApprPk { get; set; }

    public string KeyEmt { get; set; } = null!;

    public string ApproveLevel { get; set; } = null!;

    public int? ApproveStatus { get; set; }

    public string ApproveEmailAddressBusiness { get; set; } = null!;

    public string? ApproveComment { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }
}
