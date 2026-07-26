using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssignmentsValidationCriterion
{
    public int EmtAssiValiPk { get; set; }

    public string KeyEmt { get; set; } = null!;

    public string? EmtSsrequiIdConcat { get; set; }

    public bool? HasThreats { get; set; }

    public string? HasThreatsDesc { get; set; }

    public bool? NcEvaluation { get; set; }

    public bool? PcaobResultsImpact { get; set; }

    public bool? NoChangesNature { get; set; }

    public bool? NoChangesLegalRegulatory { get; set; }

    public bool? NoChangesIndustry { get; set; }

    public bool? NoChangesComplexity { get; set; }

    public bool? SufficientTime { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? NoResponsibility { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
