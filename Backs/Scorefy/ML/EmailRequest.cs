using System;
using System.Collections.Generic;
using System.Text;

namespace ML
{
    public class EmailRequest
    {
        public string Para { get; set; } = string.Empty;
        public string Asunto { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Mensaje { get; set; } = string.Empty;


        public string? FromEmail { get; set; } 
        public string? FromName {get; set;}

        }
    }
