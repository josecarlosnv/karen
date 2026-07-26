using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyDimGeneratedType
{
    public int GeneratedTypeId { get; set; }

    public string? IdDescrip { get; set; }

    public string? Comments { get; set; }

    public virtual ICollection<EvaluaColabResume> EvaluaColabResumes { get; set; } = new List<EvaluaColabResume>();

    public virtual ICollection<ScorefyTblEvaluationsGenerateExtra> ScorefyTblEvaluationsGenerateExtras { get; set; } = new List<ScorefyTblEvaluationsGenerateExtra>();

    public virtual ICollection<ScorefyTblEvaluationsGenerate> ScorefyTblEvaluationsGenerates { get; set; } = new List<ScorefyTblEvaluationsGenerate>();

    public virtual ICollection<ScorefyTblHistoricalPerformanceReview> ScorefyTblHistoricalPerformanceReviews { get; set; } = new List<ScorefyTblHistoricalPerformanceReview>();
}
