using System;
using System.Collections.Generic;

namespace DL;

public partial class Activity
{
    public int? GoalId { get; set; }

    public int ActivityTypeId { get; set; }

    public int ResponsableId { get; set; }

    public string Description { get; set; } = null!;

    public string? Place { get; set; }

    public int StatusId { get; set; }

    public string? Observations { get; set; }

    public DateTime PlanningDate { get; set; }

    public DateTime? DoneDate { get; set; }

    public int? RateId { get; set; }

    public int IndicatorTypeId { get; set; }

    public int? Sgi { get; set; }
}
