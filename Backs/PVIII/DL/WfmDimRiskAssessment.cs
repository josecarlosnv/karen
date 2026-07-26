using System;
using System.Collections.Generic;

namespace DL;

public partial class WfmDimRiskAssessment
{
    public int RiskId { get; set; }

    public string RiskAssessment { get; set; } = null!;

    public virtual ICollection<WfmTblControl416> WfmTblControl416s { get; set; } = new List<WfmTblControl416>();
}
