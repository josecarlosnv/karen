using System;
using System.Collections.Generic;

namespace DL;

public partial class DimQuarter
{
    public int Description { get; set; }

    public int Quarter { get; set; }

    public virtual ICollection<WlTblBupicApproval> WlTblBupicApprovals { get; set; } = new List<WlTblBupicApproval>();

    public virtual ICollection<WorkloadApprovalBu> WorkloadApprovalBus { get; set; } = new List<WorkloadApprovalBu>();

    public virtual ICollection<WorkloadEstimation> WorkloadEstimations { get; set; } = new List<WorkloadEstimation>();
}
