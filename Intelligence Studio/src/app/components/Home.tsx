import { useOutletContext, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  Brain,
} from "lucide-react";
import {
  translations,
  type Language,
} from "../data/translations";
import {
  getUpdates,
  type StudioUpdate,
} from "../services/intelligencestService";
import fondoClaro from "../../imports/fondo_claro.jpg";
import fondoOscuro from "../../imports/fondo_oscuro.png";

interface Product {
  name: string;
  category: string;
  badge: "Live" | "New" | "Beta" | "Coming";
}

interface Suite {
  id: string;
  name: string;
  description: string;
  products: Product[];
  path: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const SUITES: Suite[] = [
  {
    id: "engagement",
    name: "Engagement Management",
    description:
      "Resource orchestration, staffing and engagement management for audit and advisory operations.",
    products: [
      { name: "PVIII", category: "Core Platform", badge: "Live" },
      { name: "AuditIP", category: "Analytics", badge: "Live" },
      { name: "Workload", category: "Operations", badge: "Live" },
      { name: "Workforce", category: "Operations", badge: "Live" },
      { name: "Client Proposal Tracker", category: "Pipeline", badge: "Live" },
      { name: "EQCR", category: "Quality", badge: "Beta" },
    ],
    path: "/engagement-operations",
    icon: Activity,
  },
  {
    id: "talent",
    name: "Performance Intelligence",
    description:
      "Performance intelligence, evaluation frameworks and quality metrics across all talent levels.",
    products: [
      { name: "Scorefy", category: "assessment", badge: "Live" },
      {
        name: "Partner & director performance indicators",
        category: "leadership metrics",
        badge: "New",
      },
      {
        name: "Manager performance dashboard",
        category: "performance",
        badge: "Live",
      },
      {
        name: "Professional staff performance dashboard",
        category: "performance",
        badge: "Live",
      },
    ],
    path: "/talent-assessment",
    icon: Users,
  },
  {
    id: "strategy",
    name: "Executive Insights",
    description:
      "Dashboards enabling performance visibility, forecasting, and strategic decision-making.",
    products: [
      { name: "Revenue Dashboard", category: "Executive", badge: "Live" },
      { name: "Portfolio Health", category: "Performance", badge: "Live" },
      { name: "Forecasting Engine", category: "Planning", badge: "Beta" },
    ],
    path: "/strategy-office",
    icon: BarChart3,
  },
  {
    id: "analytical-perspectives",
    name: "Analytical Perspectives",
    description:
      "Advanced analytical frameworks and visualization tools for data-driven strategic insights.",
    products: [
      {
        name: "Market Intelligence Dashboard",
        category: "Analytics",
        badge: "Live",
      },
      { name: "Trend Analysis Engine", category: "Insights", badge: "Beta" },
      {
        name: "Predictive Modeling Suite",
        category: "Forecasting",
        badge: "Coming",
      },
    ],
    path: "/analytical-perspectives",
    icon: Brain,
  },
  {
    id: "governance",
    name: "Governance",
    description:
      "Risk, compliance and audit governance frameworks aligned to enterprise standards.",
    products: [
      { name: "Risk Registry", category: "Compliance", badge: "Beta" },
      { name: "Policy Vault", category: "Documentation", badge: "Coming" },
      { name: "Audit Framework", category: "Oversight", badge: "Coming" },
    ],
    path: "/governance",
    icon: ShieldCheck,
  },
  {
    id: "learning",
    name: "Learning & Certification",
    description:
      "Audit-focused training dashboards and progress tracking for required programs.",
    products: [
      { name: "Learning Hub", category: "Platform", badge: "Beta" },
      { name: "Certification Tracker", category: "Compliance", badge: "Coming" },
      { name: "Skills Passport", category: "Development", badge: "Coming" },
    ],
    path: "/learning-enablement",
    icon: GraduationCap,
  },
];

// Mapa de iconos para los Recent Updates dinámicos
const ICON_MAP: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  TrendingUp,
  Clock,
  Activity,
  Users,
  BarChart3,
  CheckCircle2,
  Brain,
  ShieldCheck,
  GraduationCap,
};

