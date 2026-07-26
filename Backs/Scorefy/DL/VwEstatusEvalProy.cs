using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEstatusEvalProy
{
    public int? PkScorExceptions { get; set; }

    public bool? IsException { get; set; }

    public string? ReasonException { get; set; }

    public int? EventNumber { get; set; }

    public long ClientId { get; set; }

    public string ClientName { get; set; } = null!;

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public string EmailAddressBusiness { get; set; } = null!;

    public string LocalJobLevelName { get; set; } = null!;

    public string? Role { get; set; }

    public int? EvaluatorId { get; set; }

    public string? EvaluatorName { get; set; }

    public string? EvaluatorEmail { get; set; }

    public string? Bu { get; set; }

    public string? LocationName { get; set; }

    public decimal? TotalHours { get; set; }

    public decimal? ChargeableHours { get; set; }

    public string? EstatusEvaluado { get; set; }

    public string? EstatusEvaluador { get; set; }

    public int? GeneratedType { get; set; }

    public int? CutOff { get; set; }

    public string KeyReport { get; set; } = null!;
}
