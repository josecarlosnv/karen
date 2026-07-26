using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public  class PviiiDimLevel
    {
        public int LevelId { get; set; }

        public string LocalJobLevelName { get; set; } = null!;

        public string LocalJobLevel { get; set; } = null!;

        public virtual ICollection<PviiiFactTeamLeaderChange> PviiiFactTeamLeaderChanges { get; set; } = new List<PviiiFactTeamLeaderChange>();
    }
}
