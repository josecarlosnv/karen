using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatOffice
{
    public int OficinaId { get; set; }

    public string Oficina { get; set; } = null!;

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int RecordChangeSequence { get; set; }

    public string OwnerEmail { get; set; } = null!;

    public virtual ICollection<PviiiTblProyectDetail> PviiiTblProyectDetails { get; set; } = new List<PviiiTblProyectDetail>();
}
