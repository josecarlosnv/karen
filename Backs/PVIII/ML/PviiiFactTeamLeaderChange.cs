using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public partial class PviiiFactTeamLeaderChange
    {
        public int DimLevelId { get; set; }

        public string P8Id { get; set; } = null!;

        public long ClientNumber { get; set; }

        public int? EmployeeId { get; set; }

        public int LevelId { get; set; }

        public string LocalJobLevelName { get; set; } = null!;

        public string? CreatedByUserEmail { get; set; }

        public long RecordChangeSequence { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public virtual PviiiDimLevel Level { get; set; } = null!;

        public virtual P8SumClient P8 { get; set; } = null!;
    }

}
