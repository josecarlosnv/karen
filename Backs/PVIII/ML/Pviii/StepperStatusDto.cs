using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Pviii
{

    public class StepperStatusDto
    {
        public bool Step1Context { get; set; }
        public bool Step2Details { get; set; }
        public bool Step3Quality { get; set; }
        public bool Step4Entities { get; set; }
        public bool Step5Staffing { get; set; }
        public bool Step6Specialists { get; set; }
        public bool Step7Valuation { get; set; }
        public bool Step8Review { get; set; }
    }

}
