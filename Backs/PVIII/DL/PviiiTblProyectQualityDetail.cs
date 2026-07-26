using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectQualityDetail
{
    public bool IsPublicEntity { get; set; }

    public bool IsRegulatedEntity { get; set; }

    public bool IsListedEntity { get; set; }

    public bool? Aits { get; set; }

    public bool IsSubstantialRoleGrp { get; set; }

    public bool IsSignificantSecSubsidiary { get; set; }

    public long RecordChangeSequence { get; set; }

    public int EntityId { get; set; }

    public string P8Id { get; set; } = null!;

    public string NatureOfEngagementLabel { get; set; } = null!;

    public string AuditWorkflowLabel { get; set; } = null!;

    public string? StatutoryExaminerLabel { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public string CyCeac { get; set; } = null!;

    public string PyCeac { get; set; } = null!;

    public bool IsSecAffiliate { get; set; }

    public virtual PviiiCatRiskLevel CyCeacNavigation { get; set; } = null!;

    public virtual PviiiCatRiskLevel PyCeacNavigation { get; set; } = null!;
}
