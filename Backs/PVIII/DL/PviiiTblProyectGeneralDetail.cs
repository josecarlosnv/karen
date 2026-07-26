using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectGeneralDetail
{
    public int? EntityGroupId { get; set; }

    public string? ClientNumber { get; set; }

    public string? ClientName { get; set; }

    public int? SegmentId { get; set; }

    public bool? IsPublicEntity { get; set; }

    public bool? IsRegulatedEntity { get; set; }

    public bool? IsListedEntity { get; set; }

    public bool? IsSecAffiliate { get; set; }

    public bool? IsNonSecAffiliate { get; set; }

    public int? ReferredCountryId { get; set; }

    public bool? IsConsolidated { get; set; }

    public bool? IsReportGroup { get; set; }

    public bool? IsSignificantSecSubsidiary { get; set; }

    public string? HasSignificantPublicSubsidiariesMexico { get; set; }

    public long RecordChangeSequence { get; set; }

    public string? ReservedField01 { get; set; }

    public string? ReservedField02 { get; set; }

    public string? ReservedField03 { get; set; }

    public string? ReservedField04 { get; set; }

    public bool? IsActive { get; set; }

    public int EntityId { get; set; }

    public string? P8Id { get; set; }

    public string? NatureOfEngagementLabel { get; set; }

    public string? AuditWorkflowLabel { get; set; }

    public string? StatutoryExaminerLabel { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public string? CyCeac { get; set; }

    public string? PyCeac { get; set; }
}
