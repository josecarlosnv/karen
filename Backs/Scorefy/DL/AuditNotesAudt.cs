using System;
using System.Collections.Generic;

namespace DL;

public partial class AuditNotesAudt
{
    public int AuditNoteId { get; set; }

    public bool? Estudia { get; set; }

    public bool? DispxViaje { get; set; }

    public string? AntigPuestoActual { get; set; }

    public string? Comentarios { get; set; }

    public string? ContactoEmerg { get; set; }

    public int? Celular { get; set; }

    public int? Cp { get; set; }

    public string? Domicilio { get; set; }

    public int? EmployeeId { get; set; }

    public string? EscuelaCampus { get; set; }

    public string? Esquema { get; set; }

    public string? EstudiaName { get; set; }

    public string? FechaFinEstudios { get; set; }

    public DateOnly? FechaPromocion { get; set; }

    public string? HorarioClases { get; set; }

    public bool? Titulado { get; set; }

    public bool? FullTime { get; set; }

    public DateOnly? Modified { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public string? ModifiedBy { get; set; }
}
