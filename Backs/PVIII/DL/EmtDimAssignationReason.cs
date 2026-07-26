using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimAssignationReason
{
    public int EmtReasonId { get; set; }

    public string? EmtReasonDesc { get; set; }

    public bool? IsCurrent { get; set; }

    public virtual ICollection<EmtTblAssignmentsBasicInformation> EmtTblAssignmentsBasicInformations { get; set; } = new List<EmtTblAssignmentsBasicInformation>();
}
