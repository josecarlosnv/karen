using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatApprovalLevel
{
    public int PkApprovalId { get; set; }

    public int ApprovalLevelId { get; set; }

    public string ApprovalLevelLabel { get; set; } = null!;

    public virtual ICollection<PviiiTblApprovalDetail> PviiiTblApprovalDetails { get; set; } = new List<PviiiTblApprovalDetail>();

    public virtual ICollection<PviiiTblApprovalDocumentation> PviiiTblApprovalDocumentations { get; set; } = new List<PviiiTblApprovalDocumentation>();
}
