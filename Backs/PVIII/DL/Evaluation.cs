using System;
using System.Collections.Generic;

namespace DL;

public partial class Evaluation
{
    public int EvaluationId { get; set; }

    public string EmployeeId { get; set; } = null!;

    public string? EvaluatedEmail { get; set; }

    public string? BusinessUnit { get; set; }

    public string? Office { get; set; }

    public string? EmployeeCategory { get; set; }

    public int FiscalYear { get; set; }

    public string? Period { get; set; }

    public string? PerformanceManagerId { get; set; }

    public string? PerformanceManagerEmail { get; set; }

    public string? CommitteeOwnerId { get; set; }

    public string? CommitteeOwnerEmail { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public byte[] RowVersion { get; set; } = null!;

    public virtual ICollection<EvaluationStep> EvaluationSteps { get; set; } = new List<EvaluationStep>();
}
