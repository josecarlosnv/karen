using System;
using System.Collections.Generic;
using System.Text;

namespace DL
{
    public class EvaluationStep
    {
        public int EvaluationStepId { get; set; }
        public int EvaluationId { get; set; }
        public string StepType { get; set; }
        public int StageStatusId { get; set; }

        public bool? MeetingConfirmed { get; set; }
        public int? DecisionTypeId { get; set; }
        public int? PromotionCategoryId { get; set; }
        public string COJustification { get; set; }
        public int OpenPD { get; set; }
        public string Strengths { get; set; }
        public string OpportunityAreas { get; set; }
        public string GeneralComments { get; set; }
        public string CalibratedBy { get; set; }
        public string CalibratedByEmail { get; set; }
        public DateTime? CalibratedAt { get; set; }

        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public Evaluation Evaluation { get; set; }
    }
}
