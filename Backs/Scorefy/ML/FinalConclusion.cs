using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class FinalConclusionSectionDTO
    {
        public int EmployeeId { get; set; } 
        public int FY { get; set; }
        public SectionDataDTO Data { get; set; }
    }


    public class FinalConclusionReminderDTO
    {
        public int EmployeeId { get; set; }
        public int FY { get; set; }
    }


    //public class FinalConclusionSectionGetDTO
    //{
    //    public int EmployeeId { get; set; }
    //    public int FY { get; set; }
    //    public bool? FeedbackConversationCompleted { get; set; }
    //    public string? PromotionType { get; set; }
    //    public string? PromotionCategory { get; set; }
    //    public string? Justification { get; set; }
    //    public int? OpenPDRating { get; set; }
    //    public string? Strengths { get; set; }
    //    public string? AreasOfOpportunity { get; set; }
    //    public string? GeneralComments { get; set; }
    //    public string? COReason { get; set; }
    //    public string? Editor { get; set; }
    //    public DateTime? LastUpdate { get; set; }
    //    public bool? TrainingCompleted { get; set; }
    //    public bool? IndependenceEthicsIssues { get; set; }
    //    public int? QPRScore { get; set; }
    //    public string? RolePerformance { get; set; }
    //    public bool? CodeOfConductIssues { get; set; }

    //}
    public class FinalConclusionSectionGetDTO
    {
        public int EmployeeId { get; set; }
        public int FY { get; set; }

        // ✅ el UI SOLO consume esto
        public SectionDataDTO Data { get; set; }

        public string? Editor { get; set; }
        public DateTime? LastUpdate { get; set; }
    }

    public class FinalConclusionConsolidatedDTO
    {
        public int EmployeeId { get; set; }
        public int FY { get; set; }

        public int? PMRating { get; set; }
        public int? CommitteeRating { get; set; }
        public int? CalibrationRating { get; set; }

        public bool AllCompleted =>
            PMRating.HasValue && CommitteeRating.HasValue && CalibrationRating.HasValue;
    }


    public class FinalConclusionFullDTO
    {
        public object? Employee { get; set; }
        public FinalConclusionSectionGetDTO? PerformanceManager { get; set; }
        public FinalConclusionSectionGetDTO? Committee { get; set; }
        public FinalConclusionSectionGetDTO? Calibration { get; set; }
        public FinalConclusionConsolidatedDTO? Consolidated { get; set; }
    }

    public class FinalConclusionWorkflowDTO
    {
        public int EmployeeId { get; set; }
        public int FY { get; set; }

        public bool PMCompleted { get; set; }
        public bool CommitteeCompleted { get; set; }
        public bool CalibrationCompleted { get; set; }

        public string CurrentStep { get; set; } // pm | committee | calibration | done
        public string NextStep { get; set; } // committee | calibration | none
    }


    public class SectionDataDTO
    {
        public bool? FeedbackConversationCompleted { get; set; }
        public string? PromotionType { get; set; }
        public string? PromotionCategory { get; set; }
        public string? Justification { get; set; }
        public int? OpenPDRating { get; set; }
        public string? Strengths { get; set; }
        public string? AreasOfOpportunity { get; set; }
        public string? GeneralComments { get; set; }
        public Compliance806ADTO? Compliance806A { get; set; }
        public Compliance806BDTO? Compliance806B { get; set; }
        public string? ComplianceComments { get; set; }
    }

    public class Compliance806ADTO
    {
        public string? TrainingCompleted { get; set; }
        public string? IndependenceEthicsIssues { get; set; }
        public string? RolePerformance { get; set; }
        public string? CodeOfConductIssues { get; set; }
    }

    public class Compliance806BDTO
    {
        public string? TrainingCompleted { get; set; }
        public string? IndependenceEthicsIssues { get; set; }
        public string? QPRScore { get; set; }
        public string? RolePerformance { get; set; }
        public string? CodeOfConductIssues { get; set; }
    }
}