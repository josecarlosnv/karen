using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimApprovalStatus
{
    public int EmtApprPk { get; set; }

    public string EmtApprDesc { get; set; } = null!;

    public bool? IsCurrent { get; set; }

    public virtual ICollection<EmtTblCredentialsApproval> EmtTblCredentialsApprovals { get; set; } = new List<EmtTblCredentialsApproval>();
}
