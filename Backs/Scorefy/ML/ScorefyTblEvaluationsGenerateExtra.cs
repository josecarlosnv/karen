using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class ScorefyTblEvaluationsGenerateExtra
    { 

        [Key]
        [Column("PK_EvalGene")]
        public int PkEvalGene { get; set; }

        [Required]
        public DateTime Created { get; set; }

        [Required, MaxLength(100)]
        [Column("Created_by")]
        public string CreatedBy { get; set; } = null!;

        [Required]
        [Column("Client_ID")]
        public int ClientId { get; set; }

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

        [Required, MaxLength(50)]
        public string BU { get; set; } = null!;

        [Required, MaxLength(100)]
        [Column("Location_Name")]
        public string LocationName { get; set; } = null!;

        [Required]
        [Column("Total_Hours", TypeName = "decimal(18,9)")] // ver nota
        public decimal TotalHours { get; set; }

        [Column("Chargeable_Hours", TypeName = "decimal(18,9)")]
        public decimal? ChargeableHours { get; set; }

        [Column("Generated_Evaluation")]
        public bool? GeneratedEvaluation { get; set; }

        [Column("Generated_Type")]
        public int? GeneratedType { get; set; }

        [Required]
        [Column("Generated_Documentation", TypeName = "varchar(max)")]
        public string GeneratedDocumentation { get; set; } = null!;

        public int CutOff { get; set; }

        [Required, MaxLength(300)]
        [Column("Key_Report")]
        public string KeyReport { get; set; } = null!;

        [Column("Is_Current")]
        public bool? IsCurrent { get; set; }

        // Back reference
        public ML.ScorefyTblEvaluationsGenerate? EvaluationsGenerate { get; set; }

    }

    public class ValidateExtraRequest
    {
        public int ClientId { get; set; }
        public int EmployeeId { get; set; }
        public int CutOff { get; set; }
    }

    public class ValidateExtraInfo
    {
        public bool Available { get; set; }
        public string Message { get; set; } = string.Empty;
    }


    public class ClientLookupResult
    {
        public int ClientId { get; set; }
        public string? ClientName { get; set; }
        public bool Found { get; set; }

        public int CutOff { get; set; }            // 1 o 2
        public string CutOffText { get; set; } = string.Empty; // sólo informativo

    }

    public class EmployeeOption
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;

        public string Email { get; set; }
    }


}
