using System;
using System.Collections.Generic;

namespace DL;

public partial class AipDimTimeOff
{
    public int CodeInt { get; set; }

    public string IbsCode { get; set; } = null!;

    public string IbsCodeDescription { get; set; } = null!;

    public string Concept { get; set; } = null!;

    public string Use { get; set; } = null!;
}
