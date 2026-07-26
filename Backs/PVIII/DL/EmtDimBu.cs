using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimBu
{
    public int EmtBuPk { get; set; }

    public int? BuId { get; set; }

    public string? BuDesc { get; set; }

    public string? SegmentId { get; set; }

    public string? SegmentDesc { get; set; }

    public string? OfficeId { get; set; }

    public string? OfficeDesc { get; set; }

    public int? CostCenter { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string? EmailAddressBusinessPic { get; set; }

    public bool? IsCurrent { get; set; }
}
