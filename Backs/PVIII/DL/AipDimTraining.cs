using System;
using System.Collections.Generic;

namespace DL;

public partial class AipDimTraining
{
    public int TrainingId { get; set; }

    public string? TrainingTypeDescription { get; set; }

    public double? TrainingDuration { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public string? Session { get; set; }

    public int? Anno { get; set; }
}
