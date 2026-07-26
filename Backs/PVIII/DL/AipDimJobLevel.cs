using System;
using System.Collections.Generic;

namespace DL;

public partial class AipDimJobLevel
{
    public int IdLevelJob { get; set; }

    public string NameJob { get; set; } = null!;

    public DateOnly? CreateAt { get; set; }

    public string CreateBy { get; set; } = null!;
}
