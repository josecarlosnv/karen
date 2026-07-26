using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatOfficina
{
    public int OficinaId { get; set; }

    public string? Oficina { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;
}
