using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimAssignmentType
{
    public int EmtTypePk { get; set; }

    public string? AssignDesc { get; set; }

    public short? AssignId { get; set; }

    public bool? Assistant { get; set; }

    public string? SectorDesc { get; set; }

    public short? SectorId { get; set; }

    public string? ParentSectorDesc { get; set; }

    public short? ParentSectorId { get; set; }

    public bool? IsCurrent { get; set; }

    public virtual ICollection<EmtTblAssignmentsBasicInformation> EmtTblAssignmentsBasicInformations { get; set; } = new List<EmtTblAssignmentsBasicInformation>();

    public virtual ICollection<EmtTblForm> EmtTblForms { get; set; } = new List<EmtTblForm>();
}
