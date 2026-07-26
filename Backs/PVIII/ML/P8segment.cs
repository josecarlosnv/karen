using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public partial class P8segment
    {
        public int SegmentId { get; set; }

        public string SegmentLabel { get; set; } = null!;

        public int SegmentPastId { get; set; }

        public virtual ICollection<P8SumClient> PviiiMasterHistories { get; set; } = new List<P8SumClient>();
    }

}
