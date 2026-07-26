using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmMasterQualityRating
{
    public int MasterQrKey { get; set; }

    public string LeaderId { get; set; } = null!;

    public string LeaderName { get; set; } = null!;

    public int FiscalYearLabel { get; set; }

    public string LeaderTitle { get; set; } = null!;

    public string Practice { get; set; } = null!;

    public string QualityRatingKey { get; set; } = null!;

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }
}
