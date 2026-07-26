using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Specialist
{
    public class SpecialistBreakdownBatchDTO
    {
        public Guid P8Id { get; set; }
        public int CostCenter { get; set; }
        public string SpecialistServiceLineLabel { get; set; }
        public List<SpecialistBreakdownDTO> Rows { get; set; }
    }
}
