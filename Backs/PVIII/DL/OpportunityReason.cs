using System;
using System.Collections.Generic;

namespace DL;

public partial class OpportunityReason
{
    public long OpportunityId { get; set; }

    public string? Outcome { get; set; }

    public string? OutcomeDescription { get; set; }

    public string? Reason { get; set; }

    public string? ReasonDescription { get; set; }
}
