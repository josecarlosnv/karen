using System;
using System.Collections.Generic;

namespace DL;

public partial class EmployeeCourse
{
    public int QeId { get; set; }

    public DateOnly Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int EmployeeId { get; set; }

    public string AuditGeneral { get; set; } = null!;

    public string Irm { get; set; } = null!;

    public string Pcaob { get; set; } = null!;

    public string SoQm { get; set; } = null!;

    public string GlobalBanking { get; set; } = null!;

    public string SegurosFianzas { get; set; } = null!;

    public string Ifrs09 { get; set; } = null!;

    public string Ifrs17 { get; set; } = null!;

    public string Esg { get; set; } = null!;

    public string Ifrbaseline { get; set; } = null!;

    public string IfrbaselineFs { get; set; } = null!;

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public string? Soc { get; set; }
}
