using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Specialist
{
    public class SpecialistRate
    {
        public int LevelAvgRateId { get; set; }

        public string BreakdownLevel { get; set; } = null!;

        public string ServiceLineLabel { get; set; } = null!;

        public string OfficeLabel { get; set; } = null!;

        public int CostCenter { get; set; }

        public string CostCenterLabel { get; set; } = null!;

        public string FunctionLabel { get; set; } = null!;

        public decimal AverageRate { get; set; }

    }
}
