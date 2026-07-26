using System;
using System.Collections.Generic;

namespace DL;

public partial class SecurityAuditip
{
    public int IdSecurity { get; set; }

    public string UserEmail { get; set; } = null!;

    public string? Roles { get; set; }

    public string? Bu { get; set; }

    public string? Oficina { get; set; }
}
