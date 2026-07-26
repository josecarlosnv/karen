using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class ApprovalDocumentationML
    {
        public string? P8Id { get; set; } = null!;
        public int? ApprovalLevelId { get; set; }
        public string? CompetenceDocumentation { get; set; }
        public string? CapabilitiesDocumentation { get; set; }
        public string? OthersDocumentation { get; set; }
        public string? FinancialRiskDocumentation { get; set; }
        public bool? ApprDocumentationActiveStatus { get; set; }
        public string? CreatedByUserEmail { get; set; } = null!;
        public DateTime? CreatedDateTime { get; set; }
        public int? RecordChangeSequence { get; set; }
        public string? AdditionalComments { get; set; }
    }
}
