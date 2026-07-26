using System;
using System.Collections.Generic;

namespace DL;

public partial class TblOpenPdresult
{
    public int OpenPdresId { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public int? OpenPdIndicator { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateOnly CreatedDate { get; set; }

    public int P8FiscalYearLabel { get; set; }

    public string LocalJobLevelName { get; set; } = null!;
}
