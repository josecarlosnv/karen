using System;
using System.Collections.Generic;

namespace DL;

public partial class DimCategory
{
    public int CategoryId { get; set; }

    public string Category { get; set; } = null!;

    public virtual ICollection<WorkloadApprovalBu> WorkloadApprovalBus { get; set; } = new List<WorkloadApprovalBu>();

    public virtual ICollection<WorkloadEstimation> WorkloadEstimations { get; set; } = new List<WorkloadEstimation>();
}
