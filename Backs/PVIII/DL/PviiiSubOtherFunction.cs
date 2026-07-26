using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSubOtherFunction
{
    public int P8OtherFunctPk { get; set; }

    public string P8Id { get; set; } = null!;

    public bool? ApprovalIndicator { get; set; }

    public string? ServicesLine { get; set; }

    public string? Comments { get; set; }

    public bool? IsActive { get; set; }

    public long? RecordChangeSequence { get; set; }

    public DateTime? Create { get; set; }

    public string CreateBy { get; set; } = null!;
}
