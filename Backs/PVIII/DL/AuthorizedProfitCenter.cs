using System;
using System.Collections.Generic;

namespace DL;

public partial class AuthorizedProfitCenter
{
    public int ProfitCenterId { get; set; }

    public string? ProfitCenter { get; set; }

    public int PracticesId { get; set; }

    public string? Practice { get; set; }

    public bool? ProfitCenterEstatus { get; set; }

    public string? SystemName { get; set; }
}
