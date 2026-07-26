using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class ProyectApprovalCreateDto
    {
        public string p8Id { get; set; }
        public bool? leapValidation { get; set; } = null!;
        public string? leapCompetenceDocumentation { get; set; } = null!;
        public string? leapCapabilitiesDocumentation { get; set; } = null!;
        public string? leapObjectivityDocumentation { get; set; } = null!;
        public string? leapTimeDocumentation { get; set; } = null!;
        public string? leapFinancialDocumentation { get; set; } = null!;
        public bool? PICValidation { get; set; } = null!;
        public string? PICCompetenceDocumentation { get; set; } = null!;
        public string? PICCapabilitiesDocumentation { get; set; } = null!;
        public string? PICObjectivityDocumentation { get; set; } = null!;
        public string? PICTimeDocumentation { get; set; } = null!;
        public string? PICFinancialDocumentation { get; set; } = null!;
        public bool? HofAValidation { get; set; } = null!;
        public string? HofACompetenceDocumentation { get; set; } = null!;
        public string? HofACapabilitiesDocumentation { get; set; } = null!;
        public string? HofAObjectivityDocumentation { get; set; } = null!;
        public string? HofATimeDocumentation { get; set; } = null!;
        public string? HofAFinancialDocumentation { get; set; } = null!;
        public bool? BUPPValidation { get; set; } = null!;
        public string? BUPPCompetenceDocumentation { get; set; } = null!;
        public string? BUPPCapabilitiesDocumentation { get; set; } = null!;
        public string? BUPPObjectivityDocumentation { get; set; } = null!;
        public string? BUPPTimeDocumentation { get; set; } = null!;
        public string? BUPPFinancialDocumentation { get; set; } = null!;
        public string createBy { get; set; }
    }
}
