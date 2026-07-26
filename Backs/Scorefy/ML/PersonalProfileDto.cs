// ML/PersonalProfileDtos.cs
namespace ML
{
    public class PersonalProfileDto
    { 
        public int ProfileId { get; set; }
        public string? EmployeeId { get; set; }          // char(11) en tabla
        public int? EmployeeIdInt { get; set; }          // comodín para front si lo necesitas
        public string? FullName { get; set; }            // EvaluatedName
        public string? Email { get; set; }               // EvaluatedEmail
        public string? StaffLevel { get; set; }          // Staff_Level
        public bool? Graduated { get; set; }             // Proffesional_Degree
        public int? PostalCode { get; set; }             // CP
        public int? PmId { get; set; }                   // PMID
        public string? PmName { get; set; }              // PMName
        public string? PmEmail { get; set; }             // PMEmail
        public bool? IsCurrent { get; set; }
        public string OfficeLocation { get; set; }
        public string English { get; set; }
    }

    public class PersonalProfileUpdateDto
    {
        public int? PmId { get; set; }
        public string? PmName { get; set; }
        public string? PmEmail { get; set; }
        public bool? Graduated { get; set; }
        public int? PostalCode { get; set; }
    }

    public class ManagerOption // para el combobox
    {
        public int Id { get; set; }            // EmployeeId
        public string? Name { get; set; }      // FullName
        public string? Email { get; set; }     // EmailAddressBusiness
        public string Label => Name ?? "";
        public string Value => Id.ToString();
    }

    //DTO unicamente para el icono 

    public sealed class SecurityAccessDto
    {
        public bool HasSecurityAccess { get; set; }

        // (Opcional)
        public string? Email { get; set; }
        public bool InEmployeesView { get; set; }
        public bool Allowed { get; set; }
    }

}
