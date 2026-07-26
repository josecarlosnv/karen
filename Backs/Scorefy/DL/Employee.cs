using System;
using System.Collections.Generic;

namespace DL;

public partial class Employee
{
    public int PayrollNumber { get; set; }

    public string Name { get; set; } = null!;

    public int ProductId { get; set; }

    public int? Officeid { get; set; }
}
