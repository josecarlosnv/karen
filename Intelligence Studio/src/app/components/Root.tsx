import React, { useState, useEffect } from "react";
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router";
import {
  Menu,
  X,
  Search,
  ChevronRight,
  ArrowRight,
  Moon,
  Sun,
} from "lucide-react";
import {
  translations,
  type Language,
} from "../data/translations";
import {
  getUpdates,
  type StudioUpdate,
} from "../services/intelligencestService";

import navImageLight from "../../imports/claro.png";
import navImageDark from "../../imports/oscuro.png";

const ANNOUNCEMENTS = [
  "Q2 2026 — Workload Optimization Engine v3.1 is now live in Engagement Management",
  "New: Partner Performance module added to Talent Assessment — available 28 May 2026",
  "Governance Framework refresh scheduled for June 2026 — register for the executive briefing",
];

interface Product {
  name: string;
  category: string;
  badge: "Live" | "New" | "Beta" | "Coming";
}

interface Suite {
  id: string;
  name: string;
  tagline: string;
  description: string;
  products: Product[];
}

const SUITES: Suite[] = [
  {
    id: "engagement",
    name: "Engagement Management",
    tagline:
      "Precision resource orchestration at enterprise scale.",
    description:
      "Staffing, workload and engagement management for audit operations.",
    products: [
      {
        name: "PVIII",
        category: "Budgeting",
        badge: "Live",
      },
      {
        name: "AuditIP",
        category: "Staffing",
        badge: "Live",
      },
      {
        name: "Wallchart",
        category: "Scheduling",
        badge: "Live",
      },
      {
        name: "Workload",
        category: "Workforce Capacity",
        badge: "Live",
      },
      {
        name: "Client Proposal Tracker",
        category: "Acceptance & Approval",
        badge: "Live",
      },
      {
        name: "EQCR Monitoring",
        category: "Quality & Compliance",
        badge: "Coming",
      },
    ],
  },
  {
    id: "talent",
    name: "Performance Intelligence",
    tagline: "Intelligence-led people decisions.",
    description:
      "Talent evaluation and performance frameworks across audit roles.",
    products: [
      {
        name: "Scorefy",
        category: "Assessment Platform",
        badge: "Live",
      },
      {
        name: "Professional Staff",
        category: "Feedback",
        badge: "Live",
      },
        {
        name: "Managers",
        category: "Management",
        badge: "Live",
      },
        {
        name: "Evaluation Operation",
        category: "Administration",
        badge: "Live",
      },
      {
        name: "Partners & Directors",
        category: "Executive Performance",
        badge: "Live",
      },
      {
        name: "Quality Metrics",
        category: "Development",
        badge: "Live",
      },
    ],
  },
  {
    id: "strategy",
    name: "Executive Insights",
    tagline:
      "Business performance intelligence for audit leadership.",
    description:
      "Executive dashboards and business visibility tools for partners, directors and leadership teams.",
    products: [
      {
        name: "Forecast",
        category: "Revenue & Hours",
        badge: "Live",
      },
      {
        name: "Operational Capability",
        category: "Portfolio Analytics",
        badge: "Live",
      },
      {
        name: "Overtime Analysis",
        category: "Capacity Trends",
        badge: "Live",
      },
    ],
  },
  {
    id: "analytical-perspectives",
    name: "Analytical Perspectives",
    tagline: "Data-driven insights for strategic decisions.",
    description:
      "Advanced analytics and visualization tools for data-driven insights.",
    products: [],
  },
  {
    id: "governance",
    name: "Governance",
    tagline: "Structure, accountability, and oversight.",
    description:
      "Risk, compliance, and audit governance aligned with enterprise standards.",
    products: [
      {
        name: "Policies & Procedures",
        category: "Compliance",
        badge: "Live",
      },
      {
        name: "Guides & Manuals",
        category: "Documentation",
        badge: "Live",
      },
      {
        name: "Controls & Quality",
        category: "Evidence",
        badge: "Live",
      },
    ],
  },
  {
    id: "learning",
    name: "Learning & Certification",
    tagline:
      "Mandatory training, certification compliance and professional development.",
    description:
      "Certification tracking, audit training compliance, Colegio de Contadores requirements and mandatory learning reporting for the enterprise workforce.",
    products: [
      {
        name: "DPC Compliance",
        category: "Dashboard",
        badge: "Live",
      },
      {
        name: "Learning Tracker",
        category: "Compliance",
        badge: "Coming",
      },
    ],
  },
];

