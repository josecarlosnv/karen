using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class ApprovalRequestDTO
    {
        public string Role { get; set; } = null!; 

        public bool Approve { get; set; }

        public DocumentationDTO? Documentation { get; set; }
    }

    public class DocumentationDTO
    {
        public string? CompetenceDocumentation { get; set; }
        public string? CapabilitiesDocumentation { get; set; }
        public string? OthersDocumentation { get; set; }
        public string? FinancialRiskDocumentation { get; set; }
        public string? AdditionalComments { get; set; }
    }
}
