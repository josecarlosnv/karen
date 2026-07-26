using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblProjectSpec
{
    public int PkCptProject { get; set; }

    public string IdForm { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int IdBu { get; set; }

    public int IdOffice { get; set; }

    public int IdFyaudit { get; set; }

    public bool IsAuditPreviousYear { get; set; }

    public string? IsAuditPreviousYearDesc { get; set; }

    public int? IdRecurring { get; set; }

    public int IdContableRule { get; set; }

    public int IdAuditRule { get; set; }

    public bool IsPublicClient { get; set; }

    public bool IsRegulatedClient { get; set; }

    public DateOnly InformDate { get; set; }

    public string? OtherAuditorNamePy { get; set; }

    public int? IdOpinionTypePy { get; set; }

    public int? Fy { get; set; }

    public bool? IsLost { get; set; }

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string? ReasonOpinionTypePy { get; set; }

    public virtual CptDimAuditRule IdAuditRuleNavigation { get; set; } = null!;

    public virtual CptDimBu IdBuNavigation { get; set; } = null!;

    public virtual CptDimContableRule IdContableRuleNavigation { get; set; } = null!;

    public virtual CptDimFyaudit IdFyauditNavigation { get; set; } = null!;

    public virtual CptDimOffice IdOfficeNavigation { get; set; } = null!;

    public virtual CptDimOpinionTypePy? IdOpinionTypePyNavigation { get; set; }

    public virtual CptDimRecurring? IdRecurringNavigation { get; set; }
}
