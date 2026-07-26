using System;
using System.Collections.Generic;

namespace DL;

public partial class WlTblEntidadesSep
{
    public string EntityId { get; set; } = null!;

    public string EntityClient { get; set; } = null!;

    public string ESic { get; set; } = null!;

    public int? TipoInfld { get; set; }

    public DateTime? Fdo { get; set; }

    public decimal? HonAudit { get; set; }

    public decimal? HonReport { get; set; }

    public decimal? HonFisc { get; set; }

    public int? TipoRevId { get; set; }

    public decimal TotalHonEnt { get; set; }

    public int IdPviiiEnt { get; set; }

    public string CreatedBy { get; set; } = null!;

    public string? ModifiedBy { get; set; }

    public string EntityGroupId { get; set; } = null!;

    public DateTime? Created { get; set; }

    public DateTime? Modified { get; set; }

    public string IdP8 { get; set; } = null!;

    public bool? Vigencia { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string? Srtype { get; set; }

    public int? Srid { get; set; }

    public string? Srname { get; set; }

    public int? Srfree { get; set; }

    public string? AuditRules { get; set; }

    public string? FinancialRules { get; set; }

    public string? Nature { get; set; }

    public int? ComissarId { get; set; }

    public string? ComissarName { get; set; }

    public string? TipoRevTexto { get; set; }

    public int? EvenntNumber { get; set; }
}
