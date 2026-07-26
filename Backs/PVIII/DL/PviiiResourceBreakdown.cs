using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiResourceBreakdown
{
    public int ResourceBreakdownId { get; set; }

    public string P8Id { get; set; } = null!;

    public string? FunctionLabel { get; set; }

    public string ServiceLineLabel { get; set; } = null!;

    public string? SpecialistLevelLabel { get; set; }

    public decimal? ResourceHoursPreliminary { get; set; }

    public decimal? ResourceHoursInterim { get; set; }

    public decimal? ResourceHoursFinal { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }
}
