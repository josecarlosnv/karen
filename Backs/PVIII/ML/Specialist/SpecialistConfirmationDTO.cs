using System;
using System.Collections.Generic;
using System.Text;

namespace ML.Specialist
{
    public class SpecialistConfirmationDTO
    {
        public int SpecialistConfirmationId { get; set; }

        public bool ConfirmationIndicator { get; set; }

        public decimal? AgreedFeesSpecialist { get; set; }

        public string? P8Id { get; set; } = null!;

        public string? CreatedByUserEmail { get; set; } = null!;

        public DateTime CreatedDateTime { get; set; }

        public int RecordChangeSequence { get; set; }

        public string? ConfirmationComments { get; set; }

        public int CostCenter { get; set; }

        public string SpecialistServiceLineLabel { get; set; } = null!;
    }

}

