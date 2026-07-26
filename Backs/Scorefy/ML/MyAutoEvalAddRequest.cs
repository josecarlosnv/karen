using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{

    public class MyAutoEvalAddRequest
    {
        public int PkEvalGene { get; set; }      // PK de scorefy_tbl_EvaluationsGenerate
        public int ClientId { get; set; }        // opcional si lo necesitas en el resume
        public int? EmployeeId { get; set; }     // opcional (si está en el proyecto)
        public int CutOff { get; set; }          // periodo
    }
}
 