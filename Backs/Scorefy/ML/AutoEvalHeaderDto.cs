using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{

    public class AutoEvalHeaderDto
    {

        public string? ClientName { get; set; }
        public string? Role { get; set; } 
        public int? EvaluatorId { get; set; }
        public string? EvaluatorName { get; set; }
        // (Opcional) agrega ClientId, EvaluatorEmail, etc.
        public int? ClientId { get; set; }
        public string? EvaluatorEmail { get; set; }
        public bool? IsClosed { get; set; }
        public int? Column_C { get; set; }

    }

}
