using System;
using System.Collections.Generic;

namespace DL;

public partial class AipTblComment
{
    public int IdComent { get; set; }

    public string? Comments { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }
}
