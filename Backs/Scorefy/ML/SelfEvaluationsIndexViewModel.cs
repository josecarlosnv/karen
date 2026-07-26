namespace ML
{
    using System.Collections.Generic;

    public class SelfEvaluationsIndexViewModel
    {
        public List<SelfEvaluationListItem> Evaluations { get; set; } = new();

        // Datos para el Start Panel
        public List<ProjectOption> Projects { get; set; } = new(); 
        public List<ClientItem> Clients { get; set; } = new();
        public List<EvaluatorItem> Evaluators { get; set; } = new();
        public List<string> Roles { get; set; } = new();

        public IEnumerable<string> RolesDisponibles { get; set; } = new[]
    {
        "Senior Manager","Manager","Supervising Senior","Senior","Staff in Charge","Staff"
    };
    }


    // NUEVO: opción de proyecto que SÍ puede generar evaluación (GeneratedEvaluation=false & IsCurrent=true)
    public class ProjectOption
    {
        public string PkEvalGene { get; set; } = "";   // clave del proyecto a generar
        public string Label { get; set; } = "";        // lo que se muestra en el <select>
        public long ClientId { get; set; }              // opcional: por si quieres validaciones adicionales
        public int EmployeeId { get; set; }            // opcional
        public string? ClientName { get; set; }
        public string? EmployeeName { get; set; }
    }


    public class SelfEvaluationListItem
    {
        public string Id { get; set; } = "";
        public string ProjectClient { get; set; } = "";
        public string Role { get; set; } = "";
        public string Status { get; set; } = "";     // "Pending" | "In Progress" | "Completed"
        public int Hours { get; set; }
        public string LastUpdated { get; set; } = ""; // e.g., "2 hours ago"
        public decimal? Score { get; set; }
        public bool? IsClosed { get; set; }
    }

    public class ClientItem
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string ClientId { get; set; } = "";
    }

    public class EvaluatorItem
    {
        public string Id { get; set; } = "";
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Initials { get; set; } = "";
    }
}
