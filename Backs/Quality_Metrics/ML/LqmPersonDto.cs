namespace ML;

public class LqmPersonDto
{
    public string EmployeeId { get; set; } = "";
    public string? Name { get; set; }
    public string? Title { get; set; }         // leaderTitle (rol)
    public string? Practice { get; set; }      // Practice
    public string? BusinessUnit { get; set; }  // businessUnitIdLabel
    public string? Office { get; set; }        // officeLabel
    public int? TenureYears { get; set; }      // calculado desde Fecha_Inicio
    public string? Photo { get; set; }         // null por ahora
}
