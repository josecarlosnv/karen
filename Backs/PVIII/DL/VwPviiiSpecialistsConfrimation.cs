using System;
using System.Collections.Generic;

namespace DL;

public partial class VwPviiiSpecialistsConfrimation
{
    public string P8Id { get; set; } = null!;

    public int? CostCenter { get; set; }

    public int P8StatusId { get; set; }

    public string ClientName { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public string? CurrentEngagementPartnerName { get; set; }

    public string CurrentEngagementPartnerEmail { get; set; } = null!;

    public string? ProjectDescription { get; set; }

    public string? OfficeLabel { get; set; }

    public string? ConfirmationComments { get; set; }

    public decimal? AgreedFeesAmount { get; set; }

    public decimal? AgreedFeesSpecialist { get; set; }

    public decimal? FeePercentageDiff { get; set; }

    public string? ConfirmationIndicator { get; set; }

    public int? ConfirmationIndicatorId { get; set; }

    public int ExistsConfirm { get; set; }

    public int ExistsBreakdown { get; set; }

    public string LvlStatusEsp { get; set; } = null!;

    public int LvlStatusEspId { get; set; }

    public string? ServiceLineInChargeLabel { get; set; }

    public string? ServiceLineInChargeEmail { get; set; }

    public string? ServiceLineSpecialist { get; set; }

    public string? AuditStagePreliminaryMths { get; set; }

    public string? AuditStageInterimIndMths { get; set; }

    public string? AuditStageFinalIndMths { get; set; }

    public string? AuditingStandards { get; set; }

    public string? AccountingFrameworks { get; set; }

    public string? FunctionLabel { get; set; }

    public string? SpecialistServiceLineLabel { get; set; }

    public decimal? PartnerDirectorFee { get; set; }

    public decimal? SeniorManagerManagerFee { get; set; }

    public decimal? ProfessionalStaffFee { get; set; }

    public decimal? Valuation { get; set; }
}
