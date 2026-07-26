using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblReappointHistoric
{
    public long? EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public string? LocalJobLevelName { get; set; }

    public string? Bu { get; set; }

    public string? Office { get; set; }

    public decimal? EntityId { get; set; }

    public string? EntityName { get; set; }

    public int? Fy { get; set; }

    public string? EmtSsrequiIdConcat { get; set; }

    public int? EmtTypePk { get; set; }

    public string? EmtSectorDesc { get; set; }

    public int? YearReappointment { get; set; }

    public int? YearAppointment { get; set; }

    public long? CeacId { get; set; }

    public long? EngagementId { get; set; }

    public string? EngagementName { get; set; }

    public int? LeadPartnerId { get; set; }

    public string? LeadPartnerName { get; set; }

    public bool? ChangesNatureEngament { get; set; }

    public bool? LocalListed { get; set; }

    public bool? UsListed { get; set; }

    public bool? OtherCountryListed { get; set; }

    public bool? RegulatedIndustry { get; set; }

    public bool? TwoYearCooling { get; set; }

    public bool? HasThreats { get; set; }

    public int EmtReapHistPk { get; set; }

    public bool? IsReappointGenerated { get; set; }

    public Guid KeyEmt { get; set; }
}
