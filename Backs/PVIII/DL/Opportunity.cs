using System;
using System.Collections.Generic;

namespace DL;

public partial class Opportunity
{
    public long OpportunityId { get; set; }

    public string? LegacyId { get; set; }

    public long PrimaryEntityId { get; set; }

    public short LineOfBusinessId { get; set; }

    public string IndustrySectorId { get; set; } = null!;

    public string SicCodeId { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly? ExpectedDecisionDate { get; set; }

    public DateOnly? EngagementStartDate { get; set; }

    public DateOnly? EngagementEndDate { get; set; }

    public long ManagerId { get; set; }

    public long PartnerId { get; set; }

    public int? ProbabilityOfSuccessId { get; set; }

    public string AccessibilityId { get; set; } = null!;

    public decimal? ExpectedRealizationRate { get; set; }

    public int OfficeId { get; set; }

    public double ProfitCenterId { get; set; }

    public string BusinessAreaId { get; set; } = null!;

    public string ContractTypeId { get; set; } = null!;

    public bool? CometitiveBid { get; set; }

    public decimal Expense { get; set; }

    public string? SentinelRequestId { get; set; }

    public string? SentinelApprovalNo { get; set; }

    public DateOnly? SanactivationDate { get; set; }

    public DateOnly? LocalSanexpiryDate { get; set; }

    public string? SentinelRequestStatus { get; set; }

    public string? RiskExceptionType { get; set; }

    public string? RiskExceptionReason { get; set; }

    public string? CompetitiorLostTo { get; set; }

    public bool EngagementLetterSignedByClient { get; set; }

    public DateOnly? CloseDate { get; set; }

    public DateOnly ExpectedDecisionDate2 { get; set; }

    public bool? PotentialForRecurring { get; set; }

    public bool? DebriefCompleted { get; set; }

    public string Outcome { get; set; } = null!;

    public string Phase { get; set; } = null!;

    public string CreatedBy { get; set; } = null!;

    public DateOnly CreatedOn { get; set; }

    public string ChangedBy { get; set; } = null!;

    public DateOnly LastChangedDate { get; set; }

    public int? FiscalYear { get; set; }
}
