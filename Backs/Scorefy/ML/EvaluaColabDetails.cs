
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class EvaluaColabDetails
    {

        [Key]
        [Column("ECD_Id")]
        public int EcdId { get; set; }

        [Required, MaxLength(100)] 
        public string ID_Colab_Emp_Proy { get; set; } = null!;

        [Required]
        public int Competence { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SubCompetence { get; set; }

        [Required, MaxLength(10)]
        public string ReactiveNum { get; set; } = null!;

        [MaxLength(50)]
        public string? Role { get; set; }

        [Required]
        public int EvaluatedResp { get; set; }

        [Required]
        public int EvaluatorResp { get; set; }

        [MaxLength(350)]
        public string? EvaluatedComent { get; set; }

        [MaxLength(350)]
        public string? EvaluatorComent { get; set; }

        public bool? IsCurrent { get; set; }
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

        // Navegaciones
        public ML.EvaluaColabResume Resume { get; set; }
        public ML.ReactivosEDP? Reactivo { get; set; }

    }
}

