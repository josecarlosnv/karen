using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ML
{
    public class Vw_scorefy_employees
    {

        [Required, MaxLength(62)]
        [Column("Full_name")] 
        public string FullName { get; set; } = null!;

        [MaxLength(50)]
        public string? Local_Job_Level_Name { get; set; }

        [MaxLength(20)]
        public string? Cost_Center { get; set; }

        public int? Employee_Id { get; set; }

        [MaxLength(30)]
        public string? Location_Name { get; set; }

        [MaxLength(50)]
        public string? Email_Address_Business { get; set; }

        [MaxLength(20)]
        public string? BU { get; set; }

        public int? EmployeeType { get; set; }

        [Required]
        public int IsActive { get; set; }

        public List<object>? Employees { get; set; }

    }
}
