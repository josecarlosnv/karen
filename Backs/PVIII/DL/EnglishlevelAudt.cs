using System;
using System.Collections.Generic;

namespace DL;

public partial class EnglishlevelAudt
{
    public int PkEnglishId { get; set; }

    public int? FkEmployeeId { get; set; }

    public decimal EnglishLevel { get; set; }

    public int? EvaluationDate { get; set; }
}
