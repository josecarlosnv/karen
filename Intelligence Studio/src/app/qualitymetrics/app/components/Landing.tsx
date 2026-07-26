import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { qualificationsApi } from "@qm/app/api/qualificationsApi";
import {
  ArrowRight,
  Settings,
  TrendingUp,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import executiveBg from "../../imports/Image__4_.jpg";


const performanceHighlights = [
  "Financial targets",
  "Portfolio growth",
  "Strategic wins",
];

const qualityRoutes = [
  {
    title: "Partners & Directors",
    description:
      "Detailed compliance matrix and indicator view",
    path: "/partner/1",
  },
  {
    title: "Head of Quality",
    description:
      "Executive oversight and quality management dashboard",
    path: "/head-of-audit/1",
  },
];

export function Landing() {
  const navigate = useNavigate();
  const [leaderCount, setLeaderCount] = useState<number | null>(null);

  useEffect(() => {
    qualificationsApi.scope()

      .then((s) => setLeaderCount(s.people.length))
      .catch(() => setLeaderCount(null));
  }, []);

  const quickStats = [
    { value: leaderCount === null ? "—" : String(leaderCount), label: "Leaders" },
    { value: "12", label: "Quality Metrics" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${executiveBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundColor: "#EEF3FA",
      }}
    >
      {/* Ultra-light tint */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,51,141,0.06) 0%, rgba(30,73,226,0.02) 42%, rgba(0,51,141,0.07) 100%)",
        }}
      />

      {/* Refined KPMG blue accents */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 18% 22%, rgba(0,51,141,0.10) 0%, rgba(0,51,141,0) 52%),
            radial-gradient(circle at 84% 28%, rgba(30,73,226,0.10) 0%, rgba(30,73,226,0) 48%),
            radial-gradient(circle at 78% 80%, rgba(0,94,184,0.08) 0%, rgba(0,94,184,0) 46%)
          `,
        }}
      />

      {/* Ambient blur */}
      <div
        className="absolute -left-24 top-20 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(0,51,141,0.08)" }}
      />
      <div
        className="absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(30,73,226,0.08)" }}
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Top bar */}
        {/* Tuerquita → /admin (System Administration): oculta porque hoy es un mockup
            con datos hardcodeados (127 Partners, FY 2025...). Ver QM_TUERQUITA_ADMIN.md */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-6 pt-6 lg:px-8" />

        {/* Hero */}
        <section className="mx-auto w-full max-w-7xl flex-1 px-6 pb-10 pt-8 lg:px-8 lg:pt-12">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1.08fr_0.92fr]">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-3xl pt-2"
            >
              <div
                className="mb-6 inline-flex w-fit items-center self-start gap-2 rounded-full px-3 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.24)",
                  border: "1px solid rgba(255,255,255,0.34)",
                  color: "rgba(12,35,60,0.72)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                }}
              >
                <div className="relative flex items-center justify-center">
                  <Sparkles
                    className="h-3.5 w-3.5"
                    strokeWidth={2}
                    style={{ color: "#0A58CA" }}
                  />

                  <div
                    className="absolute h-2 w-2 rounded-full"
                    style={{
                      background: "rgba(30,73,226,0.35)",
                      filter: "blur(4px)",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontSize: "0.77rem",
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                  }}
                >
                  Leadership Insights
                </span>
              </div>

              <h1
                className="tracking-tight"
                style={{
                  fontSize: "clamp(3.2rem, 6vw, 5.45rem)",
                  lineHeight: 0.93,
                  fontWeight: 300,
                  color: "#1E49E2",
                  letterSpacing: "-0.07em",
                  textWrap: "balance",
                }}
              >
                Quality +
                <br />
                Performance
              </h1>

              <p
                className="mt-6 max-w-xl"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.72,
                  color: "rgba(12,35,60,0.74)",
                  letterSpacing: "-0.01em",
                  fontWeight: 400,
                }}
              >
                A focused view of leadership signals, strategic
                outcomes, and quality control.
              </p>

              {/* Stat rail */}
              <div className="mt-10 flex flex-wrap gap-3">
                {quickStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.08 * index,
                    }}
                    className="min-w-[158px] rounded-2xl px-4 py-3.5"
                    style={{
                      background: "rgba(255,255,255,0.24)",
                      border:
                        "1px solid rgba(255,255,255,0.34)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      boxShadow:
                        "0 12px 32px rgba(0,51,141,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.32rem",
                        fontWeight: 600,
                        color: "#00266A",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        marginTop: "0.2rem",
                        fontSize: "0.76rem",
                        color: "rgba(12,35,60,0.56)",
                        letterSpacing: "0.005em",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right feature panel */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="lg:justify-self-end"
            >
              <div
                className="relative h-full overflow-hidden rounded-[32px] p-7 lg:w-[465px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.22) 100%)",
                  border: "1px solid rgba(255,255,255,0.38)",
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  boxShadow: "0 24px 60px rgba(12,35,60,0.08)",
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.62) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div
                      style={{
                        color: "rgba(12,35,60,0.54)",
                        fontSize: "0.72rem",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      Focus Area
                    </div>
                    <div
                      className="mt-2"
                      style={{
                        color: "#00338d",
                        fontSize: "1.52rem",
                        fontWeight: 400,
                        letterSpacing: "-0.045em",
                      }}
                    >
                      Executive Lens
                    </div>
                  </div>

                  <div
                    className="rounded-full px-3 py-1.5"
                    style={{
                      background: "rgba(0,184,245,0.05)",
                      border: "1px solid rgba(0,184,245,0.4)",
                      color: "#00B8F5",
                      fontSize: "0.73rem",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                    }}
                  >
                    FY 2026
                  </div>
                </div>

                <p
                  className="mt-5 max-w-md"
                  style={{
                    color: "rgba(12,35,60,0.72)",
                    fontSize: "0.94rem",
                    lineHeight: 1.72,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Unify key signals into a clearer, more
                  actionable executive perspective.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Scope", value: "Leadership" },
                    { label: "Lens", value: "Quality" },
                    { label: "Review", value: "Performance" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl p-4"
                      style={{
                        background: "rgba(255,255,255,0.21)",
                        border:
                          "1px solid rgba(255,255,255,0.30)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.66rem",
                          color: "rgba(12,35,60,0.48)",
                          textTransform: "uppercase",
                          letterSpacing: "0.14em",
                          fontWeight: 600,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="mt-1.5"
                        style={{
                          fontSize: "1rem",
                          color: "#00338d",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-6 rounded-2xl p-4"
                  style={{
                    background: `
    linear-gradient(
      135deg,
      rgba(0,51,141,0.09) 0%,
      rgba(30,73,226,0.05) 55%,
      rgba(0,145,218,0.05) 100%
    ) padding-box,
    linear-gradient(135deg, #00338D, #1E49E2, #0091DA) border-box
    `,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid transparent",
                  }}
                >
                  <div
                    style={{
                      color: "#ffffff",
                      fontWeight: 600,
                      fontSize: "0.92rem",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Built for decisive leadership
                  </div>
                  <div
                    className="mt-1.5"
                    style={{
                      color: "rgba(229,229,229,0.8)",
                      fontSize: "0.84rem",
                      lineHeight: 1.65,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    Clearer entry points, less noise, stronger
                    signal hierarchy.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main cards */}
          <main className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            {/* Performance */}
            <motion.button
              onClick={() => navigate("/performance")}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              className="group relative h-full overflow-hidden rounded-[32px] p-8 text-left lg:p-9"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.27) 0%, rgba(255,255,255,0.19) 100%)",
                border: "1px solid rgba(255,255,255,0.36)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 24px 60px rgba(12,35,60,0.07)",
              }}
            >
              <div
                className="absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl"
                style={{ background: "rgba(0,51,141,0.08)" }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full flex-col">
                {/* Same internal structure as the right card */}
                <div>
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #00338D 0%, #0A58CA 42%, #0091DA 100%)",
                      boxShadow:
                        "0 16px 30px rgba(30,73,226,0.18)",
                    }}
                  >
                    <TrendingUp
                      className="h-5.5 w-5.5 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="max-w-xl">
                    <h2
                      style={{
                        fontSize: "2rem",
                        lineHeight: 1.03,
                        fontWeight: 300,
                        color: "#00266A",
                        letterSpacing: "-0.055em",
                      }}
                    >
                      Performance
                    </h2>
                    <p
                      className="mt-3"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.72,
                        color: "rgba(12,35,60,0.68)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Commercial impact, growth signals, and
                      strategic contribution in a streamlined
                      view.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {performanceHighlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-full px-4 py-2"
                      style={{
                        background: "rgba(255,255,255,0.22)",
                        border:
                          "1px solid rgba(255,255,255,0.30)",
                        color: "rgba(12,35,60,0.74)",
                        fontSize: "0.79rem",
                        fontWeight: 500,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Spacer to align with right card action area */}
                <div className="mt-auto pt-10">
                  <div
                    className="inline-flex items-center gap-2"
                    style={{
                      color: "#1E49E2",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Open view
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Quality */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="relative h-full overflow-hidden rounded-[32px] p-8 lg:p-9"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.20) 100%)",
                border: "1px solid rgba(255,255,255,0.36)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 24px 60px rgba(12,35,60,0.07)",
              }}
            >
              <div
                className="absolute right-0 top-0 h-52 w-52 rounded-full blur-3xl"
                style={{ background: "rgba(30,73,226,0.06)" }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex h-full flex-col">
                <div>
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, #00338D 0%, #0A58CA 42%, #0091DA 100%)",
                      boxShadow:
                        "0 16px 30px rgba(30,73,226,0.18)",
                    }}
                  >
                    <Users
                      className="h-5.5 w-5.5 text-white"
                      strokeWidth={2}
                    />
                  </div>

                  <div className="max-w-xl">
                    <h2
                      style={{
                        fontSize: "2rem",
                        lineHeight: 1.03,
                        fontWeight: 300,
                        color: "#00266A",
                        letterSpacing: "-0.055em",
                      }}
                    >
                      Quality Rating
                    </h2>
                    <p
                      className="mt-3"
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.72,
                        color: "rgba(12,35,60,0.68)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Compliance posture, regulatory readiness,
                      and role-based oversight from a single
                      control point.
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {qualityRoutes.map((item, index) => (
                    <motion.button
                      key={item.title}
                      onClick={() => navigate(item.path)}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                      className="group/row w-full rounded-[22px] p-5 text-left transition-all"
                      style={{
                        background:
                          index === 0
                            ? "linear-gradient(135deg, rgba(30,73,226,0.08) 0%, rgba(255,255,255,0.16) 100%)"
                            : "rgba(255,255,255,0.16)",
                        border:
                          index === 0
                            ? "1px solid rgba(30,73,226,0.5)"
                            : "1px solid rgba(255,255,255,0.28)",
                        boxShadow:
                          index === 0
                            ? "0 14px 28px rgba(30,73,226,0.06)"
                            : "none",
                      }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div
                            style={{
                              color: "#00266A",
                              fontWeight: 600,
                              fontSize: "0.99rem",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            {item.title}
                          </div>
                          <div
                            className="mt-1"
                            style={{
                              color: "rgba(12,35,60,0.60)",
                              fontSize: "0.82rem",
                              lineHeight: 1.58,
                              letterSpacing: "-0.005em",
                            }}
                          >
                            {item.description}
                          </div>
                        </div>

                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover/row:translate-x-1"
                          style={{
                            background:
                              "rgba(255,255,255,0.22)",
                            border:
                              "1px solid rgba(255,255,255,0.30)",
                          }}
                        >
                          <ArrowRight
                            className="h-4 w-4"
                            style={{ color: "#1E49E2" }}
                            strokeWidth={2}
                          />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </main>
        </section>
      </div>
    </div>
  );
}