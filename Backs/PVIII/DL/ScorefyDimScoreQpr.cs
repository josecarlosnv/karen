using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyDimScoreQpr
{
    public int ScoreQprid { get; set; }

    public string ScoreDetail { get; set; } = null!;

    public virtual ICollection<ScorefyTblManagerPerformanceConclusion> ScorefyTblManagerPerformanceConclusions { get; set; } = new List<ScorefyTblManagerPerformanceConclusion>();
}
