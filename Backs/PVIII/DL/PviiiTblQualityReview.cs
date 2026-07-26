using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblQualityReview
{
    public int QualityReviewId { get; set; }

    public string P8Id { get; set; } = null!;

    public int ReviewerType { get; set; }

    public int ReviewerHours { get; set; }

    public decimal? ReviewerRate { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public int QualityReviewerId { get; set; }

    public decimal? ReviewerFee { get; set; }

    public string? CurrencyCode { get; set; }

    public string QualityReviewerName { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual PviiiCatCurrency? CurrencyCodeNavigation { get; set; }

    public virtual PviiiCatReviewerType ReviewerTypeNavigation { get; set; } = null!;
}
