import { TrendingUp, BarChart3, Users, Activity, ArrowRight } from "lucide-react";
import { useOutletContext } from "react-router";

interface ContextType {
  theme: "dark" | "light";
}

export function StrategyOffice() {
  const { theme } = useOutletContext<ContextType>();
  const isDark = theme === "dark";

  const products = [
    {
      id: "forecast",
      name: "Forecast",
      description: "Revenue and hours forecasting across audit engagements.",
      capabilities: [
        "Revenue forecast by month",
        "Revenue forecast by biweekly period",
        "Hours forecast by month",
        "Hours forecast by biweekly period",
        "Budget versus forecast",
        "Prior year comparison",
        "Trend monitoring",
      ],
      audience: "Partners, Directors and Business Leaders",
      icon: TrendingUp,
      purpose: "Where are we going?",
      url: "https://app.powerbi.com/reportEmbed?reportId=2ee50add-4fb3-4c66-b815-1ba29a3cddd1&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
    },

    {
      id: "engagement-insights",
      name: "Operational Capability",
      description: "Financial and operational visibility across audit engagements.",
      capabilities: [
        "Budget versus actual performance",
        "Engagement profitability",
        "Realization analysis",
        "Average fee per hour",
        "Contract performance monitoring",
        "Revenue tracking",
        "Prior year comparison",
        "Portfolio health indicators",
      ],
      audience: "Partners and Engagement Leaders",
      icon: BarChart3,
      purpose: "How are engagements performing?",
      url: "https://app.powerbi.com/reportEmbed?reportId=4cca6b8d-a826-4287-a174-bfc8a2dfdd05&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
    },

    {
      id: "capacity-insights",
      name: "Overtime Analysis",
      description: "Workforce capacity, utilization and overtime intelligence.",
      capabilities: [
        "Overtime monitoring",
        "Workforce utilization",
        "Capacity trends",
        "Resource pressure indicators",
        "Cost of overtime",
        "Engagement workload analysis",
        "Anomaly detection",
        "Team-level and individual-level analysis",
      ],
      audience: "Partners, Directors and Resource Management teams",
      icon: Activity,
      purpose: "Where are workforce risks emerging?",
      url: "https://app.powerbi.com/reportEmbed?reportId=54bbe715-da1f-49dc-b33f-2c44c260bdfe&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
    },

  ];

  /* 🎨 THEME TOKENS */
  const bg = isDark
    ? "linear-gradient(180deg,#06111f 0%,#071526 100%)"
    : "linear-gradient(180deg,#f4f7fc 0%,#eef3fb 100%)";

  const heroBg = isDark
    ? "linear-gradient(160deg,#0a1828 0%,#07111f 100%)"
    : "linear-gradient(160deg,#eef3fb 0%,#f4f7fc 100%)";

  const sectionBg = bg;

  const surface = isDark ? "#0d1e35" : "#ffffff";
  const border = isDark ? "rgba(80,150,255,0.14)" : "#dce6f2";

  const title = isDark ? "#e8f0ff" : "#00338d";
  const body = isDark ? "rgba(200,220,255,0.52)" : "#5B708A";
  const sub = isDark ? "rgba(220,235,255,0.75)" : "#3D4A5D";

  const accent = "#1E49E2";
  const accentSoft = isDark ? "rgba(30,73,226,0.20)" : "rgba(30,73,226,0.08)";
  const accentMid = isDark ? "rgba(80,150,255,0.30)" : "rgba(30,73,226,0.16)";
  const accentStrong = isDark ? "rgba(90,160,255,0.40)" : "rgba(30,73,226,0.22)";

  const font = "'IBM Plex Sans', sans-serif";
  const mono = "'IBM Plex Mono', monospace";

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: sectionBg,
        fontFamily: font,
      }}
    >
      {/* GRID */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(50,130,220,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(50,130,220,0.05) 1px,transparent 1px)"
            : "linear-gradient(rgba(30,73,226,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,73,226,0.04) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* GLOW */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "40px",
          right: "-80px",
          width: "360px",
          height: "360px",
          borderRadius: "999px",
          background: isDark
            ? "radial-gradient(circle, rgba(30,73,226,0.30) 0%, transparent 72%)"
            : "radial-gradient(circle, rgba(30,73,226,0.18) 0%, transparent 72%)",
          filter: "blur(34px)",
        }}
      />
      <div className="relative flex-1">
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background: heroBg,
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div className="relative max-w-[1400px] mx-auto px-10 pt-14 pb-10">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-4"
            style={{ color: body, fontFamily: mono }}
          >
            Executive Decision Intelligence
          </p>

          <h1
            style={{
              fontSize: "46px",
              fontWeight: 700,
              color: title,
              marginBottom: "8px",
            }}
          >
            Executive Insights
          </h1>

          <p style={{ maxWidth: "620px", color: sub, fontSize: "14px" }}>
            Executive visibility into revenue, profitability, workforce capacity and engagement performance.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="relative max-w-[1400px] mx-auto px-10 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {products.map((product, index) => {
            const Icon = product.icon;

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden"
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "12px",
                }}
              >
                {/* TOP LINE */}
                <div
                  style={{
                    height: "4px",
                    background: "linear-gradient(90deg,#1E49E2,#5d8cff)",
                  }}
                />

                <div className="p-5">
                  <div className="flex gap-4 mb-4">
                    <div
                      className="w-11 h-11 flex items-center justify-center"
                      style={{
                        background: accentSoft,
                        borderRadius: "10px",
                        border: `1px solid ${accentStrong}`,
                      }}
                    >
                      <Icon size={18} style={{ color: accent }} />
                    </div>

                    <div>
                      <p style={{ fontSize: "11px", color: accent }}>
                        {product.purpose}
                      </p>

                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: title }}>
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: "13px", color: body, marginBottom: "10px" }}>
                    {product.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    {product.capabilities.slice(0, 4).map((cap, i) => (
                      <div key={i} className="flex gap-2">
                        <div
                          className="w-1 h-1 mt-[6px] rounded-full"
                          style={{ background: accent }}
                        />
                        <span style={{ fontSize: "12px", color: sub }}>{cap}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: "11px", color: body }}>
                      {product.audience}
                    </span>

                    <button
                      onClick={() => product.url && window.open(product.url, "_blank")}
                      className="flex items-center gap-1 px-3 py-2"
                      style={{
                        background: accent,
                        color: "#fff",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      Open
                      <ArrowRight size={12} />
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      </div>
      <footer className="relative border-t mt-auto border-white/10 bg-white dark:bg-[#0C233C]">

        <div className="max-w-[1400px] mx-auto px-8 py-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium mb-1 text-[#0C233C] dark:text-white/90">
                Intelligence Studio
              </p>
              <p className="text-[10px] text-[#0C233C]/60 dark:text-white/60">
                Enterprise Intelligence Platform · Internal Use
                Only
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
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              © 2026 KPMG
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}