using System;
using System.Collections.Generic;
using System.Text;
using System.Xml.Linq;

namespace ML
{
    public class SubOtherFunctionsML
    {
        public int p8OtherFunctPK  { get; set; }
        public bool approvalIndicator { get; set; }
        public string costCenter { get; set; }
        public string servicesLine { get; set; } = null!;
        public string comments { get; set; }
        public string createBy { get; set; } = null!;
    }
}
