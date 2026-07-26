using ML.Pviii;
using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class SaveStaffingRequest
    {
        public List<StaffingDto> Staffing { get; set; } = new();
        public SchedulingConsiderationDto SchedulingConsideration { get; set; } = new();
    }
}
