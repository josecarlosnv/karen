using System;
using System.Collections.Generic;

namespace DL;

public partial class Entity
{
    public int? EntityReleasedStatus { get; set; }

    public int? EntityArchivalFlag { get; set; }

    public long? EntityGroupId { get; set; }

    public string? EntityGroupDescription { get; set; }

    public long? EntityId { get; set; }

    public string? EntityDescription { get; set; }

    public string? EntityLob { get; set; }

    public string? EntitySector { get; set; }

    public string? EntitySic { get; set; }

    public string? Region { get; set; }

    public string? Country { get; set; }

    public string? StreetConcatenation { get; set; }

    public string? PostalCode { get; set; }
}
