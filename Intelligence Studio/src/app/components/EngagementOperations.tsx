import { ArrowRight, ChevronRight } from "lucide-react";
import { useOutletContext, useNavigate } from "react-router";

interface OutletContext {
  theme: "dark" | "light";
}

const SUPPORTING = [
  {
    id: "proposal",
    app: "Client Proposal Tracker",
    role: "Client Acceptance",
    why: "Track and approve new client engagements before they enter the planning cycle.",
    optional: true,
    url: "https://apps.powerapps.com/play/e/6d23ad25-3312-47bb-b9e7-986e5e8d2f4f/a/52a1ccdd-cf70-48ba-86e1-1069507b6823?tenantId=deff24bb-2089-4400-8c8e-f71e680378b2&hint=a6ce838a-79a0-45ad-997a-5e8ed0d1408a&sourcetime=1759517509527",
  },
  {
    id: "wallchart",
    app: "Wallchart",
    role: "Resource Scheduling",
    why: "Schedule professional staff across engagements and manage team availability.",
    url: "https://apps.powerapps.com/play/e/6d23ad25-3312-47bb-b9e7-986e5e8d2f4f/a/54d65caf-2a49-4b70-8412-55a4017564ff?tenantId=deff24bb-2089-4400-8c8e-f71e680378b2&hint=3834a503-ddb8-43a8-82de-78df348b61b8&sourcetime=1719513156318&source=portal",
  },
  {
    id: "auditip",
    app: "AuditIP",
    role: "Staffing Operations",
    why: "Manage assignment execution, absences, training visibility and operational risk tracking.",
    url: "https://app.powerbi.com/reportEmbed?reportId=2e13d78d-3eac-4afe-9200-350823530c41&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
  },
  {
    id: "workload",
    app: "Workload",
    role: "Capacity Utilization",
    why: "Monitor actual hours, manage waiver approvals and balance engagement capacity.",
    url: "https://apps.powerapps.com/play/e/6d23ad25-3312-47bb-b9e7-986e5e8d2f4f/a/5eaa0096-15de-4259-986e-7f9f2666bbc2?tenantId=deff24bb-2089-4400-8c8e-f71e680378b2&sourcetime=1734620284506&source=portal#",
  },
  {
    id: "eqcr",
    app: "EQCR Monitoring",
    role: "Quality Oversight",
    why: "Quality partner oversight and compliance monitoring throughout the engagement lifecycle.",
    url: "",
  },
];


const PVIII_CAPABILITIES = [
  { label: "Engagement Budgeting", desc: "Forecast and control engagement budgets" },
  { label: "Staffing Requirements", desc: "Define headcount and skill profiles" },
  { label: "Engagement Valuation", desc: "Client and financial modelling" },
  { label: "Resource Forecasting", desc: "Forward-looking capacity planning" },
];

