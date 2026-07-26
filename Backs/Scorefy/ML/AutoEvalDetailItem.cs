using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class AutoEvalDetailItem
    {

        public int EcdId { get; set; }
        public string? Competence { get; set; }
        public string? SubCompetence { get; set; }  // "1.1", ... 
        public string ReactiveNum { get; set; }
        public int? EvaluatedResp { get; set; } // 0,1,2,3 (0 = NA)
        public string? EvaluatedComent { get; set; }
        public int? EvaluatorResp { get; set; } // 0,1,2,3 (0 = NA)
        public string? EvaluatorComent { get; set; }

        public string? SubCompetenceDescrip { get; set; }
        public string? ReactiveDescrip { get; set; }
        public string CompetenciaDescrip { get; set; }
        public decimal? Weight { get; set; }

    }
}
