using System;
using System.Collections.Generic;

namespace DL;

public partial class VwPviiiSubSpecialistInformation
{
    public string P8Id { get; set; } = null!;

    public int P8StatusId { get; set; }

    public string ClientName { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public string? CurrentEngagementPartnerName { get; set; }

    public string CurrentEngagementPartnerEmail { get; set; } = null!;

    public string? ProjectDescription { get; set; }

    public string? OfficeLabel { get; set; }

    public decimal AgreedFeesAmount { get; set; }

    public string? ServiceLineInChargeLabel { get; set; }

    public string ServiceLineInChargeEmail { get; set; } = null!;

    public string ServiceLineSpecialist { get; set; } = null!;

    public string AuditStagesIndMths { get; set; } = null!;

    public string? AuditingStandards { get; set; }

    public string? AccountingFrameworks { get; set; }

    public string? FunctionLabel { get; set; }

    public int? CostCenter { get; set; }

    public string? SpecialistServiceLineLabel { get; set; }

    public decimal? Valuation { get; set; }
}
