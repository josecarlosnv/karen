using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class TeamlLeaderChangeML
    {
        public int DimLevelId { get; set; }

        public string P8Id { get; set; } = null!;

        public int? EmployeeId { get; set; }

        public int LevelId { get; set; }

        public string LocalJobLevelName { get; set; } = null!;

        public string? CreatedByUserEmail { get; set; }

        public long RecordChangeSequence { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public decimal? EmployeeRate { get; set; }

        public string? CurrencyCode { get; set; }

        public bool EngagementRoleId { get; set; }

    }
}
