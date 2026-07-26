using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblSecurity
{
    public int EmtsecurityPk { get; set; }

    public string EmailAddressBusiness { get; set; } = null!;

    public string? FullName { get; set; }

    public int RoleId { get; set; }

    public string? RoleDesc { get; set; }

    public int? BuId { get; set; }

    public string? BuDesc { get; set; }

    public int? SegmentId { get; set; }

    public string? SegmentDesc { get; set; }

    public int? OfficeId { get; set; }

    public string? OfficeDesc { get; set; }

    public decimal? ColumnA { get; set; }

    public decimal? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
