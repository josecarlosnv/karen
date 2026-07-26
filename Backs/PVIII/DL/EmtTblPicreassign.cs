using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblPicreassign
{
    public int EmtPicreassiPk { get; set; }

    public string KeyEmt { get; set; } = null!;

    public int EmployeeId { get; set; }

    public string? Comments { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;
}
