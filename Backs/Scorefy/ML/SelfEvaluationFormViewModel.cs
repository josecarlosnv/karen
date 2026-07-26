namespace ML
{
    using System.Collections.Generic;

    public class SelfEvaluationFormViewModel
    {
        public string EvaluationId { get; set; } = "";
        public int MyProperty { get; set; }
        public string Title { get; set; } = "Self‑Evaluation Form";
        public string SubTitle { get; set; } = "Rate your performance and provide evidence.";
 
        // Lista de reactivos (sub-competencias) a evaluar
        public List<ReactivoItem> Items { get; set; } = new();

        // Ítems excluidos (N/A) para el acordeón
        public List<ExcludedItem> Excluded { get; set; } = new();
    }

    public class ReactivoItem
    {
        public int EcdId { get; set; }
        public string  ReactiveNum { get; set; }
        public int Index { get; set; }
        public string Competency { get; set; } = "";
        public string SubCompetency { get; set; } = "";
        public string Description { get; set; } = "";
        public int? Score { get; set; }              // 1, 2, 3 o null si N/A
        public string Comment { get; set; } = "";
        public bool IsNA { get; set; }               // marcado N/A
        public string CompetenciaDescrip { get; set; }
        public string SubCompetenciaDescrip { get; set; }

    }

    
}
