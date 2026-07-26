using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiMasterSpecialist
{
    public int MasterSpecialistId { get; set; }

    public string ServiceLineSpecialist { get; set; } = null!;

    public string P8Id { get; set; } = null!;

    public int P8StatusId { get; set; }

    public bool P8ValidityStatus { get; set; }

    public string BusinessUnitIdLabel { get; set; } = null!;

    public string SegmentLabel { get; set; } = null!;

    public string CurrentEngagementPartnerName { get; set; } = null!;

    public string CurrentEngagementPartnerEmail { get; set; } = null!;

    public string ServiceLineInChargeLabel { get; set; } = null!;

    public string ServiceLineInChargeEmail { get; set; } = null!;

    public bool SpecialistConfirmStatus { get; set; }

    public bool SpecialistConfirmBreakdown { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }
}
