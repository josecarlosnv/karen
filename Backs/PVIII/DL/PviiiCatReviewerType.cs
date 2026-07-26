using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatReviewerType
{
    public int ReviewerTypePk { get; set; }

    public int ReviewerTypeId { get; set; }

    public string ReviewerTypeLabel { get; set; } = null!;

    public virtual ICollection<PviiiTblEntityReportConfig> PviiiTblEntityReportConfigs { get; set; } = new List<PviiiTblEntityReportConfig>();

    public virtual ICollection<PviiiTblQualityReview> PviiiTblQualityReviews { get; set; } = new List<PviiiTblQualityReview>();
}
