using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectValuationDetail
{
    public int P8ValuationPk { get; set; }

    public string P8Id { get; set; } = null!;

    public decimal? AuditRevenue { get; set; }

    public decimal? ReportRevenue { get; set; }

    public decimal? TaxRevenue { get; set; }

    public decimal? TotalProposedRevenue { get; set; }

    public decimal? TecnologyRecoveryFeee { get; set; }

    public decimal? ProposedRevenuePlusTecnologyFee { get; set; }

    public decimal StandardAuditHours { get; set; }

    public decimal StandardAuditRevenue { get; set; }

    public decimal? ImpulsaHours { get; set; }

    public decimal? ImpulsaRevenue { get; set; }

    public decimal? SpecialistsRevenue { get; set; }

    public decimal? GrossAuditRevenue { get; set; }

    public decimal? Expenses { get; set; }

    public decimal? NetAuditRevenue { get; set; }

    public decimal? Valuation { get; set; }

    public bool? IsValidated { get; set; }

    public bool? IsActive { get; set; }

    public long? RecordChangeSequence { get; set; }

    public DateTime? Create { get; set; }

    public string CreateBy { get; set; } = null!;

    public decimal? AverageAuditFee { get; set; }
}
