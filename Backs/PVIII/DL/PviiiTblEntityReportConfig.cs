using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblEntityReportConfig
{
    public int KeyId { get; set; }

    public string P8Id { get; set; } = null!;

    public string ReportType { get; set; } = null!;

    public DateOnly? OpinionDate { get; set; }

    public string? ReviewerTypeLabel { get; set; }

    public decimal? AuditFeeAmount { get; set; }

    public decimal? ReportFeeAmount { get; set; }

    public decimal? TaxFeeAmount { get; set; }

    public bool IsActive { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string ClientNumber { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public decimal? TotalFeeAmount { get; set; }

    public virtual PviiiCatReportType ReportTypeNavigation { get; set; } = null!;

    public virtual PviiiCatReviewerType? ReviewerTypeLabelNavigation { get; set; }
}
