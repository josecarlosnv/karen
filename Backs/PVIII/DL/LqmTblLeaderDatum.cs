using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmTblLeaderDatum
{
    public int LeaderDataPk { get; set; }

    public string LeaderEmployeeId { get; set; } = null!;

    public string LeaderName { get; set; } = null!;

    public string LeaderTitle { get; set; } = null!;

    public string Practice { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public string OfficeLabel { get; set; } = null!;

    public string LeaderEmail { get; set; } = null!;

    public bool IsHofA { get; set; }

    public string? Fy { get; set; }

    public bool IsBupic { get; set; }

    public string? LeaderDataUniqueKey { get; set; }

    public string? NetworkId { get; set; }

    public string? AllowedOffices { get; set; }
}
