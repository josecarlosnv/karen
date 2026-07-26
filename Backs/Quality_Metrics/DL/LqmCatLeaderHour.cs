namespace DL;

public partial class LqmCatLeaderHour
{
    public int LeaderHoursKey { get; set; }
    public string LeaderEmployeeId { get; set; } = null!;
    public string? Fy { get; set; }
    public string? LeaderDataUniqueKey { get; set; }
    public decimal? TotalHours { get; set; }
    public string? Waiver { get; set; }
    public int? HoursTarget { get; set; }
    public DateTime? JobEntryDate { get; set; }
    public int? ComplianceValidation { get; set; }   // 1 y 3 = cumple · 2 = no cumple
    
}
