using System;
using System.Collections.Generic;

namespace DL;

public partial class Account
{
    public string EntityGroupNumber { get; set; } = null!;

    public string? Name { get; set; }

    public int? LeadPartnerId { get; set; }

    public int? LeadPartner2Id { get; set; }

    public int? Practic { get; set; }

    public int? BusinessUnit { get; set; }

    public int? Office { get; set; }

    public int? ClientType { get; set; }
}
