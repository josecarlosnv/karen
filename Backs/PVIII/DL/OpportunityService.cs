using System;
using System.Collections.Generic;

namespace DL;

public partial class OpportunityService
{
    public int OpportunityServiceId { get; set; }

    public long OpportunityId { get; set; }

    public string ServiceTypeId { get; set; } = null!;

    public long ManagerId { get; set; }

    public long PartnerId { get; set; }

    public double ProfitCenterId { get; set; }

    public string BusinessAreaId { get; set; } = null!;

    public string? SentinelServiceType { get; set; }

    public string? TypeOfWork { get; set; }

    public string? TypeOfWorkDescription { get; set; }

    public string? CurrentFiscalYearFee { get; set; }

    public string? Currency { get; set; }

    public decimal TotalFees { get; set; }
}
