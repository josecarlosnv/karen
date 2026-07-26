using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiTblProyectApprovalsDetail
{
    public int P8AppovalsPk { get; set; }

    public string P8Id { get; set; } = null!;

    public bool? LeapValidation { get; set; }

    public string? LeapCompetenceDocumentation { get; set; }

    public string? LeapCapabilitiesDocumentation { get; set; }

    public string? LeapObjectivityDocumentation { get; set; }

    public string? LeapTimeDocumentation { get; set; }

    public string? LeapFinancialDocumentation { get; set; }

    public bool? Picvalidation { get; set; }

    public string? PiccompetenceDocumentation { get; set; }

    public string? PiccapabilitiesDocumentation { get; set; }

    public string? PicobjectivityDocumentation { get; set; }

    public string? PictimeDocumentation { get; set; }

    public string? PicfinancialDocumentation { get; set; }

    public bool? HofAvalidation { get; set; }

    public string? HofAcompetenceDocumentation { get; set; }

    public string? HofAcapabilitiesDocumentation { get; set; }

    public string? HofAobjectivityDocumentation { get; set; }

    public string? HofAtimeDocumentation { get; set; }

    public string? HofAfinancialDocumentation { get; set; }

    public bool? Buppvalidation { get; set; }

    public string? BuppcompetenceDocumentation { get; set; }

    public string? BuppcapabilitiesDocumentation { get; set; }

    public string? BuppobjectivityDocumentation { get; set; }

    public string? BupptimeDocumentation { get; set; }

    public string? BuppfinancialDocumentation { get; set; }

    public bool? IsActive { get; set; }

    public long? RecordChangeSequence { get; set; }

    public DateTime? Create { get; set; }

    public string CreateBy { get; set; } = null!;
}
