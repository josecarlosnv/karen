using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class CatEmpleado
    {
        public sealed class CatEmpleadoItemVM
        {
            public int EmployeeId { get; set; } 
            public string FullName { get; set; } = "";
        }

        public sealed class CatEmpleadoFilterVM
        {
            public bool HasAccess { get; set; } = true;
            public List<string> Warnings { get; set; } = new();
            public List<CatEmpleadoItemVM> Results { get; set; } = new();
        }
    }
}



