using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectReviewDetail
{
    public int P8ReviewPk { get; set; }

    public string P8Id { get; set; } = null!;

    public bool? IsHighRisk { get; set; }

    public bool? IsFinancialRisk { get; set; }

    public bool? IsValidated { get; set; }

    public bool? IsActive { get; set; }

    public long? RecordChangeSequence { get; set; }

    public DateTime? Create { get; set; }

    public string CreateBy { get; set; } = null!;

    public int ApprovalLevelId { get; set; }
}
