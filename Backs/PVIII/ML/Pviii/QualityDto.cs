using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{

    public class QualityDto
    {
        public bool IsPublicEntity { get; set; }                        
        public bool IsRegulatedEntity { get; set; }                    
        public bool IsListedEntity { get; set; }                     
        public bool HasSignificantPublicSubsidiariesMexico { get; set; } 
        public bool IsSignificantSecSubsidiary { get; set; }           
        public bool IsSecAffiliate { get; set; }                     
        public bool IsNonSecAffiliate { get; set; }                 
        public bool IsReportGroup { get; set; }                      
        public int? ReferredCountryId { get; set; }
        public bool Aits { get; set; }
        public long RecordChangeSequence { get; set; }
        public string? NatureOfEngagementLabel { get; set; }
        public string? AuditWorkflowLabel { get; set; }
        public string? StatutoryExaminerLabel { get; set; }
        public string? CreatedByUserEmail { get; set; }
        public DateTime? CreatedDateTime { get; set; }
        public string? CyCeac { get; set; }

        public string? PyCeac { get; set; }
    }
}