using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatRiskLevel
{
    public int RiskLevelId { get; set; }

    public string RiskLevelLabel { get; set; } = null!;

    public virtual ICollection<PviiiTblProyectQualityDetail> PviiiTblProyectQualityDetailCyCeacNavigations { get; set; } = new List<PviiiTblProyectQualityDetail>();

    public virtual ICollection<PviiiTblProyectQualityDetail> PviiiTblProyectQualityDetailPyCeacNavigations { get; set; } = new List<PviiiTblProyectQualityDetail>();
}
