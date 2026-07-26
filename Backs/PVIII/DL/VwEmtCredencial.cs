using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEmtCredencial
{
    public int EmtcredentPk { get; set; }

    public int EmployeeId { get; set; }

    public string? FullName { get; set; }

    public string? LocalJobLevelName { get; set; }

    public DateOnly? SeniorityDate { get; set; }

    public string? Bu { get; set; }

    public string? LocationName { get; set; }

    public bool? UnderstandingResponsabilities { get; set; }

    public decimal Aicpa { get; set; }

    public decimal Pcaob { get; set; }

    public decimal Icfr { get; set; }

    public decimal Sec { get; set; }

    public decimal Ifrs { get; set; }

    public decimal Usgaa { get; set; }

    public string? SpecificTraining { get; set; }

    public string? IndutryExperience { get; set; }

    public string? Qualification1 { get; set; }

    public string? Qualification2 { get; set; }

    public string? Qualification3 { get; set; }

    public string NcEvaluation { get; set; } = null!;

    public string? PcaobInspectionResults { get; set; }

    public int EmtindepenceId { get; set; }

    public string? EmtindepenceDesc { get; set; }

    public int? EventNumber { get; set; }

    public bool? Deputy { get; set; }

    public string? DeputyEmailAddressBusiness { get; set; }

    public string? DeputyComment { get; set; }

    public DateTime? DeputyDate { get; set; }

    public bool? Cppp { get; set; }

    public string? CpppEmailAddressBusiness { get; set; }

    public string? CpppComment { get; set; }

    public DateTime? CpppDate { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
