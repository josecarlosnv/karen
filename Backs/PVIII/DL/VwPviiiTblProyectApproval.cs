using System;
using System.Collections.Generic;

namespace DL;

public partial class VwPviiiTblProyectApproval
{
    public string IdP8 { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int BusinessUnitId { get; set; }

    public string BusinessUnitIdLabel { get; set; } = null!;

    public int CurrentEngagementPartnerId { get; set; }

    public string? CurrentEngagementPartnerName { get; set; }

    public string CurrentEngagementPartnerEmail { get; set; } = null!;

    public bool? CurrentEngagementPartnerQpr { get; set; }

    public decimal? CurrentEngagementPartnerYears { get; set; }

    public bool? CurrentEngagementPartnerOpen { get; set; }

    public int CurrentEngagementManagerId { get; set; }

    public string? CurrentEngagementManagerName { get; set; }

    public bool? CurrentEngagementManagerQpr { get; set; }

    public decimal? CurrentEngagementManagerYears { get; set; }

    public bool? CurrentEngagementManagerOpen { get; set; }

    public int P8revenueTypeId { get; set; }

    public string P8revenueTypeLabel { get; set; } = null!;

    public int P8FiscalYearLabel { get; set; }

    public decimal StandardAuditHours { get; set; }

    public decimal? NetAuditRevenue { get; set; }

    public decimal? Valuation { get; set; }

    public decimal? AverageAuditFee { get; set; }

    public bool? IsHighRisk { get; set; }

    public bool? IsFinancialRisk { get; set; }

    public int? LeapValidation { get; set; }

    public string? LeapCompetenceDocumentation { get; set; }

    public string? LeapCapabilitiesDocumentation { get; set; }

    public string? LeapObjectivityDocumentation { get; set; }

    public string? LeapTimeDocumentation { get; set; }

    public string? LeapFinancialDocumentation { get; set; }

    public int? Picvalidation { get; set; }

    public string? PiccompetenceDocumentation { get; set; }

    public string? PiccapabilitiesDocumentation { get; set; }

    public string? PicobjectivityDocumentation { get; set; }

    public string? PictimeDocumentation { get; set; }

    public string? PicfinancialDocumentation { get; set; }

    public bool? HofAvalidation { get; set; }

    public string? HofAcompetenceDocumentation { get; set; }

    public string? HofAcapabilitiesDocumentation { get; set; }

    public string? HofAobjectivityDocumentation { get; set; }

    public string? HofAtimeDocumentation { get; set; }

    public string? HofAfinancialDocumentation { get; set; }

    public bool? Buppvalidation { get; set; }

    public string? BuppcompetenceDocumentation { get; set; }

    public string? BuppcapabilitiesDocumentation { get; set; }

    public string? BuppobjectivityDocumentation { get; set; }

    public string? BupptimeDocumentation { get; set; }

    public string? BuppfinancialDocumentation { get; set; }

    public string ApproveLvlNeededDescription { get; set; } = null!;

    public int ApproveLvlNeededId { get; set; }

    public string? StatusApprovDescription { get; set; }

    public int? StatusApprovId { get; set; }

    public DateTime? CreateVal { get; set; }

    public DateTime? CreateRev { get; set; }

    public DateTime? CreateApp { get; set; }

    public string CreateByRev { get; set; } = null!;
}
