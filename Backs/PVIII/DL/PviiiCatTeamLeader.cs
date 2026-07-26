using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatTeamLeader
{
    public int CatTeamLeaderId { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public string EmployeeEmail { get; set; } = null!;

    public string LevelLabel { get; set; } = null!;

    public string LevelCode { get; set; } = null!;

    public decimal? Fyc { get; set; }

    public int? CostCenterId { get; set; }

    public string CostCenterLabel { get; set; } = null!;

    public int? OfficeId { get; set; }

    public string OfficeLabel { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public decimal? YearsInRole { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public bool ActiveIndicator { get; set; }

    public string CurrencyCode { get; set; } = null!;

    public bool IsFirstYear { get; set; }

    public bool QprResult { get; set; }

    public bool OpenPdIndicator { get; set; }
}
