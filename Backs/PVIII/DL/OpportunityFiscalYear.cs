using System;
using System.Collections.Generic;

namespace DL;

public partial class OpportunityFiscalYear
{
    public long OpportunityId { get; set; }

    public int? OpportunityFiscalYear1 { get; set; }

    public decimal? Fee { get; set; }

    public decimal? FeeMx { get; set; }

    public string? Currency { get; set; }

    public string? TypeOfWorkDescription { get; set; }

    public string? NameServiceType { get; set; }

    public string? ServiceTypeId { get; set; }
}
