import { useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router";


interface OutletContext {
  theme: "dark" | "light";
}

/* ─── Data ─────────────────────────────────────────────────── */

const SCOREFY_CAPABILITIES = [
  { label: "Project Evaluations",    desc: "Capture structured feedback at project close" },
  { label: "Competency Assessments", desc: "Measure competency levels against role profiles" },
  { label: "Performance History",    desc: "Full longitudinal record per professional" },
  { label: "Feedback Collection",    desc: "Multi-source feedback and 360 workflows" },
  { label: "Evaluation Workflows",   desc: "Campaign administration and review routing" },
];

const ECOSYSTEM_SUPPORTING = [
  {
    id: "professional",
    app: "Professional Performance Dashboard",
    role: "Staff Performance Insights",
    why: "Gives professionals a personal view of project participation, hours, evaluation results, competency strengths and development opportunities.",
    url: "https://app.powerbi.com/reportEmbed?reportId=69b07863-0bb5-4a48-807c-3b83577e49bc&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
  },
  {
    id: "manager",
    app: "Manager Performance Dashboard",
    role: "Management Performance Insights",
    why: "Aggregates evaluation outcomes, engagement participation, revenue contribution, budget attainment and portfolio performance for managers.",
    url: "https://app.powerbi.com/reportEmbed?reportId=640a22df-a160-46d5-b5a2-2d8abe5e3c40&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
  },
  {
    id: "operations",
    app: "Evaluation Operations",
    role: "Administrative Operations",
    why: "Operational reporting experience for coordinators — tracking evaluation completion, pending reviews, workflow status and campaign management.",
    url: "https://app.powerbi.com/reportEmbed?reportId=07cc0d7d-29cd-4140-9790-2e12fbffd5f3&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
  },
];


const LEADERSHIP_APPS = [
  {
    id: "leadership",
    app: "Leadership Performance",
    role: "Executive Dashboard",
    url: "https://app.powerbi.com/reportEmbed?reportId=38c7e223-6d34-49ec-999c-322b76cff3ec&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
    type: "dashboard",
    description: "Comprehensive performance scorecard for partners and directors — revenue performance, budget achievement, client portfolio growth, client acquisition and retention, training compliance and people development.",
    capabilities: [
      "Revenue Performance",
      "Budget Achievement",
      "Client Portfolio Growth",
      "Client Acquisition & Retention",
      "Training Compliance",
      "People Development",
    ],
  },
  {
    id: "quality",
    app: "Quality Metrics",
    role: "Quality Management Platform",
    url: "",
    type: "operational",
    description: "Operational application where quality and compliance information is captured and managed — not a reporting dashboard. Covers quality review outcomes, ethics and independence compliance, quality incidents, regulatory observations and engagement oversight indicators.",
    capabilities: [
      "Quality Review Outcomes",
      "Ethics Compliance",
      "Independence Compliance",
      "Quality Incidents",
      "Regulatory Observations",
      "Partner Quality Performance",
    ],
  },
];

/* ─── Component ────────────────────────────────────────────── */

export function TalentAssessment() {
  const { theme } = useOutletContext<OutletContext>();
  const dk = theme === "dark";

  const navigate = useNavigate()
const [accessError, setAccessError] = useState(false)
const [checking, setChecking] = useState(false)

async function handleOpenScorefy() {
    setChecking(true)
    setAccessError(false)
    try {
const res = await fetch(`${import.meta.env.VITE_SCOREFY_API_URL}/api/security/guard`, {
    credentials: 'include',
    mode: 'cors',
})
        const data = await res.json()
        if (data.allowed) {
window.location.href = "/IntelligenceStudio/scorefy"
        } else {
            setAccessError(true)
        }
    } catch {
        setAccessError(true)
    } finally {
        setChecking(false)
    }
}



  /* Design tokens */
  const bg         = dk ? "#07111f" : "#f4f7fc";
  const surface    = dk ? "#0d1e35" : "#ffffff";
  const surfaceAlt = dk ? "#0a1828" : "#f4f7fc";
  const border     = dk ? "rgba(50,130,220,0.14)" : "#dce6f2";
  const title      = dk ? "#e8f0ff" : "#00338d";
  const body       = dk ? "rgba(200,220,255,0.45)" : "#5B708A";
  const sub        = dk ? "rgba(200,220,255,0.68)" : "#1E3A5F";
  const accent     = "#1E49E2";
  const accentMid  = dk ? "rgba(30,73,226,0.20)" : "rgba(30,73,226,0.08)";
  const accentRing = dk ? "rgba(80,150,255,0.30)" : "rgba(30,73,226,0.22)";
  const font       = "'IBM Plex Sans', sans-serif";
  const mono       = "'IBM Plex Mono', monospace";

  function hoverEnter(e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = accentRing;
    el.style.boxShadow   = dk
      ? "0 4px 20px rgba(30,73,226,0.14)"
      : "0 4px 16px rgba(30,73,226,0.09)";
  }
  function hoverLeave(e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, shadow = "none") {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = border;
    el.style.boxShadow   = shadow;
  }

  /* ── Render ── */
  return (
<div className="min-h-screen flex flex-col" style={{ background: bg, fontFamily: font }}>

      {/* ══ HERO ═══════════════════════════════════════════════ */}
      <section
     
        style={{
          borderColor: border,
          background: dk
            ? "linear-gradient(160deg,#0a1828 0%,#07111f 100%)"
            : "linear-gradient(160deg,#eef3fb 0%,#f4f7fc 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: dk
              ? "linear-gradient(rgba(50,130,220,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(50,130,220,0.04) 1px,transparent 1px)"
              : "linear-gradient(rgba(30,73,226,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,73,226,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-16 pt-16 pb-14">
       
          <div className="flex items-end justify-between gap-12">
            <div className="max-w-[600px]">
              <h1
                className="mb-4"
                style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.06, color: title }}
              >
                Performance Intelligence
              </h1>
              <p className="text-[14px] leading-relaxed max-w-[520px]" style={{ color: sub, fontWeight: 400 }}>
                The operating model for performance measurement across the audit practice — evaluation, analytics and leadership oversight in a structured ecosystem.
              </p>
            </div>

            {/* Domain tags */}
            <div className="hidden lg:flex flex-col gap-2 shrink-0">
              {[
                { label: "Performance Evaluation Ecosystem", active: true  },
                { label: "Leadership & Quality Oversight",   active: false },
              ].map(t => (
                <div
                  key={t.label}
                  className="flex items-center gap-2.5 px-4 py-2.5"
                  style={{
                    background: t.active ? accentMid : "transparent",
                    border: `1px solid ${t.active ? accentRing : border}`,
                    borderRadius: "5px",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: t.active ? accent : (dk ? "rgba(100,160,240,0.28)" : "#c5d4e8") }}
                  />
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: t.active ? accent : body }}
                  >
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ DOMAIN 1 ════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-16 pt-12 pb-6">

        {/* Domain header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5" style={{ background: accent, borderRadius: "2px" }} />
            <p className="text-[13px] font-bold" style={{ color: title }}>
              Performance Evaluation Ecosystem
            </p>
          </div>
          <div className="flex-1 h-px" style={{ background: border }} />
      
        </div>

        {/* ── Scorefy Hero ── */}
        <div
          className="relative overflow-hidden mb-4"
          style={{
            background: dk
              ? "linear-gradient(135deg,rgba(12,26,56,0.95) 0%,rgba(8,18,40,0.90) 100%)"
              : "linear-gradient(135deg,#1E49E2 0%,#0d35b8 100%)",
            border: `1px solid ${dk ? "rgba(80,150,255,0.22)" : "transparent"}`,
            borderRadius: "10px",
            boxShadow: dk
              ? "0 12px 48px rgba(0,0,0,0.50),0 0 40px rgba(30,73,226,0.18)"
              : "0 12px 48px rgba(30,73,226,0.28),0 4px 16px rgba(30,73,226,0.20)",
          }}
        >
          {dk && (
            <>
              <div className="absolute pointer-events-none" style={{ top:"-40px",right:"-40px",width:"260px",height:"260px",borderRadius:"50%",background:"radial-gradient(circle,rgba(30,73,226,0.35) 0%,transparent 70%)",filter:"blur(32px)" }} />
              <div className="absolute pointer-events-none" style={{ bottom:"-20px",left:"38%",width:"160px",height:"160px",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,180,255,0.12) 0%,transparent 70%)",filter:"blur(24px)" }} />
            </>
          )}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",backgroundSize:"48px 48px" }} />

          <div className="relative p-10 flex items-start gap-14">
            {/* Identity */}
            <div className="max-w-[380px] flex flex-col gap-5 shrink-0">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="px-2.5 py-1" style={{ background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.20)",borderRadius:"100px" }}>
                    <span className="text-[10px] font-semibold" style={{ color:"rgba(255,255,255,0.80)" }}>
                      Performance Evaluation Platform
                    </span>
                  </div>
                </div>
                <h2 style={{ fontSize:"38px",fontWeight:700,letterSpacing:"-0.03em",lineHeight:1.0,color:"#ffffff" }}>
                  Scorefy
                </h2>
              </div>

              <p className="text-[14px] leading-relaxed" style={{ color:"rgba(255,255,255,0.62)",fontWeight:400 }}>
                Project evaluations, competency assessments and evaluation workflows are consolidated here — feeding all downstream analytical experiences.
              </p>

<button
    onClick={handleOpenScorefy}
    disabled={checking}
    className="flex items-center gap-2 self-start px-5 py-2.5 transition-all duration-150 group/cta"
    style={{ background:"rgba(255,255,255,0.14)", border:"1px solid rgba(255,255,255,0.28)", borderRadius:"6px" }}
    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)"; }}
>
    <span className="text-[12px] font-semibold" style={{ color:"#ffffff" }}>
        {checking ? 'Verificando...' : 'Open Scorefy'}
    </span>
    {!checking && (
        <ArrowRight size={13} style={{ color:"#ffffff" }} className="group/cta:translate-x-0.5 transition-transform duration-150" />
    )}
</button>

{accessError && (
    <p className="text-[11px] mt-2" style={{ color: "rgba(255,150,150,0.90)" }}>
        No tienes permisos para acceder a Scorefy.
    </p>
)}

            </div>

            {/* Capabilities grid */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {SCOREFY_CAPABILITIES.map(cap => (
                <div
                  key={cap.label}
                  className="p-4"
                  style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.11)",borderRadius:"7px" }}
                >
                  <p className="text-[12px] mb-1" style={{ fontWeight:600,color:"rgba(255,255,255,0.90)" }}>{cap.label}</p>
                  <p className="text-[11px] leading-snug" style={{ color:"rgba(255,255,255,0.44)",fontWeight:400 }}>{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Ecosystem supporting cards ── */}
        <div className="grid grid-cols-3 gap-3">
          {ECOSYSTEM_SUPPORTING.map(item => (
              <button
              key={item.id}
              onClick={() => item.url && window.open(item.url, "_blank")}
              className="text-left flex flex-col transition-all duration-150 group/card"

              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "8px",
                padding: "20px",
                boxShadow: dk ? "none" : "0 1px 3px rgba(0,40,120,0.05)",
              }}
              onMouseEnter={hoverEnter}
              onMouseLeave={e => hoverLeave(e, dk ? "none" : "0 1px 3px rgba(0,40,120,0.05)")}
            >
              <span className="text-[10px] font-semibold mb-2" style={{ color: accent }}>{item.role}</span>
              <p className="text-[13px] mb-2.5 leading-tight" style={{ fontWeight: 700, color: title }}>{item.app}</p>
              <p className="text-[11px] leading-relaxed flex-1" style={{ color: body, fontWeight: 400 }}>{item.why}</p>
              <div className="flex items-center gap-1.5 mt-4 pt-3.5" style={{ borderTop: `1px solid ${border}` }}>
                <span className="text-[10px] font-semibold" style={{ color: dk ? "rgba(100,160,240,0.55)" : accent }}>Open</span>
                <ArrowRight size={10} className="group/card:translate-x-0.5 transition-transform duration-150" style={{ color: dk ? "rgba(100,160,240,0.45)" : accent }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ DOMAIN 2 ════════════════════════════════════════════ */}
      <section
        className="border-t mt-10"
        style={{
          borderColor: border,
          background: dk
            ? "linear-gradient(180deg,#0a1828 0%,#07111f 100%)"
            : "linear-gradient(180deg,#eef3fb 0%,#f4f7fc 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-16 py-12">

          {/* Domain header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5" style={{ background: dk ? "rgba(80,150,255,0.60)" : "#3D4A5D", borderRadius: "2px" }} />
              <p className="text-[13px] font-bold" style={{ color: title }}>
                Leadership & Quality Oversight
              </p>
            </div>
            <div className="flex-1 h-px" style={{ background: border }} />

          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-4">
            {LEADERSHIP_APPS.map(item => (
                   <div
                key={item.id}
                onClick={() =>
                  item.id === "quality"
                    ? (window.location.href = "/IntelligenceStudio/")
                    : item.url && window.open(item.url, "_blank")
                }

                className="flex flex-col transition-all duration-150 cursor-pointer group/card"

                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "10px",
                  padding: "28px",
                  boxShadow: dk ? "none" : "0 1px 4px rgba(0,40,120,0.06)",
                }}
                onMouseEnter={hoverEnter}
                onMouseLeave={e => hoverLeave(e, dk ? "none" : "0 1px 4px rgba(0,40,120,0.06)")}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="text-[10px] font-semibold" style={{ color: accent }}>{item.role}</span>
                    {item.type === "operational" && (
                      <div
                        className="inline-flex items-center gap-1 ml-2 px-2 py-0.5"
                        style={{
                          background: accentMid,
                          border: `1px solid ${accentRing}`,
                          borderRadius: "4px",
                          verticalAlign: "middle",
                        }}
                      >
                        <span className="text-[9px] font-semibold tracking-[0.06em] uppercase" style={{ color: dk ? "rgba(150,190,255,0.85)" : accent }}>
                          Operational App
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-[22px] mb-3 leading-tight" style={{ fontWeight: 700, color: title }}>
                  {item.app}
                </h3>

                <p className="text-[12px] leading-relaxed mb-6" style={{ color: body, fontWeight: 400, maxWidth: "460px" }}>
                  {item.description}
                </p>

                {/* Capability tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.capabilities.map(cap => (
                    <span
                      key={cap}
                      className="text-[10px] font-medium px-2.5 py-1"
                      style={{
                        color: sub,
                        background: dk ? "rgba(50,130,220,0.08)" : "rgba(30,73,226,0.05)",
                        border: `1px solid ${border}`,
                        borderRadius: "4px",
                      }}
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto flex items-center gap-1.5 pt-5" style={{ borderTop: `1px solid ${border}` }}>
                  <span className="text-[10px] font-semibold transition-colors duration-150" style={{ color: dk ? "rgba(100,160,240,0.55)" : accent }}>
                    Open {item.app}
                  </span>
                  <ArrowRight
                    size={10}
                    className="group/card:translate-x-0.5 transition-transform duration-150"
                    style={{ color: dk ? "rgba(100,160,240,0.45)" : accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
