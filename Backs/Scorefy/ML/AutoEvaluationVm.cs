// PL/Models/AutoEvaluationVm.cs  (ViewModel para Razor)
namespace ML;

public class AutoEvaluationVm
{
    // Encabezado
    public string IdColabEmpProy { get; set; } = null!;
    public string EvaluatedName { get; set; } = "";
    public string ClientName { get; set; } = "";
    public decimal? TotalHours { get; set; } 
    public int CutOff { get; set; } = 1;

    // Combos
    public string? Rol { get; set; }
    public IEnumerable<string> RolesDisponibles { get; set; } = new[]
    {
        "Senior Manager","Manager","Senior","Staff in Charge","Staff"
    }; 
    public string? NivelEvaluador { get; set; }
    public IEnumerable<string> NivelesDisponibles { get; set; } = new[]
    {
        "Partner","Director","Senior Manager","Manager","Supervising Senior","Senior","Staff In Charge"
    }; 
    public int? EvaluatorId { get; set; }
    //public IEnumerable<(int Id, string Nombre, string Email)> Evaluadores { get; set; } = Enumerable.Empty<(int, string, string)>();

    // Calificaciones
    public decimal? GradeAutoCalculada { get; set; } // cálculo cliente o servidor
    public decimal? GradeEvaluator { get; set; }

    // Flags
    public bool ExistePrevio { get; set; }
    public bool ExisteCierre { get; set; }

    // Detalles
    public int CompetenciaSeleccionada { get; set; } = 1; // 1..5 (tabs)
    public List<AutoEvalDetailItem> Detalles { get; set; } = new();

    public List<EvaluadorVM> Evaluadores { get; set; } = new();
    //public List<string> RolesDisponibles { get; set; } = new();
    //public List<string> NivelesDisponibles { get; set; } = new();
    //public string? Rol { get; set; }
    //public int? EvaluatorId { get; set; }
}

