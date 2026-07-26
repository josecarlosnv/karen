using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class QualityReviewML
    {
        public int QualityReviewId { get; set; }

        public string P8Id { get; set; } = null!;

        public int ReviewerType { get; set; }

        public int ReviewerHours { get; set; }

        public decimal? ReviewerRate { get; set; }

        public string CreatedByUserEmail { get; set; } = null!;

        public DateTime CreatedDateTime { get; set; }

        public int RecordChangeSequence { get; set; }

        public int QualityReviewerId { get; set; }

        public decimal? ReviewerFee { get; set; }

        public string? CurrencyCode { get; set; }

        public string QualityReviewerName { get; set; } = null!;

        public bool IsActive { get; set; }

    }
}
