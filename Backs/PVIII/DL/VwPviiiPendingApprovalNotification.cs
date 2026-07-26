using System;
using System.Collections.Generic;

namespace DL;

public partial class VwPviiiPendingApprovalNotification
{
    public string P8Id { get; set; } = null!;

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public string SegmentLabel { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public int ApprovalLevelId { get; set; }

    public string ApprovalLevelLabel { get; set; } = null!;

    public string RequiredRole { get; set; } = null!;

    public string? RecipientName { get; set; }

    public string RecipientEmail { get; set; } = null!;

    public string NotificationCadence { get; set; } = null!;
}
