using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSubSpecialistBreakdown
{
    public int ResourceBreakdownId { get; set; }

    public string P8Id { get; set; } = null!;

    public string SpecialistServiceLineLabel { get; set; } = null!;

    public int SpecialistLevelId { get; set; }

    public decimal? ResourceHoursPreliminary { get; set; }

    public decimal? ResourceHoursInterim { get; set; }

    public decimal? ResourceHoursFinal { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public int CostCenter { get; set; }
}
