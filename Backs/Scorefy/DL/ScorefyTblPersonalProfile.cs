using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DL
{
    public partial class ScorefyTblPersonalProfile
    {

        
        public int ProfileId { get; set; } // Si es IDENTITY, no lo asignes al insertar

        public string? EmployeeId { get; set; }
        public int? PMID { get; set; }

       
        public string? EvaluatedName { get; set; }

       
        public string? PMName { get; set; }

       
        public string? EvaluatedEmail { get; set; }

       
        public bool? ProffesionalDegree { get; set; }

        
        public int? CP { get; set; }

       
        public string? StaffLevel { get; set; }

       
        public bool? IsCurrent { get; set; }

       
        public int EventNumber { get; set; } // NOT NULL en la tabla

       
        public string? CreatedBy { get; set; }

       
        public DateTime? Created { get; set; }

       
        public string? ColumnA { get; set; }

        
        public string? ColumnB { get; set; }

       
        public int? ColumnC { get; set; }

        
        public int? ColumnD { get; set; }

       
        public string? PMEmail { get; set; }

    }
}
