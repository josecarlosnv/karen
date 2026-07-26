using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyTblCommitePerformanceConclusion
{
    public int CPC_Id { get; set; }
    public int EmployeeId { get; set; }
    public int FY { get; set; }
    public int? Cpc_PromotionOrCO { get; set; }
    public int? Cpc_PromotedToCategory { get; set; }

    public string? Cpc_COReason { get; set; }
    public int Cpc_FinalOpenPDRating { get; set; }
    public string? Cpc_GeneralComments { get; set; }

    public int? Calibration_FinalOpenPDRating { get; set; }

    public string? Calibration_GeneralComments { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }
    public int IsCurrent { get; set; }

    public int? Columna_A { get; set; }

    public int? Columna_B { get; set; }

    public string? Columna_C { get; set; }

    public string? Columna_D { get; set; }

   
}
