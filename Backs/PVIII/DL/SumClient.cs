using System;
using System.Collections.Generic;

namespace DL;

public partial class SumClient
{
    public int ClientSummaryId { get; set; }

    public int ClientNumber { get; set; }

    public string? ClientName { get; set; }

    public string? EntityType { get; set; }

    public int? FiscalYear { get; set; }

    public int? BusinessUnitId { get; set; }

    public string? BusinessUnit { get; set; }

    public string? OfficeId { get; set; }

    public string? Office { get; set; }

    public string? RevenueType { get; set; }

    public string? TeamRoleTypeId { get; set; }

    public int? MemberEmployeeId { get; set; }

    public string? MemberName { get; set; }

    public int? ApprovalId { get; set; }

    public int? HeadOfAuditStatus { get; set; }

    public string? P8Id { get; set; }

    public long? RecordChangeSequence { get; set; }
}
