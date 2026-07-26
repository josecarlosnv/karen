namespace ML;

public class LqmAccessDto
{
    public string Email { get; set; } = string.Empty;
    public string? Role { get; set; }
    public string? Bu { get; set; }
    public string? Office { get; set; }

    public bool IsBuPic { get; set; }
    public bool IsHofA { get; set; }

    public bool InEmployeeGate { get; set; }   // Partner/Director + Audit/Nacional
    public bool HasSecurityRow { get; set; }   // existe en LQM_Tbl_Security
    public bool IsAll { get; set; }            // userRole = 'All'

    public bool Allowed { get; set; }                // puede entrar al app
    public bool CanAccessPerformance { get; set; }   // Performance / Partner&Director
    public bool CanAccessBuEvaluation { get; set; }  // evaluación de BU PICs
    public bool CanSelectUsers { get; set; }   // puede ver/usar el combobox de usuarios
public string Scope { get; set; } = "Self"; // alcance de datos: Self | Allegados | All

public bool CanAccessHofA { get; set; }

public bool CanAccessPartners { get; set; }

}
