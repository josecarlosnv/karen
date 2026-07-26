using System;
using System.Collections.Generic;

namespace DL;

public partial class HorasExtraAudit
{
    public int HorasExtrasId { get; set; }

    public string Client { get; set; } = null!;

    public string Engagement { get; set; } = null!;

    public string EmployeeName { get; set; } = null!;

    public string EmployeeNumber { get; set; } = null!;

    public string EmployeeStaffLevel { get; set; } = null!;

    public string EmployeeStaffLevelDesc { get; set; } = null!;

    public string WorkDate { get; set; } = null!;

    public decimal ChargeableHours { get; set; }

    public string ActivityCode { get; set; } = null!;

    public string? ActivityDescription { get; set; }
}
