using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimSectorType
{
    public int EmtSectorPk { get; set; }

    public int? SectorId { get; set; }

    public string? SectorDesc { get; set; }

    public string? ParentSectorDesc { get; set; }

    public bool? IsCurrent { get; set; }
}
