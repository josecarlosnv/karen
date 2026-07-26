using System;
using System.Collections.Generic;

namespace DL;

public partial class Horas2doRevisor
{
    public int RevId { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? CreatedByUser { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ModifyByUser { get; set; }

    public string EmployeeId { get; set; } = null!;

    public int FiscalYear { get; set; }

    public int ReviewerTypeId { get; set; }

    public string Client { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int ReviewerHours { get; set; }

    public string ReviewerMail { get; set; } = null!;

    public bool Vigencia { get; set; }

    public virtual DimFiscalYear FiscalYearNavigation { get; set; } = null!;

    public virtual TipoRev ReviewerType { get; set; } = null!;
}
