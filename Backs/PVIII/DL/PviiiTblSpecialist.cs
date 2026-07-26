using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblSpecialist
{
    public int KeyId { get; set; }

    public string P8Id { get; set; } = null!;

    public decimal AgreedFeesAmount { get; set; }

    public bool AuditStagePreliminaryInd { get; set; }

    public bool AuditStageInterimInd { get; set; }

    public bool AuditStageFinalInd { get; set; }

    public bool IsActive { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public int? ServiceLineInChargeId { get; set; }

    public string? ServiceLineInChargeLabel { get; set; }

    public string? AuditStagePreliminaryMths { get; set; }

    public string? AuditStageInterimIndMths { get; set; }

    public string? AuditStageFinalIndMths { get; set; }

    public int? CostCenter { get; set; }

    public string ServiceLineInChargeEmail { get; set; } = null!;

    public string ServiceLineSpecialist { get; set; } = null!;

    public string AuditStageConcat { get; set; } = null!;
}
