using System;
using System.Collections.Generic;

namespace DL;

public partial class Asignacione
{
    public int IdDb { get; set; }

    public string? AsigDescrip { get; set; }

    public int? EmployeeId { get; set; }

    public DateTime? Fecha { get; set; }

    public int? Horas { get; set; }

    public string? IdConflicto { get; set; }

    public string? IdPviii { get; set; }

    public string? Qguid { get; set; }

    public int? Tipo { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedOn { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public bool? Vigencia { get; set; }

    public int? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
