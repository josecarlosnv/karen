using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class EvaluatorDetailItem
    { 
        public int EcdId { get; set; }                  // PK de detalle si está disponible
        public string? ReactiveNum { get; set; }        // Fallback clave de negocio
        public string? SubCompetence { get; set; }      // Fallback clave de negocio
        public int? EvaluatorResp { get; set; }         // 0 = N/A
        public string? EvaluatorComent { get; set; }
        public bool Update { get; set; }                // Para forzar upsert (tipo Power Apps)
    }

    public class EvaluatorBatchRequest
    {
        public string IdColabEmpProy { get; set; } = default!;
        public string Email { get; set; } = default!;
        public IEnumerable<EvaluatorDetailItem> Items { get; set; } = Enumerable.Empty<EvaluatorDetailItem>();
        public decimal? GradeEvaluator { get; set; }
        public bool? IsClosed { get; set; } = false;     // igual a tu Power Apps (IsClosed = 0)
    }

    public class EvaluatorBatchResponse
    {
        public string IdColabEmpProy { get; set; } = default!;
        public int Updated { get; set; }
        public int ProgressAnswered { get; set; }
        public int ProgressTotal { get; set; }
        public decimal? GradeEvaluator { get; set; }
        public bool? IsClosed { get; set; }
    }

    // Para la carga de la pantalla de detalle del evaluador
    public class EvaluatorDetailLoadResponse
    {
        // Encabezado
        public string IdColabEmpProy { get; set; } = default!;
        public string EmployeeName { get; set; } = "";
        public string Client { get; set; } = "";
        public string Role { get; set; } = "";
        public string Period { get; set; } = "";

        // Detalle
        public List<EvaluatorDetailLoadItem> Items { get; set; } = new();
    }

    public class EvaluatorDetailLoadItem
    {
        public int EcdId { get; set; }
        public string Competency { get; set; } = "";
        public string SubCompetency { get; set; } = "";
        public string Description { get; set; } = "";

        // Self
        public int? SelfScore { get; set; }
        public string SelfComment { get; set; } = "";
        public bool SelfIsNA { get; set; }

        // Evaluator
        public int? EvaluatorScore { get; set; }
        public string EvaluatorComment { get; set; } = "";
        public bool EvaluatorIsNA => (EvaluatorScore ?? 0) == 0; // 0 => N/A

        // Claves de negocio auxiliares
        public string? ReactiveNum { get; set; }
        public string? SubCompetence { get; set; }
    }
}
