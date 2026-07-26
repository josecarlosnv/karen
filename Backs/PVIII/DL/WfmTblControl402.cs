using System;
using System.Collections.Generic;

namespace DL;

public partial class WfmTblControl402
{
    public int IdReport { get; set; }

    public string ClientNumber { get; set; } = null!;

    public int PartnerId { get; set; }

    public bool AprCp8Pp8 { get; set; }

    public bool AprCp8Pibs { get; set; }

    public bool AprCspPsp { get; set; }

    public string? ComCp8Pp8 { get; set; }

    public string? ComCp8Pibs { get; set; }

    public string? ComCspPsp { get; set; }

    public bool? Vigencia { get; set; }

    public string? Bu { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public string? ModifiedBy { get; set; }

    public DateOnly? CutOffDate { get; set; }
}