function badgeStyle(badge: Product["badge"], theme: "dark" | "light"): React.CSSProperties {
  if (theme === "light") {
    switch (badge) {
      case "Live":
        return { color: "#1E49E2", borderColor: "#1E49E2", background: "#FFFFFF", fontWeight: 600 };
      case "New":
        return { color: "#1E49E2", borderColor: "rgba(30,73,226,0.35)", background: "#FFFFFF", fontWeight: 600 };
      case "Beta":
        return { color: "rgba(0,51,141,0.65)", borderColor: "rgba(0,51,141,0.25)", background: "#FFFFFF", fontWeight: 500 };
      case "Coming":
        return { color: "rgba(0,51,141,0.65)", borderColor: "rgba(0,51,141,0.25)", background: "#FFFFFF", fontWeight: 500 };
    }
  }
  // dark mode — existing Tailwind classes handle colors; return empty
  return {};
}

function badgeClass(badge: Product["badge"], theme: "dark" | "light") {
  const baseClasses =
    "text-[9px] tracking-[0.06em] capitalize px-1.5 py-0.5 border";
  if (theme === "light") return baseClasses;
  switch (badge) {
    case "Live":
      return `${baseClasses} text-accent border-accent/30 bg-accent/5`;
    case "New":
      return `${baseClasses} text-primary border-primary/30 bg-primary/5`;
    case "Beta":
      return `${baseClasses} text-muted-foreground border-muted-foreground/30 bg-muted-foreground/5`;
    case "Coming":
      return `${baseClasses} text-foreground/40 border-foreground/20 bg-foreground/5`;
  }
}

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [announcementClosed, setAnnouncementClosed] =
    useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSuite, setMenuSuite] =
    useState<string>("engagement");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [language, setLanguage] = useState<"en" | "es">("es");

  const t = translations[language];

  const [bannerUpdates, setBannerUpdates] = useState<StudioUpdate[]>([]);

  useEffect(() => {
    getUpdates("banner").then(setBannerUpdates).catch(() => {});
  }, []);

  // Usa los mensajes de la BD; si no hay, cae a los del front (t.announcements)
  const announcements =
    bannerUpdates.length > 0
      ? bannerUpdates.map((b) => b.message)
      : t.announcements;

  // Apply dark class to document root for CSS variable switching
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Rotate announcements every 4 s
  useEffect(() => {
    if (announcementClosed) return;
    const timer = setInterval(
      () =>
        setAnnouncementIndex(
          (i) => (i + 1) % announcements.length,
        ),
      4000,
    );
    return () => clearInterval(timer);
  }, [announcementClosed, announcements.length]);


  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    closeMenu();
  }, [location.pathname]);

  const openMenuAt = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
    }
    setMenuSuite(id);
    setMenuOpen(true);
  };

  const closeMenu = () => setMenuOpen(false);

  const toggleMenu = () => {
    if (menuOpen) closeMenu();
    else openMenuAt("engagement");
  };

  const toggleTheme = () =>
    setTheme(theme === "dark" ? "light" : "dark");
  const toggleLanguage = () =>
    setLanguage(language === "en" ? "es" : "en");

  const activeSuiteData =
    SUITES.find((s) => s.id === menuSuite) || SUITES[0];

  const NAV_ITEMS = SUITES.map((s) => ({
    id: s.id,
    name: t.suites[s.id as keyof typeof t.suites].name,
    path:
      s.id === "engagement"
        ? "/engagement-operations"
        : s.id === "talent"
          ? "/talent-assessment"
          : s.id === "strategy"
            ? "/strategy-office"
            : s.id === "analytical-perspectives"
              ? "/analytical-perspectives"
              : s.id === "governance"
                ? "/governance"
                : s.id === "learning"
                  ? "/learning-enablement"
                  : "/",
  }));

  /* Single helper — navigate to the currently active suite and close the menu */
  const navigateToSuite = () => {
    closeMenu();
    const item = NAV_ITEMS.find(
      (n) => n.id === activeSuiteData.id,
    );
    if (item) navigate(item.path);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* MARKER-MAKE-KIT-INVOKED */}
      {/* MARKER-MAKE-KIT-DISCOVERY-READ */}
      {/* Announcement Ribbon */}
      {!announcementClosed && (
        <div
          className="relative border-b flex items-center justify-center px-12 py-2.5"
          style={{
            backgroundColor:
              theme === "light" ? "#1E49E2" : "#00338D",
            borderColor:
              theme === "light" ? "#1E49E2" : "#00338D",
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="tracking-[0.1em] capitalize text-[10px] font-medium text-white"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              {t.announcementLabel}
            </span>
            <span className="w-px h-3 bg-border" />
            <span
              className="text-[11.5px] transition-opacity duration-500 text-white/90 tracking-[0.1em]"
              key={announcementIndex}
            >
              {announcements[announcementIndex] ?? announcements[0]}
            </span>

          </div>
          <button
            onClick={() => setAnnouncementClosed(true)}
            className="absolute right-5 transition-colors text-white/70 hover:text-white"
            aria-label="Close announcement"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background:
            theme === "dark"
              ? "linear-gradient(135deg, rgba(10, 22, 40, 0.75) 0%, rgba(5, 13, 26, 0.65) 100%)"
              : "rgba(255,255,255,1)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          borderColor:
            theme === "dark"
              ? "rgba(80, 160, 232, 0.15)"
              : "rgba(0, 51, 141, 0.08)",
          boxShadow:
            theme === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(80, 160, 232, 0.1) inset, 0 1px 0 rgba(80, 160, 232, 0.1) inset"
              : "0 4px 24px rgba(0, 51, 141, 0.06), 0 0 0 1px rgba(0, 94, 184, 0.05) inset",
        }}
      >
        {/* Primary bar */}
        <div className="max-w-[1440px] mx-auto px-8 h-[64px] flex items-center justify-between">
          {/* Hamburger */}
          <button
            onClick={toggleMenu}
            className="flex items-center gap-3 transition-colors group text-muted-foreground hover:text-foreground"
            aria-label={
              menuOpen ? "Close navigation" : "Open navigation"
            }
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
            <span
              className="text-[10px] tracking-[0.18em] capitalize transition-colors text-foreground/25 group-hover:text-foreground/50"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {menuOpen ? "" : ""}
            </span>
          </button>

          {/* Wordmark */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-center group"
          >
            <span
              className="text-[15px] tracking-[0.2em] capitalize font-semibold transition-all duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.22em",
                backgroundImage:
                  theme === "light"
                    ? "linear-gradient(135deg, #00338d 0%, #005eb8 100%)"
                    : "linear-gradient(135deg, #50a0e8 0%, #0078d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                filter:
                  theme === "dark"
                    ? "drop-shadow(0 0 8px rgba(0, 120, 212, 0.4))"
                    : "none",
              }}
            >
              {t.studioName}
            </span>
          </Link>

          {/* Icon row */}
          <div className="flex items-center gap-5">
            {/* Language toggle */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLanguage("en")}
                className={`text-[10px] tracking-[0.12em] capitalize transition-colors ${
                  language === "en"
                    ? "text-foreground/75"
                    : "text-foreground/25 hover:text-foreground/50"
                }`}
                style={{ fontFamily: "'DM Mono', monospace" }}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-[10px] text-foreground/15">
                /
              </span>
              <button
                onClick={() => setLanguage("es")}
                className={`text-[10px] tracking-[0.12em] capitalize transition-colors ${
                  language === "es"
                    ? "text-foreground/75"
                    : "text-foreground/25 hover:text-foreground/50"
                }`}
                style={{ fontFamily: "'DM Mono', monospace" }}
                aria-label="Cambiar a Español"
              >
                ES
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="transition-colors text-foreground/35 hover:text-foreground/75"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )}
            </button>

            {/* Search */}
            <button
              className="transition-colors text-foreground/35 hover:text-foreground/75"
              aria-label="Search"
            >
              <Search size={15} />
            </button>
          </div>
        </div>

        {/* Suite sub-navigation */}
        <div
          className="border-t"
          style={{
            background:
              theme === "dark"
                ? "linear-gradient(135deg, rgba(15, 31, 53, 0.55) 0%, rgba(10, 22, 40, 0.45) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.60) 0%, rgba(245, 250, 255, 0.50) 100%)",
            backdropFilter: "blur(16px) saturate(150%)",
            WebkitBackdropFilter: "blur(16px) saturate(150%)",
            borderColor:
              theme === "dark"
                ? "rgba(80, 160, 232, 0.12)"
                : "rgba(0, 51, 141, 0.06)",
            boxShadow:
              theme === "dark"
                ? "0 1px 0 rgba(80, 160, 232, 0.08) inset"
                : "0 1px 0 rgba(0, 94, 184, 0.04) inset",
          }}
        >
          <div className="max-w-[1440px] mx-auto px-8 flex justify-center">
            {NAV_ITEMS.map((item) => {
              const isSuite = SUITES.some(
                (s) => s.id === item.id,
              );
              const isActive =
                location.pathname === item.path &&
                item.path !== "/";

              return isSuite ? (
                <button
                  key={item.id}
                  onClick={() => openMenuAt(item.id)}
                  className={`
                    relative px-6 py-2.5 text-[11px] tracking-[0.14em] capitalize border-b-2 transition-all duration-300 font-medium group
                    ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-foreground/70 hover:text-foreground"
                    }
                  `}
                  style={{
                    borderColor: isActive
                      ? theme === "dark"
                        ? "#0078d4"
                        : "#005eb8"
                      : "transparent",
                    textShadow:
                      isActive && theme === "dark"
                        ? "0 0 12px rgba(0, 120, 212, 0.3)"
                        : "none",
                  }}
                >
                  <span className="relative z-10">
                    {item.name}
                  </span>
                  {!isActive && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          theme === "dark"
                            ? "linear-gradient(180deg, rgba(0, 120, 212, 0.08) 0%, transparent 100%)"
                            : "linear-gradient(180deg, rgba(0, 94, 184, 0.04) 0%, transparent 100%)",
                      }}
                    />
                  )}
                </button>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    relative px-6 py-2.5 text-[11px] tracking-[0.14em] capitalize border-b-2 transition-all duration-300 font-medium group
                    ${
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-foreground/70 hover:text-foreground"
                    }
                  `}
                  style={{
                    borderColor: isActive
                      ? theme === "dark"
                        ? "#0078d4"
                        : "#005eb8"
                      : "transparent",
                    textShadow:
                      isActive && theme === "dark"
                        ? "0 0 12px rgba(0, 120, 212, 0.3)"
                        : "none",
                  }}
                >
                  <span className="relative z-10">
                    {item.name}
                  </span>
                  {!isActive && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          theme === "dark"
                            ? "linear-gradient(180deg, rgba(0, 120, 212, 0.08) 0%, transparent 100%)"
                            : "linear-gradient(180deg, rgba(0, 94, 184, 0.04) 0%, transparent 100%)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mega Menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={closeMenu}
            style={{
              backdropFilter: "blur(10px) saturate(140%)",
              WebkitBackdropFilter: "blur(10px) saturate(140%)",
              background:
                theme === "dark"
                  ? "rgba(3, 8, 20, 0.80)"
                  : "rgba(200, 218, 240, 0.50)",
            }}
          />

          {/* Menu panel */}
          <div
            className="fixed left-0 right-0 z-50"
            style={{
              top: announcementClosed ? "104px" : "132px",
              background:
                theme === "dark" ? "#07111f" : "#FAFBFD",
              borderBottom:
                theme === "dark"
                  ? "1px solid rgba(80,160,232,0.08)"
                  : "1px solid rgba(0,51,141,0.06)",
              boxShadow:
                theme === "dark"
                  ? "0 24px 64px rgba(0,0,0,0.70)"
                  : "0 20px 56px rgba(0, 35, 100, 0.12)",
            }}
          >
            <div
              className="max-w-[1440px] mx-auto grid"
              style={{
                gridTemplateColumns: "264px 1fr 380px",
                minHeight: "460px",
              }}
            >
              {/* ── LEFT: Suite list ── */}
              <div
                className="flex flex-col py-9 px-7"
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(180deg, rgba(4, 16, 40, 0.80) 0%, rgba(4, 12, 30, 0.60) 100%)"
                      : "#F7F9FC",
                  borderRight:
                    theme === "dark"
                      ? "1px solid rgba(80,160,232,0.08)"
                      : "1px solid rgba(0,51,141,0.06)",
                }}
              >
                <nav className="flex-1 space-y-0.5">
                  {SUITES.map((suite, i) => {
                    const isSelected = menuSuite === suite.id;
                    return (
                      <button
                        key={suite.id}
                        onMouseEnter={() =>
                          setMenuSuite(suite.id)
                        }
                        className="w-full text-left flex items-center justify-between py-2.5 px-3 transition-all duration-150"
                        style={{
                          borderRadius: "5px",
                          borderLeft: isSelected
                            ? "2px solid #1E49E2"
                            : "2px solid transparent",
                          background: isSelected
                            ? theme === "dark"
                              ? "rgba(30, 73, 226, 0.14)"
                              : "rgba(30, 73, 226, 0.07)"
                            : "transparent",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="text-[10px] tabular-nums w-5 shrink-0"
                            style={{
                              fontFamily:
                                "'IBM Plex Sans', monospace",
                              fontWeight: 500,
                              color: isSelected
                                ? theme === "dark"
                                  ? "rgba(100,170,255,0.65)"
                                  : "#1E49E2"
                                : theme === "dark"
                                  ? "rgba(255,255,255,0.20)"
                                  : "rgba(0,51,141,0.55)",
                            }}
                          >
                            0{i + 1}
                          </span>
                          <span
                            className="text-[13px] transition-colors duration-150"
                            style={{
                              fontFamily:
                                "'IBM Plex Sans', sans-serif",
                              fontWeight: isSelected
                                ? 600
                                : 500,
                              color: isSelected
                                ? theme === "dark"
                                  ? "#e8f0ff"
                                  : "#1E49E2"
                                : theme === "dark"
                                  ? "rgba(255,255,255,0.45)"
                                  : "rgba(0,51,141,0.62)",
                            }}
                          >
                            {
                              t.suites[
                                suite.id as keyof typeof t.suites
                              ].name
                            }
                          </span>
                        </div>
                        <ChevronRight
                          size={12}
                          style={{
                            opacity: isSelected ? 1 : 0,
                            transition: "opacity 0.15s",
                            color:
                              theme === "dark"
                                ? "rgba(100,170,255,0.55)"
                                : "#1E49E2",
                          }}
                        />
                      </button>
                    );
                  })}
                </nav>

              </div>

              {/* ── CENTER: Product grid ── */}
              <div className="py-9 px-10 flex flex-col">
                

                {/* Analytical Perspectives — capability panel */}
                {activeSuiteData.id === "analytical-perspectives" ? (
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <p
                        className="text-[10px] tracking-[0.12em] uppercase mb-1.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color:
                            theme === "dark"
                              ? "rgba(100,160,240,0.55)"
                              : "rgba(0,51,141,0.45)",
                        }}
                      >
                        Analytical Perspectives
                      </p>
                      <p
                        className="text-[13px] mb-3"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontWeight: 600,
                          color:
                            theme === "dark"
                              ? "rgba(220,235,255,0.88)"
                              : "rgba(0,51,141,0.85)"
                        }}
                      >
                        Business questions answered with data.
                      </p>
                      <p
                        className="text-[12px] leading-[1.65]"
                        style={{
                          fontFamily: "var(--font-sans)",
                          color:
                            theme === "dark"
                              ? "rgba(180,205,240,0.50)"
                              : "rgba(0,51,141,0.55)",
                        }}
                      >
                        Transform business questions into structured, data-driven insights. This suite focuses on investigations, deep dives and analytical studies that help leaders understand operational challenges, identify opportunities and support decision-making.
                      </p>
                    </div>

                    <div
                      className="mt-auto pt-4"
                      style={{
                        borderTop:
                          theme === "dark"
                            ? "1px solid rgba(80,160,232,0.08)"
                            : "1px solid rgba(0,51,141,0.06)",
                      }}
                    >
                      <p
                        className="text-[9.5px] tracking-[0.10em] uppercase mb-2.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color:
                            theme === "dark"
                              ? "rgba(100,160,240,0.40)"
                              : "rgba(0,51,141,0.38)",
                        }}
                      >
                        Areas of Focus
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {[
                          "Workforce Analytics",
                          "Engagement Economics",
                          "Operational Effectiveness",
                          "Learning & Certification Adoption",
                          "Performance Trends",
                          "Strategic Business Reviews",
                        ].map((area) => (
                          <div key={area} className="flex items-center gap-1.5">
                            <span
                              className="shrink-0 w-1 h-1 rounded-full"
                              style={{
                                background:
                                  theme === "dark"
                                    ? "rgba(100,160,240,0.40)"
                                    : "rgba(0,51,141,0.30)",
                              }}
                            />
                            <span
                              className="text-[11px] leading-snug"
                              style={{
                                fontFamily: "var(--font-sans)",
                                color:
                                  theme === "dark"
                                    ? "rgba(180,205,240,0.55)"
                                    : "rgba(0,51,141,0.62)",
                              }}
                            >
                              {area}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  
                  </div>
                ) : (
                /* Product cards — clicking any card navigates into the suite */
                <div className="grid grid-cols-2 gap-2 flex-1">

                                          {activeSuiteData.products.map((product) => (
                                              <button
                                                  key={product.name}
                                                  onClick={navigateToSuite}


                      className="text-left px-4 py-3.5 transition-all duration-150 group/card"
                      style={{
                        borderRadius: "6px",
                        background:
                          theme === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "#ffffff",
                        border:
                          theme === "dark"
                            ? "1px solid rgba(80,160,232,0.08)"
                            : "1px solid rgba(0,51,141,0.06)",
                        boxShadow:
                          theme === "dark"
                            ? "none"
                            : "0 1px 4px rgba(0, 40, 120, 0.06)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          theme === "dark"
                            ? "rgba(30, 73, 226, 0.10)"
                            : "#F4F7FF";
                        e.currentTarget.style.borderColor =
                          theme === "dark"
                            ? "rgba(80, 150, 255, 0.28)"
                            : "rgba(0,51,141,0.18)";
                        e.currentTarget.style.boxShadow =
                          theme === "dark"
                            ? "0 0 0 1px rgba(80,150,255,0.18) inset, 0 4px 16px rgba(0, 60, 200, 0.14)"
                            : "0 2px 12px rgba(0, 51, 141, 0.10)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          theme === "dark"
                            ? "rgba(255,255,255,0.03)"
                            : "#ffffff";
                        e.currentTarget.style.borderColor =
                          theme === "dark"
                            ? "rgba(80,160,232,0.08)"
                            : "rgba(0,51,141,0.06)";
                        e.currentTarget.style.boxShadow =
                          theme === "dark"
                            ? "none"
                            : "0 1px 4px rgba(0, 40, 120, 0.06)";
                      }}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <span
                          className="text-[13px] leading-snug transition-colors duration-150"
                          style={{
                            fontFamily:
                              "'IBM Plex Sans', sans-serif",
                            fontWeight: 500,
                            color:
                              theme === "dark"
                                ? "rgba(220,235,255,0.75)"
                                : "rgba(0,51,141,0.85)",
                          }}
                        >
                          {product.name}
                        </span>
                        <span
                          className={`shrink-0 ml-2 mt-0.5 ${badgeClass(product.badge, theme)}`}
                          style={{
                            fontFamily: "'IBM Plex Sans', monospace",
                            ...badgeStyle(product.badge, theme),
                          }}
                        >
                          {product.badge}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-medium"
                        style={{
                          fontFamily:
                            "'IBM Plex Sans', sans-serif",
                          color:
                            theme === "dark"
                              ? "rgba(100, 160, 240, 0.35)"
                              : "rgba(0,51,141,0.55)",
                        }}
                      >
                        {product.category}
                      </span>
                    </button>
                  ))}
                </div>
                )}

                {/* Enter suite CTA — secondary visual cue */}
                <button
                  className="mt-6 flex items-center gap-2 group/enter"
                  onClick={navigateToSuite}
                >
                  <span
                    className="text-[11px] font-semibold tracking-[0.06em] transition-colors duration-150"
                    style={{
                      fontFamily: "'IBM Plex Sans', sans-serif",
                      color:
                        theme === "dark"
                          ? "rgba(100, 180, 255, 0.65)"
                          : "#1E49E2",
                    }}
                  >
                    {t.enterSuite}
                  </span>
                  <ArrowRight
                    size={12}
                    className="group/enter:translate-x-0.5 transition-transform duration-150"
                    style={{
                      color:
                        theme === "dark"
                          ? "rgba(100, 180, 255, 0.55)"
                          : "#1E49E2",
                    }}
                  />
                </button>
              </div>

              {/* ── RIGHT: Spotlight image panel — fully clickable ── */}
              {/* ── RIGHT: Spotlight image panel — fully clickable ── */}
<div
  className="relative flex flex-col overflow-hidden transition-all duration-200"
  style={{
    cursor: "pointer",
  }}
  onClick={navigateToSuite}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow = "none";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow = "none";
  }}
>
  {/* Full-bleed image */}
  <div className="absolute inset-0">
    <img
      src={theme === "dark" ? navImageDark : navImageLight}
      alt={`${t.suites[activeSuiteData.id as keyof typeof t.suites].name} visual`}
      className="w-full h-full object-cover"
      style={{ display: "block" }}
    />

    {/* Left fade to blend image with center panel */}
    <div
      className="absolute top-0 left-0 h-full pointer-events-none z-[2]"
      style={{
        width: theme === "dark" ? "82px" : "56px",
        background:
          theme === "dark"
            ? "linear-gradient(to right, #07111f 0%, rgba(7,17,31,0.92) 18%, rgba(7,17,31,0.55) 45%, rgba(7,17,31,0) 100%)"
            : "linear-gradient(to right, rgba(250,251,253,0.55) 0%, rgba(250,251,253,0.25) 40%, rgba(250,251,253,0) 100%)",
      }}
    />
  </div>

  {/* Bottom veil — localized to bottom third only */}
  <div
    className="absolute bottom-0 left-0 right-0"
    style={{
      height: "55%",
      background:
        theme === "dark"
          ? "linear-gradient(0deg, rgba(7,17,31,0.82) 0%, rgba(7,17,31,0.45) 55%, transparent 100%)"
          : "linear-gradient(0deg, rgba(8,22,52,0.58) 0%, rgba(8,22,52,0.20) 55%, transparent 100%)",
    }}
  />

  {/* Bottom info block — suite name + tagline only */}
  <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-6">
    <p
      className="text-[10px] tracking-[0.14em] uppercase mb-2"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        color: "rgba(255,255,255,0.45)",
      }}
    >
      {t.suiteSpotlight}
    </p>
    <p
      className="text-[15px] leading-snug mb-1"
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 600,
        color: "rgba(255,255,255,0.92)",
      }}
    >
      {t.suites[activeSuiteData.id as keyof typeof t.suites].name}
    </p>
    <p
      className="text-[11.5px] leading-[1.55]"
      style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 400,
        color: "rgba(255,255,255,0.55)",
      }}
    >
      {t.suites[activeSuiteData.id as keyof typeof t.suites].tagline}
    </p>
  </div>
</div>

            </div>
          </div>
        </>
      )}

      {/* Page content */}
      <Outlet context={{ theme, language, t }} />
    </div>
  );
}