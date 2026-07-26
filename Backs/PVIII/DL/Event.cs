using System;
using System.Collections.Generic;

namespace DL;

public partial class Event
{
    public int EventId { get; set; }

    public string EntityGroupNumber { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly EventDate { get; set; }
}
