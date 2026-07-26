using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSubSpFeeAlignment
{
    public int SpFeeAlignmentId { get; set; }

    public string P8Id { get; set; } = null!;

    public int CostCenter { get; set; }

    public int FeeAlignment { get; set; }

    public string SpecialistServiceLineLabel { get; set; } = null!;

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }
}
