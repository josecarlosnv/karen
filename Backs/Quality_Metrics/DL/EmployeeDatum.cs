namespace DL;

public partial class EmployeeDatum
{
    public string EmployeeId { get; set; } = null!;
    public string? EmailAddressBusiness { get; set; }
    public string? NetworkId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? LocalJobLevelName { get; set; }
    public string? LocationName { get; set; }
    public string? PracticaDescription { get; set; }
    public string? FechaInicio { get; set; }   // Fecha_Inicio (varchar) -> tenure
}
