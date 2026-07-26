import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { translations, type Language } from "../data/translations";
import {
  getResearchLibrary,
  type ResearchLibraryItem,
} from "../services/intelligencestService";

interface ContextType {
  theme: "dark" | "light";
  language: Language;
  t: typeof translations.en;
}

const INVESTIGATION_AREAS = [
  {
    domain: "01",
    title: "Workforce & Talent",
    questions: [
      "Why is turnover increasing in specific teams or functions?",
      "Which roles or cohorts show early attrition risk signals?",
      "Where are capacity bottlenecks emerging?",
    ],
  },
  {
    domain: "02",
    title: "Engagement Performance",
    questions: [
      "Which engagements are becoming less profitable over time?",
      "What factors drive recurring budget deviations?",
      "What patterns explain persistent workload imbalances?",
    ],
  },
  {
    domain: "03",
    title: "Clients & Growth",
    questions: [
      "What drives client satisfaction across service lines?",
      "Which clients show early signs of disengagement?",
      "What factors are associated with sustained revenue growth?",
    ],
  },
];

const TAG_COLORS: Record<string, { text: string; border: string; bg: string }> = {
  "Deep Dive": { text: "#00338D", border: "rgba(0,51,141,0.18)", bg: "rgba(0,51,141,0.05)" },
  Featured: { text: "#005EB8", border: "rgba(0,94,184,0.18)", bg: "rgba(0,94,184,0.05)" },
  New: { text: "#0077CC", border: "rgba(0,119,204,0.18)", bg: "rgba(0,119,204,0.05)" },
  Updated: { text: "#006C9C", border: "rgba(0,108,156,0.18)", bg: "rgba(0,108,156,0.05)" },
  // Badges en español (los de la BD)
  "ANÁLISIS PROFUNDO": { text: "#00338D", border: "rgba(0,51,141,0.18)", bg: "rgba(0,51,141,0.05)" },
  DESTACADO: { text: "#005EB8", border: "rgba(0,94,184,0.18)", bg: "rgba(0,94,184,0.05)" },
  NUEVO: { text: "#0077CC", border: "rgba(0,119,204,0.18)", bg: "rgba(0,119,204,0.05)" },
  ACTUALIZADO: { text: "#006C9C", border: "rgba(0,108,156,0.18)", bg: "rgba(0,108,156,0.05)" },
};

