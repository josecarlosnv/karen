using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmTblQualificationsPenTwo
{
    public int QualyPtKey { get; set; }

    public string LeaderDataUniqueKey { get; set; } = null!;

    public string IndicatorsUniqueKey { get; set; } = null!;

    public decimal? QualificationScore { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public string? QualificationDescription { get; set; }

    public string? QualificationMessage { get; set; }
}
