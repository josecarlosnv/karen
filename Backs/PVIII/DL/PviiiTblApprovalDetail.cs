using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblApprovalDetail
{
    public int P8approvalPk { get; set; }

    public string P8Id { get; set; } = null!;

    public int ApprovalLevelId { get; set; }

    public string? StandardCommentsDocumentation { get; set; }

    public bool ApprovalActiveStatus { get; set; }

    public bool ApprovalIndicator { get; set; }

    public string ApproverLevel { get; set; } = null!;

    public string? ProjectRiskLevel { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public int ApproverId { get; set; }

    public virtual PviiiCatApprovalLevel ApprovalLevel { get; set; } = null!;
}
