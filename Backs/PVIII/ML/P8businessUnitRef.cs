using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public  class P8businessUnitRef
    {
        public int BusinessUnitId { get; set; }

        public string BusinessUnitIdLabel { get; set; } = null!;

        public virtual ICollection<P8SumClient> PviiiMasterHistories { get; set; } = new List<P8SumClient>();
    }

}
