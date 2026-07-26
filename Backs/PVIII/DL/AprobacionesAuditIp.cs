using System;
using System.Collections.Generic;

namespace DL;

public partial class AprobacionesAuditIp
{
    public int Id { get; set; }

    public string? IdP8 { get; set; }

    public int? EngagementId { get; set; }

    public int? PartnerId { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? Estatus { get; set; }

    public string? Comentarios { get; set; }

    public decimal? ColumnA { get; set; }

    public string? ColumnB { get; set; }
}
