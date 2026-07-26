using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class StaffingPreviewDto
    {

        public string WindowKey { get; set; } = null!;

        public DateOnly WindowStart { get; set; }
        public DateOnly WindowEnd { get; set; }

        public string LevelLabel { get; set; } = string.Empty;

        public decimal Hours { get; set; }
        public decimal Fees { get; set; }

    }
}
