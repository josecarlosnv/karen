namespace DL;

public partial class LqmCatManagerDatum
{
    public int MgrDataPK { get; set; }
    public string ManagerEmployeeId { get; set; } = null!;
    public string ManagerName { get; set; } = null!;
    public string? ManagerTitle { get; set; }
    public string? Practice { get; set; }
    public string? BusinessUnitIdLabel { get; set; }
    public string? OfficeLabel { get; set; }
    public string? ManagerEmail { get; set; }
    public string? Fy { get; set; }
    public string? ManagerDataUniqueKey { get; set; }
}
