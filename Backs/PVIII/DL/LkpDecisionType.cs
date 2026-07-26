using System;
using System.Collections.Generic;

namespace DL;

public partial class LkpDecisionType
{
    public byte DecisionTypeId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<EvaluationStep> EvaluationSteps { get; set; } = new List<EvaluationStep>();
}
