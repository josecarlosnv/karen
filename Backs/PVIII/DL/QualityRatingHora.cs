using System;
using System.Collections.Generic;

namespace DL;

public partial class QualityRatingHora
{
    public int Id { get; set; }

    public int? EmployeeId { get; set; }

    public string? FullName { get; set; }

    public string? Bu { get; set; }

    public string? Category { get; set; }

    public decimal? Hours { get; set; }

    public decimal? Impact { get; set; }

    public decimal? Waiver { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public decimal? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public decimal? HorasPropias { get; set; }

    public decimal? HorasEqcr { get; set; }

    public decimal? HorasLsqcr { get; set; }

    public decimal? OtrasHoras { get; set; }

    public string? OtrasActividades { get; set; }

    public decimal? ColumnC { get; set; }

    public decimal? ColumnD { get; set; }

    public string? ColumnE { get; set; }

    public string? ColumnF { get; set; }
}
