using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSpecialistConfirmation
{
    public int SpecialistConfirmationId { get; set; }

    public bool ConfirmationIndicator { get; set; }

    public decimal? AgreedFeesSpecialist { get; set; }

    public string P8Id { get; set; } = null!;

    public string ServiceLineLabel { get; set; } = null!;

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }
}
