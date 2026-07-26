using System;
using System.Collections.Generic;

namespace DL;

public partial class Report402
{
    public int IdReport { get; set; }

    public string? ClientNumber { get; set; }

    public string? ClientName { get; set; }

    public string? PartnerId { get; set; }

    public string? PartnerName { get; set; }

    public string? Chp8 { get; set; }

    public string? PHp8 { get; set; }

    public string? Phsp { get; set; }

    public string? Phibs { get; set; }

    public string? Phibsspe { get; set; }

    public string? VarChp8PHp8 { get; set; }

    public string? VarChp8Phibs { get; set; }

    public string? VarChp8Chibsspe { get; set; }

    public DateOnly? DateRegister { get; set; }
}
