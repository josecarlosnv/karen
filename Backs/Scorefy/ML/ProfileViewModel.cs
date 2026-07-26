namespace ML
{
    public class ProfileViewModel
    {
        // Identidad
        public string Name { get; set; } = "John Doe";
        public string Email { get; set; } = "john.doe@company.com"; 
        public string RoleTitle { get; set; } = "Manager";
        public string? AvatarUrl { get; set; } = null; // si no hay, se muestran iniciales

        // Datos de empleado (panel derecho del card)
        public string BusinessUnit { get; set; } = "Audit Services";
        public string Office { get; set; } = "New York";
        public string Level { get; set; } = "Senior Consultant";

        // Preferencias
        public string Language { get; set; } = "en";     // en | es
        public string Theme { get; set; } = "system";    // system | light | dark
        public bool EmailReminders { get; set; } = true; // notificaciones
        public bool ProductTips { get; set; } = true;    // tooltips y tours
        public bool KeyboardHints { get; set; } = true;  // mostrar hints de atajos

        // Utilidad para iniciales
        public string Initials => GetInitials(Name);

        public static string GetInitials(string name)
        {
            if (string.IsNullOrWhiteSpace(name)) return "NA";
            var parts = name.Trim().Split(' ');
            return string.Concat(parts[0][0], parts.Length > 1 ? parts[^1][0] : parts[0][0]).ToUpper();
        }
    }
}
