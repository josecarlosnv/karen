using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtDimFiscalYear
{
    public int EmtFyId { get; set; }

    public int? EmtFyDesc { get; set; }

    public bool? IsCfy { get; set; }

    public bool? IsPfy { get; set; }

    public bool? IsCurrent { get; set; }
}
