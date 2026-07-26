using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class ReactivosRoleProfile
    {

        [Key]
        [Column("Id_RRP")] 
        public int IdRrp { get; set; }

        [MaxLength(50)]
        public string? Nivel { get; set; }

        public int? Numeralia { get; set; }

        [MaxLength(500)]
        public string? Indicador { get; set; }

        [MaxLength(250)] public string? Column_A { get; set; }
        [MaxLength(250)] public string? Column_B { get; set; }
        public int? Column_C { get; set; }
        public int? Column_D { get; set; }
        public bool? Vigencia { get; set; }
        public int? FY { get; set; }

    }
}
