using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public  class P8fiscalYearRef
    {
        public int P8FiscalYearId { get; set; }

        public int P8FiscalYearLabel { get; set; }

        public virtual ICollection<P8SumClient> PviiiMasterHistories { get; set; } = new List<P8SumClient>();
    }
}
