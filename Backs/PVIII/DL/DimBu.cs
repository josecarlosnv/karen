using System;
using System.Collections.Generic;

namespace DL;

public partial class DimBu
{
    public int Buid { get; set; }

    public string Bu { get; set; } = null!;

    public virtual ICollection<WlTblBupicApproval> WlTblBupicApprovals { get; set; } = new List<WlTblBupicApproval>();

    public virtual ICollection<WorkloadApprovalBu> WorkloadApprovalBus { get; set; } = new List<WorkloadApprovalBu>();

    public virtual ICollection<WorkloadEstimation> WorkloadEstimations { get; set; } = new List<WorkloadEstimation>();
}
