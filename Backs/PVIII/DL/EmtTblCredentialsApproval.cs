using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblCredentialsApproval
{
    public int EmtCredApprPk { get; set; }

    public long EmployeeId { get; set; }

    public string ApproveLevel { get; set; } = null!;

    public int? ApproveStatus { get; set; }

    public string ApproveEmailAddressBusiness { get; set; } = null!;

    public string? ApproveComment { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public virtual EmtDimApprovalStatus? ApproveStatusNavigation { get; set; }
}
