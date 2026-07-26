namespace DL;

public partial class LqmTblLeaderDatum
{
    public int LeaderDataPK { get; set; }
    public string LeaderEmployeeID { get; set; } = null!;   // char(8)
    public string LeaderName { get; set; } = null!;
    public string? FiscalYearLabel { get; set; }            // FY es texto ("2026")
    public string LeaderTitle { get; set; } = null!;
    public string Practice { get; set; } = null!;
    public string BusinessUnitIdLabel { get; set; } = null!;
    public string OfficeLabel { get; set; } = null!;
    public bool? IsHofa { get; set; }                       // isHofA
    public bool? IsBupic { get; set; }                      // IsBUPIC

    public string? LeaderDataUniqueKey { get; set; }        // computed
    public string LeaderEmail { get; set; } = null!;
    public string? NetworkId { get; set; }                  // Network_Id
    public string? AllowedOffices { get; set; }             // allowedOffices — "Mexico,Queretaro" · NULL = todas

}
