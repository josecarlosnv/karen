using System;
using System.Collections.Generic;

namespace DL;

public partial class ClientCare
{
    public int IdEvaluación { get; set; }

    public string? SocioclientCare { get; set; }

    public int Ejercicio { get; set; }

    public DateOnly? Fechadeinicio { get; set; }

    public string Estatus { get; set; } = null!;

    public string? OperadoraCargo { get; set; }

    public long? IdentificadorIbs { get; set; }

    public string? Práctica { get; set; }

    public string Cliente { get; set; } = null!;

    public string? Empresa { get; set; }

    public string? ServicioProducto { get; set; }

    public int IdEvaluacionSolicitudInformacion { get; set; }

    public string? FormatoSolicitud { get; set; }

    public string? Un { get; set; }

    public string? Lob { get; set; }

    public bool? Requisitada { get; set; }

    public DateOnly? FechaDeInicioDeLaEvaluación { get; set; }

    public string? NombreSocio { get; set; }

    public string? Puesto { get; set; }

    public string DireccionCorreo { get; set; } = null!;

    public string? Sector { get; set; }

    public string? Oficina { get; set; }

    public string? Honorarios { get; set; }

    public string? ClienteDesde { get; set; }

    public int? IdFormatosolicitudinformacion { get; set; }

    public int IdContactoCc { get; set; }

    public int IdEvaluacionSolicitudServicio { get; set; }

    public string? DescripciónDetalladaServiciosKpmg { get; set; }

    public int IdPregunta { get; set; }

    public string Pregunta { get; set; } = null!;

    public int IdCat { get; set; }

    public int? IdPreguntaCategoriaPadre { get; set; }

    public string? Descripcion { get; set; }

    public int? Orden { get; set; }

    public string? Formato { get; set; }

    public int EsPregunta { get; set; }

    public int? OrdenPregunta { get; set; }

    public int IdPreguntaTipo { get; set; }

    public int IdCuestionarioFormatoPregunta { get; set; }

    public int IdRespuesta { get; set; }

    public string? Respuesta { get; set; }

    public double? ValorNumerico { get; set; }

    public string? EjecutivosEntrevistados { get; set; }

    public string? Rol { get; set; }

    public string? Resumen { get; set; }

    public string? SugerenciaCc { get; set; }

    public string? SeguimientoRequerido { get; set; }

    public string? PercepcionInterna { get; set; }

    public string? OportunidadesDetectadas { get; set; }
}
