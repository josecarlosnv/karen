using System;
using System.Collections.Generic;

namespace DL;

public partial class FeeEsp
{
    public int FeeEspId { get; set; }

    public string EspFunction { get; set; } = null!;

    public string EspPractice { get; set; } = null!;

    public string Oficina { get; set; } = null!;

    public string Categoria { get; set; } = null!;

    public decimal FeeEsp1 { get; set; }

    public int Fy { get; set; }
}
