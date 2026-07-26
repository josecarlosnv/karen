using System;
using System.Collections.Generic;

namespace DL;

public partial class DimUsersWorkload
{
    public string User { get; set; } = null!;

    public virtual ICollection<NonClientFacingHours1> NonClientFacingHours1s { get; set; } = new List<NonClientFacingHours1>();
}
