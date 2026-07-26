using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectDetail
{
    public string? AuditModality { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int EngagementRowSequence { get; set; }

    public int? EntityId { get; set; }

    public int? AuditFiscalYear { get; set; }

    public bool? IsP8active { get; set; }

    public Guid P8Id { get; set; }

    public string? ProjectDescription { get; set; }

    public long RecordChangeSequence { get; set; }

    public string? ReservedField01 { get; set; }

    public string? ReservedField02 { get; set; }

    public string? RevenueType { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public string? OfficeLabel { get; set; }

    public string? AddressLine { get; set; }

    public string? PostalCode { get; set; }

    public string? PhoneNumber { get; set; }

    public bool ReportGroupAuditor { get; set; }

    public bool IsConsolidated { get; set; }

    public virtual PviiiCatAuditFiscalYear? AuditFiscalYearNavigation { get; set; }

    public virtual PviiiCatOffice? OfficeLabelNavigation { get; set; }
}
