using System;
using System.Collections.Generic;

namespace DL;

public partial class VwCptHubreport
{
    public long? Incremental { get; set; }

    public int PkCptProject { get; set; }

    public string IdForm { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int IdBu { get; set; }

    public string? DescriptionBu { get; set; }

    public int IdOffice { get; set; }

    public string? DescriptionOffice { get; set; }

    public int? IdRecurring { get; set; }

    public string? DescriptionRecurring { get; set; }

    public int? TotalFee { get; set; }

    public int? LeadPartnerId { get; set; }

    public string? LeadPartnerName { get; set; }

    public string? LeadPartnerEmail { get; set; }

    public string? LeadPartnerLevel { get; set; }

    public int? SecondReviewerId { get; set; }

    public string? SecondReviewerName { get; set; }

    public string? SecondReviewerEmail { get; set; }

    public string? SecondReviewerLevel { get; set; }

    public int? ManagerId { get; set; }

    public string? ManagerName { get; set; }

    public string? ManagerEmail { get; set; }

    public string? ManagerLevel { get; set; }

    public decimal? Valuation { get; set; }

    public int? TotalHours { get; set; }

    public int? TotalFeexHour { get; set; }

    public int? IdStatus { get; set; }

    public int? PkCptHubre { get; set; }

    public decimal? IdOportunity { get; set; }

    public int? IdWorkStatus { get; set; }

    public string? Comments { get; set; }

    public DateOnly? CloseDate { get; set; }

    public DateTime? CreatedProp { get; set; }

    public string? CreatedByProp { get; set; }

    public DateTime? CreatedHub { get; set; }

    public string? CreatedBy { get; set; }

    public string? CreatedName { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? IdRegistered { get; set; }
}
