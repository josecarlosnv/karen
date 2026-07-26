using System;
using System.Collections.Generic;

namespace DL;

public partial class AipCatRequeststatus
{
    public int CatStatusPk { get; set; }

    public string RequestStatus { get; set; } = null!;

    public int StatusIdentifier { get; set; }

    public virtual ICollection<AipDimStatusRequest> AipDimStatusRequests { get; set; } = new List<AipDimStatusRequest>();
}
