using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblSecurity
{
    public int IdCptSecurity { get; set; }

    public string Email { get; set; } = null!;

    public string? Nombre { get; set; }

    public string Role { get; set; } = null!;

    public int? IdType { get; set; }

    public string? DescriptionType { get; set; }

    public string? Bu { get; set; }

    public string? Office { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