export function EngagementOperations() {
  const { theme } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const dk = theme === "dark";

  const bg         = dk ? "#07111f" : "#f4f7fc";
  const surface    = dk ? "#0d1e35" : "#ffffff";
  const surfaceAlt = dk ? "#0a1828" : "#f4f7fc";
  const border     = dk ? "rgba(50,130,220,0.14)" : "#dce6f2";
  const borderDash = dk ? "rgba(50,130,220,0.22)" : "rgba(30,73,226,0.20)";
  const title      = dk ? "#e8f0ff" : "#00338d";
  const body       = dk ? "rgba(180,205,255,0.55)" : "#5B708A";
  const sub        = dk ? "rgba(210,225,255,0.78)" : "#1E3A5F";
  const accent     = "#1E49E2";
  const accentMid  = dk ? "rgba(30,73,226,0.20)" : "rgba(30,73,226,0.08)";
  const accentRing = dk ? "rgba(80,150,255,0.30)" : "rgba(30,73,226,0.22)";
  const font       = "'IBM Plex Sans', sans-serif";
  const mono       = "'IBM Plex Mono', monospace";

  function CardHover(e: React.MouseEvent<HTMLButtonElement>, enter: boolean) {
    const el = e.currentTarget;
    el.style.borderColor  = enter ? accentRing   : border;
    el.style.boxShadow    = enter
      ? (dk ? "0 4px 20px rgba(30,73,226,0.14)" : "0 4px 16px rgba(30,73,226,0.09)")
      : "none";
  }

  return (
<div className="min-h-screen flex flex-col" style={{ background: bg, fontFamily: font }}>

      {/* ── HERO ── */}
      <section
       
        style={{
          borderColor: border,
          background: dk
            ? "linear-gradient(160deg,#0a1828 0%,#07111f 100%)"
            : "linear-gradient(160deg,#eef3fb 0%,#f4f7fc 100%)",
        }}
      >
        {/* fine grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: dk
              ? "linear-gradient(rgba(50,130,220,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(50,130,220,0.04) 1px,transparent 1px)"
              : "linear-gradient(rgba(30,73,226,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,73,226,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-16 pt-14 pb-14">
    

          <div className="flex items-end justify-between gap-12">
            <div className="max-w-[620px]">
              <h1
                className="mb-4"
                style={{ fontSize: "40px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.06, color: title }}
              >
                Engagement Management
              </h1>
              <p className="text-[14px] leading-relaxed" style={{ color: sub, fontWeight: 400, maxWidth: "540px" }}>
                The central workspace for audit engagement planning and delivery — budgeting, staffing, execution and quality oversight.
              </p>
            </div>

            {/* Compact lifecycle tags — no status counts */}
            <div className="hidden lg:flex flex-col gap-1.5 shrink-0">
              {[
                { label: "Engagement Budgeting",  active: true  },
                { label: "Resource Scheduling",    active: false },
                { label: "Staffing Operations",    active: false },
                { label: "Capacity Utilization",   active: false },
                { label: "Quality Oversight",      active: false },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2 px-3 py-1.5"
                  style={{
                    background: t.active ? accentMid : "transparent",
                    border: `1px solid ${t.active ? accentRing : border}`,
                    borderRadius: "4px",
                  }}
                >
                  <div
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: t.active ? accent : (dk ? "rgba(100,160,240,0.28)" : "#c5d4e8") }}
                  />
                  <span
                    className="text-[10px] font-semibold"
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

      {/* ── PVIII HERO CARD ── */}
      <section className="max-w-[1400px] mx-auto px-16 pt-12 pb-6">
        <p
          className="text-[10px] font-semibold tracking-[0.10em] uppercase mb-5"
          style={{ color: title }}
        >
          Primary Platform
        </p>

        <div
          className="relative overflow-hidden"
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
          {/* Dark mode ambient glows */}
          {dk && (
            <>
              <div className="absolute pointer-events-none" style={{ top:"-40px",right:"-40px",width:"260px",height:"260px",borderRadius:"50%",background:"radial-gradient(circle,rgba(30,73,226,0.35) 0%,transparent 70%)",filter:"blur(32px)" }} />
              <div className="absolute pointer-events-none" style={{ bottom:"-20px",left:"35%",width:"160px",height:"160px",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,180,255,0.12) 0%,transparent 70%)",filter:"blur(24px)" }} />
            </>
          )}
          {/* Grid overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",backgroundSize:"48px 48px" }} />

          <div className="relative p-10 flex items-start gap-14">
            {/* Left */}
            <div className="max-w-[400px] flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="px-2.5 py-1"
                    style={{ background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.20)",borderRadius:"100px" }}
                  >
                    <span className="text-[10px] font-semibold" style={{ color:"rgba(255,255,255,0.80)" }}>
                      Core Planning Platform
                    </span>
                  </div>
                </div>

                <h2
                  style={{ fontSize:"38px",fontWeight:700,letterSpacing:"-0.03em",lineHeight:1.0,color:"#ffffff" }}
                >
                  PVIII
                </h2>
              </div>

              <p
                className="text-[14px] leading-relaxed"
                style={{ color:"rgba(255,255,255,0.62)",fontWeight:400 }}
              >
                The primary platform for all audit engagements. Budgeting, valuation, staffing requirements and resource forecasting are consolidated here before any operational activity begins.
              </p>

              <button
                onClick={() => { window.location.href = "/IntelligenceStudio/PVIII"; }}
                className="flex items-center gap-2 self-start px-5 py-2.5 transition-all duration-150 group/cta"
                style={{ background:"rgba(255,255,255,0.14)",border:"1px solid rgba(255,255,255,0.28)",borderRadius:"6px" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.22)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.14)"; }}
              >

                <span className="text-[12px] font-semibold" style={{ color:"#ffffff" }}>Open PVIII</span>
                <ArrowRight size={13} style={{ color:"#ffffff" }} className="group/cta:translate-x-0.5 transition-transform duration-150" />
              </button>
            </div>

            {/* Right: capability grid */}
            <div className="flex-1 grid grid-cols-2 gap-3">
              {PVIII_CAPABILITIES.map(cap => (
                <div
                  key={cap.label}
                  className="p-4"
                  style={{ background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.11)",borderRadius:"7px" }}
                >
                  <p className="text-[12px] mb-1" style={{ fontWeight:600,color:"rgba(255,255,255,0.90)" }}>{cap.label}</p>
                  <p className="text-[11px] leading-snug" style={{ color:"rgba(255,255,255,0.46)",fontWeight:400 }}>{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIFECYCLE + SUPPORTING APPS ── */}
      <section className="max-w-[1400px] mx-auto px-16 pt-8 pb-16">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <p className="text-[10px] font-semibold tracking-[0.10em] uppercase" style={{ color: title }}>
            Engagement Lifecycle
          </p>
          <div className="flex-1 h-px" style={{ background: border }} />
        </div>

        {/* Flow diagram row: CPT (optional) → PVIII (hub) → rest */}
        <div className="mb-8">
          {/* Optional entry row */}
          <div className="flex items-center mb-2 pl-0">
            <div
              className="flex items-center gap-2.5 px-4 py-2"
              style={{
                border: `1px dashed ${borderDash}`,
                borderRadius: "5px",
                background: "transparent",
              }}
            >
              <span className="text-[10px] font-semibold" style={{ color: body, fontFamily: mono }}>Optional</span>
              <span className="w-px h-3 self-center" style={{ background: border, display:"inline-block" }} />
              <span className="text-[11px] font-semibold" style={{ color: sub }}>Client Proposal Tracker</span>
              <span className="text-[10px]" style={{ color: body }}>— New client acceptance workflow</span>
            </div>
            <div className="flex items-center ml-3">
              <div className="w-8 border-t" style={{ borderColor: borderDash, borderStyle:"dashed" }} />
              <span className="text-[10px] font-medium px-1.5" style={{ color: body }}>↓</span>
            </div>
          </div>

          {/* Main lifecycle flow */}
          <div className="flex items-stretch gap-0">
            {[
              { step:"01", label:"PVIII",            role:"Engagement Budgeting",  isPrimary: true  },
              { step:"02", label:"Wallchart",         role:"Resource Scheduling",   isPrimary: false },
              { step:"03", label:"AuditIP",           role:"Staffing Operations",   isPrimary: false },
              { step:"04", label:"Workload",          role:"Capacity Utilization",  isPrimary: false },
              { step:"05", label:"EQCR Monitoring",   role:"Quality Oversight",     isPrimary: false },
            ].map((item, i, arr) => (
              <div key={item.step} className="flex items-center flex-1 min-w-0">
                <div
                  className="flex-1 px-4 py-3.5 flex flex-col justify-between transition-all duration-150"
                  style={{
                    minHeight: item.isPrimary ? "90px" : "72px",
                    background: item.isPrimary ? accentMid : (dk ? "rgba(255,255,255,0.025)" : "#ffffff"),
                    border: `1px solid ${item.isPrimary ? accentRing : border}`,
                    borderRadius: "6px",
                    boxShadow: item.isPrimary
                      ? (dk ? "0 0 24px rgba(30,73,226,0.18)" : "0 4px 16px rgba(30,73,226,0.10)")
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[9px] font-semibold tabular-nums"
                      style={{ color: item.isPrimary ? accent : (dk ? "rgba(100,160,240,0.35)" : "#9BAFC8"), fontFamily: mono }}
                    >
                      {item.step}
                    </span>
                    {item.isPrimary && (
                      <span
                        className="text-[9px] font-semibold tracking-[0.06em] uppercase px-1.5 py-0.5"
                        style={{ background: accentMid, border:`1px solid ${accentRing}`, borderRadius:"3px", color: dk ? "rgba(150,190,255,0.85)" : accent }}
                      >
                        Hub
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] leading-tight" style={{ fontWeight: item.isPrimary ? 700 : 600, color: item.isPrimary ? (dk ? "#b8d4ff" : accent) : title }}>
                      {item.label}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: body, fontWeight: 500 }}>
                      {item.role}
                    </p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="px-2 shrink-0">
                    <ArrowRight size={11} style={{ color: dk ? "rgba(50,130,220,0.28)" : "#9BAFC8" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Supporting application cards */}
        <div className="flex items-center gap-3 mb-5">
          <p className="text-[10px] font-semibold tracking-[0.10em] uppercase" style={{ color: title }}>
            Supporting Applications
          </p>
          <div className="flex-1 h-px" style={{ background: border }} />
        </div>

        <div className="grid grid-cols-5 gap-3">
          {SUPPORTING.map(item => (
            <button
              key={item.id}
              onClick={() =>
                item.id === "eqcr"
                  ? (window.location.href = "/IntelligenceStudio/")
                  : item.url && window.open(item.url, "_blank")
              }
              className="text-left flex flex-col transition-all duration-150 group/card"

              style={{
                background: surface,
                border: `1px solid ${border}`,
                borderRadius: "8px",
                padding: "18px",
                boxShadow: dk ? "none" : "0 1px 3px rgba(0,40,120,0.05)",
              }}
              onMouseEnter={e => CardHover(e, true)}
              onMouseLeave={e => CardHover(e, false)}
            >
              {/* Role + optional tag */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold" style={{ color: accent }}>
                  {item.role}
                </span>
                {item.optional && (
                  <span
                    className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5"
                    style={{
                      color: body,
                      border: `1px dashed ${borderDash}`,
                      borderRadius: "3px",
                    }}
                  >
                    Optional
                  </span>
                )}
              </div>

              {/* App name */}
              <p className="text-[13px] mb-2 leading-tight" style={{ fontWeight: 700, color: title }}>
                {item.app}
              </p>

              {/* Why open it */}
              <p className="text-[11px] leading-relaxed flex-1" style={{ color: body, fontWeight: 400 }}>
                {item.why}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-1.5 mt-4 pt-3.5" style={{ borderTop: `1px solid ${border}` }}>
                <span className="text-[10px] font-semibold" style={{ color: dk ? "rgba(100,160,240,0.55)" : accent }}>
                  Open
                </span>
                <ArrowRight
                  size={10}
                  className="group/card:translate-x-0.5 transition-transform duration-150"
                  style={{ color: dk ? "rgba(100,160,240,0.45)" : accent }}
                />
              </div>
            </button>
          ))}
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
