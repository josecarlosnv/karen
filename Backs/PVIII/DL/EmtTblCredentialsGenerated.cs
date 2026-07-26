using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblCredentialsGenerated
{
    public int EmtCredentGenPk { get; set; }

    public int? EmtCredentPk { get; set; }

    public long EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string? EmailAddressBusiness { get; set; }

    public bool IsAssistant { get; set; }

    public string LocalJobLevelName { get; set; } = null!;

    public bool IsFirmMember { get; set; }

    public decimal? YearsInRole { get; set; }

    public string? Bu { get; set; }

    public string? LocationName { get; set; }

    public bool? UnderstandingResponsabilities { get; set; }

    public decimal? Aicpa { get; set; }

    public decimal? Pcaob { get; set; }

    public decimal? Icfr { get; set; }

    public decimal? Sec { get; set; }

    public decimal? Ifrs { get; set; }

    public decimal? Usgaap { get; set; }

    public string? SpecificTraining { get; set; }

    public string? IndutryExperience { get; set; }

    public string? Qpr1 { get; set; }

    public string? Qpr2 { get; set; }

    public string? Qpr3 { get; set; }

    public string? NcEvaluation { get; set; }

    public string? PcaobInspectionResults { get; set; }

    public string? IndepenceDesc { get; set; }

    public int? Deputy { get; set; }

    public int? Cppp { get; set; }

    public string? DeputyEmailAddressBusiness { get; set; }

    public string? CpppEmailAddressBusiness { get; set; }

    public string? DeputyComment { get; set; }

    public string? CpppComment { get; set; }

    public bool? ReadyToApprove { get; set; }

    public int StatusId { get; set; }

    public string StatusLabel { get; set; } = null!;

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }
}
