using System;
using System.Collections.Generic;

namespace DL;

public partial class VwCptDashboard
{
    public string? LeadPartnerName { get; set; }

    public string? DescriptionBu { get; set; }

    public int IdBu { get; set; }

    public string? DescriptionOffice { get; set; }

    public int IdOffice { get; set; }

    public string ClientName { get; set; } = null!;

    public int? Year { get; set; }

    public int? Mes { get; set; }

    public int? MesFiscal { get; set; }

    public string? MesText { get; set; }

    public int? TotalHoras { get; set; }

    public int? TotalFee { get; set; }

    public decimal? TotalFeeByMillioner { get; set; }

    public int? TotalFeexHour { get; set; }

    public int? IdStatus { get; set; }

    public string? DescriptionStatus { get; set; }

    public int? IdComplete { get; set; }

    public DateOnly? CreatedDate { get; set; }

    public int Created { get; set; }
}
