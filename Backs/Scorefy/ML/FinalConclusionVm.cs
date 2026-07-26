namespace ML
{
    public class FinalConclusionVm
    {
        public int? Id { get; set; }
        public int EmployeeId { get; set; } 
        public string? EmailEvaluado { get; set; }
        public int Fy { get; set; }
        public string? Periodo { get; set; }

        public SectionStateData PerformanceManager { get; set; } = new();
        public SectionStateData Committee { get; set; } = new();
        public SectionStateData Calibration { get; set; } = new();

        public bool ReunionPM { get; set; }

        // Informativo para tu panel lateral
        public string? Bu { get; set; }
        public string? Office { get; set; }
        public string? Level { get; set; }
        public string? EmployeeEmail { get; set; }
        public string? EmployeeName { get; set; }
    }

    public class SectionStateData
    {
        public string State { get; set; } = "edit";       // "edit" | "view" | "locked"
        public string Status { get; set; } = "pending";   // "pending" | "in-progress" | "completed"
        public SectionData? Data { get; set; }            // payload de la sección
        public string? EditorName { get; set; }
        public DateTimeOffset? LastUpdated { get; set; }
    }

    public class SectionData
    {
        public int? OpenPDRating { get; set; }
        public string? Fortalezas { get; set; }
        public string? AreasOportunidad { get; set; }
        public string? Comentarios { get; set; }
        public bool? Promocion { get; set; }
        public string? CategoriaPromocion { get; set; }
    }

    // Payloads por sección (PUT)
    public class SavePmDto : SectionData { public bool? ReunionPM { get; set; } }
    public class SaveCommitteeDto : SectionData { public string? ComentariosGenerales { get; set; } }
    public class SaveCalibrationDto
    {
        public decimal? OpenPD_Final { get; set; }
        public string? Notas_Finales { get; set; }
    }
}