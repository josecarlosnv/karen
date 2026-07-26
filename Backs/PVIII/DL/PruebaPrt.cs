using System;
using System.Collections.Generic;

namespace DL;

public partial class PruebaPrt
{
    public int PprtId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedByUser { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ModifyByUser { get; set; }

    public string EmployeeId { get; set; } = null!;

    public int FiscalYear { get; set; }

    public int NonClientFacingHours { get; set; }

    public string? Activities { get; set; }

    public bool Vigencia { get; set; }

    public string EmailAddressBusiness { get; set; } = null!;

    public string? Comments { get; set; }

    public bool Waiver { get; set; }
}
