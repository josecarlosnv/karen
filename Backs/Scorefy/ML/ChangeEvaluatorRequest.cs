using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{

    public sealed class ChangeEvaluatorRequest
    {
        public string KeyReport { get; set; } = "";
        public int NewEvaluatorId { get; set; } 
    }

}
