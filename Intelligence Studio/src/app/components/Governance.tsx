import { useOutletContext } from "react-router";
import { Scale, BookOpen, FileCheck, ArrowRight } from "lucide-react";

interface ContextType {
  theme: "dark" | "light";
}

const PRIMARY_RESOURCES = [
  {
    id: "policies",
    icon: Scale,
    title: "Policies & Procedures",
    purpose:
      "Defines governance rules, approval workflows, eligibility criteria, and standardized procedures to ensure consistent and compliant operations.",
    href: "https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-DataGovernance/SitePages/Docs---Policies---Procedures.aspx",
  },
  {
    id: "guides",
    icon: BookOpen,
    title: "Guides & Manuals",
    purpose:
      "Provides step-by-step instructions, onboarding resources, and detailed process documentation to support effective adoption and execution.",
    href: "https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-DataGovernance/SitePages/Docs---Guides---Manuals.aspx",
  },
  {
    id: "controls",
    icon: FileCheck,
    title: "Controls & Quality Evidence",
    purpose:
      "Includes audit evidence, quality assurance documentation, and compliance artifacts to support monitoring, validation, and review processes.",
    href: "https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-DataGovernance/SitePages/Docs---Guides.aspx",
  },
];

export function Governance() {
  const { theme } = useOutletContext<ContextType>();
  const isDark = theme === "dark";

  /* 🎨 TOKENS */
  const bg = isDark
    ? "linear-gradient(180deg,#06111f 0%,#071526 100%)"
    : "linear-gradient(180deg,#f4f7fc 0%,#eef3fb 100%)";

  const surface = isDark ? "#0d1e35" : "#ffffff";
  const border = isDark ? "rgba(80,150,255,0.14)" : "#dce6f2";

  const title = isDark ? "#e8f0ff" : "#00338d";
  const body = isDark ? "rgba(200,220,255,0.55)" : "#5B708A";
  const sub = isDark ? "rgba(220,235,255,0.75)" : "#3D4A5D";

  const accent = "#1E49E2";
  const accentSoft = isDark ? "rgba(30,73,226,0.18)" : "rgba(30,73,226,0.08)";
  const accentStrong = isDark ? "rgba(90,160,255,0.36)" : "rgba(30,73,226,0.22)";

  const mono = "'IBM Plex Mono', monospace";
  const font = "'IBM Plex Sans', sans-serif";

  return (
    <div
className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: bg, fontFamily: font }}
    >

      {/* GRID */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(50,130,220,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(50,130,220,0.05) 1px,transparent 1px)"
            : "linear-gradient(rgba(30,73,226,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,73,226,0.04) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* GLOW */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20px",
          right: "-100px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle,rgba(30,73,226,0.30) 0%,transparent 70%)"
            : "radial-gradient(circle,rgba(30,73,226,0.18) 0%,transparent 70%)",
          filter: "blur(32px)",
        }}
      />

      {/* HERO */}
      <section className="relative pt-14 pb-10">
        <div className="max-w-[1200px] mx-auto px-10">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-4"
            style={{ color: body, fontFamily: mono }}
          >
            Governance Framework
          </p>

          <h1
            style={{
              fontSize: "38px",
              fontWeight: 700,
              color: title,
              marginBottom: "8px",
            }}
          >
            Governance
          </h1>

          <p style={{ maxWidth: "520px", color: sub, fontSize: "14px" }}>
            Policies, standards, controls and guidance for Intelligence Studio.
          </p>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="max-w-[1200px] mx-auto px-10 pb-14">
        <div className="mb-6">
          <p
            className="text-[10px] uppercase tracking-[0.14em] mb-2"
            style={{ color: body, fontFamily: mono }}
          >
            Resources
          </p>

          <h2 style={{ fontSize: "22px", fontWeight: 600, color: title }}>
            Governance Resources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRIMARY_RESOURCES.map((resource, index) => {
            const Icon = resource.icon;

            return (
              <div
                key={resource.id}
                className="group relative overflow-hidden"
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "12px",
                }}
              >
                {/* TOP ACCENT */}
                <div
                  style={{
                    height: "3px",
                    background: "linear-gradient(90deg,#1E49E2,#5d8cff)",
                  }}
                />

                {/* GLOW */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: "-30px",
                    right: "-20px",
                    width: "140px",
                    height: "140px",
                    borderRadius: "50%",
                    background: isDark
                      ? "radial-gradient(circle,rgba(30,73,226,0.20) 0%,transparent 70%)"
                      : "radial-gradient(circle,rgba(30,73,226,0.10) 0%,transparent 70%)",
                    filter: "blur(18px)",
                  }}
                />

                <div className="relative p-5">
                  <div className="flex items-start gap-4 mb-4">

                    <div
                      className="w-10 h-10 flex items-center justify-center"
                      style={{
                        background: accentSoft,
                        borderRadius: "8px",
                        border: `1px solid ${accentStrong}`,
                      }}
                    >
                      <Icon size={16} style={{ color: accent }} />
                    </div>

                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: title }}>
                        {resource.title}
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: "13px", color: sub, marginBottom: "12px" }}>
                    {resource.purpose}
                  </p>

                  
<a
  href={resource.href}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-1.5"
  style={{ textDecoration: "none" }}
>
  <span style={{ fontSize: "11px", color: accent }}>
    Open
  </span>
  <ArrowRight size={12} style={{ color: accent }} />
</a>

                  </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-[1200px] mx-auto px-10 pb-16">
        <div
          style={{
            borderRadius: "14px",
            padding: "1px",
            background: "linear-gradient(135deg,#00338D,#005EB8,#00B5E2)",
          }}
        >
          <div
            className="px-8 py-8"
            style={{
              borderRadius: "13px",
              background: isDark ? "#0a1828" : "#f4f7fc",
            }}
          >
            <h2 style={{ fontSize: "22px", color: title, marginBottom: "8px" }}>
              Need guidance?
            </h2>

            <p style={{ fontSize: "13px", color: body, marginBottom: "14px" }}>
              Find policies, approval paths or governance contacts.
            </p>

            <button
              className="flex items-center gap-2 px-4 py-2"
              style={{
                background: accent,
                color: "#fff",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              View Governance Contacts
              <ArrowRight size={12} />
            </button>
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
