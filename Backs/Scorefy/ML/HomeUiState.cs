using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
     
    public class HomeUiState
    {
        // Saludo y flags de UI
        public string Saludo { get; set; } = "";
        public bool ShowButtons { get; set; }
        public bool BotonPerformance { get; set; }
        public bool BotonRoleProfile { get; set; }
        public bool BotonReportes { get; set; }
        public bool VFilters { get; set; }

        // Usuario
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public int? EmployeeId { get; set; }
        public string? Nivel { get; set; }
        public DateTime CurrentDate { get; set; }

        // Seguridad
        public bool VLock { get; set; }
        public bool VMaster { get; set; } // Role == ALL
        public bool VTop { get; set; }    // Role == TOP
        public bool VKey { get; set; }    // Role == KEY
        public bool VPIE { get; set; }    // Role == PIE
        public bool VHLSTM { get; set; }  // Role == HLSTM

        // Contexto
        public string? BU { get; set; }
        public string? Office { get; set; }

        // Colecciones
        public List<string> ColRoleProfileDetails { get; set; } = new();
        public List<string> ColRoleProfileResumen { get; set; } = new();

        public List<EvaluacionVm> ColNewProy { get; set; } = new();
        public MrpVm IncisosMrp { get; set; } = new();
        public bool VCutOff { get; set; }

        public class EvaluacionVm
        {
            public string? Key_Report { get; set; }
            public string? GradeEvaluator { get; set; }
            public bool? Cut_Off { get; set; }
            public int? ID_Colab_Emp_Proy { get; set; }
        }

        public class MrpVm
        {
            public string? Nivel { get; set; }
            public int? TotalReactivos { get; set; }
        }
    }
}