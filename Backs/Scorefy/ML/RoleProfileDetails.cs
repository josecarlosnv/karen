using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class RoleProfileDetails
    {


        [Column("RolePD_Id")]
        public int RolePdId { get; set; } 

        [Required, MaxLength(100)]
        public string ID_RoleProfile { get; set; } = null!;

        [Required]
        public int ReactiveNum { get; set; }

        [MaxLength(350)]
        public string? EvaluatedComent { get; set; }

        [MaxLength(350)]
        public string? PMComent { get; set; }

        [MaxLength(50)]
        public string? Role { get; set; }

        public bool? Aplica { get; set; }
        public bool? AutoEvaluation { get; set; }
        public bool? Confirm { get; set; }

        public DateTime? Created { get; set; }
        [MaxLength(100)] public string? CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        [MaxLength(100)] public string? ModifiedBy { get; set; }

        [MaxLength(200)] public string? Column_A { get; set; }
        [MaxLength(200)] public string? Column_B { get; set; }
        public int? Column_C { get; set; }
        public int? Column_D { get; set; }
        public DateTime? Created_time { get; set; }
        public DateTime? Modified_time { get; set; }
        public int? FY { get; set; }

        public ML.RoleProfileResumen? Resumen { get; set; }
        public ML.ReactivosRoleProfile? Reactivo { get; set; }

    }
}
