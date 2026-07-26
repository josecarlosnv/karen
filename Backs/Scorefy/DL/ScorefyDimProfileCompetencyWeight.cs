using System;
using System.Collections.Generic;
using System.Text;

namespace DL
{

    public class ScorefyDimProfileCompetencyWeight
    {
        public int CompetencyWeightId { get; set; }
        public int Fy { get; set; }
        public int CompetenciaId { get; set; }           // ojo al nombre real de la columna
        public string? Local_Job_Level_Name { get; set; }   // Local_Job_Level_Name
        public decimal Weight { get; set; }
    }

}