interface ContextType {
  theme: "dark" | "light";
  language: Language;
  t: typeof translations.en;
}

export function Home() {
  const { t, theme } = useOutletContext<ContextType>();
  const navigate = useNavigate();

  const [recentUpdates, setRecentUpdates] = useState<StudioUpdate[]>([]);

  useEffect(() => {
    getUpdates("recent_update").then(setRecentUpdates).catch(() => {});
  }, []);

  const getUpdateIcon = (name?: string) => ICON_MAP[name ?? ""] ?? TrendingUp;

  const totalProducts = SUITES.reduce(
    (acc, suite) => acc + suite.products.length,
    0,
  );
  const liveProducts = SUITES.reduce(
    (acc, suite) =>
      acc + suite.products.filter((p) => p.badge === "Live").length,
    0,
  );

  return (
<div className="bg-background min-h-screen flex flex-col">

      {/* Enterprise Hero — taller to let cards overlap meaningfully */}
      <section className="relative overflow-hidden h-[520px]">
        {/* Background Image - Light Mode */}
        <div className="absolute inset-0 dark:hidden">
          <img
            src={fondoClaro}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/55 via-white/15 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
        </div>

        {/* Background Image - Dark Mode */}
        <div className="absolute inset-0 hidden dark:block">
          <img
            src={fondoOscuro}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-52 bg-gradient-to-t from-background via-background/55 to-transparent pointer-events-none" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-8 h-full">
          <div className="grid grid-cols-[1fr_400px] gap-16 h-full items-center">
            {/* Left: Value Proposition */}
            <div className="pt-8">
              <p
                className="text-[11px] tracking-[0.08em] capitalize font-medium mb-8 dark:text-white/60 text-foreground/60 dark:text-white/50 "
                style={{ fontFamily: "'IBM Plex Mono', monospace" }}
              >
                Enterprise Intelligence Platform
              </p>

              <h1 className="text-[42px] leading-[1.1] font-semibold mb-8  tracking-[-0.02em] text-[#00338D] dark:text-white ">
                Intelligence Studio
              </h1>

              <p className="text-[15px] leading-[1.7] max-w-[520px] dark:text-white/80 text-foreground/60 dark:text-white/50 ">
                A connected intelligence hub for KPMG Audit. Where products,
                analytics and insights come together to drive performance and
                informed decision-making.
              </p>
            </div>

            {/* Right: Live Ecosystem Panel - Responsive for light/dark */}
            <div
              className="rounded-lg overflow-hidden"
              style={{
                background:
                  theme === "dark"
                    ? "linear-gradient(160deg, rgba(13, 36, 61, 0.85) 0%, rgba(10, 22, 40, 0.75) 100%)"
                    : "linear-gradient(160deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 250, 255, 0.75) 100%)",
                backdropFilter: "blur(32px) saturate(180%)",
                WebkitBackdropFilter: "blur(32px) saturate(180%)",
                border:
                  theme === "dark"
                    ? "1px solid rgba(80, 160, 232, 0.2)"
                    : "1px solid rgba(0, 51, 141, 0.12)",
                boxShadow:
                  theme === "dark"
                    ? "0 0 0 1px rgba(80, 160, 232, 0.15) inset, 0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 120, 212, 0.15)"
                    : "0 0 0 1px rgba(0, 94, 184, 0.08) inset, 0 16px 48px rgba(0, 51, 141, 0.12), 0 0 32px rgba(0, 94, 184, 0.08)",
              }}
            >
              <div className="pt-6 px-6 pb-6 space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-md"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg, rgba(0, 120, 212, 0.12) 0%, rgba(0, 94, 184, 0.06) 100%)"
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(245, 250, 255, 0.4) 100%)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border:
                        theme === "dark"
                          ? "1px solid rgba(80, 160, 232, 0.25)"
                          : "1px solid rgba(0, 94, 184, 0.15)",
                      boxShadow:
                        theme === "dark"
                          ? "0 0 0 1px rgba(80, 160, 232, 0.15) inset, 0 4px 16px rgba(0, 120, 212, 0.15), 0 0 20px rgba(0, 120, 212, 0.1)"
                          : "0 0 0 1px rgba(0, 94, 184, 0.06) inset, 0 4px 12px rgba(0, 51, 141, 0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity
                        size={14}
                        className="text-accent"
                        style={{
                          filter:
                            theme === "dark"
                              ? "drop-shadow(0 0 4px rgba(0, 120, 212, 0.5))"
                              : "none",
                        }}
                      />
                      <span
                        className="text-[10px] font-medium tracking-[0.05em] capitalize text-muted-foreground"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        Active
                      </span>
                    </div>
                    <p className="text-[28px] font-semibold text-foreground">
                      {totalProducts}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      Products
                    </p>
                  </div>

                  <div
                    className="p-4 rounded-md"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(135deg, rgba(0, 120, 212, 0.12) 0%, rgba(0, 94, 184, 0.06) 100%)"
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(245, 250, 255, 0.4) 100%)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border:
                        theme === "dark"
                          ? "1px solid rgba(80, 160, 232, 0.25)"
                          : "1px solid rgba(0, 94, 184, 0.15)",
                      boxShadow:
                        theme === "dark"
                          ? "0 0 0 1px rgba(80, 160, 232, 0.15) inset, 0 4px 16px rgba(0, 120, 212, 0.15), 0 0 20px rgba(0, 120, 212, 0.1)"
                          : "0 0 0 1px rgba(0, 94, 184, 0.06) inset, 0 4px 12px rgba(0, 51, 141, 0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2
                        size={14}
                        className="text-accent"
                        style={{
                          filter:
                            theme === "dark"
                              ? "drop-shadow(0 0 4px rgba(0, 120, 212, 0.5))"
                              : "none",
                        }}
                      />
                      <span
                        className="text-[10px] font-medium tracking-[0.05em] capitalize text-muted-foreground"
                        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                      >
                        Live
                      </span>
                    </div>
                    <p className="text-[28px] font-semibold text-foreground">
                      {liveProducts}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70">
                      Production
                    </p>
                  </div>
                </div>

                {/* Recent Activity — dinámico desde la BD */}
                <div>
                  <p
                    className="text-[10px] font-medium tracking-[0.05em] capitalize mb-3 text-muted-foreground"
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    Recent Updates
                  </p>
                  <div className="space-y-2">
                    {recentUpdates.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground/50 py-1">
                        No hay actualizaciones
                      </p>
                    ) : (
                      recentUpdates.map((update) => {
                        const IconComp = getUpdateIcon(update.icon);
                        return (
                          <div
                            key={update.id}
                            className="flex items-start gap-2.5 text-[12px] pb-2 border-b"
                            style={{
                              borderColor:
                                theme === "dark"
                                  ? "rgba(80, 160, 232, 0.15)"
                                  : "rgb(214, 225, 237)",
                            }}
                          >
                            <IconComp
                              size={12}
                              className="mt-0.5 text-accent"
                            />
                            <div>
                              <p className="text-foreground/90">
                                {update.title ?? update.message}
                              </p>
                              {update.subtitle && (
                                <p className="text-[10px] text-muted-foreground/60">
                                  {update.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence Suites — float above Hero, barely opaque glass panels */}
      <section className="relative z-10 w-full max-w-[1800px] mx-auto px-6 mt-12 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
          {SUITES.map((suite) => {
            const IconComponent = suite.icon;

            const borderGrad =
              "linear-gradient(135deg, rgba(0,51,141,.9) 0%, rgba(0,83,159,.7) 50%, rgba(30,73,226,.5) 100%)";

            const shadowDark = "0 10px 30px rgba(0,0,0,.22)";
            const shadowLight = "0 10px 30px rgba(0,51,141,.08)";
            const shadowHoverDark =
              "0 16px 48px rgba(0,0,0,0.38), 0 4px 12px rgba(0,0,0,0.22)";
            const shadowHoverLight =
              "0 16px 40px rgba(0,20,80,0.14), 0 4px 10px rgba(0,20,80,0.08)";

            return (
              <button
                key={suite.id}
                onClick={() => navigate(suite.path)}
                className="group relative text-left transition-all duration-500 w-full"
                style={{
                  minWidth: 0,
                  padding: "1px",
                  borderRadius: "14px",
                  background: borderGrad,
                  boxShadow: theme === "dark" ? shadowDark : shadowLight,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    theme === "dark" ? shadowHoverDark : shadowHoverLight;
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    theme === "dark" ? shadowDark : shadowLight;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    borderRadius: "13px",
                    background:
                      theme === "dark"
                        ? "rgba(10, 25, 47, 0.95)"
                        : "rgba(255,255,255,.95)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                  }}
                >
                  <div
                    className="absolute top-0 inset-x-0 h-px pointer-events-none"
                    style={{
                      background:
                        theme === "dark"
                          ? "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.08) 65%, transparent 90%)"
                          : "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.70) 40%, rgba(255,255,255,0.50) 65%, transparent 90%)",
                    }}
                  />

                  <div className="relative px-6 py-6">
                    <div className="mb-5">
                      <div
                        className="mb-4 transition-transform duration-400 group-hover:scale-105"
                        style={{
                          display: "inline-flex",
                          padding: "1px",
                          borderRadius: "9px",
                          background: borderGrad,
                        }}
                      >
                        <div
                          className="w-9 h-9 flex items-center justify-center"
                          style={{
                            borderRadius: "8px",
                            background:
                              theme === "dark"
                                ? "rgba(10, 25, 47, 0.9)"
                                : "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                          }}
                        >
                          <IconComponent
                            size={16}
                            style={{
                              color: theme === "dark" ? "#FFFFFF" : "#1E49E2",
                            }}
                          />
                        </div>
                      </div>

                      <h3
                        className="text-[14.5px] font-semibold leading-snug"
                        style={{
                          fontFamily: "'IBM Plex Sans', sans-serif",
                          color:
                            theme === "dark"
                              ? "rgba(230,240,255,0.92)"
                              : "#061c40",
                        }}
                      >
                        {suite.name}
                      </h3>
                    </div>

                    <p
                      className="text-[11.5px] leading-[1.75] mb-6"
                      style={{
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        color:
                          theme === "dark"
                            ? "rgba(200,218,240,0.55)"
                            : "rgba(6,28,64,0.52)",
                      }}
                    >
                      {suite.description}
                    </p>

                    <div className="flex justify-end">
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-400 group-hover:translate-x-1"
                        style={{
                          color:
                            theme === "dark"
                              ? "rgba(0,181,226,0.55)"
                              : "rgba(0,51,141,0.40)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* System Footer */}
      <footer className="relative border-t mt-auto border-white/10 bg-white dark:bg-[#0C233C]">
        <div className="max-w-[1400px] mx-auto px-8 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium mb-1 text-[#0C233C] dark:text-white/90">
                Intelligence Studio
              </p>
              <p className="text-[10px] text-[#0C233C]/60 dark:text-white/60">
                Enterprise Intelligence Platform · Internal Use Only
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-[10px] transition-colors text-[#0C233C]/60 hover:text-[#00338D] dark:text-white/60 dark:hover:text-white">
                Documentation
              </button>
              <button className="text-[10px] transition-colors text-[#0C233C]/60 hover:text-[#00338D] dark:text-white/60 dark:hover:text-white">
                Support
              </button>
              <button className="text-[10px] transition-colors text-[#0C233C]/60 hover:text-[#00338D] dark:text-white/60 dark:hover:text-white">
                System Status
              </button>
            </div>

            <p
              className="text-[10px] text-[#0C233C]/40 dark:text-white/40"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              © 2026 KPMG
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
