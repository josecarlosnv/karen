using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiFactTeamMember
{
    public short? ClientTenureYears { get; set; }

    public string? CreatedByUserEmail { get; set; }

    public DateTime? CreatedDateTime { get; set; }

    public string? MemberEmail { get; set; }

    public int MemberEmployeeId { get; set; }

    public decimal? MemberFeeAmount { get; set; }

    public decimal? MemberHours { get; set; }

    public string? MemberName { get; set; }

    public decimal? MemberRateAmount { get; set; }

    public Guid P8Id { get; set; }

    public int P8TeamMemberId { get; set; }

    public long RecordChangeSequence { get; set; }

    public int TeamRoleTypeId { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }
}
