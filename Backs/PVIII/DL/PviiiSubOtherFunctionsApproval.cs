using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSubOtherFunctionsApproval
{
    public int P8OtherFunctPk { get; set; }

    public bool? ApprovalIndicator { get; set; }

    public string? CostCenter { get; set; }

    public string ServicesLine { get; set; } = null!;

    public string? Comments { get; set; }

    public bool? IsActive { get; set; }

    public long? RecordChangeSequence { get; set; }

    public DateTime? Create { get; set; }

    public string CreateBy { get; set; } = null!;
}
