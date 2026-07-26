using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class AutoEvalDetailsGenerateRequest
    {

        public string IdColabEmpProy { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool EvaluationType { get; set; } = false; // autoevaluación 
        public int CutOff { get; set; } = 1;              // ¡alineado a la vista!
        public string? RolSeleccionado { get; set; }      // para filtrar catálogo si lo necesitas
    }

}

