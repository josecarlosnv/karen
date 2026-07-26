using System;
using System.Collections.Generic;

namespace DL;

public partial class DimFiscalYear
{
    public int FiscalYear { get; set; }

    public virtual ICollection<Horas2doRevisor> Horas2doRevisors { get; set; } = new List<Horas2doRevisor>();

    public virtual ICollection<NonClientFacingActivity> NonClientFacingActivities { get; set; } = new List<NonClientFacingActivity>();

    public virtual ICollection<PruebaNonClientFacingActivity> PruebaNonClientFacingActivities { get; set; } = new List<PruebaNonClientFacingActivity>();

    public virtual ICollection<WlTblBupicApproval> WlTblBupicApprovals { get; set; } = new List<WlTblBupicApproval>();

    public virtual ICollection<WorkloadApprovalBu> WorkloadApprovalBus { get; set; } = new List<WorkloadApprovalBu>();

    public virtual ICollection<WorkloadEstimation> WorkloadEstimations { get; set; } = new List<WorkloadEstimation>();
}
