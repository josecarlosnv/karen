using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class ProjectsFilterVM
    {
        // Filtros seleccionados
        public string? BU { get; set; }
        public string? Location_Name { get; set; }
        public string? Local_Job_Level_Name { get; set; } 
        public string? Employee_Name { get; set; }

        // Mostrar/ocultar filtros según seguridad
        public bool ShowFilters { get; set; } = false;

        // Si el usuario es KEY, la BU es fija
        public bool BUIsFixed { get; set; } = false;


        // Listas para combos (solo si ShowFilters = true)
        public List<string> BUOptions { get; set; } = new();
        public List<string> LocationOptions { get; set; } = new();
        public List<string> JobLevelOptions { get; set; } = new();
        public List<string> EmployeeOptions { get; set; } = new();

        // Resultados (cards)
        public List<ML.ScorefyTblEvaluationsGenerate> Results { get; set; } = new();
        public List<ML.EvaluaColabResume> ResultsResume { get; set; } = new();
    }
}



