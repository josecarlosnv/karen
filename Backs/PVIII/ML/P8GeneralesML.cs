using System;
using System.Collections.Generic;
using System.Text;
//MODELO USADO PARA LA PARTE DE WORKSPACE - Select Client

namespace ML
{
   

    public class P8GeneralesML
    {
        // -----------------------------
        // ORIGEN: PviiiGeneralDetail
        // -----------------------------
        public int EntityId { get; set; }
        public int? EntityGroupId { get; set; }
        public string? ClientNumber { get; set; }
        public string? ClientName { get; set; }
        public int? SegmentId { get; set; }
        public string? LegacyIndustryDescription { get; set; }

        public bool? IsPublicEntity { get; set; }
        public bool? IsRegulatedEntity { get; set; }
        public bool? IsListedEntity { get; set; }
        public bool? IsSecAffiliate { get; set; }
        public bool? IsNonSecAffiliate { get; set; }

        public bool? IsConsolidated { get; set; }
        public bool? IsReportGroup { get; set; }
        public bool? IsActive { get; set; }

        public string? AddressLine { get; set; }
        public string? PostalCode { get; set; }
        public string? PhoneNumber { get; set; }

        // -----------------------------
        // ORIGEN: PviiiFactEngagement
        // -----------------------------
        public Guid P8Id { get; set; }
        public int? OfficeId { get; set; }
        public short? FiscalYear { get; set; }
        public string? RevenueType { get; set; }
        public string? ProjectDescription { get; set; }

        public string? AuditFlowType { get; set; }
        public string? AuditModality { get; set; }

        public bool? IsP8Active { get; set; }

        public string? CreatedByUserEmail { get; set; }
        public DateTime? CreatedDateTime { get; set; }

        public string? UpdatedByUserEmail { get; set; }
        public DateTime? UpdatedDateTime { get; set; }

        public int EngagementRowSequence { get; set; }

        public decimal? TotalHoursEp { get; set; }
        public decimal? TotalHonEp { get; set; }

        public long RecordChangeSequence { get; set; }
    }

}
