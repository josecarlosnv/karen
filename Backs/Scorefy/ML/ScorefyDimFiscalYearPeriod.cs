using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace ML
{ 
    public class ScorefyDimFiscalYearPeriod
    {

        [Key]
        public int ID { get; set; }

        public int? FiscalYearPeriod { get; set; }
        [MaxLength(20)] public string? column_A { get; set; }
        public int? IsCutOff { get; set; }
        public int? IsFirstCutOff { get; set; }
        public int? IsSecondCutOff { get; set; }

    }
}
