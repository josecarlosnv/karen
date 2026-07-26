using System;
using System.Collections.Generic;

namespace DL;

public partial class EvaluationStep
{
    public int EvaluationStepId { get; set; }

    public int EvaluationId { get; set; }

    public string StepType { get; set; } = null!;

    public byte StageStatusId { get; set; }

    public bool? MeetingConfirmed { get; set; }

    public byte? DecisionTypeId { get; set; }

    public byte? PromotionCategoryId { get; set; }

    public string? Cojustification { get; set; }

    public byte OpenPd { get; set; }

    public string? Strengths { get; set; }

    public string? OpportunityAreas { get; set; }

    public string? GeneralComments { get; set; }

    public string? CalibratedBy { get; set; }

    public string? CalibratedByEmail { get; set; }

    public DateTime? CalibratedAt { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public virtual LkpDecisionType? DecisionType { get; set; }

    public virtual Evaluation Evaluation { get; set; } = null!;

    public virtual LkpPromotionCategory? PromotionCategory { get; set; }

    public virtual LkpStageStatus StageStatus { get; set; } = null!;
}
