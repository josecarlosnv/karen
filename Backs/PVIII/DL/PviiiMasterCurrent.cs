using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiMasterCurrent
{
    public int SumClientId { get; set; }

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int P8FiscalYearId { get; set; }

    public int P8FiscalYearLabel { get; set; }

    public int BusinessUnitId { get; set; }

    public string BusinessUnitIdLabel { get; set; } = null!;

    public int P8revenueTypeId { get; set; }

    public string P8revenueTypeLabel { get; set; } = null!;

    public string P8Id { get; set; } = null!;

    public string? PastYearp8Id { get; set; }

    public int P8StatusId { get; set; }

    public string P8StatusLabel { get; set; } = null!;

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public bool P8ValidityStatus { get; set; }

    public int SegmentId { get; set; }

    public string SegmentLabel { get; set; } = null!;

    public int CurrentEngagementManagerId { get; set; }

    public string? CurrentEngagementManagerName { get; set; }

    public int CurrentEngagementPartnerId { get; set; }

    public string? CurrentEngagementPartnerName { get; set; }

    public string CurrentEngagementManagerEmail { get; set; } = null!;

    public string CurrentEngagementPartnerEmail { get; set; } = null!;

    public bool? IsLost { get; set; }

    public virtual PviiiCatBusinessUnitRef BusinessUnitIdLabelNavigation { get; set; } = null!;

    public virtual PviiiCatFiscalYearRef P8FiscalYearLabelNavigation { get; set; } = null!;

    public virtual PviiiCatStatus P8StatusLabelNavigation { get; set; } = null!;

    public virtual PviiiCatRevType P8revenueTypeLabelNavigation { get; set; } = null!;

    public virtual PviiiCatSegment SegmentLabelNavigation { get; set; } = null!;
}
