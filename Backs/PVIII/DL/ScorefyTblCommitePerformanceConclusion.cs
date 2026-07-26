using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyTblCommitePerformanceConclusion
{
    public int CpcId { get; set; }

    public int EmployeeId { get; set; }

    public int Fy { get; set; }

    public int? CpcPromotionOrCo { get; set; }

    public int? CpcPromotedToCategory { get; set; }

    public string? CpcCoreason { get; set; }

    public int CpcFinalOpenPdrating { get; set; }

    public string? CpcGeneralComments { get; set; }

    public int? CalibrationFinalOpenPdrating { get; set; }

    public string? CalibrationGeneralComments { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? IsCurrent { get; set; }

    public int? ColumnaA { get; set; }

    public int? ColumnaB { get; set; }

    public string? ColumnaC { get; set; }

    public string? ColumnaD { get; set; }
}
