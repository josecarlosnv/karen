

import { useEffect, useState } from "react";
import { KPICard } from "../components/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ClipboardList,
  CheckSquare,
  Bell,
  AlertCircle,
  TrendingUp,
  BarChart3,
  User,
  FileCheck,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";

function truncateText(text?: string, max = 10) {
  if (!text) return "";
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1) + "…";
}

function splitClientAndRole(title?: string) {
  if (!title) return { client: "", rest: "" };

  // separador típico de tu UI: "CLIENTE — ROL"
  const parts = title.split("—").map(s => s.trim());
  if (parts.length === 1) return { client: title.trim(), rest: "" };

  const client = parts[0];
  const rest = parts.slice(1).join(" — ");
  return { client, rest };
}


export function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_SCOREFY_API_URL;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dashboard`, {
          credentials: "include"
        });
        const data = await res.json();
        setSummary(data.summary);
        setRecent(data.recent);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Welcome back! Here's an overview of your performance evaluations.
        </p>
      </motion.div>

      {/* KPI CARDS */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants}>
          <KPICard
            title="Pending Evaluations"
            value={summary?.pending ?? "..."}
            icon={ClipboardList}
            href="/self-evaluations"
            gradient="var(--gradient-primary)"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KPICard
            title="Completed Evaluations"
            value={summary?.completed ?? "..."}
            icon={CheckSquare}
            href="/self-evaluations"
            gradient="var(--gradient-accent)"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KPICard
            title="Total Evaluations"
            value={summary?.total ?? "..."}
            icon={Bell}
            href="/self-evaluations"
            gradient="linear-gradient(135deg, #00B8F5 0%, #7213EA 100%)"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KPICard
            title="Open Exceptions"
            value={summary?.openExceptions ?? "..."}
            icon={AlertCircle}
            href="/status-reminders"
            gradient="var(--gradient-purple)"
          />
        </motion.div>
      </motion.div>

      {/* QUICK ACTIONS + RECENT ACTIVITY → Matching Height */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* QUICK ACTIONS */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card
            className="border-0 min-h-[300px]"
            style={{
              boxShadow: "var(--shadow-lg)",
              background: "linear-gradient(135deg, #FFFFFF 0%, rgba(248, 250, 252, 0.8) 100%)"
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {[
                {
                  title: "Create Self-Evaluation",
                  description: "Start a new self-evaluation for your current project",
                  icon: ClipboardList,
                  href: "/self-evaluations/",
                  gradient: "var(--gradient-primary)"
                },
                {
                  title: "Review Evaluations",
                  description: "View and complete pending manager evaluations",
                  icon: CheckSquare,
                  href: "/evaluations",
                  gradient: "var(--gradient-accent)"
                },
                {
                  title: "Send Reminders",
                  description: "Send reminders for pending evaluations",
                  icon: Bell,
                  href: "/status-reminders",
                  gradient: "var(--gradient-purple)"
                }
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Link
                    to={action.href}
                    className="group flex items-start gap-4 p-4 rounded-xl border border-border hover:border-transparent transition-all duration-300 relative"
                    style={{ background: "white", boxShadow: "var(--shadow-sm)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 51, 141, 0.10), 0 2px 4px rgba(0, 51, 141, 0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0, 51, 141, 0.08), 0 1px 2px rgba(0, 51, 141, 0.04)";
                    }}
                  >
                    {/* LEFT BLUE LINE */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "var(--kpmg-blue)" }}
                    />

                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: action.gradient }}
                    >
                      <action.icon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold group-hover:text-primary transition-colors">{action.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    </div>

                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* RECENT ACTIVITY */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Card
            className="border-0 min-h-[366px]"
            style={{
              boxShadow: "var(--shadow-lg)",
              background: "linear-gradient(135deg, #FFFFFF 0%, rgba(248, 250, 252, 0.8) 100%)"
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--gradient-primary)" }} />
                Recent Activity
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {recent.length === 0 && !loading && (
                  <p className="text-muted-foreground text-sm">No recent activity found.</p>
                )}

                {recent.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="group flex items-start justify-between p-4 rounded-xl border border-border hover:border-transparent transition-all duration-300 relative"
                    style={{ background: "white", boxShadow: "var(--shadow-sm)" }}
                  >
                    {/* BLUE LEFT LINE */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: activity.color ?? "var(--kpmg-blue)" }}
                    />

                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className="h-2 w-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: activity.color }}
                      />
                      <div className="flex-1">
                        
                        {(() => {
                          const { client, rest } = splitClientAndRole(activity.title);
                          const shortClient = truncateText(client, 25); // 👈 aquí defines el “cierto largo”

                          return (
                            <p
                              className="font-medium group-hover:text-primary transition-colors"
                              title={activity.title} // 👈 tooltip con el texto completo
                            >
                              {rest ? (
                                <>
                                  {shortClient} <span className="text-muted-foreground">— {rest}</span>
                                </>
                              ) : (
                                shortClient
                              )}
                            </p>
                          );
                        })()}

                        <p className="text-sm text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                        activity.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* POWER BI SECTION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: "var(--kpmg-blue)" }}>
            Analyze your evaluations
          </h2>
          <p className="text-muted-foreground mt-1">Access detailed dashboards in Power BI.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Manager Dashboard",
              description: "High-level performance and completion overview",
              audience: "Managers",
              icon: BarChart3,
              href: "https://app.powerbi.com/reportEmbed?reportId=640a22df-a160-46d5-b5a2-2d8abe5e3c40&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2"
            },
            {
              title: "Staff Dashboard",
              description: "Individual evaluation status and progress",
              audience: "Professional staff",
              icon: User,
              href: "https://app.powerbi.com/reportEmbed?reportId=69b07863-0bb5-4a48-807c-3b83577e49bc&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2"
            },
            {
              title: "Evaluation Tracking",
              description: "Operational tracking and control for assistants",
              audience: "Assistants and control teams",
              icon: FileCheck,
                href: "https://app.powerbi.com/reportEmbed?reportId=07cc0d7d-29cd-4140-9790-2e12fbffd5f3&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2"
            }
          ].map((dash, index) => (
            <motion.div
              key={dash.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <a
                href={dash.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-6 rounded-xl border border-border/50 transition-all duration-300 bg-white shadow-sm relative overflow-hidden"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 51, 141, 0.10), 0 2px 4px rgba(0, 51, 141, 0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 1px 3px rgba(0, 51, 141, 0.08), 0 1px 2px rgba(0, 51, 141, 0.04)")
                }
              >
                {/* LEFT BLUE LINE */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "var(--kpmg-blue)" }}
                />

                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-primary">
                    <dash.icon className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <h3 className="font-semibold mb-2 text-primary group-hover:text-primary">
                  {dash.title}
                </h3>
                <p className="text-sm text-muted-foreground">{dash.description}</p>

                <p className="text-xs text-muted-foreground mt-3">{dash.audience}</p>
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}