using System;
using System.Collections.Generic;

namespace DL;

public partial class AipDimWorktype
{
    public int IdWorktype { get; set; }

    public string NameJob { get; set; } = null!;

    public DateOnly? CreateAt { get; set; }

    public string CreateBy { get; set; } = null!;

    public virtual ICollection<AipTblAuditNote> AipTblAuditNotes { get; set; } = new List<AipTblAuditNote>();
}
