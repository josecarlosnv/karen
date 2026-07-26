using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblAuditNote
{
    public int? EmployeeId { get; set; }

    public string FullName { get; set; } = null!;

    public string? Bu { get; set; }

    public string? LocalJobName { get; set; }

    public string? LocationName { get; set; }

    public string FullTime { get; set; } = null!;

    public string? PersonalNumber { get; set; }

    public bool? IsStudying { get; set; }

    public string? SchoolName { get; set; }

    public string? Schedule { get; set; }

    public string? GraduationDate { get; set; }

    public string? PostalCode { get; set; }

    public string? Address { get; set; }

    public bool? IsGraduated { get; set; }

    public bool? AvailableForTravel { get; set; }

    public int? IsFullTime { get; set; }

    public string? EmergencyContactName { get; set; }

    public string? EmergencyContactPersonalNumber { get; set; }

    public int? TerminationDate { get; set; }

    public string? TerminationReason { get; set; }

    public bool? TerminationStatus { get; set; }

    public int? StatusUpdate { get; set; }
}
