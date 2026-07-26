using System;
using System.Collections.Generic;

namespace DL;

public partial class CalendarbooksAudt
{
    public int CalendarbooksId { get; set; }

    public int FkUserId { get; set; }

    public int FkCalendarId { get; set; }

    public int? FkTimeOffId { get; set; }

    public int? FkRequestId { get; set; }

    public int? FkProjectId { get; set; }

    public int? FkAssignmentTypeId { get; set; }

    public int? FkTraining { get; set; }

    public int? UpdateStatus { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Comentts { get; set; }
}
