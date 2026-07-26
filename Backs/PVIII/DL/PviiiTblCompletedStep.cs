using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblCompletedStep
{
    public int Id { get; set; }

    public string P8id { get; set; } = null!;

    public byte StepNumber { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime ReatedAt { get; set; }

    public bool IsActive { get; set; }
}
