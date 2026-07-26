using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class ScorefyTblExceptions
    {

        [Key]
        [Column("PK_scorExceptions")] 
        public int PkScorExceptions { get; set; }

        [Required, MaxLength(300)]
        [Column("Key_Report")]
        public string KeyReport { get; set; } = null!;

        [Column("Is_Exception")]
        public bool? IsException { get; set; }

        [Column("Reason_Exception", TypeName = "varchar(max)")]
        public string? ReasonException { get; set; }

        public int? FY { get; set; }
        [Column("Is_Current")] public bool? IsCurrent { get; set; }
        [Column("Event_Number")] public int? EventNumber { get; set; }

        public DateTime? Created { get; set; }
        [MaxLength(100)] public string? Created_By { get; set; }
        public DateTime? Modified { get; set; }
        [MaxLength(100)] public string? Modified_By { get; set; }

        public int? Column_A { get; set; }
        public int? Column_B { get; set; }
        [MaxLength(300)] public string? Column_C { get; set; }
        [MaxLength(300)] public string? Column_D { get; set; }

    }
}
