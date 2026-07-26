using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ML
{

    public sealed class DeleteEvaluationRequest
    {
        // Id de la evaluación (en Power Apps lo tienes como ECR_Id)
        [JsonPropertyName("IdColabEmpProy")] 
        public string? IdColabEmpProy { get; set; }

        [JsonPropertyName("ECR_Id")]
        public string? EcrIdAlias { get; set; } // alias opcional

        // Metadatos para ubicar la(s) fila(s) de generación
        public int? PkEvalGene { get; set; }
        public string? KeyReport { get; set; }
        public int? GeneratedType { get; set; }
    }

}
