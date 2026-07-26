using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class RoleProfileResumen
    { 

        [Key]
        [Column("RolePR_Id")]
        public int RolePrId { get; set; }

        [Required, MaxLength(100)]
        public string ID_RoleProfile { get; set; } = null!;

        public int ReactivesNum { get; set; }
        public int? EvaluatedID { get; set; }
        public int? PMID { get; set; }

        [MaxLength(250)] public string? EvaluatedName { get; set; }
        [MaxLength(250)] public string? PMName { get; set; }
        [MaxLength(250)] public string? EvaluatedEmail { get; set; }
        [MaxLength(250)] public string? PMEmail { get; set; }

        public bool? EvaluatedComplete { get; set; }
        public bool? PMComplete { get; set; }

        public int? FY { get; set; }
        public int? Period { get; set; }
        public bool? IsCurrent { get; set; }
        public DateTime? Created { get; set; }
        [MaxLength(100)] public string? CreatedBy { get; set; }
        public DateTime? Modified { get; set; }
        [MaxLength(100)] public string? ModifiedBy { get; set; }

        [MaxLength(250)] public string? Column_A { get; set; }
        [MaxLength(250)] public string? Column_B { get; set; }
        public int? Column_C { get; set; } // <-- corrígelo si fue 'int'
        public int? Column_D { get; set; }
        public DateTime? Created_time { get; set; }
        public DateTime? Modified_time { get; set; }

        public virtual ICollection<RoleProfileDetails> Details { get; set; } = new List<RoleProfileDetails>();

    }
}
