using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyTblManagerPerformanceConclusion
{
    public int MPC_Id { get; set; }
    public int EmployeeId { get; set; }
    public string Local_Job_Level_Name { get; set; }
    public string Email_Address_Business { get; set; }
    public string PM_LocalJob { get; set; }
    public string PM_Email { get; set; }
    public int FY { get; set; }
    public bool ManagerFeedbackDiscussionConfirmed { get; set; }
    public bool MandatoryTrainingCompleted { get; set; }

    public bool IndependenceEth { get; set; }

    public int ScoreQPR { get; set; }

    public bool RoleResponsibilitiesMet { get; set; }
    public bool CodeOfConductIncidents { get; set; }
    public string? ComplianceAdditionalComments { get; set; }
    public int? PromotionOrCO { get; set; }
    public int? PromotedToCategory { get; set; }

    public string? COReason { get; set; }

    public int FinalOpenPDRating { get; set; }

    public string? FinalStrengthsSummary { get; set; }

    public string? FinalAreasOfOpportunity { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }
    public int? IsCurrent { get; set; }

    public string? Columna_A { get; set; }

    public string? Columna_B { get; set; }

    public int? Columna_C { get; set; }

    public int? Columna_D { get; set; }

   
}
