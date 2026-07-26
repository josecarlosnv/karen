using System;
using System.Collections.Generic;

namespace DL;

public partial class IntelligencestUpdate
{
    public int Id { get; set; }

    public string Type { get; set; } = null!;

    public string? Area { get; set; }

    public string? Title { get; set; }

    public string Message { get; set; } = null!;

    public string? Subtitle { get; set; }

    public string? Icon { get; set; }

    public bool? IsActive { get; set; }

    public int? DisplayOrder { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
