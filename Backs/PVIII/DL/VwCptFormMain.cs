using System;
using System.Collections.Generic;

namespace DL;

public partial class VwCptFormMain
{
    public int PkCptProject { get; set; }

    public string IdForm { get; set; } = null!;

    public string ClientName { get; set; } = null!;

    public int IdBu { get; set; }

    public string? DescriptionBu { get; set; }

    public int IdOffice { get; set; }

    public string? DescriptionOffice { get; set; }

    public int IdFyaudit { get; set; }

    public int? DescriptionFyaudit { get; set; }

    public bool IsAuditPreviousYear { get; set; }

    public string? IsAuditPreviousYearDesc { get; set; }

    public int? IdRecurring { get; set; }

    public string? DescriptionRecurring { get; set; }

    public int IdContableRule { get; set; }

    public string? DescriptionContableRule { get; set; }

    public int IdAuditRule { get; set; }

    public string? DescriptionAuditRule { get; set; }

    public bool IsPublicClient { get; set; }

    public bool IsRegulatedClient { get; set; }

    public DateOnly InformDate { get; set; }

    public string? OtherAuditorNamePy { get; set; }

    public int? IdOpinionTypePy { get; set; }

    public string? ReasonOpinionTypePy { get; set; }

    public string? DescriptionOpinionTypePy { get; set; }

    public int? PkCptFinMet { get; set; }

    public int? AuditFee { get; set; }

    public int? AuditNumDeliverables { get; set; }

    public int? AuditAvgxDeliverables { get; set; }

    public int? AuditHours { get; set; }

    public int? AuditAvgxHours { get; set; }

    public bool? IsFiscalMandatory { get; set; }

    public int? FiscalFee { get; set; }

    public int? FiscalNumDeliverables { get; set; }

    public int? FiscalOpNumDeliverables { get; set; }

    public int? FiscalAvgxDeliverables { get; set; }

    public int? FiscalHours { get; set; }

    public int? FiscalAvgxHours { get; set; }

    public int? TotalFee { get; set; }

    public int? PkCptEstHours { get; set; }

    public int? LeadPartnerId { get; set; }

    public string? LeadPartnerName { get; set; }

    public string? LeadPartnerEmail { get; set; }

    public string? LeadPartnerLevel { get; set; }

    public int? LeadPartnerCostCenter { get; set; }

    public int? LeadPartnerHours { get; set; }

    public decimal? LeadPartnerFee { get; set; }

    public decimal? LeadPartnerTotalFee { get; set; }

    public int? SecondReviewerId { get; set; }

    public string? SecondReviewerName { get; set; }

    public string? SecondReviewerEmail { get; set; }

    public string? SecondReviewerLevel { get; set; }

    public int? SecondReviewerCostCenter { get; set; }

    public int? SecondReviewerHours { get; set; }

    public decimal? SecondReviewerFee { get; set; }

    public decimal? SecondReviewerTotalFee { get; set; }

    public int? ManagerId { get; set; }

    public string? ManagerName { get; set; }

    public string? ManagerEmail { get; set; }

    public string? ManagerLevel { get; set; }

    public int? ManagerCostCenter { get; set; }

    public int? ManagerHours { get; set; }

    public decimal? ManagerFee { get; set; }

    public decimal? ManagerTotalFee { get; set; }

    public int? SuperSeniorCostCenter { get; set; }

    public string? SuperSeniorSegmento { get; set; }

    public int? SuperSeniorHours { get; set; }

    public decimal? SuperSeniorFee { get; set; }

    public decimal? SuperSeniorTotalFee { get; set; }

    public int? SeniorCostCenter { get; set; }

    public string? SeniorSegmento { get; set; }

    public int? SeniorHours { get; set; }

    public decimal? SeniorFee { get; set; }

    public decimal? SeniorTotalFee { get; set; }

    public int? StaffinChargeCostCenter { get; set; }

    public string? StaffinChargeSegmento { get; set; }

    public int? StaffinChargeHours { get; set; }

    public decimal? StaffinChargeFee { get; set; }

    public decimal? StaffinChargeTotalFee { get; set; }

    public int? StaffCostCenter { get; set; }

    public string? StaffSegmento { get; set; }

    public int? StaffHours { get; set; }

    public decimal? StaffFee { get; set; }

    public decimal? StaffTotalFee { get; set; }

    public int? SpecialistsHours { get; set; }

    public decimal? Valuation { get; set; }

    public int? TotalHours { get; set; }

    public int? TotalFeexHour { get; set; }

    public int? PkCptEvalCert { get; set; }

    public bool? IsNoteworthyDerogative { get; set; }

    public string? IsNoteworthyDerogativeDesc { get; set; }

    public bool? Certification { get; set; }

    public int? PkCptAprobals { get; set; }

    public int? IdStatus { get; set; }

    public string? DescriptionStatus { get; set; }

    public bool? PicBu { get; set; }

    public bool? HofANacional { get; set; }

    public bool? Buqpp { get; set; }

    public string? PicBuComment { get; set; }

    public string? HofANacionalComment { get; set; }

    public string? BuqppComment { get; set; }

    public string? FechaAprob { get; set; }

    public bool? IsLost { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public string? CreatedName { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? PcolumnA { get; set; }

    public int? PcolumnB { get; set; }

    public string? PcolumnC { get; set; }

    public string? PcolumnD { get; set; }

    public int? FcolumnA { get; set; }

    public int? FcolumnB { get; set; }

    public string? FcolumnC { get; set; }

    public string? FcolumnD { get; set; }

    public int? HcolumnA { get; set; }

    public int? HcolumnB { get; set; }

    public string? HcolumnC { get; set; }

    public string? HcolumnD { get; set; }

    public int? ApcolumnA { get; set; }

    public int? ApcolumnB { get; set; }

    public string? ApcolumnC { get; set; }

    public string? ApcolumnD { get; set; }

    public int? EcolumnA { get; set; }

    public int? EcolumnB { get; set; }

    public string? EcolumnC { get; set; }

    public string? EcolumnD { get; set; }
}
