using System;
using System.Collections.Generic;

namespace DL;

public partial class TrainingSession
{
    public int PkTrainingId { get; set; }

    public int? CalendarBookId { get; set; }

    public int? TrainingTypeId { get; set; }

    public string? TrainingDescription { get; set; }

    public double? TrainingHours { get; set; }

    public TimeOnly? TrainingStartTime { get; set; }

    public string? TrainingComments { get; set; }

    public double? TrainingDuration { get; set; }
}
