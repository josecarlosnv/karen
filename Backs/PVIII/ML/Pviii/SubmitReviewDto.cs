using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class SubmitReviewDto

    {
        public string P8Id { get; set; } = null!;
        public bool IsHighRisk { get; set; }
        public bool IsFinancialRisk { get; set; }
        public int ApprovalLevelId { get; set; }
    }

}
