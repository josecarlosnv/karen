
namespace ML
{
    public class CloseSummaryDto
    {
        public string IdColabEmpProy { get; set; } = default!;
        public decimal GradeEvaluated { get; set; }
        public int ReactivesNum { get; set; }

        // Datos útiles para el correo:
        public string? Proyecto { get; set; } 
        public int? ClientId { get; set; }
        public string? ClienteNombre { get; set; }
        public string? ColaboradorNombre { get; set; }
        public string? ColaboradorEmail { get; set; }
        public string? EvaluadorNombre { get; set; }
        public string? EvaluadorEmail { get; set; }
        public DateTime? FechaCierreUtc { get; set; }

        // Resumen de ítems para el body (opcional, top N)
        public List<CloseSummaryItemDto>? Resumen { get; set; }
    }

    public class CloseSummaryItemDto
    {
        public string? Competence { get; set; }
        public string? SubCompetence { get; set; }
        public string? ReactiveNum { get; set; }
        public int? EvaluatedResp { get; set; }
        public string? EvaluatedComent { get; set; }
    }
}

