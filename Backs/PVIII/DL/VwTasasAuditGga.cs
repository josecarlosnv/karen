using System;
using System.Collections.Generic;

namespace DL;

public partial class VwTasasAuditGga
{
    public string FullName { get; set; } = null!;

    public string EmployeeId { get; set; } = null!;

    public string? EmailAddressBusiness { get; set; }

    public string? LocalJobLevelName { get; set; }

    public decimal? Fyc { get; set; }

    public string? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string? LocationName { get; set; }

    public string? ProductoDescription { get; set; }
}
