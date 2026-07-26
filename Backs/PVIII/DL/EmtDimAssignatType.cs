using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimAssignatType
{
    public int EmttypeId { get; set; }

    public string? EmttypeDescription { get; set; }

    public bool? IsCurrent { get; set; }

    public virtual ICollection<EmtTblAssign> EmtTblAssigns { get; set; } = new List<EmtTblAssign>();

    public virtual ICollection<EmtTblReappoint> EmtTblReappoints { get; set; } = new List<EmtTblReappoint>();
}
