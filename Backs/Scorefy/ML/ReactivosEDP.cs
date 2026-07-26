using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class ReactivosEDP
    {

        [Key]
        [Column("Id_REDP")] 
        public int IdRedp { get; set; }

        [MaxLength(250)]
        public string? Nivel { get; set; }

        public int? Competencia { get; set; }

        [MaxLength(250)]
        public string? CompetenciaDescrip { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SubCompetencia { get; set; }

        [MaxLength(250)]
        public string? SubCompetenciaDescrip { get; set; }

        [Required, MaxLength(50)]
        public string NumReactivo { get; set; } = null!;

        [MaxLength(500)]
        public string? ReactivoDescrip { get; set; }

        [MaxLength(250)] public string? Column_A { get; set; }
        [MaxLength(250)] public string? Column_B { get; set; }
        public int? Column_C { get; set; }
        public int? Column_D { get; set; }
        public bool? Vigencia { get; set; }
        public int? FY { get; set; }

    }
}
