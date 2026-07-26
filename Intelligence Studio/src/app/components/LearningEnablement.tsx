import { useOutletContext } from "react-router";
import { BookOpen, Award, ShieldCheck, FileText, ArrowRight } from "lucide-react";

interface ContextType {
  theme: "dark" | "light";
}

const CAPABILITIES = [
  {
    icon: BookOpen,
    label: "Monitor training completion",
    detail: "Track completed courses and participation rates across the organization.",
  },
  {
    icon: ShieldCheck,
    label: "Track certification compliance",
    detail: "Monitor certification requirements and identify gaps before deadlines.",
  },
  {
    icon: FileText,
    label: "Identify pending requirements",
    detail: "Surface outstanding assignments and unmet learning obligations.",
  },
  {
    icon: Award,
    label: "Support regulatory reporting",
    detail: "Generate structured outputs for audit, compliance and regulatory bodies.",
  },
];

const TOOLS = [
  {
    id: "certification-tracker",
    name: "Certification & Learning Tracker",
    category: "Training Compliance",
    purpose:
      "Monitor completed courses, discipline credits and certification requirements across all professional staff.",
    users: ["Colegio de Contadores", "Learning Teams", "Leadership"],
    icon: Award,
    url: "",
  },
  {
    id: "training-reporter",
    name: "Training Status Reporter",
    category: "Learning Analytics",
    purpose:
      "Monitor training completion, pending assignments and participation status by program, team and individual.",
    users: ["Training Administrators", "Managers", "Audit Leadership"],
    icon: BookOpen,
    url: "https://app.powerbi.com/reportEmbed?reportId=255a4e2c-cf4c-43ce-871e-addedcdb36d9&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
  },
];

