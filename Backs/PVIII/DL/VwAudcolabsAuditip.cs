using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAudcolabsAuditip
{
    public int? IdEmpleados { get; set; }

    public int? IdIngles { get; set; }

    public string? Categoria { get; set; }

    public string? Fullname { get; set; }

    public string Ingles { get; set; } = null!;

    public string Fulltime { get; set; } = null!;
}
