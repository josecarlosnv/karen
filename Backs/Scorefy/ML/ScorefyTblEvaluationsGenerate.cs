using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{ 
    public class ScorefyTblEvaluationsGenerate
    {

        [Key]
        [Column("PK_EvalGene")]
        public int PkEvalGene { get; set; }

        public DateTime? Created { get; set; }

        [Required, MaxLength(100)]
        [Column("Created_by")]
        public string CreatedBy { get; set; } = null!;

        [Required]
        [Column("Client_ID")]
        public long ClientId { get; set; }

        [Required, MaxLength(400)]
        [Column("Client_Name")]
        public string ClientName { get; set; } = null!;

        [Required]
        [Column("Employee_ID")]
        public int EmployeeId { get; set; }

        [Required, MaxLength(200)]
        [Column("Employee_Name")]
        public string EmployeeName { get; set; } = null!;

        [Required, MaxLength(100)]
        [Column("Local_Job_Level_Name")]
        public string LocalJobLevelName { get; set; } = null!;

        [Required, MaxLength(100)]
        [Column("Email_Address_Business")]
        public string EmailAddressBusiness { get; set; } = null!;

        [MaxLength(50)]
        public string? BU { get; set; }

        [MaxLength(100)]
        [Column("Location_Name")]
        public string? LocationName { get; set; }

        // TODO: el tipo SQL indicado es decimal(9,18) (inválido). Ajusta al real.
        [Column("Total_Hours", TypeName = "decimal(18,9)")]
        public decimal? TotalHours { get; set; }

        [Column("Chargeable_Hours", TypeName = "decimal(18,9)")]
        public decimal? ChargeableHours { get; set; }

        [Column("Generated_Evaluation")]
        public bool GeneratedEvaluation { get; set; }

        [Column("Generated_Type")]
        public int? GeneratedType { get; set; }

        [Column("Cut_Off")]
        public int? CutOff { get; set; }

        [Required, MaxLength(300)]
        [Column("Key_Report")]
        public string KeyReport { get; set; } = null!;

        [Column("Is_Current")]
        public bool IsCurrent { get; set; }

        public List<object> ScorefyTblEvaluationsGenerates { get; set; }

        // Navegaciones
        public ML.ScorefyTblEvaluationsGenerateExtra? Extra { get; set; }
        public ML.ScorefyTblExceptions? Exception { get; set; }
    }
}
