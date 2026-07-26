namespace ML
{
    using System.Collections.Generic;

    public class ReportsViewModel
    {
        // Filtros seleccionados
        public string Period { get; set; } = "Q4 2025";
        public string Status { get; set; } = "all";
        public string Role { get; set; } = "all";
        public string Client { get; set; } = "all"; 

        // Catálogos
        public List<string> Periods { get; set; } = new() { "Q4 2025", "Q1 2026", "Q2 2026" };
        public List<string> Roles { get; set; } = new() { "Senior Consultant", "Staff Accountant", "Manager", "Senior Manager" };
        public List<string> Clients { get; set; } = new() { "Acme Corporation", "TechStart Inc", "Global Enterprises", "Innovation Labs" };

        // KPIs
        public int TotalEvaluations { get; set; }
        public int Pending { get; set; }
        public int InProgress { get; set; }
        public int Completed { get; set; }
        public int RemindersSent { get; set; }
        public int ExceptionsOpen { get; set; }

        // Distribución de calificaciones (1..3)
        public int Score1 { get; set; } // Needs Development
        public int Score2 { get; set; } // Competent
        public int Score3 { get; set; } // Strong Performance

        // Serie temporal para Open PD promedio (por semana o por mes)
        public List<TrendPoint> OpenPdTrend { get; set; } = new();

        // Top clientes (por volumen o desempeño)
        public List<ClientAggregate> TopClients { get; set; } = new();
    }

    public class TrendPoint
    {
        public string Label { get; set; } = ""; // ej. "W1", "W2" o "Jan", "Feb"
        public double Value { get; set; }       // promedio Open PD (1..5; 1 es mejor)
    }

    public class ClientAggregate
    {
        public string ClientName { get; set; } = "";
        public int Evaluations { get; set; }
        public double AvgOpenPd { get; set; }
        public string StatusMix { get; set; } = ""; // texto, ej: "2/1/5 (P/Pr/C)"
    }
}
