import { Link } from "react-router";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Clock,
  Building2,
  Calendar,
} from "lucide-react";
import { motion } from "motion/react";

const reportCards = [
  {
    id: "1",
    title: "P8 Dashboard",
    description: "Comprehensive overview of all P8 engagements",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600",
    metrics: ["24 Active", "12 Approved", "8 Pending"],
  },
  {
    id: "2",
    title: "Revenue Analytics",
    description: "Revenue trends and projections by segment",
    icon: DollarSign,
    color: "from-emerald-500 to-emerald-600",
    metrics: ["$12.4M Total", "+8.5% YoY", "42% Margin"],
  },
  {
    id: "3",
    title: "Specialist Utilization",
    description: "Specialist engagement and confirmation rates",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    metrics: ["156 Specialists", "94% Confirmed", "12 Practices"],
  },
  {
    id: "4",
    title: "Hours Analysis",
    description: "Staffing hours breakdown and variance tracking",
    icon: Clock,
    color: "from-cyan-500 to-cyan-600",
    metrics: ["45.2K Hours", "+6.3% vs PY", "1,420 Avg/P8"],
  },
  {
    id: "5",
    title: "Client Portfolio",
    description: "Client segmentation and engagement summary",
    icon: Building2,
    color: "from-pink-500 to-pink-600",
    metrics: ["128 Clients", "85 Active", "15 New"],
  },
  {
    id: "6",
    title: "Performance Trends",
    description: "Key performance indicators over time",
    icon: TrendingUp,
    color: "from-indigo-500 to-indigo-600",
    metrics: ["Q1 2026", "+12% Growth", "Top 10 Insights"],
  },
  {
    id: "7",
    title: "Approval Pipeline",
    description: "Status and aging of pending approvals",
    icon: FileText,
    color: "from-amber-500 to-amber-600",
    metrics: ["8 Pending", "2.4 Days Avg", "98% On Time"],
  },
  {
    id: "8",
    title: "Calendar View",
    description: "Engagement timeline and key milestones",
    icon: Calendar,
    color: "from-slate-500 to-slate-600",
    metrics: ["12 This Month", "18 Next Month", "6 Overdue"],
  },
];

export default function Reports() {
  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0C233C] via-[#00338D] to-[#1E49E2] px-6 py-12 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-3">P8 Reports Hub</h1>
            <p className="text-lg text-blue-100">
              Access comprehensive analytics and insights for P8 engagements
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6">
        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link to={`/reports/${report.id}`} className="block group h-full">
                <div className="h-full bg-white rounded-xl border border-slate-200 p-6 transition-all hover:shadow-xl hover:border-slate-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
                    >
                      <report.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900 group-hover:text-[#00338D] transition-colors mb-1">
                        {report.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    {report.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {metric}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <span className="text-sm font-medium text-[#00338D] group-hover:text-[#1E49E2] transition-colors">
                      View Report →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-xl border border-slate-200 p-8"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Quick Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-600 mb-1">Total P8s YTD</p>
              <p className="text-3xl font-bold text-slate-900">248</p>
              <p className="text-xs text-emerald-600 mt-1">+18% vs last year</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Total Revenue YTD</p>
              <p className="text-3xl font-bold text-slate-900">$24.8M</p>
              <p className="text-xs text-emerald-600 mt-1">+12.5% vs last year</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Avg Turnaround</p>
              <p className="text-3xl font-bold text-slate-900">2.4d</p>
              <p className="text-xs text-slate-600 mt-1">Within SLA</p>
            </div>
            <div>
              <p className="text-xs text-slate-600 mb-1">Approval Rate</p>
              <p className="text-3xl font-bold text-slate-900">98%</p>
              <p className="text-xs text-emerald-600 mt-1">First-time approvals</p>
            </div>
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Need Custom Reports?
              </h3>
              <p className="text-sm text-slate-600">
                Export data or request custom analytics from the admin team
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                Export Data
              </button>
              <button className="px-4 py-2 bg-[#00338D] text-white rounded-lg text-sm font-medium hover:bg-[#1E49E2] transition-colors">
                Request Report
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
