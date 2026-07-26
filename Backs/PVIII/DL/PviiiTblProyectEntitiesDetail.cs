using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectEntitiesDetail
{
    public string? AuditModality { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int EngagementRowSequence { get; set; }

    public int EntityId { get; set; }

    public short? FiscalYear { get; set; }

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

    public int? PostalCode { get; set; }

    public string? PhoneNumber { get; set; }
}
