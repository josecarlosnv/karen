using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEmtReappointHistoric
{
    public int GeneratedReap { get; set; }

    public long? EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? Bu { get; set; }

    public string? Office { get; set; }

    public long? EntityId { get; set; }

    public string? EntityName { get; set; }

    public int? Fy { get; set; }

    public string? EmtSsrequiDesc { get; set; }

    public int? EmtSectorId { get; set; }

    public string? EmtSectorDesc { get; set; }

    public int? YearReappointment { get; set; }

    public int? YearAppointment { get; set; }

    public long? CeacId { get; set; }

    public int? EngagementId { get; set; }

    public string? EngagementName { get; set; }

    public long? LeadPartnerId { get; set; }

    public string? LeadPartnerName { get; set; }

    public bool? ChangesNatureEngament { get; set; }

    public bool? LocalListed { get; set; }

    public bool? UsListed { get; set; }

    public bool? OtherCountryListed { get; set; }

    public bool? RegulatedIndustry { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? HasThreats { get; set; }

    public int EmtReapHistfullPk { get; set; }

    public string KeyEmt { get; set; } = null!;
}
