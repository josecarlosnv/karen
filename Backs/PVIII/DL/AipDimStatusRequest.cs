using System;
using System.Collections.Generic;

namespace DL;

public partial class AipDimStatusRequest
{
    public int DimStatusRequestPk { get; set; }

    public string P8Id { get; set; } = null!;

    public int RequestIdentifier { get; set; }

    public string RequestStatus { get; set; } = null!;

    public int StatusIdentifier { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime Created { get; set; }

    public string ModifiedBy { get; set; } = null!;

    public DateTime Modified { get; set; }

    public virtual AipCatRequeststatus AipCatRequeststatus { get; set; } = null!;
}
