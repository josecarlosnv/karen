using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmTblSecurity
{
    public int SecQrKey { get; set; }

    public string UserEmail { get; set; } = null!;

    public string UserRole { get; set; } = null!;

    public string BusinessUnitIdLabel { get; set; } = null!;

    public string OfficeLabel { get; set; } = null!;

    public bool IsBupic { get; set; }

    public bool IsHofA { get; set; }
}
