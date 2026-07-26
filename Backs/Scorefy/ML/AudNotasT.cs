using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{


    public class AudNotasT
    {
        public int AudNotasTId { get; set; } 

        public DateOnly? Modified { get; set; }

        public DateOnly? Created { get; set; }

        public string? CreatedBy { get; set; }

        public string? ModifiedBy { get; set; }

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

        public string? ColumnA { get; set; }

        public string? ColumnB { get; set; }

        public int? ColumnC { get; set; }

        public int? ColumnD { get; set; }
    }
}