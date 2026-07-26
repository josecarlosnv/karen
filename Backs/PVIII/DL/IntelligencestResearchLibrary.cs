using System;
using System.Collections.Generic;

namespace DL;

public partial class IntelligencestResearchLibrary
{
    public int Id { get; set; }

    public string Category { get; set; } = null!;

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public string? Badge { get; set; }

    public string? ExternalLink { get; set; }

    public bool? IsActive { get; set; }

    public int? DisplayOrder { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
