using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public  class P8factApproval
    {
        public int P8ApprStatusId { get; set; }

        public string P8ApprStatusLabel { get; set; } = null!;

        public virtual ICollection<P8SumClient> PviiiMasterHistories { get; set; } = new List<P8SumClient>();
    }

}
