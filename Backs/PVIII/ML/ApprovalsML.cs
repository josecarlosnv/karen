using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class ApprovalsML
    {
        public int? p8AppovalsPK { get; set; } = null!;

        public string p8Id { get; set; } = null!;
        public string projectName { get; set; } = null!;

        public bool? leapValidation { get; set; }

        public string? leapCompetenceDocumentation { get; set; }

        public string? leapCapabilitiesDocumentation { get; set; }

        public string? leapObjectivityDocumentation { get; set; }

        public string? leapTimeDocumentation { get; set; }

        public string? leapFinancialDocumentation { get; set; }

        public bool? PICValidation { get; set; }

        public string? PICCompetenceDocumentation { get; set; }

        public string? PICCapabilitiesDocumentation { get; set; }

        public string? PICObjectivityDocumentation { get; set; }

        public string? PICTimeDocumentation { get; set; }

        public string? PICFinancialDocumentation { get; set; }

        public bool? HofAValidation { get; set; }

        public string? HofACompetenceDocumentation { get; set; }

        public string? HofACapabilitiesDocumentation { get; set; }

        public string? HofAObjectivityDocumentation { get; set; }

        public string? HofATimeDocumentation { get; set; }

        public string? HofAFinancialDocumentation { get; set; }

        public bool? BUPPValidation { get; set; }

        public string? BUPPCompetenceDocumentation { get; set; }

        public string? BUPPCapabilitiesDocumentation { get; set; }

        public string? BUPPObjectivityDocumentation { get; set; }

        public string? BUPPTimeDocumentation { get; set; }

        public string? BUPPFinancialDocumentation { get; set; }

        public string? createBy { get; set; }

    }
}
