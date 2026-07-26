using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiMasterHistory
{
    public int P8HistoryId { get; set; }

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int P8FiscalYearId { get; set; }

    public int P8FiscalYearLabel { get; set; }

    public int BusinessUnitId { get; set; }

    public string BusinessUnitIdLabel { get; set; } = null!;

    public int P8revenueTypeId { get; set; }

    public string P8revenueTypeLabel { get; set; } = null!;

    public string P8Id { get; set; } = null!;

    public string PastYearp8Id { get; set; } = null!;

    public int P8StatusId { get; set; }

    public string P8ApprStatusLabel { get; set; } = null!;

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public bool P8ValidityStatus { get; set; }

    public int SegmentId { get; set; }

    public string SegmentLabel { get; set; } = null!;

    public int CurrentEngagementManagerId { get; set; }

    public string CurrentEngagementManagerName { get; set; } = null!;

    public int CurrentEngagementPartnerId { get; set; }

    public string CurrentEngagementPartnerName { get; set; } = null!;

    public string CurrentEngagementManagerEmail { get; set; } = null!;

    public string CurrentEngagementPartnerEmail { get; set; } = null!;
}
