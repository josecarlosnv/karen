using System;
using System.Collections.Generic;

namespace DL;

public partial class VwCptTblCommentsFilter
{
    public int PkCptComment { get; set; }

    public string IdForm { get; set; } = null!;

    public string EmployeeName { get; set; } = null!;

    public string? CreatedBy { get; set; }

    public int? IdType { get; set; }

    public string? DescriptionType { get; set; }

    public bool? IsFilter { get; set; }

    public string? Comment { get; set; }

    public DateTime? Created { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }
}
