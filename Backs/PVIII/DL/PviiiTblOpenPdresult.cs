using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblOpenPdresult
{
    public int OpenPdresId { get; set; }

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public int? OpenPdIndicator { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }
}
