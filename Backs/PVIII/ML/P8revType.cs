using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public  class P8revType
    {
        public int P8revenueTypeId { get; set; }

        public string P8revenueTypeLabel { get; set; } = null!;

        public virtual ICollection<P8SumClient> PviiiMasterHistories { get; set; } = new List<P8SumClient>();
    }

}
