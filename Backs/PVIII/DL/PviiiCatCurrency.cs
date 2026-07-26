using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatCurrency
{
    public int CurrencyId { get; set; }

    public int CurrencyCodeId { get; set; }

    public string CurrencyCode { get; set; } = null!;

    public virtual ICollection<PviiiFactTeamLeaderChange> PviiiFactTeamLeaderChanges { get; set; } = new List<PviiiFactTeamLeaderChange>();

    public virtual ICollection<PviiiTblQualityReview> PviiiTblQualityReviews { get; set; } = new List<PviiiTblQualityReview>();
}
