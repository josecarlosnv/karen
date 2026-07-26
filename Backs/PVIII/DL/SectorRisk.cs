using System;
using System.Collections.Generic;

namespace DL;

public partial class SectorRisk
{
    public int UniqueId { get; set; }

    public int? SectorId { get; set; }

    public string? Descrip { get; set; }

    public string? RiskLevel { get; set; }
}
