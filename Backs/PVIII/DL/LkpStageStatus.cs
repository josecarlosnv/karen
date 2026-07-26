using System;
using System.Collections.Generic;

namespace DL;

public partial class LkpStageStatus
{
    public byte StageStatusId { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<EvaluationStep> EvaluationSteps { get; set; } = new List<EvaluationStep>();
}
