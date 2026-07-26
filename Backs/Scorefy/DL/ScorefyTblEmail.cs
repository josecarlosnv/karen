using System;
using System.Collections.Generic;
using System.Text;

namespace DL;

public partial class ScorefyTblEmail
{
    public int IdEmail { get; set; }

    public string ToEmail { get; set; } = null!;

    public string? ToName { get; set; }

    public string FromEmail { get; set; } = null!;

    public string? FromName { get; set; }

    public string Body { get; set; } = null!;

    public string ContextKey { get; set; } = null!;

    public string EmailType { get; set; } = null!;

    public int? IdentitySect { get; set; }

    public DateTime Created { get; set; }
}

