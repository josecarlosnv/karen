namespace ML
{
    using System.Collections.Generic;

    public class FinalConclusionViewModel
    {
        // Header / Context
        public string EvaluationCycle { get; set; } = "Q4 2025"; 
        public string EmployeeName { get; set; } = "Sarah Johnson";
        public string EmployeeBU { get; set; } = "Audit Services";
        public string EmployeeOffice { get; set; } = "New York";
        public string EmployeeLevel { get; set; } = "Senior Consultant";
        public string EvaluationPeriod { get; set; } = "2025-2026";

        // Step cards
        public FinalConclusionSectionModel PerformanceManager { get; set; } = new();
        public FinalConclusionSectionModel Committee { get; set; } = new();
        public FinalConclusionSectionModel Calibration { get; set; } = new();

        // Catálogo para Promotion
        public List<string> PromotionCategories { get; set; } = new() {
        "Senior", "Supervising Senior", "Staff in Charge", "Manager", "Senior Manager", "Director"
    };
    }

    public class FinalConclusionSectionModel
    {
        // "performance-manager" | "committee" | "calibration"
        public string SectionType { get; set; } = "performance-manager";

        // state: "edit" | "view" | "locked"
        public string State { get; set; } = "edit";

        // status: "pending" | "in-progress" | "completed"
        public string Status { get; set; } = "in-progress";

        // Data
        public string PromotionType { get; set; } = null; // "promotion" | "co" | null
        public string PromotionCategory { get; set; } = "";
        public string Justification { get; set; } = "";
        public int? OpenPDRating { get; set; } = null;     // 1..5 (1 = highest)
        public string Strengths { get; set; } = "";        // Only performance-manager
        public string AreasOfOpportunity { get; set; } = "";// Only performance-manager
        public string GeneralComments { get; set; } = "";  // committee & calibration

        // Meta
        public string EditorName { get; set; } = "John Manager";
        public string LastUpdated { get; set; } = "Today";
    }
}
