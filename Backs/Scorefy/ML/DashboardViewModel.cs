
namespace ML
{
    using System.Collections.Generic;


    public class DashboardViewModel
    {
        // KPIs
        public int PendingEvaluations { get; set; }
        public int InProgress { get; set; } 
        public int RemindersSent { get; set; }
        public int OpenExceptions { get; set; }
        public int TrendVsLastPeriodPercent { get; set; } // e.g., +12

        // Recent Activity
        public List<ActivityItem> RecentActivity { get; set; } = new();

        // (Opcional) Quick actions si quieres parametrizarlas
        public List<QuickActionItem> QuickActions { get; set; } = new();
    }

    public class ActivityItem
    {
        public string Title { get; set; } = "";
        public string When { get; set; } = "";          // e.g., "2 hours ago"
        public string StatusChip { get; set; } = "";    // "In Progress" | "Completed" | "Sent"
    }

    public class QuickActionItem
    {
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string Href { get; set; } = "";
        public string Icon { get; set; } = ""; // "self", "review", "remind"
    }

}