export function LearningEnablement() {
  const { theme } = useOutletContext<ContextType>();
  const isDark = theme === "dark";

  const bg = isDark
    ? "linear-gradient(180deg,#06111f 0%,#071526 100%)"
    : "linear-gradient(180deg,#f4f7fc 0%,#eef3fb 100%)";

  const border = isDark ? "rgba(80,150,255,0.14)" : "#dce6f2";
  const surface = isDark ? "#0d1e35" : "#ffffff";
  const surfaceAlt = isDark ? "#0a1828" : "#f8fbff";
  const title = isDark ? "#e8f0ff" : "#00338d";
  const body = isDark ? "rgba(200,220,255,0.55)" : "#5B708A";
  const sub = isDark ? "rgba(220,235,255,0.75)" : "#3D4A5D";
  const accent = "#1E49E2";
  const accentSoft = isDark ? "rgba(30,73,226,0.16)" : "rgba(30,73,226,0.08)";
  const accentStrong = isDark ? "rgba(90,160,255,0.34)" : "rgba(30,73,226,0.22)";
  const mono = "'IBM Plex Mono', monospace";
  const font = "'IBM Plex Sans', sans-serif";

  return (
    <div
className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: bg,
        fontFamily: font,
      }}
    >
      {/* GRID */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(50,130,220,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(50,130,220,0.04) 1px,transparent 1px)"
            : "linear-gradient(rgba(30,73,226,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(30,73,226,0.04) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* GLOW */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20px",
          right: "-80px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle,rgba(30,73,226,0.20) 0%,transparent 72%)"
            : "radial-gradient(circle,rgba(30,73,226,0.16) 0%,transparent 72%)",
          filter: "blur(30px)",
        }}
      />

      {/* HERO */}
      <section className="relative pt-14 pb-10">
        <div className="max-w-[1200px] mx-auto px-10">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-4"
            style={{ color: body, fontFamily: mono, fontWeight: 600 }}
          >
            Learning & Certification
          </p>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: 700,
              color: title,
              marginBottom: "10px",
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Learning & Certification
          </h1>

          <p
            style={{
              maxWidth: "560px",
              fontSize: "14px",
              color: sub,
              lineHeight: 1.7,
            }}
          >
            Monitor training completion, certification requirements and learning participation across the organization.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="max-w-[1200px] mx-auto px-10 pt-6 pb-8">
        <div className="mb-6">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-2"
            style={{ color: body, fontFamily: mono, fontWeight: 600 }}
          >
            Capabilities
          </p>

          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: title,
              letterSpacing: "-0.01em",
            }}
          >
            What can you do here?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;

            return (
              <div
                key={cap.label}
                className="relative p-5 transition-all duration-200"
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "12px",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.18)"
                    : "0 8px 24px rgba(10,30,80,0.04)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-2px)";
                  el.style.borderColor = accentStrong;
                  el.style.boxShadow = isDark
                    ? "0 14px 30px rgba(30,73,226,0.14)"
                    : "0 14px 30px rgba(30,73,226,0.08)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = border;
                  el.style.boxShadow = isDark
                    ? "0 8px 24px rgba(0,0,0,0.18)"
                    : "0 8px 24px rgba(10,30,80,0.04)";
                }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: "-20px",
                    right: "-20px",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background: isDark
                      ? "radial-gradient(circle,rgba(30,73,226,0.14) 0%,transparent 70%)"
                      : "radial-gradient(circle,rgba(30,73,226,0.10) 0%,transparent 70%)",
                    filter: "blur(18px)",
                  }}
                />

                <div className="relative">
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-4"
                    style={{
                      background: accentSoft,
                      border: `1px solid ${accentStrong}`,
                      borderRadius: "9px",
                    }}
                  >
                    <Icon size={16} style={{ color: accent }} />
                  </div>

                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: title,
                      marginBottom: "6px",
                      lineHeight: 1.35,
                    }}
                  >
                    {cap.label}
                  </p>

                  <p
                    style={{
                      fontSize: "12px",
                      color: body,
                      lineHeight: 1.55,
                    }}
                  >
                    {cap.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOOLS */}
      <section className="max-w-[1200px] mx-auto px-10 pb-14 pt-4">
        <div className="mb-6">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-2"
            style={{ color: body, fontFamily: mono, fontWeight: 600 }}
          >
            Tools
          </p>

          <h2
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: title,
              letterSpacing: "-0.01em",
            }}
          >
            Available Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {TOOLS.map((tool, idx) => {
            const Icon = tool.icon;

            return (
              <div
                key={tool.id}
                className="p-5 transition-all duration-200"
                style={{
                  background: surfaceAlt,
                  border: `1px solid ${border}`,
                  borderRadius: "12px",
                  boxShadow: isDark
                    ? "0 8px 24px rgba(0,0,0,0.18)"
                    : "0 8px 24px rgba(10,30,80,0.04)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-2px)";
                  el.style.borderColor = accentStrong;
                  el.style.boxShadow = isDark
                    ? "0 14px 34px rgba(30,73,226,0.16)"
                    : "0 14px 34px rgba(30,73,226,0.10)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = border;
                  el.style.boxShadow = isDark
                    ? "0 8px 24px rgba(0,0,0,0.18)"
                    : "0 8px 24px rgba(10,30,80,0.04)";
                }}
              >
                <div
                  style={{
                    height: "3px",
                    marginBottom: "14px",
                    background:
                      idx === 0
                        ? "linear-gradient(90deg,#1E49E2,#5d8cff)"
                        : "linear-gradient(90deg,#173bbd,#4f7fff)",
                  }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 flex items-center justify-center shrink-0"
                    style={{
                      background: accentSoft,
                      borderRadius: "10px",
                      border: `1px solid ${accentStrong}`,
                    }}
                  >
                    <Icon size={17} style={{ color: accent }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <h3
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: title,
                          lineHeight: 1.35,
                          marginBottom: "4px",
                        }}
                      >
                        {tool.name}
                      </h3>

                      <p
                        style={{
                          fontSize: "11px",
                          color: accent,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tool.category}
                      </p>
                    </div>

                    <p
                      style={{
                        fontSize: "12.5px",
                        color: sub,
                        lineHeight: 1.6,
                        marginBottom: "10px",
                      }}
                    >
                      {tool.purpose}
                    </p>

                    <p
                      style={{
                        fontSize: "11px",
                        color: body,
                        lineHeight: 1.5,
                      }}
                    >
                      {tool.users.join(" · ")}
                    </p>
                  </div>

                  <button
                    onClick={() => tool.url && window.open(tool.url, "_blank")}
                    className="flex items-center gap-1 px-3 py-2 shrink-0 transition-all duration-150"
                    style={{
                      background: accent,
                      color: "#fff",
                      borderRadius: "7px",
                      fontSize: "11px",
                      fontWeight: 700,
                      boxShadow: "0 8px 20px rgba(30,73,226,0.24)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "#173bbd";
                      el.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = accent;
                      el.style.transform = "translateY(0)";
                    }}
                  >
                    Open
                    <ArrowRight size={12} />
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
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