using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{
    public class vwValuationBreakdownDtoML
    {
        public string p8Id { get; set; }
        public string levelLabel { get; set; }
        public int p8FiscalYear { get; set; }
        public decimal? hours { get; set; } = null!;
        public decimal? fees { get; set; } = null!;
    }
}
