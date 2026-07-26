namespace ML
{
    using System.Collections.Generic;

    public class ManagerEvaluationsIndexViewModel
    {
        // Search + filtros seleccionados
        public string Query { get; set; } = "";
        public string Status { get; set; } = "all";   // all | pending | in-progress | complete
        public string Role { get; set; } = "all"; 
        public string Client { get; set; } = "all";

        // Datos para dropdowns
        public List<string> Roles { get; set; } = new();
        public List<string> Clients { get; set; } = new();

        // Resultados
        public List<ManagerEvaluationCardItem> Evaluations { get; set; } = new();

        // Métricas de cabecera
        public int TotalCount => Evaluations?.Count ?? 0;     // total antes de filtro (puedes separar si filtras server-side)
        public int ShownCount { get; set; }                   // calculado client-side o server-side
    }

    public class ManagerEvaluationCardItem
    {
        public string Id { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string EmployeeRole { get; set; } = "";
        public string ClientName { get; set; } = "";
        public string ClientNumber { get; set; } = "";
        public string CreatedOn { get; set; } = "";  // “1/14/2026”
        public string DueDate { get; set; } = "";    // “2/9/2026”
        public string Status { get; set; } = "";     // pending | in-progress | complete
    }
}
