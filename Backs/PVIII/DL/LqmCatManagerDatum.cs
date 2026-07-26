using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmCatManagerDatum
{
    public int MgrDataPk { get; set; }

    public string ManagerEmployeeId { get; set; } = null!;

    public string ManagerName { get; set; } = null!;

    public string ManagerTitle { get; set; } = null!;

    public string Practice { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public string OfficeLabel { get; set; } = null!;

    public string ManagerEmail { get; set; } = null!;

    public string Fy { get; set; } = null!;

    public string NetworkId { get; set; } = null!;

    public string? ManagerDataUniqueKey { get; set; }
}
