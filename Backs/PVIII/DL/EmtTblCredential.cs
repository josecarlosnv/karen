using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblCredential
{
    public int EmtCredentPk { get; set; }

    public long EmployeeId { get; set; }

    public bool? IsFirmMember { get; set; }

    public bool? IsAssistant { get; set; }

    public string? SpecificTraining { get; set; }

    public string? IndutryExperience { get; set; }

    public string? NcEvaluation { get; set; }

    public string? PcaobInspectionResults { get; set; }

    public string? IndepenceDesc { get; set; }

    public bool? UnderstandingResponsabilities { get; set; }

    public bool? ReadyToApprove { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
