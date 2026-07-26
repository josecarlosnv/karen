namespace ML
{

    // PL/Models/AutoEvaluationPostModel.cs
    public class AutoEvaluationPostModel
    {
        public string IdColabEmpProy { get; set; } = null!;
        public string? Rol { get; set; }
        public string? NivelEvaluador { get; set; }
        public int? EvaluatorId { get; set; }
         
        //public List<AutoEvaluationPostDetail> Detalles { get; set; } = new();
        public string? Detalles { get; set; }
        public decimal? ClientFinalScore { get; set; }
    }

    public class AutoEvaluationPostDetail
    {
        public int EcdId { get; set; }
        public string? Competence { get; set; }
        public string? SubCompetence { get; set; }
        public string ReactiveNum { get; set; }
        public decimal? EvaluatedResp { get; set; }   // 0,1,2,3
        public string? EvaluatedComent { get; set; }
    }

}
