using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblEstimatedHour
{
    public int PkCptEstHours { get; set; }

    public string IdForm { get; set; } = null!;

    public int LeadPartnerId { get; set; }

    public string LeadPartnerLevel { get; set; } = null!;

    public int LeadPartnerCostCenter { get; set; }

    public int LeadPartnerHours { get; set; }

    public decimal LeadPartnerFee { get; set; }

    public decimal? LeadPartnerTotalFee { get; set; }

    public int? SecondReviewerId { get; set; }

    public string? SecondReviewerLevel { get; set; }

    public int? SecondReviewerCostCenter { get; set; }

    public int? SecondReviewerHours { get; set; }

    public decimal? SecondReviewerFee { get; set; }

    public decimal? SecondReviewerTotalFee { get; set; }

    public int ManagerId { get; set; }

    public string ManagerLevel { get; set; } = null!;

    public int ManagerCostCenter { get; set; }

    public int ManagerHours { get; set; }

    public decimal ManagerFee { get; set; }

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

    public int? Fy { get; set; }

    public bool? IsLost { get; set; }

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public int? SpecialistsHours { get; set; }
}
