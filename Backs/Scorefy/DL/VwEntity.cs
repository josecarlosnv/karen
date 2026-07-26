using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEntity
{
    public long? EntityId { get; set; }

    public string? EntityDescription { get; set; }

    public long? EntityGroupId { get; set; }

    public string? EntityGroupDescription { get; set; }

    public string? EntitySector { get; set; }

    public string? EntityLob { get; set; }
}
