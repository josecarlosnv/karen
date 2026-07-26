namespace ML
{
    using System.Collections.Generic;

    public class ManagerEvaluationDetailViewModel
    {
        public string EvaluationId { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string Client { get; set; } = ""; 
        public string Role { get; set; } = "";
        public string Period { get; set; } = "2025-2026";

        // Reactivos a evaluar por el manager
        public List<EvaluatorReactivo> Items { get; set; } = new();

        // Ítems excluidos (N/A) para el acordeón
        public List<ExcludedItem> Excluded { get; set; } = new();
    }

    public class ReactivoValue
    {
        public int? Score { get; set; }        // 1,2,3; null si N/A
        public string Comment { get; set; } = "";
        public bool IsNA { get; set; }         // marcado N/A
    }

    public class EvaluatorReactivo
    {
        public int Index { get; set; }
        public int Competency { get; set; }
        public decimal SubCompetency { get; set; }
        public string Description { get; set; } = "";

        // Self eval (readonly panel en la card, igual que tu EnhancedReactivoCard cuando mode="evaluator")
        public ReactivoValue SelfEvaluation { get; set; } = new();

        // Evaluator (valor actual)
        public ReactivoValue Value { get; set; } = new();

        // Estado visual opcional ("default" | "error" | "saved")
        public string State { get; set; } = "default";
        public string? ErrorMessage { get; set; }
    }

    
}
