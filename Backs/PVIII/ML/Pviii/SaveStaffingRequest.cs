using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class SaveStaffingRequest
    {
        public DateTime CutoffDate { get; set; }
        public List<StaffingDto> Dtos { get; set; } = new();
        public SchedulingConsiderationDto SchedulingDto { get; set; } = new();
        public string Email { get; set; } = null!;
    }
}
