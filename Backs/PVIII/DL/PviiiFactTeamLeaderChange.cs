using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiFactTeamLeaderChange
{
    public int DimLevelId { get; set; }

    public string P8Id { get; set; } = null!;

    public int? EmployeeId { get; set; }

    public string LevelId { get; set; } = null!;

    public string LocalJobLevelName { get; set; } = null!;

    public string? CreatedByUserEmail { get; set; }

    public long RecordChangeSequence { get; set; }

    public DateTime CreatedDateTime { get; set; }

    public decimal? EmployeeRate { get; set; }

    public string? CurrencyCode { get; set; }

    public int EngagementRoleId { get; set; }

    public virtual PviiiCatCurrency? CurrencyCodeNavigation { get; set; }

    public virtual PviiiDimLevel LocalJobLevelNameNavigation { get; set; } = null!;
}
