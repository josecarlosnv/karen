using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    
    public class StaffingDto
    {
        public int KeyId { get; set; }

        public string? P8Id { get; set; } = null!;

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }

        public string LevelLabel { get; set; } = null!;

        public int PeopleCount { get; set; }
        public decimal HoursTotal { get;  set; }

        public decimal RateAmountTotal { get; set; }

        public bool IsActive { get; set; }

        public string EngagementSegmentLabel { get; set; } = null!;

        public int? EngagementSegmentId { get; set; }
        public int? CostCenter { get; set; } 
        
        public string? CreatedByUserEmail { get; set; }

        public string WindowKey =>
                $"{StartDate:yyyy-MM-dd}_{EndDate:yyyy-MM-dd}";

    }

}

