namespace ML.Models;

public class StatusReminderFilterVM
{
    // Filtros (coinciden con tu UI)
    public string? Search { get; set; }
    public string EvaluatorStatus { get; set; } = "all";  // "all"|"pending"|"in-progress"|"complete"
    public string EmployeeStatus { get; set; } = "all";   // "all"|"pending"|"in-progress"|"complete" 
    public string EvaluationType { get; set; } = "all";   // "all"|"ordinary"|"extra"

    // Ordenamiento
    public string SortField { get; set; } = "employeeName"; // employeeName|projectClient|evaluatorName|evaluatorStatus|evaluationType|hours|employeeStatus
    public string SortDirection { get; set; } = "asc";      // asc|desc|none

    // Resultado
    public List<StatusReminderRow> Results { get; set; } = new();

    // Metadatos
    public bool HasAccess { get; set; } = false;
    public List<string> Warnings { get; set; } = new();
}

public class StatusReminderRow
{
    public string Id { get; set; } = "";              // usamos Key_Report como Id uniforme
    public string KeyReport { get; set; } = "";
    public string EmployeeName { get; set; } = "";
    public string ProjectClient { get; set; } = "";
    public string EvaluatorName { get; set; } = "";

    // Estados normalizados a tu UI
    public string EvaluatorStatus { get; set; } = "pending";    // pending|in-progress|complete
    public string EmployeeStatus { get; set; } = "pending";     // pending|in-progress|complete

    public string EvaluationType { get; set; } = "ordinary";    // ordinary|extra
    public int Hours { get; set; }                              // Total_Hours
}

// Reminders
public record ReminderRequest(string KeyReport, string? Note);

// Exceptions (según tu tabla scorefy_tbl_Exceptions y la vista)
public class ExceptionItemVM
{
    public int Id { get; set; }                  // PK_scorExceptions
    public string KeyReport { get; set; } = "";
    public bool IsException { get; set; }
    public string? Reason { get; set; }
    public int? EventNumber { get; set; }
    public string EmployeeName { get; set; } = "";
    public string ProjectClient { get; set; } = "";
    public string? EvaluatorName { get; set; }

    public string? ExceptionType { get; set; } //para actualizar la excepcion
}

// Create/Update exception

//codigo Mich
//public record ExceptionCreateVM(string KeyReport, string ExceptionType, string Reason);
// fin codigo Mich
// codigo Isaac
public record ExceptionCreateVM(
    string KeyReport,
    string Reason,
    bool IsException,
    int FY,
    string ExceptionType
);
// Fin codigo Isaac
public record ExceptionUpdateVM(int Id, string? ExceptionType, string Reason, bool IsException);