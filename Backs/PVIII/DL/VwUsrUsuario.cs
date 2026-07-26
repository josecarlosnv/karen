using System;
using System.Collections.Generic;

namespace DL;

public partial class VwUsrUsuario
{
    public int IdUsrUsuario { get; set; }

    public string? NumeroEmpleado { get; set; }

    public string? NombreCompleto { get; set; }

    public string Nombre { get; set; } = null!;

    public string ApellidoPaterno { get; set; } = null!;

    public string ApellidoMaterno { get; set; } = null!;

    public string? NomUsuario { get; set; }

    public string DireccionCorreo { get; set; } = null!;

    public bool UsuarioActivo { get; set; }

    public string? Puesto { get; set; }

    public string? Oficina { get; set; }

    public string? Departamento { get; set; }

    public string? Practica { get; set; }

    public string? Segmento { get; set; }

    public string? SubSegmento { get; set; }

    public int IdTipoUsuario { get; set; }

    public int? IdIdioma { get; set; }

    public int? IdUsrUsuarioKpmg { get; set; }

    public int? IdOficina { get; set; }

    public int? IdPuestoKpmg { get; set; }

    public int? IdSubSegmento { get; set; }

    public int? IdDepartamento { get; set; }

    public int? IdPractica { get; set; }

    public int? IdSegmento { get; set; }
}
