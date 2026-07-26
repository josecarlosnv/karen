using System;
using System.Collections.Generic;

namespace DL;

public partial class AipTblAuditNote
{
    public int AuditId { get; set; }

    public int EmployeeId { get; set; }

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

    public int StatusUpdate { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public virtual AipDimWorktype? IsFullTimeNavigation { get; set; }
}
