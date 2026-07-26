using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class P8ProjectDetailDto
    {
        public Guid P8Id { get; set; }
        public string ClientNumber { get; set; }
        public string ClientName { get; set; }
        public string FiscalYear { get; set; }
        public string RevenueType { get; set; }
        public int SegmentId { get; set; }
        public string Segmento { get; set; }
        public HistoricalComparisonDto LastYearMetrics { get; set; }
        public CreateProjectDto CreateProject { get; set; }
        public QualityDto Quality { get; set; }
        public List<StaffingDto> Staffing { get; set; }
        public SubmitDto SubmitInfo { get; set; }
        public EngagementDetailsDto EngagementDetails { get; set; }
        public FrameworkDto ProyectRisk { get; set; }
        public QualityDto QualityCFY { get; set; }
        public EngagementDetailsDto EngagementDetailsCFY { get; set; }
        public ValuationDto ValuationCFY { get; set; }

        public ValuationDto Valuation { get; set; }
        public StepperStatusDto stepperStatus { get; set; }
        public SchedulingConsiderationDto SchedulingConsiderations { get; set; }

        public List<CreateEntityReportConfigDto> EntitiesCurrent { get; set; }
        public List<CreateEntityReportConfigDto> Entities { get; set; }
        public EngagementFrameworkDto? EngagementFramework { get; set; }
        public List<vwValuationBreakdownDtoML> valuationBreakdown { get; set; }

        public List<SpecialistsDto> Specialists { get; set; }

        public List<SpecialistsDto> SpecialistsHistory { get; set; }

        public string? CreatedByUserEmail { get; set; }
        public string? Estatus { get; set; }
        public bool? FirstYearClient { get; set; }

        public decimal? TH_Audit { get; set; }
        public decimal? TIN_Audit { get; set; }
        public decimal? Cuota_Audit { get; set; }
        public string FiscalYearparaApprovals { get; set; }
        public string RevenueTypeparaApprovals { get; set; }
    }
}
