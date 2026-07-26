using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyTblManagerPerformanceConclusion
{
    public int MpcId { get; set; }

    public int EmployeeId { get; set; }

    public string LocalJobLevelName { get; set; } = null!;

    public string EmailAddressBusiness { get; set; } = null!;

    public string PmLocalJob { get; set; } = null!;

    public string PmEmail { get; set; } = null!;

    public int Fy { get; set; }

    public bool ManagerFeedbackDiscussionConfirmed { get; set; }

    public bool MandatoryTrainingCompleted { get; set; }

    public bool IndependenceEth { get; set; }

    public int ScoreQpr { get; set; }

    public bool RoleResponsibilitiesMet { get; set; }

    public bool CodeOfConductIncidents { get; set; }

    public string? ComplianceAdditionalComments { get; set; }

    public int? PromotionOrCo { get; set; }

    public int? PromotedToCategory { get; set; }

    public string? Coreason { get; set; }

    public int FinalOpenPdrating { get; set; }

    public string FinalStrengthsSummary { get; set; } = null!;

    public string FinalAreasOfOpportunity { get; set; } = null!;

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? IsCurrent { get; set; }

    public int? ColumnaA { get; set; }

    public int? ColumnaB { get; set; }

    public string? ColumnaC { get; set; }

    public string? ColumnaD { get; set; }

    public virtual ScorefyDimPromotionCategory? PromotedToCategoryNavigation { get; set; }

    public virtual ScorefyDimScoreQpr ScoreQprNavigation { get; set; } = null!;
}
