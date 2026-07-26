using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{

    public class SchedulingConsiderationDto
    {
        public string P8Id { get; set; } = null!;
        public bool TravelRequired { get; set; }
        public string? SchedulingNotes { get; set; }
        public int? SuggestedEmployeeId { get; set; }
        public string? SuggestedEmployeeName { get; set; }
        public int? EngagementSegmentId { get; set; }
        public string? EngagementSegmentLabel { get; set; }
        public string? CreatedByUserEmail { get; set; }

        public List<SuggestedCollaboratorDto> SuggestedCollaborators { get; set; } = new();

    }

    public class SuggestedCollaboratorDto
    {
        public int SuggestedEmployeeId { get; set; }
        public string SuggestedEmployeeName { get; set; }
    }

}
