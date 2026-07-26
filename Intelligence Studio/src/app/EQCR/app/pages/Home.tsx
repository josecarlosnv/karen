import {
  UserCheck,
  UserCog,
  FolderKanban,
  Briefcase,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { authApi, Claims } from "../API/authApi";


export default function Home() {
  
  const useUser = () => {
  const [user, setUser] = useState<Claims | null>(null);

    useEffect(() => {
      authApi.getClaims()
        .then(setUser)
        .catch(console.error);
    }, []);

    return user;
  };

  const user = useUser();

const [dashboard, setDashboard] = useState<any>(null);
const [powerBIReport, setPowerBIReport] =useState<any>(null);
useEffect(() => {
  const loadPowerBILink = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_GetDashboardKPIS/getEQCRDashboardLink`,
        {
          credentials: "include",
        }
      );

      const data =
        await response.json();

      setPowerBIReport(data);
console.log("state", powerBIReport);

    } catch (error) {
      console.error(error);
    }
  };

  loadPowerBILink();

}, []);
useEffect(() => {
  const loadDashboard = async () => {
    const response = await fetch(
  `${import.meta.env.VITE_EQCR_API_URL}/EMT_GetDashboardKPIS`,
  {
    credentials: "include",
  }
);

    const data = await response.json();

    setDashboard(data);
  };

  loadDashboard();
}, []);
const kpiData = dashboard
  ? [
      {
        id: "eqcr-cppp",
        label: "Credentials • CPPP",
        pending: dashboard.CredentialsCPPPPending,
        total: dashboard.CredentialsCPPPTotal,
        icon: UserCheck,
        category: "eqcr",
        accentColor: "#00338D",
        gradientFrom: "#00338D",
        gradientTo: "#1E49E2",
      },
      {
        id: "eqcr-deputy",
        label: "Credentials • Deputy",
        pending: dashboard.CredentialsDeputyPending,
        total: dashboard.CredentialsDeputyTotal,
        icon: UserCog,
        category: "eqcr",
        accentColor: "#00338D",
        gradientFrom: "#00338D",
        gradientTo: "#1E49E2",
      },
      {
        id: "assignments-cppp",
        label: "Assignments • CPPP",
        pending: dashboard.AssignmentsCPPPPending,
        total: dashboard.AssignmentsCPPPTotal,
        icon: FolderKanban,
        category: "assignments",
        accentColor: "#7213EA",
        gradientFrom: "#7213EA",
        gradientTo: "#1E49E2",
      },
      {
        id: "assignments-deputy",
        label: "Assignments • Deputy",
        pending: dashboard.AssignmentsDeputyPending,
        total: dashboard.AssignmentsDeputyTotal,
        icon: Briefcase,
        category: "assignments",
        accentColor: "#7213EA",
        gradientFrom: "#7213EA",
        gradientTo: "#1E49E2",
      },
    ]
  : [];
  // Confirmations data for Donut Chart
 const confirmationsData = dashboard
  ? [
      {
        id: "pending",
        name: "Pending",
        value: dashboard.DonutPending,
        color: "#7892EE",
        gradientId: "gradient-pending",
      },
      {
        id: "approved",
        name: "Approved",
        value: dashboard.DonutApproved,
        color: "#00266A",
        gradientId: "gradient-completed",
      },
      {
        id: "draft",
        name: "Draft",
        value: dashboard.DonutDraft,
        color: "#B5D0FF",
        gradientId: "gradient-sent",
      },
    ]
  : [];


  const totalConfirmations = confirmationsData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  // Form Type breakdown for Confirmations
  const formTypeData = dashboard
  ? [
      {
        id: "soc",
        type: "Soc",
        count: dashboard.SOC,
        color: "#001947",
      },
      {
        id: "assistant",
        type: "Assistant",
        count: dashboard.Assistant,
        color: "#0F2471",
      },
      {
        id: "esg",
        type: "Esg",
        count: dashboard.ESG,
        color: "#001947",
      },
      {
        id: "audit",
        type: "Audit",
        count: dashboard.Audit,
        color: "#133860",
      },
    ]
  : [];


  // Analytics - Single Power BI report
  const AnalyticsIcon = BarChart3;





  // Custom label for donut chart
  const renderCustomLabel = (entry) => {
    const percent = (
      (entry.value / totalConfirmations) *
      100
    ).toFixed(0);
    return `${percent}%`;
  };


  if (!user) return <div>Cargando...</div>;

  if (user.NO_ACCESS) return <div>NO ACCESS</div>;

  return ( 
    <div
  className="min-h-screen overflow-x-hidden relative"
      style={{
        backgroundColor: "#f4f7fb",
        backgroundImage: `
    radial-gradient(900px 400px at 0% 20%, rgba(30, 73, 226, 0.10), transparent 70%),
    radial-gradient(800px 350px at 100% 60%, rgba(114, 19, 234, 0.08), transparent 70%),
    radial-gradient(700px 300px at 50% 100%, rgba(0, 51, 141, 0.06), transparent 70%),

    repeating-linear-gradient(
      110deg,
      rgba(0, 51, 141, 0.035) 0px,
      rgba(0, 51, 141, 0.035) 2px,
      transparent 2px,
      transparent 50px
    ),

    linear-gradient(180deg, #f8faff 0%, #eef3ff 100%)
  `,
        backgroundRepeat:
          "no-repeat, no-repeat, no-repeat, repeat, no-repeat",
        backgroundSize: "auto, auto, auto, auto, auto",
      }}
    >
      <div className="px-8 py-10 space-y-10 max-w-full relative z-10">
        {/* KPI Cards - Number-focused, editorial style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const Icon = kpi.icon;
            return (
             
<Card
  key={kpi.id}
  className="p-6 bg-white border border-[#1E49E2]/20 rounded-xl 
             shadow-[0_4px_20px_rgba(30,73,226,0.08)]
             hover:shadow-[0_8px_30px_rgba(30,73,226,0.12)]
             hover:border-[#1E49E2]/40
             hover:-translate-y-[2px]
             transition-all duration-200"
>
  <div className="h-[2px] w-full bg-gradient-to-r from-[#1E49E2]/0 via-[#1E49E2] to-[#1E49E2]/0 mb-4 rounded-full opacity-70" />

  <div className="flex items-center justify-between">

                  {/* Left side - Number hero */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2.5">
                      <p
                        className="text-3xl text-[#1E49E2]"
                        style={{
                          fontWeight: "500",
                          letterSpacing: "0.015em",
                          lineHeight: "1.2",
                          textShadow:
                            "0 1px 1px rgba(0, 51, 141, 0.08)",
                        }}
                      >
                        {kpi.pending}
                      </p>
                      <p
                        className="text-lg text-[#1E49E2]/40"
                        style={{
                          fontWeight: "400",
                          letterSpacing: "0.01em",
                          lineHeight: "1.25",
                        }}
                      >
                        / {kpi.total}
                      </p>
                    </div>
                    <p
                      className="text-xs text-gray-500"
                      style={{
                        fontWeight: "400",
                        letterSpacing: "0.03em",
                        lineHeight: "1.5",
                      }}
                    >
                      {kpi.label}
                    </p>
                  </div>

                  {/* Right side - Subtle icon */}
                  <div className="flex items-center justify-center flex-shrink-0">
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={1.6}
                      style={{
                        stroke: `url(#icon-gradient-${kpi.id})`,
                      }}
                    />

                    <svg width="0" height="0">
                      <defs>
                        <linearGradient
                          id={`icon-gradient-${kpi.id}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor={kpi.gradientFrom}
                          />
                          <stop
                            offset="100%"
                            stopColor={kpi.gradientTo}
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Activity and Analytics - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
          {/* Left: Activity */}
          <div className="min-w-0 flex flex-col">
            <h2
              className="text-sm text-[#6B85D6] mb-5"
              style={{
                fontWeight: "400",
                letterSpacing: "0.04em",
                lineHeight: "1.3",
              }}
            >
              Recent activity
            </h2>

            <Card className="p-6 bg-white border border-gray-200 shadow-sm h-full">
              {/* Confirmations Section */}
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-sm"
                  style={{
                    color: "#5B6FAF",
                    fontWeight: "400",
                    letterSpacing: "0.06em",
                    lineHeight: "1.3",
                    textShadow:
                      "0 1px 1px rgba(0, 51, 141, 0.08)",
                  }}
                >
                  Confirmations
                </h3>
                <span
                  className="text-xs text-gray-400"
                  style={{
                    fontWeight: "400",
                    letterSpacing: "0.02em",
                    lineHeight: "1.45",
                  }}
                >
                  {totalConfirmations} total
                </span>
              </div>

              {/* Donut (izquierda) + By Form Type (derecha) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Donut Chart - Left */}
                <div className="flex flex-col gap-4 min-w-0">
                  <div
                    className="h-48"
                    style={{ minHeight: "192px" }}
                  >
                    <ResponsiveContainer
                      width="100%"
                      height={192}
                    >
                      <PieChart>
                        <defs>
                          {/* Gradient definitions for each slice */}
                          <linearGradient
                            id="gradient-pending"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#8da5f5"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#6580e7"
                              stopOpacity={1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="gradient-completed"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#003685"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#001a50"
                              stopOpacity={1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="gradient-sent"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#c7dcff"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="#a3c4ff"
                              stopOpacity={1}
                            />
                          </linearGradient>

                          {/* Drop shadow filter */}
                          <filter
                            id="donut-shadow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feGaussianBlur
                              in="SourceAlpha"
                              stdDeviation="3"
                            />
                            <feOffset
                              dx="0"
                              dy="2"
                              result="offsetblur"
                            />
                            <feComponentTransfer>
                              <feFuncA
                                type="linear"
                                slope="0.15"
                              />
                            </feComponentTransfer>
                            <feMerge>
                              <feMergeNode />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>

                          {/* Subtle highlight overlay */}
                          <radialGradient
                            id="donut-highlight"
                            cx="50%"
                            cy="30%"
                          >
                            <stop
                              offset="0%"
                              stopColor="#ffffff"
                              stopOpacity={0.15}
                            />
                            <stop
                              offset="50%"
                              stopColor="#ffffff"
                              stopOpacity={0.05}
                            />
                            <stop
                              offset="100%"
                              stopColor="#ffffff"
                              stopOpacity={0}
                            />
                          </radialGradient>
                        </defs>

                        <Pie
                          id="confirmations-pie"
                          data={confirmationsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                          label={renderCustomLabel}
                          labelLine={false}
                          filter="url(#donut-shadow)"
                        >
                          {confirmationsData.map(
                            (entry, index) => (
                              <Cell
                                key={`conf-cell-${index}`}
                                fill={`url(#${entry.gradientId})`}
                                stroke="#ffffff"
                                strokeWidth={2}
                              />
                            ),
                          )}
                        </Pie>

                        <Tooltip
                          formatter={(value) => [
                            `${value} confirmations`,
                            "Count",
                          ]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "8px 12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Custom Legend */}
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {confirmationsData.map((entry) => (
                      <div
                        key={`legend-${entry.id}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: entry.color,
                          }}
                        />
                        <span
                          className="text-xs text-gray-500"
                          style={{
                            fontWeight: "400",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {entry.name}{" "}
                          <span
                            style={{
                              fontWeight: "500",
                              color: "#374151",
                            }}
                          >
                            ({entry.value})
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* By Form Type - Right (single column) */}
                <div className="flex flex-col min-w-0">
                  <h4
                    className="text-xs text-gray-400 mb-4"
                    style={{
                      fontWeight: "400",
                      letterSpacing: "0.03em",
                      lineHeight: "1.3",
                    }}
                  >
                    By form type
                  </h4>

                  <div className="space-y-2.5">
                    {formTypeData.map((formType) => (
                      <div
                        key={formType.id}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: formType.color,
                            }}
                          />
                          <span
                            className="text-sm text-gray-600"
                            style={{
                              fontWeight: "400",
                              letterSpacing: "0.01em",
                              lineHeight: "1.5",
                            }}
                          >
                            {formType.type}
                          </span>
                        </div>

                        <span
                          className="text-xs text-gray-500"
                          style={{
                            fontWeight: "500",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {formType.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Analytics */}
          <div className="min-w-0 flex flex-col">
            <h2
              className="text-sm text-[#6B85D6] mb-5"
              style={{
                fontWeight: "400",
                letterSpacing: "0.04em",
                lineHeight: "1.3",
              }}
            >
              Full dashboard
            </h2>

            <Card className="p-3 bg-white border border-gray-200 shadow-sm flex flex-col h-full">
              <div
                className="flex-1 h-full flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:from-blue-50 hover:to-indigo-50 transition-all border border-blue-100/50 cursor-pointer"
                onClick={() => {
  if (powerBIReport?.external_link) {
    window.open(
      powerBIReport.external_link,
      "_blank"
    );
  }
}}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#00338D] to-[#1E49E2] flex items-center justify-center shadow-sm">
                  <AnalyticsIcon
                    className="w-8 h-8 text-white"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <div>
                    <p
                      className="text-xs text-gray-500 mb-1.5"
                      style={{
                        fontWeight: "400",
                        letterSpacing: "0.03em",
                        lineHeight: "1.5",
                      }}
                    >
                      Performance
                    </p>
                    <h3
                      className="text-base text-gray-900"
                      style={{
                        fontWeight: "500",
                        letterSpacing: "0.01em",
                        lineHeight: "1.4",
                      }}
                    >
                      {powerBIReport?.title || "EQCR Dashboard"}
                    </h3>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white hover:shadow-md transition-shadow text-sm"
                    onClick={() => {
                      if (powerBIReport?.external_link) {
                        window.open(
                          powerBIReport.external_link,
                          "_blank"
                        );
                      }
                    }}
                  >
                    Open
                    <ExternalLink
                      className="w-3.5 h-3.5 ml-2"
                      strokeWidth={2}
                    />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}