using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiFactEngagement
{
    public string? AuditFlowType { get; set; }

    public string? AuditModality { get; set; }

    public DateOnly? AuditOpinionDate { get; set; }

    public int? AuditReportTypeId { get; set; }

    public int? BusinessUnitId { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public short? CurrentFiscalYear { get; set; }

    public int EngagementRowSequence { get; set; }

    public int EntityId { get; set; }

    public short? FiscalYear { get; set; }

    public bool? IsP8active { get; set; }

    public bool? IsReassigned { get; set; }

    public string? LegacyInstalledResourceCapacity { get; set; }

    public int? LostClientP8id { get; set; }

    public int? OfficeId { get; set; }

    public int? P8EngagementId { get; set; }

    public Guid P8Id { get; set; }

    public int? PriorFiscalYearP8id { get; set; }

    public decimal? PriorFiscalYearTotalFeeAmount { get; set; }

    public decimal? PriorFiscalYearTotalHours { get; set; }

    public string? ProjectDescription { get; set; }

    public long RecordChangeSequence { get; set; }

    public string? ReservedField01 { get; set; }

    public string? ReservedField02 { get; set; }

    public string? RevenueType { get; set; }

    public int? ReviewerTypeId { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }
}
