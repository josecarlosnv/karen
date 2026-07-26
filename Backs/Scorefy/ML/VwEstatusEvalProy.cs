using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class VwEstatusEvalProy
    {
        public int? PK_scorExceptions { get; set; }
        public bool? Is_Exception { get; set; } 
        public string? Reason_Exception { get; set; }
        public int? Event_Number { get; set; }
        public long? Client_ID { get; set; }
        public string? Client_Name { get; set; }
        public int? Employee_ID { get; set; }
        public string? Employee_Name { get; set; }
        public string? Email_Address_Business { get; set; }
        public string? Role { get; set; }
        public int? EvaluatorID { get; set; }
        public string? EvaluatorName { get; set; }
        public string? EvaluatorEmail { get; set; }
        public string? BU { get; set; }
        public string? Location_Name { get; set; }
        [Column(TypeName = "decimal(18,9)")] public decimal? Total_Hours { get; set; }
        [Column(TypeName = "decimal(18,9)")] public decimal? Chargeable_Hours { get; set; }
        public string? EstatusEvaluado { get; set; }
        public string? EstatusEvaluador { get; set; }
        public int? Generated_Type { get; set; }
        public int? Cut_Off { get; set; }
        public string? Key_Report { get; set; }

    }
}