export function AnalyticalPerspectives() {
  const { t, theme } = useOutletContext<ContextType>();
  const isDark = theme === "dark";

  const [researchItems, setResearchItems] = useState<ResearchLibraryItem[]>([]);

  useEffect(() => {
    getResearchLibrary().then(setResearchItems).catch(() => {});
  }, []);

  const bg = isDark
    ? "linear-gradient(180deg,#06111f 0%,#081526 100%)"
    : "linear-gradient(180deg,#f4f7fc 0%,#eef3fb 100%)";

  const heroBg = isDark
    ? "linear-gradient(160deg,#0a1828 0%,#07111f 100%)"
    : "linear-gradient(160deg,#eef3fb 0%,#f4f7fc 100%)";

  const surface = isDark ? "#0d1e35" : "#ffffff";
  const surfaceAlt = isDark ? "#0a1828" : "#f8fbff";
  const border = isDark ? "rgba(80,150,255,0.14)" : "#dce6f2";
  const title = isDark ? "#e8f0ff" : "#00338d";
  const body = isDark ? "rgba(200,220,255,0.52)" : "#5B708A";
  const sub = isDark ? "rgba(220,235,255,0.75)" : "#3D4A5D";
  const accent = "#1E49E2";
  const accentSoft = isDark ? "rgba(30,73,226,0.16)" : "rgba(30,73,226,0.08)";
  const accentMid = isDark ? "rgba(80,150,255,0.24)" : "rgba(30,73,226,0.16)";
  const accentStrong = isDark ? "rgba(90,160,255,0.34)" : "rgba(30,73,226,0.22)";
  const mono = "'IBM Plex Mono', monospace";
  const font = "'IBM Plex Sans', sans-serif";

  return (
    <div
className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: bg, color: title, fontFamily: font }}
    >
      {/* GLOBAL GRID */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(50,130,220,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(50,130,220,0.04) 1px,transparent 1px)"
            : "linear-gradient(rgba(30,73,226,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,73,226,0.04) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* GLOBAL GLOWS */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "30px",
          right: "-100px",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle,rgba(30,73,226,0.22) 0%,transparent 72%)"
            : "radial-gradient(circle,rgba(30,73,226,0.16) 0%,transparent 72%)",
          filter: "blur(34px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "520px",
          left: "-120px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle,rgba(0,181,226,0.12) 0%,transparent 72%)"
            : "radial-gradient(circle,rgba(0,181,226,0.08) 0%,transparent 72%)",
          filter: "blur(28px)",
        }}
      />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: heroBg, borderBottom: `1px solid ${border}` }}
      >
        <div className="relative max-w-[1400px] mx-auto px-10 pt-16 pb-14">
          <div className="flex items-end justify-between gap-10">
            <div className="max-w-[720px]">
              <p
                className="text-[10px] uppercase tracking-[0.16em] mb-5"
                style={{ color: body, fontFamily: mono, fontWeight: 600 }}
              >
                Analytical Perspectives
              </p>

              <h1
                className="mb-4"
                style={{
                  fontSize: "46px",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  fontWeight: 700,
                  color: title,
                  maxWidth: "760px",
                }}
              >
                Transforming complex business questions into evidence-based decisions.
              </h1>

              <p
                className="max-w-[620px]"
                style={{ fontSize: "15px", lineHeight: 1.7, color: sub, fontWeight: 400 }}
              >
                Through focused Deep Dive studies, we investigate workforce, operational,
                financial and client-related questions to uncover actionable insights for leadership teams.
              </p>
            </div>

            <div className="hidden xl:flex flex-col gap-2 shrink-0">
              {["Deep Dive Studies", "Strategic Questions", "Evidence-Based Insight"].map((item, i) => (
                <div
                  key={item}
                  className="px-4 py-2.5"
                  style={{
                    background: i === 0 ? accentSoft : "transparent",
                    border: `1px solid ${i === 0 ? accentStrong : border}`,
                    borderRadius: "6px",
                  }}
                >
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: i === 0 ? accent : body }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="relative max-w-[1400px] mx-auto px-10 pt-12 pb-6">
        <div className="mb-7">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-2"
            style={{ color: body, fontWeight: 600, fontFamily: mono }}
          >
            What we investigate
          </p>
          <h2
            style={{
              fontSize: "24px",
              lineHeight: 1.1,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: title,
            }}
          >
            What can we help answer?
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {INVESTIGATION_AREAS.map((area, idx) => (
            <div
              key={area.domain}
              className="relative overflow-hidden"
              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "12px",
                boxShadow: isDark
                  ? "0 10px 30px rgba(0,0,0,0.20)"
                  : "0 8px 26px rgba(10,30,80,0.05)",
              }}
            >
              <div
                style={{
                  height: "4px",
                  background:
                    idx === 0
                      ? "linear-gradient(90deg,#1E49E2 0%,#4A7BFF 100%)"
                      : idx === 1
                      ? "linear-gradient(90deg,#173bbd 0%,#1E49E2 100%)"
                      : "linear-gradient(90deg,#2458ff 0%,#6b95ff 100%)",
                }}
              />

              <div
                className="absolute pointer-events-none"
                style={{
                  top: "-30px",
                  right: "-20px",
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: isDark
                    ? "radial-gradient(circle,rgba(30,73,226,0.18) 0%,transparent 72%)"
                    : "radial-gradient(circle,rgba(30,73,226,0.10) 0%,transparent 72%)",
                  filter: "blur(18px)",
                }}
              />

              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="px-2.5 py-1"
                    style={{
                      background: accentSoft,
                      border: `1px solid ${accentMid}`,
                      borderRadius: "999px",
                    }}
                  >
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: accent, fontFamily: mono }}
                    >
                      {area.domain}
                    </span>
                  </div>

                  <h3
                    style={{ fontSize: "18px", fontWeight: 700, lineHeight: 1.15, color: title }}
                  >
                    {area.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {area.questions.map((q, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                        style={{ background: accent }}
                      />
                      <span style={{ fontSize: "12.5px", lineHeight: 1.55, color: sub }}>
                        {q}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 — Research Library (dinámico desde la BD) */}
      <section className="relative max-w-[1400px] mx-auto px-10 pt-10 pb-8">
        <div className="flex items-end justify-between gap-8 mb-7">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.14em] mb-2"
              style={{ color: body, fontWeight: 600, fontFamily: mono }}
            >
              Studies
            </p>
            <h2
              style={{
                fontSize: "24px",
                lineHeight: 1.1,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: title,
              }}
            >
              Research Library
            </h2>
          </div>

          <p
            className="hidden lg:block max-w-[420px] text-right"
            style={{ fontSize: "12.5px", lineHeight: 1.65, color: body }}
          >
            A curated collection of structured investigations exploring workforce patterns,
            operational efficiency and strategic trends.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {researchItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.externalLink && window.open(item.externalLink, "_blank")
              }
              className="text-left group relative overflow-hidden transition-all duration-200"
              style={{
                background: surfaceAlt,
                border: `1px solid ${border}`,
                borderRadius: "12px",
                padding: "22px",
                cursor: item.externalLink ? "pointer" : "default",
                boxShadow: isDark
                  ? "0 8px 24px rgba(0,0,0,0.18)"
                  : "0 8px 24px rgba(10,30,80,0.04)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = "translateY(-2px)";
                el.style.borderColor = accentStrong;
                el.style.boxShadow = isDark
                  ? "0 14px 32px rgba(30,73,226,0.16)"
                  : "0 14px 32px rgba(30,73,226,0.10)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
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
                  top: "-35px",
                  right: "-25px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: isDark
                    ? "radial-gradient(circle,rgba(30,73,226,0.15) 0%,transparent 70%)"
                    : "radial-gradient(circle,rgba(30,73,226,0.08) 0%,transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p
                      className="mb-2"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: body,
                        fontFamily: mono,
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </p>

                    <h4
                      style={{
                        fontSize: "16px",
                        lineHeight: 1.35,
                        fontWeight: 700,
                        color: title,
                        maxWidth: "520px",
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {item.badge && (
                      <span
                        className="px-2.5 py-1 border"
                        style={{
                          fontSize: "9px",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          fontFamily: mono,
                          fontWeight: 600,
                          color: TAG_COLORS[item.badge]?.text ?? accent,
                          borderColor: TAG_COLORS[item.badge]?.border ?? accentMid,
                          background: TAG_COLORS[item.badge]?.bg ?? accentSoft,
                          borderRadius: "999px",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.externalLink && (
                      <ArrowRight
                        size={13}
                        className="transition-transform duration-150 group-hover:translate-x-0.5"
                        style={{ color: accent }}
                      />
                    )}
                  </div>
                </div>

                {item.description && (
                  <p style={{ fontSize: "12.5px", lineHeight: 1.6, color: body, maxWidth: "95%" }}>
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="pt-7">
          <button className="flex items-center gap-2 group">
            <span
              className="text-[11px] uppercase tracking-[0.14em]"
              style={{ color: accent, fontFamily: mono, fontWeight: 600 }}
            >
              {t.viewAllAnalyses}
            </span>
            <ArrowRight
              size={12}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
              style={{ color: accent }}
            />
          </button>
        </div>
      </section>

      {/* SECTION 4 */}
      <section className="relative max-w-[1400px] mx-auto px-10 pt-8 pb-16">
        <div
          className="p-px"
          style={{
            borderRadius: "18px",
            background: "linear-gradient(135deg,#00338D 0%,#005EB8 55%,#00B5E2 100%)",
            boxShadow: isDark
              ? "0 18px 46px rgba(0,51,141,0.28)"
              : "0 18px 46px rgba(30,73,226,0.18)",
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: "17px",
              background: isDark
                ? "linear-gradient(135deg,rgba(8,18,40,0.96) 0%,rgba(10,24,48,0.94) 100%)"
                : "linear-gradient(135deg,rgba(246,250,255,0.97) 0%,rgba(239,245,255,0.95) 100%)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            <div
              className="absolute pointer-events-none"
              style={{
                top: "-55px",
                right: "-40px",
                width: "240px",
                height: "240px",
                borderRadius: "50%",
                background: "radial-gradient(circle,rgba(0,181,226,0.18) 0%,transparent 72%)",
                filter: "blur(28px)",
              }}
            />

            <div className="relative px-10 py-10 flex items-center justify-between gap-10">
              <div className="max-w-[700px]">
                <p
                  className="text-[10px] uppercase tracking-[0.16em] mb-4"
                  style={{
                    color: isDark ? "rgba(180,220,255,0.70)" : "rgba(0,51,141,0.56)",
                    fontFamily: mono,
                    fontWeight: 600,
                  }}
                >
                  Deep Dive Program
                </p>

                <h2
                  className="mb-4"
                  style={{
                    fontSize: "30px",
                    lineHeight: 1.1,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: title,
                  }}
                >
                  Have a strategic question?
                </h2>

                <p style={{ fontSize: "14px", lineHeight: 1.7, color: sub }}>
                  Analytical Perspectives transforms business questions into structured investigations using operational, workforce, financial and client data. Whether you need to validate a hypothesis, understand a trend, evaluate an opportunity or identify a risk, the team can design and execute a focused Deep Dive study.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <button
                  className="flex items-center gap-2.5 px-6 py-3 transition-all duration-150"
                  style={{
                    background: accent,
                    color: "#ffffff",
                    borderRadius: "8px",
                    fontSize: "13px",
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
                  Request a Deep Dive
                  <ArrowUpRight size={14} />
                </button>

                <button
                  className="flex items-center justify-center gap-2 group px-4 py-2"
                  style={{
                    fontSize: "12px",
                    color: isDark ? "rgba(190,215,245,0.62)" : "rgba(0,51,141,0.62)",
                    fontWeight: 500,
                  }}
                >
                  Learn about the methodology
                  <ArrowRight
                    size={12}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </div>
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
