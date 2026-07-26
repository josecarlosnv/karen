using System;
using System.Collections.Generic;

namespace DL;

public partial class LogErrorBi
{
    public string? ErrorNumber { get; set; }

    public string? ErrorSeverity { get; set; }

    public string? ErrorState { get; set; }

    public string? ErrorLine { get; set; }

    public string? ErrorMessage { get; set; }

    public DateTime? Date { get; set; }

    public string? Step { get; set; }
}
