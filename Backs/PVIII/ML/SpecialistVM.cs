using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class SpecialistVM
    {
        public string P8Id { get; set; } = null!;
        public int MasterSpecialistId { get; set; }

        public string? FunctionLabel { get; set; }
        public string? ClientName { get; set; }

        public string? ServiceLinePartnerLead { get; set; }
        public string? ServiceLineLabel { get; set; }
        public string? BusinessUnitLabel { get; set; }
        public string? SegmentLabel { get; set; }
        public string? SpecialistPartnerName { get; set; }
        public string? SpecialistPartnerEmail { get; set; }
        public bool IsActive { get; set; }
        public decimal? TargetFees { get; set; }
        public decimal? ValuationPercent { get; set; }

        public string? AuditStandards { get; set; }
        public string? FinancialReportingStandards { get; set; }


    }

    public class SpecialistRequestVM
    {
        public string P8Id { get; set; } = null!;

        public string FunctionLabel { get; set; } = null!;
        public string ServiceLineLabel { get; set; } = null!;
        public string BusinessUnitLabel { get; set; } = null!;
        public string SegmentLabel { get; set; } = null!;

        public string SpecialistPartnerName { get; set; } = null!;
        public string SpecialistPartnerEmail { get; set; } = null!;

        public SpecialistStatusEnum Status { get; set; }
        public bool ConfirmationCompleted { get; set; }
        public bool BreakdownCompleted { get; set; }

        public List<ResourceBreakdownVM> Breakdown { get; set; } = new();

        public string? ConfirmationComment { get; set; }
        public string? ApprovalComment { get; set; }

        public DateTime? SubmittedOn { get; set; }
        public DateTime? ApprovedOn { get; set; }
    }

    public enum SpecialistStatusEnum
    {
        Draft = 0,
        Submitted = 1,
        Approved = 2,
        ChangesRequested = 3
    }

    public class ResourceBreakdownVM
    {
        public string FunctionLabel { get; set; } = null!;
        public string ServiceLineLabel { get; set; } = null!;
        public string Category { get; set; } = null!; 

        public decimal PreliminaryHours { get; set; }
        public decimal InterimHours { get; set; }
        public decimal FinalHours { get; set; }
    }


    public class SpecialistConfirmationVM
    {
        public bool ConfirmationIndicator { get; set; }
        public decimal? AgreedFeesSpecialist { get; set; }
        public string ServiceLineLabel { get; set; } = null!;
        public string? Comment { get; set; }
    }


}

