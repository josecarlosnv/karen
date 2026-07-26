namespace ML
{
    using System.Collections.Generic;
    //modelo para formulario 
    public class StatusRemindersViewModel
    {
        // Filtros activos (opcional si filtras server-side)
        public string Query { get; set; } = "";
        public string Status { get; set; } = "all";
        public string Role { get; set; } = "all"; 
        public string Client { get; set; } = "all";

        // Datos para dropdowns
        public List<string> Roles { get; set; } = new();
        public List<string> Clients { get; set; } = new();

        // Tabla principal
        public List<StatusRow> Evaluations { get; set; } = new();

        // Excepciones (panel lateral o grid inferior)
        public List<ExceptionItem> Exceptions { get; set; } = new();
    }

    public class StatusRow
    {
        public string Id { get; set; } = "";
        public string Employee { get; set; } = "";
        public string EmployeeRole { get; set; } = "";
        public string ClientName { get; set; } = "";
        public string ClientNumber { get; set; } = "";
        public string Evaluator { get; set; } = "";
        public string CreatedOn { get; set; } = "";  // e.g. "1/14/2026"
        public string DueDate { get; set; } = "";    // e.g. "2/09/2026"
        public string Status { get; set; } = "";     // "pending" | "in-progress" | "complete" (ChipStatus)
        public string EvalType { get; set; } = "ordinary"; // "ordinary" | "extra" (ChipEvaluationType)
    }

    public class ExceptionItem
    {
        public string Title { get; set; } = "";
        public string ReasonPreview { get; set; } = "";
        public string CreatedOn { get; set; } = "";
        public string CreatedBy { get; set; } = "";
        public string ExceptionType { get; set; } = "not-assigned"; // ExceptionModal enums
    }

}
