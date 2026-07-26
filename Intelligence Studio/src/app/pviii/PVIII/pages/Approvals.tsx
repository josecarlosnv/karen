import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import {
  Search,
  Filter,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  DollarSign,
  Target,
  Building2,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { motion } from "motion/react";
import { useApproverAccess } from "../Api/useApproveAccess";
import { approvalsApi, Approval } from "../Api/useVwApprovals";

const primaryGradient =
  "bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D] hover:to-[#00338D]";

type ApprovalRole = "lead-partner" | "bu-leader" | "hofa" | "buppp";

type ApprovalCard = {
  id: any;
  client: string;
  partner: string;
  manager: string;
  projectType: string;
  fiscalYear: string;
    statusRaw: string;
    p8StatusLabel?: string;

  role: ApprovalRole;
  requiresAdditionalReview: any; 

  apprBupic?: string | null;
  apprHofA?: string | null;
  apprBuppp?: string | null;
};

export default function Approvals() {
  const { loading, hasAccess, lvl, email, practice, data } = useApproverAccess();
    const appliesToRole = (row: Approval, role: ApprovalRole) => {
        const level = Number(row.approvalLevelId);

        if (role === "lead-partner") return true;

        if (role === "bu-leader") return level >= 2;

        if (role === "hofa") return level >= 3;

        if (role === "buppp") return level >= 4;

        return false;
    };
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [kpis, setKpis] = useState<any>(null);
    const normalizeUser = (email: string) => {
        if (!email.includes("@")) {
            return email + "@kpmg.com.mx";
        }
        return email;
    };
    const normalizedUser = normalizeUser(email).toLowerCase();

  const calcDelta = (current: number, past: number) => {
    if (!past || past === 0) return 0;
    return ((current - past) / past) * 100;
  };

  const getDeltaColor = (delta: number) =>
    delta >= 0 ? "text-emerald-600" : "text-red-500";

  const formatDelta = (delta: number) => {
    if (delta == null || Number.isNaN(delta)) return "0%";
    const sign = delta > 0 ? "+" : delta < 0 ? "-" : "";
    return `${sign}${Math.abs(Math.round(delta))}%`;
  };

  // ---------------------------
  // Status helpers
  // ---------------------------
  const normalize = (v?: string | null) => (v ?? "").toString().trim().toLowerCase();

  const isNA = (v?: string | null) => {
    const s = normalize(v);
    return s === "n/a" || s === "na";
  };

  const isPending = (v?: string | null) => normalize(v).includes("pending");
  const isApproved = (v?: string | null) => normalize(v).includes("approved");
  const isRejected = (v?: string | null) => normalize(v).includes("rejected");

  const isPendingLike = (v?: string | null) => {
    const s = normalize(v);
    if (!s) return true; 
    if (isNA(s)) return false;
    return isPending(s);
  };

  const roleNiceName = (role: ApprovalRole) => {
    switch (role) {
      case "lead-partner":
        return "Lead Partner";
      case "bu-leader":
        return "BU Leader";
      case "hofa":
        return "HofA";
      case "buppp":
        return "BUPPP";
      default:
        return "Approver";
    }
  };

 
  //   const getButtonStatusLabel = (statusRaw: string) => {

  //       if (
  //           approval.p8StatusLabel?.toLowerCase() === "review needed"
  //       ) {
  //           return "Review";
  //           // o "Continue Review"
  //       }

  //   const s = normalize(statusRaw);
  //   if (!s) return "Approve"; 

  //   if (isNA(s)) return "N/A";
  //   if (isPending(s)) return "Approve";
  //   if (isApproved(s) || isRejected(s)) return "View Approval";

  //   return "View Approval";
  // };

    const getButtonStatusLabel = (approval: ApprovalCard) => {

        if (
            approval.p8StatusLabel?.toLowerCase() === "requires review"
        ) {
            return "Review";
        }

        const s = normalize(approval.statusRaw);

        if (!s) return "Approve";

        if (isNA(s)) return "N/A";

        if (isPending(s))
            return "Approve";

        if (isApproved(s) || isRejected(s))
            return "View Approval";

        return "View Approval";
    };
    const getNextPendingApprovalLabel = (a: ApprovalCard): string | null => {
        const level = Number(a.requiresAdditionalReview);

        const flow: ApprovalRole[] =
            level === 1
                ? ["lead-partner"]
                : level === 2
                    ? ["lead-partner", "bu-leader"]
                    : level === 3
                        ? ["lead-partner", "bu-leader", "hofa"]
                        : ["lead-partner", "bu-leader", "hofa", "buppp"];

        const steps: Record<ApprovalRole, string | null | undefined> = {
            "lead-partner": a.statusRaw,
            "bu-leader": a.apprBupic,
            "hofa": a.apprHofA,
            "buppp": a.apprBuppp,
        };

        for (const role of flow) {
            const value = steps[role];

            if (isNA(value)) continue;

            if (
                value != null &&
                !isApproved(value) &&
                !isRejected(value) &&
                isPendingLike(value)
            ) {
                return roleNiceName(role);
            }
        }

        return null;
    };
  // ---------------------------
  // Leyenda superior (larga) para TODOS con "qué falta después"
  // - Lead Partner:
  //    Pending => Pending Approval
  //    Approved + falta => Waiting for {X} approval
  //    Approved + no falta => Approved
  // - Otros roles:
  //    Pending => Waiting for {Role} approval
  //    Approved + falta => Waiting for {X} approval
  //    Approved + no falta => Approved
  // ---------------------------
    const getTopStatusLabel = (approval: ApprovalCard) => {

        if (
            approval.p8StatusLabel?.toLowerCase() === "requires review"
        ) {
            return "Requires review";
        }

    const s = normalize(approval.statusRaw);
    if (!s) return "";

    if (isNA(s)) return "N/A";
    if (isRejected(s)) return "Rejected";

    const next = getNextPendingApprovalLabel(approval);

    if (approval.role === "lead-partner") {
      if (isPending(s)) return "Pending Approval";

      if (isApproved(s)) {
        if (next) return `Waiting for ${next} approval`;
        return "Approved";
      }

      return approval.statusRaw;
    }

    if (isPending(s)) return `Waiting for ${roleNiceName(approval.role)} approval`;

    if (isApproved(s)) {
      if (next) return `Waiting for ${next} approval`;
      return "Approved";
    }

    return approval.statusRaw;
  };

  const getRoleStatusRaw = (row: Approval, role: ApprovalRole): string => {
    let raw = "";
    switch (role) {
      case "lead-partner":
        raw = (row.apprLeap ?? "") as any;
        break;
      case "bu-leader":
        raw = (row.apprBupic ?? "") as any;
        break;
      case "hofa":
        raw = (row.apprHofA ?? "") as any;
        break;
      case "buppp":
        raw = (row.apprBuppp ?? "") as any;
        break;
      default:
        raw = "";
        break;
    }
    return (raw ?? "").toString().trim();
  };

  const matchesStatusFilter = (statusRaw: string) => {
    const s = normalize(statusRaw);

    if (statusFilter === "all") return true;
    if (statusFilter === "pending-approval") return !s || s.includes("pending");
    if (statusFilter === "approved") return s.includes("approved");

    return s.includes(normalize(statusFilter));
  };

  // ---------------------------
  // KPI aggregation
  // ---------------------------
  const aggregateKpis = (rows: any[]) => {
    if (!rows || rows.length === 0) return null;

    if (rows.length === 1) {
      const r = rows[0];
      return {
        current: {
          auditHours: r.standardAuditHoursCurrent ?? 0,
          netAuditIncome: r.netAuditRevenueCurrent ?? 0,
          valuation: r.valuationCurrent ?? 0,
          avgFee: r.averageAuditFeeCurrent ?? 0,
        },
        past: {
          auditHours: r.standardAuditHoursPast ?? 0,
          netAuditIncome: r.netAuditRevenuePast ?? 0,
          valuation: (r.valuationPast ?? 0) * 100,
          avgFee: r.averageAuditFeePast ?? 0,
        },
      };
    }

    const totals = rows.reduce(
      (acc, r) => {
        acc.currentAuditHours += r.standardAuditHoursCurrent ?? 0;
        acc.pastAuditHours += r.standardAuditHoursPast ?? 0;

        acc.currentRevenue += r.netAuditRevenueCurrent ?? 0;
        acc.pastRevenue += r.netAuditRevenuePast ?? 0;

        acc.currentWeightedValuation +=
          (r.valuationCurrent ?? 0) * (r.netAuditRevenueCurrent ?? 0);

        acc.pastWeightedValuation +=
          (r.valuationPast ?? 0) * (r.netAuditRevenuePast ?? 0);

        acc.currentTotalWeight += r.netAuditRevenueCurrent ?? 0;
        acc.pastTotalWeight += r.netAuditRevenuePast ?? 0;

        return acc;
      },
      {
        currentAuditHours: 0,
        pastAuditHours: 0,
        currentRevenue: 0,
        pastRevenue: 0,
        currentWeightedValuation: 0,
        pastWeightedValuation: 0,
        currentTotalWeight: 0,
        pastTotalWeight: 0,
      }
    );

    return {
      current: {
        auditHours: totals.currentAuditHours,
        netAuditIncome: totals.currentRevenue,
        valuation:
          totals.currentTotalWeight > 0
            ? totals.currentWeightedValuation / totals.currentTotalWeight
            : 0,
        avgFee: totals.currentAuditHours > 0 ? totals.currentRevenue / totals.currentAuditHours : 0,
      },
      past: {
        auditHours: totals.pastAuditHours,
        netAuditIncome: totals.pastRevenue,
        valuation:
          totals.pastTotalWeight > 0
            ? (totals.pastWeightedValuation / totals.pastTotalWeight) * 100
            : 0,
        avgFee: totals.pastAuditHours > 0 ? totals.pastRevenue / totals.pastAuditHours : 0,
      },
    };
  };

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const rows = await approvalsApi.list();
        const result = aggregateKpis(rows);
        setKpis(result);
      } catch (error) {
        console.error("Error loading KPIs", error);
      }
    };
    fetchKpis();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await approvalsApi.list();
        setApprovals(data);
      } catch (error) {
        console.error("Error fetching approvals", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

    const roles = data?.roles ?? [data?.level];


    const isVMaster = roles.includes("vMaster");
    const isLevel3 = roles.includes("Level3");
    const isLevel4 = roles.includes("Level4");
    const isLead =
        roles.includes("lead-partner") ||
        approvals.some(x =>
            x.currentEngagementPartnerEmail?.toLowerCase() === email.toLowerCase()
        );

    const isHofa = isLevel4 && practice === "HOFA";
    const isBuppp = isLevel4 && practice === "BUPPP";


    const leadPartnerApprovals = useMemo(() => {
        return approvals
            .filter((x) => {
                if (isVMaster) return true;

                const dbEmail = (x.currentEngagementPartnerEmail ?? "").toLowerCase();

                const userEmail = (data?.email ?? "").toLowerCase();
                const userNetwork = (data?.networkId ?? "").toLowerCase();

                if (userEmail && dbEmail === userEmail) {
                    return true;
                }

                if (userNetwork && dbEmail.startsWith(userNetwork + "@")) {
                    return true;
                }

                return false;
            })
            .map((x) => ({
                id: x.p8Id,
                client: x.clientName,
                partner: x.currentEngagementPartnerName,
                manager: x.currentEngagementManagerName,
                projectType: x.p8revenueTypeLabel,
                fiscalYear: x.p8FiscalYearLabel.toString(),
                statusRaw: getRoleStatusRaw(x, "lead-partner"),

                p8StatusLabel: x.p8StatusLabel,

                role: "lead-partner",
                requiresAdditionalReview: x.approvalLevelId,
                apprBupic: x.apprBupic,
                apprHofA: x.apprHofA,
                apprBuppp: x.apprBuppp,
            }));
    }, [approvals, data, isVMaster]);
    

  const buLeaderApprovals: ApprovalCard[] =
    isLevel3 || isVMaster 
      ? approvals
              .filter((x) =>
                  appliesToRole(x, "bu-leader") &&
                  !isNA(x.apprBupic)
              )          .map((x) => {
            const statusRaw = getRoleStatusRaw(x, "bu-leader");
            return {
              id: x.p8Id,
              client: x.clientName,
              partner: x.currentEngagementPartnerName,
              manager: x.currentEngagementManagerName,
              projectType: x.p8revenueTypeLabel,
              fiscalYear: x.p8FiscalYearLabel.toString(),
              statusRaw,
                role: "bu-leader",

                p8StatusLabel: x.p8StatusLabel,

              requiresAdditionalReview: x.approvalLevelId,
              apprBupic: (x.apprBupic ?? "") as any,
              apprHofA: (x.apprHofA ?? "") as any,
              apprBuppp: (x.apprBuppp ?? "") as any,
            };
          })
      : [];

  const hofaApprovals: ApprovalCard[] =
      isHofa || isVMaster 
      ? approvals
          
              .filter((x) =>
                  appliesToRole(x, "hofa") &&
                  !isNA(x.apprHofA)
              )
          .map((x) => {
            const statusRaw = getRoleStatusRaw(x, "hofa");
            return {
              id: x.p8Id,
              client: x.clientName,
              partner: x.currentEngagementPartnerName,
              manager: x.currentEngagementManagerName,
              projectType: x.p8revenueTypeLabel,
              fiscalYear: x.p8FiscalYearLabel.toString(),
              statusRaw,
                role: "hofa",

                p8StatusLabel: x.p8StatusLabel,

              requiresAdditionalReview: x.approvalLevelId,
              apprBupic: (x.apprBupic ?? "") as any,
              apprHofA: (x.apprHofA ?? "") as any,
              apprBuppp: (x.apprBuppp ?? "") as any,
            };
          })
      : [];

  const bupppApprovals: ApprovalCard[] =
      isBuppp || isVMaster 
      ? approvals
          
              .filter((x) =>
                  appliesToRole(x, "buppp") &&
                  !isNA(x.apprBuppp)
              )
          .map((x) => {
            const statusRaw = getRoleStatusRaw(x, "buppp");
            return {
              id: x.p8Id,
              client: x.clientName,
              partner: x.currentEngagementPartnerName,
              manager: x.currentEngagementManagerName,
              projectType: x.p8revenueTypeLabel,
              fiscalYear: x.p8FiscalYearLabel.toString(),
              statusRaw,
                role: "buppp",

                p8StatusLabel: x.p8StatusLabel,

              requiresAdditionalReview: x.approvalLevelId,
              apprBupic: (x.apprBupic ?? "") as any,
              apprHofA: (x.apprHofA ?? "") as any,
              apprBuppp: (x.apprBuppp ?? "") as any,
            };
          })
      : [];

  const filteredLeadPartner = leadPartnerApprovals.filter((item) => {
    const matchesSearch =
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = isVMaster ? true : matchesStatusFilter(item.statusRaw);
      
    return matchesSearch && matchesStatus;
  });

  const filteredBULeader = buLeaderApprovals.filter((item) => {
    const matchesSearch =
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = matchesStatusFilter(item.statusRaw);
    return matchesSearch && matchesStatus;
  });

  const filteredHofa = hofaApprovals.filter((item) => {
    const matchesSearch =
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = matchesStatusFilter(item.statusRaw);
    return matchesSearch && matchesStatus;
  });

  const filteredBuppp = bupppApprovals.filter((item) => {
    const matchesSearch =
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = matchesStatusFilter(item.statusRaw);
    return matchesSearch && matchesStatus;
  });

    const kpiSummary = approvals.reduce(
        (acc, row) => {
            acc.total += 1;

            if (row.approvalsSummary) {
                const [approved, total] = row.approvalsSummary
                    .split("/")
                    .map(Number);

                if (approved === total && total > 0) {
                    acc.approved += 1;
                }
            }
            if ((row.approvalLevelId ?? 0) > 1) {
                acc.alerts += 1;
            }

            return acc;
        },
        {
            approved: 0,
            total: 0,
            alerts: 0,
        }
    );

    const approvalRate =
        kpiSummary.total > 0
            ? (kpiSummary.approved / kpiSummary.total) * 100
            : 0;

  const revenueDelta = calcDelta(kpis?.current.netAuditIncome ?? 0, kpis?.past.netAuditIncome ?? 0);
  const hoursDelta = calcDelta(kpis?.current.auditHours ?? 0, kpis?.past.auditHours ?? 0);
  const valuationDelta = calcDelta(kpis?.current.valuation ?? 0, kpis?.past.valuation ?? 0);
  const feeDelta = calcDelta(kpis?.current.avgFee ?? 0, kpis?.past.avgFee ?? 0);

  const allProjects = [...leadPartnerApprovals, ...buLeaderApprovals];
  const projectsWithAlerts = allProjects.filter((p) => p.requiresAdditionalReview).length;

  // ---------------------------
  // ACCESS
  // ---------------------------
  if (loading) return <div>Cargando...</div>;

    if (!data) return <div>Cargando permisos...</div>;

  if (!hasAccess && lvl === 0) {
    return (
      <div className="min-h-screen bg-white pb-24 lg:pb-8">
        <svg width="0" height="0" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="kpmgBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00338D" />
              <stop offset="100%" stopColor="#1E49E2" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 overflow-hidden pointer-events-none"></div>

        <div className="relative min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="text-2xl font-semibold text-[#00338D] mb-2">Unauthorized</div>
            <div className="text-sm text-slate-600">You do not have any assigned approvals.</div>
          </div>
        </div>
      </div>
    );
  }
   
  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-8">
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="kpmgBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00338D" />
            <stop offset="100%" stopColor="#1E49E2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-br from-[#00338D]/8 via-[#1E49E2]/8 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#1E49E2]/8 via-[#00338D]/8 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60vh] left-[20%] w-[400px] h-[400px] bg-gradient-to-br from-[#00338D]/6 via-[#1E49E2]/6 to-transparent rounded-full blur-3xl"
        />

        <motion.div
          animate={{ opacity: [0.05, 0.08, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00338D 1px, transparent 1px),
              linear-gradient(to bottom, #00338D 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="px-6 pt-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.2 }} 
                className="relative flex-1"
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, #1E49E2 0%, #00338D 100%)",
                  }}
                >
                  <div className="h-full w-full bg-white rounded-xl" />
                </div>

                <div className="relative rounded-xl px-4 py-4 flex flex-col items-center text-center min-h-[130px] justify-between">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3 h-3 text-[#0C233C]/70" />
                      <span className="text-[11px] font-normal text-[#0C233C]/80 tracking-[0.2em]">
                        Approvals Summary
                      </span>
                    </div>

                    <span className="text-2xl font-medium text-[#1E49E2] tracking-[0.04em]">
                                          {kpiSummary.approved}/{kpiSummary.total}
                                      </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                                      <span className="text-[10.5px] text-[#0C233C]/60">Alerts: {kpiSummary.alerts}</span>
                    <span className="text-[10.5px] text-emerald-600 font-medium">
                      Rate: {approvalRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} 
                className="relative flex-1"
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, #1E49E2 0%, #00338D 100%)",
                  }}
                >
                  <div className="h-full w-full bg-white rounded-xl" />
                </div>

                <div className="relative rounded-xl px-4 py-4 flex flex-col items-center text-center min-h-[130px] justify-between">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <DollarSign className="w-3 h-3 text-[#0C233C]/70" />
                      <span className="text-[11px] font-normal text-[#0C233C]/80 tracking-[0.2em]">
                        Net Revenue
                      </span>
                    </div>

                    <span className="text-2xl font-medium text-[#1E49E2] tracking-[0.04em]">
                      ${Math.round(kpis?.current.netAuditIncome ?? 0).toLocaleString("en-US")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10.5px] text-[#0C233C]/60">
                      PY: ${(kpis?.past.netAuditIncome ?? 0).toLocaleString("en-US")}
                    </span>

                    <span className={`text-[10.5px] font-medium ${getDeltaColor(revenueDelta)}`}>
                      Δ {formatDelta(revenueDelta)}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} 
                className="relative flex-1"
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, #1E49E2 0%, #00338D 100%)",
                  }}
                >
                  <div className="h-full w-full bg-white rounded-xl" />
                </div>

                <div className="relative rounded-xl px-4 py-4 flex flex-col items-center text-center min-h-[130px] justify-between">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Clock className="w-3 h-3 text-[#0C233C]/70" />
                      <span className="text-[11px] font-normal text-[#0C233C]/80 tracking-[0.2em]">
                        Audit Hours
                      </span>
                    </div>

                    <span className="text-2xl font-medium text-[#1E49E2] tracking-[0.04em]">
                      {(kpis?.current.auditHours ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10.5px] text-[#0C233C]/60">
                      PY: {(kpis?.past.auditHours ?? 0).toLocaleString()}
                    </span>

                    <span className={`text-[10.5px] font-medium ${getDeltaColor(hoursDelta)}`}>
                      Δ {formatDelta(hoursDelta)}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} 
                className="relative flex-1"
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, #1E49E2 0%, #00338D 100%)",
                  }}
                >
                  <div className="h-full w-full bg-white rounded-xl" />
                </div>

                <div className="relative rounded-xl px-4 py-4 flex flex-col items-center text-center min-h-[130px] justify-between">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <TrendingUp className="w-3 h-3 text-[#0C233C]/70" />
                      <span className="text-[11px] font-normal text-[#0C233C]/80 tracking-[0.2em]">
                        Valuation
                      </span>
                    </div>

                    <span className="text-2xl font-medium text-[#1E49E2] tracking-[0.04em]">
                      {Math.round(kpis?.current.valuation ?? 0)}%
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10.5px] text-[#0C233C]/60">
                      PY: {Math.round(kpis?.past.valuation ?? 0)}%
                    </span>

                    <span className={`text-[10.5px] font-medium ${getDeltaColor(valuationDelta)}`}>
                      Δ {formatDelta(valuationDelta)}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} 
                className="relative flex-1"
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    padding: "1px",
                    background: "linear-gradient(135deg, #1E49E2 0%, #00338D 100%)",
                  }}
                >
                  <div className="h-full w-full bg-white rounded-xl" />
                </div>

                <div className="relative rounded-xl px-4 py-4 flex flex-col items-center text-center min-h-[130px] justify-between">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <Target className="w-3 h-3 text-[#0C233C]/70" />
                      <span className="text-[11px] font-normal text-[#0C233C]/80 tracking-[0.2em]">
                        Average Fee
                      </span>
                    </div>

                    <span className="text-2xl font-medium text-[#1E49E2] tracking-[0.04em]">
                      ${Math.round(kpis?.current.avgFee ?? 0).toLocaleString("en-US")}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[10.5px] text-[#0C233C]/60">
                      PY: ${Math.round(kpis?.past.avgFee ?? 0).toLocaleString("en-US")}
                    </span>

                    <span className={`text-[10.5px] font-medium ${getDeltaColor(feeDelta)}`}>
                      Δ {formatDelta(feeDelta)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Tabs
        

                  defaultValue={
                      isVMaster
                          ? "lead-partner"
                          : isLevel3
                              ? "bu-leader"
                              : isHofa
                                  ? "hofa"
                                  : isBuppp
                                      ? "buppp"
                                      : "lead-partner"
                  }

        >
          <div className="flex items-center justify-between gap-6 mb-4">
            <TabsList>
              <TabsTrigger value="lead-partner">Lead Partner</TabsTrigger>
              <TabsTrigger value="bu-leader">BU Leader</TabsTrigger>
              <TabsTrigger value="hofa">HofA</TabsTrigger>
              <TabsTrigger value="buppp">BUPPP</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-200/60">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded transition-all text-[11px] font-normal tracking-[0.04em] ${
                    statusFilter === "all"
                      ? "bg-white text-[#00338D] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter("pending-approval")}
                  className={`px-3 py-1.5 rounded transition-all text-[11px] font-normal tracking-[0.04em] ${
                    statusFilter === "pending-approval"
                      ? "bg-white text-[#00338D] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter("approved")}
                  className={`px-3 py-1.5 rounded transition-all text-[11px] font-normal tracking-[0.04em] ${
                    statusFilter === "approved"
                      ? "bg-white text-[#00338D] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Approved
                </button>
              </div>

              <div className="relative w-52">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    pl-8 h-8
                    text-[11px] font-normal tracking-[0.03em] leading-[1.1]
                    placeholder:text-slate-400
                    border-slate-200/60
                    bg-slate-50
                    focus:bg-white
                    focus:border-[#00338D]/20
                  "
                />
              </div>
            </div>
          </div>

          {/* ------------------ LEAD PARTNER ------------------ */}
          <TabsContent value="lead-partner" className="mt-0">
            <div className="space-y-4">
              {filteredLeadPartner.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }} 
                >
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative rounded-lg p-[1px] bg-gradient-to-br from-[#00338D]/15 via-[#1E49E2]/10 to-[#00338D]/15 hover:from-[#00338D]/25 hover:via-[#1E49E2]/20 hover:to-[#00338D]/25 transition-all duration-300"
                  >
                    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(30,73,226,0.15)] hover:-translate-y-0.5 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E49E2] to-[#1E49E2] flex items-center justify-center shadow-sm">
                              <Building2 size={22} className="text-white" strokeWidth={2} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-[#00338D] tracking-[0.03em] mb-1 group-hover:text-[#1E49E2] transition-colors duration-300 leading-tight">
                              {approval.client}
                            </h3>

                            <p className="text-xs text-[#1E49E2] tracking-[0.02em]">
                              {getTopStatusLabel(approval)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3.5 mb-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Lead</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.partner}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Manager</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.manager}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Project Type</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.projectType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Fiscal Year</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.fiscalYear}
                              </p>
                            </div>
                          </div>

                                      {approval.requiresAdditionalReview > 1 && (
                                          <div className="pt-2">
                                              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-normal tracking-[0.05em] bg-[#00B8F5]/5 text-[#00B8F5] border border-[#00B8F5]/50">
                                                  Additional approval required
                                              </span>
                                          </div>
                                      )}
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <Button asChild size="default" className={primaryGradient}>
                            <Link
                              to={`/approvals/${approval.id}`}
                              state={{ requiresAdditionalReview: approval.requiresAdditionalReview }}
                            >
                                              {/* {getButtonStatusLabel(approval.statusRaw)}*/}
                              {getButtonStatusLabel(approval)}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {filteredLeadPartner.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No approvals found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ------------------ BU LEADER ------------------ */}
          <TabsContent value="bu-leader" className="mt-0">
            <div className="space-y-4">
              {filteredBULeader.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }} 
                >
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative rounded-lg p-[1px] bg-gradient-to-br from-[#00338D]/15 via-[#1E49E2]/10 to-[#00338D]/15 hover:from-[#00338D]/25 hover:via-[#1E49E2]/20 hover:to-[#00338D]/25 transition-all duration-300"
                  >
                    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(30,73,226,0.15)] hover:-translate-y-0.5 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center shadow-sm">
                              <Building2 size={22} className="text-white" strokeWidth={2} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-[#00338D] tracking-[0.03em] mb-1 group-hover:text-[#1E49E2] transition-colors duration-300 leading-tight">
                              {approval.client}
                            </h3>

                            <p className="text-xs text-[#1E49E2] tracking-[0.02em]">
                              {getTopStatusLabel(approval)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3.5 mb-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Lead</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.partner}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Manager</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.manager}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Project Type</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.projectType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Fiscal Year</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.fiscalYear}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <Button asChild size="default" className={primaryGradient}>
                            <Link
                              to={`/approvals/bu-leader/${approval.id}`}
                              state={{ requiresAdditionalReview: approval.requiresAdditionalReview }}
                            >
                                              {/* {getButtonStatusLabel(approval.statusRaw)}*/}
                              {getButtonStatusLabel(approval)}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {filteredBULeader.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No exception approvals pending</p>
                  <p className="text-xs text-slate-400 mt-2">
                    BU Leader approval is only required when business rules are not met
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ------------------ HOFA ------------------ */}
          <TabsContent value="hofa" className="mt-0">
            <div className="space-y-4">
              {filteredHofa.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }} 
                >
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative rounded-lg p-[1px] bg-gradient-to-br from-[#00338D]/15 via-[#1E49E2]/10 to-[#00338D]/15 hover:from-[#00338D]/25 hover:via-[#1E49E2]/20 hover:to-[#00338D]/25 transition-all duration-300"
                  >
                    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(30,73,226,0.15)] hover:-translate-y-0.5 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center shadow-sm">
                              <Building2 size={22} className="text-white" strokeWidth={2} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-[#00338D] tracking-[0.03em] mb-1 group-hover:text-[#1E49E2] transition-colors duration-300 leading-tight">
                              {approval.client}
                            </h3>

                            <p className="text-xs text-[#1E49E2] tracking-[0.02em]">
                              {getTopStatusLabel(approval)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3.5 mb-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Lead</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.partner}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Manager</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.manager}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Project Type</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.projectType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Fiscal Year</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.fiscalYear}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <Button asChild size="default" className={primaryGradient}>
                            <Link
                              to={`/approvals/hofa/${approval.id}`}
                              state={{ requiresAdditionalReview: approval.requiresAdditionalReview }}
                            >
                                              {/* {getButtonStatusLabel(approval.statusRaw)}*/}
                              {getButtonStatusLabel(approval)}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {filteredHofa.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No exception approvals pending</p>
                  <p className="text-xs text-slate-400 mt-2">
                    HofA approval is only required when business rules are not met
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ------------------ BUPPP ------------------ */}
          <TabsContent value="buppp" className="mt-0">
            <div className="space-y-4">
              {filteredBuppp.map((approval, index) => (
                <motion.div
                  key={approval.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }} 
                >
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative rounded-lg p-[1px] bg-gradient-to-br from-[#00338D]/15 via-[#1E49E2]/10 to-[#00338D]/15 hover:from-[#00338D]/25 hover:via-[#1E49E2]/20 hover:to-[#00338D]/25 transition-all duration-300"
                  >
                    <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(30,73,226,0.15)] hover:-translate-y-0.5 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-5">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center shadow-sm">
                              <Building2 size={22} className="text-white" strokeWidth={2} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-[#00338D] tracking-[0.03em] mb-1 group-hover:text-[#1E49E2] transition-colors duration-300 leading-tight">
                              {approval.client}
                            </h3>

                            <p className="text-xs text-[#1E49E2] tracking-[0.02em]">
                              {getTopStatusLabel(approval)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3.5 mb-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Lead</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.partner}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Engagement Manager</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.manager}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Project Type</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.projectType}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-400 mb-1">Fiscal Year</p>
                              <p className="text-sm text-[#00338d] font-normal tracking-[0.05em]">
                                {approval.fiscalYear}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <Button asChild size="default" className={primaryGradient}>
                            <Link
                              to={`/approvals/buppp/${approval.id}`}
                              state={{ requiresAdditionalReview: approval.requiresAdditionalReview }}
                            >
                                              {/* {getButtonStatusLabel(approval.statusRaw)}*/}
                              {getButtonStatusLabel(approval)}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

              {filteredBuppp.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium">No exception approvals pending</p>
                  <p className="text-xs text-slate-400 mt-2">
                    BUPPP approval is only required when business rules are not met
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}