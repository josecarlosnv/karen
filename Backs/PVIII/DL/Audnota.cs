using System;
using System.Collections.Generic;

namespace DL;

public partial class Audnota
{
    public int AudnotasId { get; set; }

    public DateOnly? Modified { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public string? ModifiedBy { get; set; }

    public string? Estudia { get; set; }

    public bool? Isfulltime { get; set; }

    public bool? Dispxviaje { get; set; }

    public string? Antigpuestoactual { get; set; }

    public bool? Celular { get; set; }

    public string? Comentarios { get; set; }

    public string? Contactoemerg { get; set; }

    public bool? Cp { get; set; }

    public string? Dispxviajename { get; set; }

    public string? Domicilio { get; set; }

    public bool? Employeeid { get; set; }

    public string? Escuelacampus { get; set; }

    public string? Esquema { get; set; }

    public string? Estudianame { get; set; }

    public string? Fechafinestudios { get; set; }

    public DateTime? Fechaingresofirma { get; set; }

    public DateTime? Fechanacimiento { get; set; }

    public DateOnly? Fechapromocion { get; set; }

    public string? Horarioclases { get; set; }

    public string? Nombre { get; set; }

    public string? Puesto { get; set; }

    public string? Titulado { get; set; }

    public bool? Costcenter { get; set; }

    public string? Productodescrip { get; set; }

    public string? Fullname { get; set; }

    public string? Istfulltime { get; set; }

    public string? Isfulltimename { get; set; }
}
