using System;
using System.Collections.Generic;

namespace DL;

public partial class KsdindicatorAccount
{
    public int KsdcatalogId { get; set; }

    public string EntityGroupNumber { get; set; } = null!;

    public int FiscalYear { get; set; }

    public string? Content { get; set; }
}
