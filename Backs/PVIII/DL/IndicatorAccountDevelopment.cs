using System;
using System.Collections.Generic;

namespace DL;

public partial class IndicatorAccountDevelopment
{
    public string EntityGroupNumber { get; set; } = null!;

    public int FiscalYear { get; set; }

    public string? Year1 { get; set; }

    public int? Year1UserId { get; set; }

    public string? Year2 { get; set; }

    public int? Year2UserId { get; set; }

    public string? Year3 { get; set; }

    public int? Year3UserId { get; set; }

    public int? UnitOfAnalisisUserId { get; set; }

    public string? UnitofAnalisis { get; set; }

    public string? ResponsableUnitId { get; set; }

    public int? ResponsableUnitIdSelected { get; set; }
}
