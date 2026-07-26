using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyDimPromotionCategory
{
    public int PromotionCategoryId { get; set; }

    public string PromotionCategoryName { get; set; } = null!;

    public virtual ICollection<ScorefyTblManagerPerformanceConclusion> ScorefyTblManagerPerformanceConclusions { get; set; } = new List<ScorefyTblManagerPerformanceConclusion>();
}
