using System;
using System.Collections.Generic;

namespace DL;

public partial class AipFactCalendarbook
{
    public int PkCalendarbooksId { get; set; }

    public int StartDate { get; set; }

    public int EndDate { get; set; }

    public string FkUserId { get; set; } = null!;

    public int? FkTimeoffId { get; set; }

    public int? FkRequestId { get; set; }

    public string? FkProjectId { get; set; }

    public int? FkAssignmentTypeId { get; set; }

    public int? FkTraining { get; set; }

    public int? FkComments { get; set; }

    public int? Duration { get; set; }

    public int UpdateStatus { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? OtherFunction { get; set; }

    public int StatusRegistro { get; set; }
}
