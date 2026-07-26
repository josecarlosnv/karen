using System;
using System.Collections.Generic;

namespace DL;

public partial class AipFactEnglishLevel
{
    public int EnglishId { get; set; }

    public int EmployeeId { get; set; }

    public decimal? EnglishLevel { get; set; }

    public string? Comments { get; set; }

    public int? EvaluationYear { get; set; }

    public string? EnglishTypeLevel { get; set; }
}
