using System;
using System.Collections.Generic;

namespace DL;

public partial class OvertimeApproval
{
    public string? PartnerNumber { get; set; }

    public string? PartnerName { get; set; }

    public long? ClientNumber { get; set; }

    public string? ApproverResponse { get; set; }

    public int? FiscalYearPeriod { get; set; }

    public string? FrequencyType { get; set; }

    public string MergeId { get; set; } = null!;

    public bool? Validity { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int IdDb { get; set; }
}
