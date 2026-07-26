using System;
using System.Collections.Generic;

namespace DL;

public partial class Contact
{
    public string IdContact { get; set; } = null!;

    public string EntityGroupNumber { get; set; } = null!;

    public bool StrategicContact { get; set; }

    public bool Coach { get; set; }

    public bool EconomicInfluence { get; set; }

    public bool TecnicalInfluence { get; set; }

    public bool Alumni { get; set; }

    public bool Super9 { get; set; }
}
