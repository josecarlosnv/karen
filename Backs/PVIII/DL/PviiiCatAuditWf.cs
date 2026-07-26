using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatAuditWf
{
    public int AuditWorkflowId { get; set; }

    public string AuditWorkflowLabel { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;
}
