using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class CatSpecialistML
    {
        public int SpecialistLeaderId { get; set; }

        public int EmployeeId { get; set; }

        public string EmployeeName { get; set; } = null!;

        public string EmployeeEmail { get; set; } = null!;

        public string LevelLabel { get; set; } = null!;

        public string ServiceLineLabel { get; set; } = null!;

        public string? UpdatedByUserEmail { get; set; }

        public DateTime? UpdatedDateTime { get; set; }
    }
}
