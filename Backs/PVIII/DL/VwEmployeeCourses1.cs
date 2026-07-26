using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEmployeeCourses1
{
    public string EmployeeId { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? EstatusEmployee { get; set; }

    public string? LocalJobTitle { get; set; }

    public string? CostCenterDescrip { get; set; }

    public string? ProductoDescription { get; set; }

    public string? CostCenter { get; set; }

    public DateOnly FechaInicio { get; set; }

    public DateOnly? HireDate { get; set; }

    public string? LocationName { get; set; }

    public string? AuditGeneral { get; set; }

    public string? Irm { get; set; }

    public string? Esg { get; set; }

    public string? SoQm { get; set; }

    public string? GlobalBanking { get; set; }

    public string? SegurosFianzas { get; set; }

    public string? Ifrs09 { get; set; }

    public string? Ifrs17 { get; set; }

    public string? IfrsbaselineFs { get; set; }

    public string? Ifrsbaseline { get; set; }

    public string? Pcaob { get; set; }
}
