using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblAprobal
{
    public int PkCptAprobals { get; set; }

    public string IdForm { get; set; } = null!;

    public bool? PicBu { get; set; }

    public string? PicBuComment { get; set; }

    public DateTime? PicBuDate { get; set; }

    public string? PicBuDateText { get; set; }

    public bool? HofANacional { get; set; }

    public string? HofANacionalComment { get; set; }

    public DateTime? HofANacionalDate { get; set; }

    public string? HofANacionalDateText { get; set; }

    public bool? Buqpp { get; set; }

    public string? BuqppComment { get; set; }

    public DateTime? BuqppDate { get; set; }

    public string? BuqppDateText { get; set; }

    public int? Fy { get; set; }

    public bool? IsLost { get; set; }

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
