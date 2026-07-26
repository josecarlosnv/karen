using System;
using System.Collections.Generic;

namespace DL;

public partial class QualityRanking
{
    public int Id { get; set; }

    public int? EmployeeId { get; set; }

    public string? QprLeap { get; set; }

    public decimal? QprLeapImpact { get; set; }

    public string? QprEqcr { get; set; }

    public decimal? QprEqcrImpact { get; set; }

    public int? Restatements { get; set; }

    public decimal? RestatementsImpact { get; set; }

    public int? ExternalRegulatoryInspections { get; set; }

    public decimal? ExternalRegulatoryInspectionsImpact { get; set; }

    public decimal? TimelyCeacsApprovals { get; set; }

    public decimal? TimelyCeacsApprovalsImpact { get; set; }

    public int? Infringements { get; set; }

    public decimal? InfringementsImpact { get; set; }

    public int? CloseOut { get; set; }

    public decimal? CloseOutImpact { get; set; }

    public int? ConfirmationCompliance { get; set; }

    public decimal? ConfirmationComplianceImpact { get; set; }

    public int? IndependenceAndIntegrityTraining { get; set; }

    public decimal? IndependenceAndIntegrityTrainingImpact { get; set; }

    public decimal? TrainingGlms { get; set; }

    public decimal? TrainingGlmsImpact { get; set; }

    public int? ConsistentConduct { get; set; }

    public decimal? ConsistentConductImpact { get; set; }

    public string? RoleProfile { get; set; }

    public decimal? RoleProfileImpact { get; set; }

    public string? CarteraClientes { get; set; }

    public decimal? CarteraClientesImpact { get; set; }

    public decimal? SupervisaTrabajo { get; set; }

    public decimal? SupervisaTrabajoImpact { get; set; }

    public string? Reactivo12 { get; set; }

    public decimal? Reactivo12Impact { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public decimal? ColumnA { get; set; }

    public decimal? ColumnB { get; set; }

    public decimal? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string? ColumnE { get; set; }

    public string? ColumnF { get; set; }

    public string? ComentarioAdicional { get; set; }

    public decimal? ColumnG { get; set; }

    public decimal? ColumnH { get; set; }

    public string? ColumnI { get; set; }

    public string? ColumnJ { get; set; }

    public string? Comentarios { get; set; }

    public string? Reactivo1 { get; set; }

    public string? Reactivo2 { get; set; }

    public int? Reactivo3 { get; set; }

    public int? Reactivo4 { get; set; }
}
