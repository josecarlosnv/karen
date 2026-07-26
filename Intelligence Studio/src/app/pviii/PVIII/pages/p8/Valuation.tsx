
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence, number } from "motion/react";
import {
  ArrowLeft,
  Save,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Info,
  AlertCircle,
  X,
} from "lucide-react";
import { Stepper, Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useProject } from "../../context/ProjectContext";
import { pviiiValuation } from "../../Api/pviiiValuation";

const wizardSteps: Step[] = [
  { id: "context", title: "Context"},
  { id: "details", title: "Details"},
  { id: "quality", title: "Quality"},
  { id: "entities", title: "Entities"},
  { id: "staffing", title: "Staffing"},
  { id: "specialists", title: "Specialists"},
  { id: "valuation", title: "Valuation"},
  { id: "review", title: "Review"},
];

const mockValuationData = {
  pastYear: {
    auditHours: 1350,
    netAuditIncome: 261500,
    projectValuation: 40.7,
    avgAuditRate: 189.2,
  },
  netIncome: {
    expensesInitial: 0,
  },
};

const mockExceptions = [
  {
    id: "1",
    severity: "high",
    rule: "Technology Recovery Cost Variance",
    description:
      "Technology recovery cost exceeds standard 3.5% threshold by 0.8%",
  },
  {
    id: "2",
    severity: "medium",
    rule: "Project Valuation Below Target",
    description: "Current project valuation is below firm target",
  },
];

const calculateYoYChange = (cy: number, py: number | null) => {
  if (py === null || py === 0) return null;
  const absolute = cy - py;
  const percentage = ((Math.round(cy) - Math.round(py)) / Math.round(py)) * 100;
  return { absolute, percentage };
};
type VarianceScheme = "slate" | "emerald" | "red" | "amber";
const getVarianceColor = (percentage: number | null): VarianceScheme => {
  if (percentage === null) return "slate";
  if (percentage > 5) return "emerald";
  if (percentage < -5) return "red";
  return "amber";
};
const varianceStyles: Record<
  VarianceScheme,
  { chipBg: string; chipText: string; text: string }
> = {
  slate: {
    chipBg: "bg-slate-100",
    chipText: "text-slate-700",
    text: "text-slate-700",
  },
  emerald: {
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    text: "text-emerald-700",
  },
  red: {
    chipBg: "bg-red-50",
    chipText: "text-red-700",
    text: "text-red-700",
  },
  amber: {
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    text: "text-amber-700",
  },
};

const IMPULSA_RATE = 0.05;
const IMPULSA_HOURLY_RATE = 325;
type FeesTotals = { totalHours: number; totalFees: number };
const calculateStandardAuditFeesSubtotal = (
  roles: Array<{ hours: number; standardFees: number }>
): FeesTotals => {
  const totalHours = roles.reduce((sum, r) => sum + (r.hours || 0), 0);
  const totalFees = roles.reduce((sum, r) => sum + (r.standardFees || 0), 0);
  return { totalHours, totalFees };
};
const calculateImpulsa = (baseHours: number) => {
  const hours = baseHours * IMPULSA_RATE;
  const fees = Math.round(hours) * Math.round(IMPULSA_HOURLY_RATE); 
  return { hours, fees };
};
const calculateStandardAuditFeesTotal = (
  subtotal: FeesTotals,
  impulsa: { hours: number; fees: number }
): FeesTotals => {
  return {
    totalHours: subtotal.totalHours + impulsa.hours,
    totalFees: subtotal.totalFees + impulsa.fees,
  };
};
interface KPICardProps {
  title: string;
  cy: number;
  py: number | null;
  format?: "number" | "currency" | "percentage";
  subtitle?: string;
}
function KPICard({ title, cy, py, format = "number", subtitle }: KPICardProps) {
  const yoyChange = calculateYoYChange(cy, py);
  
  const invertColors = title === "Audit Hours";


  const adjustedPercentage =
    yoyChange?.percentage == null
      ? null
      : invertColors
        ? -yoyChange.percentage
        : yoyChange.percentage;

  const simpleColor =
    adjustedPercentage == null || adjustedPercentage === 0
      ? "text-black"
      : adjustedPercentage > 0
        ? "text-[#1DA44E]" 
        : "text-[#FF0000]"; 
        
  const simpleChip =
    adjustedPercentage == null || adjustedPercentage === 0
      ? "bg-transparent border border-black/20 text-black"
      : adjustedPercentage > 0
        ? "bg-[#1DA44E]/10 border border-[#1DA44E]/30 text-[#1DA44E]"
        : "bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000]";


        
  const scheme = getVarianceColor(adjustedPercentage);
  const styles = varianceStyles[scheme];
 
  const formatValue = (val: number) => {
    const v = Math.round(val || 0);
    if (format === "currency") return `$${v.toLocaleString()}`;
    if (format === "percentage") return `${v}%`;
    return v.toLocaleString();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        bg-white rounded-xl
        border border-slate-200/80
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        p-6
        text-center
      "
    >
      <h3 className="text-[12px] font-normal tracking-[0.04em] text-[#0C233C] mb-3">
        {title}
      </h3>
      <div className="flex justify-center items-baseline gap-3 mb-3">
        <p className="text-3xl font-medium text-[#1E49E2] tracking-[0.04em]">
          {formatValue(cy)}
        </p>
      </div>
      {subtitle && <p className="text-xs text-slate-500 mb-2">{subtitle}</p>}
      <div className="flex justify-center items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          {py !== null ? `PY: ${formatValue(py)}` : "PY: N/A"}
        </span>
        {yoyChange && (
          <>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              
            {yoyChange.percentage > 0 ? (
                invertColors ? (
                  <TrendingUp className="w-3.5 h-3.5 text-[#FF0000]" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 text-[#1DA44E]" />
                )
              ) : (
                invertColors ? (
                  <TrendingDown className="w-3.5 h-3.5 text-[#1DA44E]" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-[#FF0000]" />
                )
              )}
             
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${simpleChip}`}
              >
                {yoyChange.absolute > 0 ? "+" : ""}
                {format === "currency"
                  ? `$${Math.round(Math.abs(yoyChange.absolute)).toLocaleString()}`
                  : Math.round(Math.abs(yoyChange.absolute)).toLocaleString()}
                  
              </span>
              <span 
              className={`text-xs font-medium ${simpleColor}`}
              >
                {yoyChange.percentage > 0 ? "+" : ""}
                {Math.round(yoyChange.percentage)}%
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
interface MetricRowProps {
  label: string;
  value: string | number;
  emphasized?: boolean;
  formula?: string;
  showFormula?: boolean;
}
function MetricRow({
  label,
  value,
  emphasized,
  formula,
  showFormula,
}: MetricRowProps) {
  return (
    <div
      className={`flex items-start justify-between py-3 px-4 rounded-lg hover:bg-[#00338d]/5 transition-colors ${
        emphasized ? "bg-[#1E49E2]/10" : ""
      }`}
    >
      <div className="flex-1">
        <span
          className={`text-sm ${
            emphasized ? "font-semibold text-[#1E49E2]" : "text-[#0C233C]/90"
          }`}
        >
          {label}
        </span>
        {showFormula && formula && (
          <div className="mt-1 text-xs text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded inline-block">
            {formula}
          </div>
        )}
      </div>
      <span
        className={`text-sm ${
          emphasized
            ? "font-bold text-[#1E49E2] text-lg"
            : "font-semibold text-[#0C233C]"
        } ml-4`}
      >
        {typeof value === "number"
          ? `$${Math.round(value).toLocaleString()}`
          : value}
      </span>
    </div>
  );
}
export default function Valuation() {
  const navigate = useNavigate();
    const { p8Id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [valuationData, setValuationData] = useState<any | null>(null);
  const [loadingValuation, setLoadingValuation] = useState(false);
  const STEP_NUMBER = 7;
  const {
    getStepStatus,
    getStepData,
    saveStep,
    markStepInProgress,
    editStep,
    isStepCompleted,
  } = useProject();
  const [isHydrating, setIsHydrating] = useState(true);
  const [showFormulas, setShowFormulas] = useState(false);
  const [exceptionsDrawerOpen, setExceptionsDrawerOpen] = useState(false);
  const [feesAsProposedExpanded, setFeesAsProposedExpanded] = useState(true);
  const [standardAuditFeesExpanded, setStandardAuditFeesExpanded] =
    useState(true);
  const [specialistsExpanded, setSpecialistsExpanded] = useState(true);
  const [netIncomeExpanded, setNetIncomeExpanded] = useState(true);
  const [expenses, setExpenses] = useState<number>(0);
  const [expensesTouched, setExpensesTouched] = useState(false); // NEW
  const [showAllSpecialists, setShowAllSpecialists] = useState(false);
  const markEdited = () => {
    if (!isHydrating) editStep(STEP_NUMBER);
    };
    const isValidated = valuationData?.valuation?.isValidated;

  useEffect(() => {
    if (!p8Id) return;
    const loadValuation = async () => {
      setLoadingValuation(true);
      try {
        const data = await pviiiValuation.getById(p8Id);
        setValuationData(data);
        const normalizeNumber = (value: any) =>
          typeof value === "number" && !isNaN(value) ? value : 0;
        void normalizeNumber;
      } finally {
        setLoadingValuation(false);
      }
    };
    loadValuation();
  }, [p8Id]);

  useEffect(() => {
    if (!valuationData) return;

    const apiExpenses = valuationData?.valuation?.expenses;

    if (!expensesTouched && typeof apiExpenses === "number" && !isNaN(apiExpenses)) {
      setExpenses(apiExpenses);
    }
  }, [valuationData, expensesTouched]);

  const handleExpensesChange = (value: number) => {
    setExpenses(value);
    setExpensesTouched(true);
  };

    const shouldSave = () => {
        return isValidated !== true;
    };


  const feesAsProposed = useMemo(() => {
    if (!valuationData?.entitiesCurrent) {
      return {
        auditFees: 0,
        reportFees: 0,
        taxFees: 0,
        totalFeesProposed: 0,
        technologyRecoveryCostRate: 0.035,
      };
    }
    const auditFees = valuationData.entitiesCurrent.reduce(
      (sum: number, e: any) => sum + (e.auditFeeAmount || 0),
      0
    );
    const reportFees = valuationData.entitiesCurrent.reduce(
      (sum: number, e: any) => sum + (e.reportFeeAmount || 0),
      0
    );
    const taxFees = valuationData.entitiesCurrent.reduce(
      (sum: number, e: any) => sum + (e.taxFeeAmount || 0),
      0
    );
    const totalFeesProposed = auditFees + reportFees + taxFees;
    return {
      auditFees,
      reportFees,
      taxFees,
      totalFeesProposed,
      technologyRecoveryCostRate: 0.035,
    };
  }, [valuationData]);
  const standardAuditFeesByRole = useMemo(() => {
    if (!valuationData?.valuationBreakdown) return []; 
    const map = new Map<
      string,
      { role: string; hours: number; standardFees: number }
    >();
    valuationData.valuationBreakdown.forEach((s: any) => { 
      const key = s.levelLabel;
      if (!map.has(key)) {
        map.set(key, { role: key, hours: 0, standardFees: 0 });
      }
      const entry = map.get(key)!;
      entry.hours += s.hours || 0; 
      entry.standardFees += s.fees || 0; 
    });
    return Array.from(map.values());
  }, [valuationData]);


const [step1Context, setstep1Context] = useState(false);
const [step2Details, setstep2Details] = useState(false);
const [step3Quality, setstep3Quality] = useState(false);
const [step4Entities, setstep4Entities] = useState(false);
const [step5Staffing, setstep5Staffing] = useState(false);

useEffect(() => {
  setstep1Context(valuationData?.stepperStatus?.step1Context ?? false);
  setstep2Details(valuationData?.stepperStatus?.step2Details ?? false);
  setstep3Quality(valuationData?.stepperStatus?.step3Quality ?? false);
  setstep4Entities(valuationData?.stepperStatus?.step4Entities ?? false);
  setstep5Staffing(valuationData?.stepperStatus?.step5Staffing ?? false);
}, [valuationData]);

const activeSaveZero =
  step1Context &&
  step2Details &&
  step3Quality &&
  step4Entities &&
  step5Staffing;
const [auditHoursPFY, setauditHoursPFY] = useState(0);
const [netAuditRevenuePFY, setnetAuditRevenuePFY] = useState(0);
const [valuationPFY, setvaluationPFY] = useState(0);
const [averageFeePFY, setaverageFeePFY] = useState(0);

useEffect(() => {
  if (!valuationData) return;

  setauditHoursPFY(valuationData.lastYearMetrics?.auditHours ?? 0);
  setnetAuditRevenuePFY(valuationData.lastYearMetrics?.netAuditRevenue ?? 0);
  setvaluationPFY(valuationData.lastYearMetrics?.valuation ?? 0);
  setaverageFeePFY(valuationData.lastYearMetrics?.averageFee ?? 0

  );
}, [valuationData]);

const [isRegulatedEntity, setIsRegulatedEntity] = useState(false);
const [isListedEntity, setIsListedEntity] = useState(false);

const isfirstYearClient = useMemo(() => {
  return (auditHoursPFY ?? 0) === 0;
}, [auditHoursPFY]);

const [responsibleOfficeLabel, setResponsibleOfficeLabel] = useState("");

useEffect(() => {
  if (!valuationData) return;

  setIsRegulatedEntity(valuationData.quality?.isRegulatedEntity ?? false);
  setIsListedEntity(valuationData.quality?.isListedEntity ?? false);

  setResponsibleOfficeLabel(valuationData.engagementDetails?.responsibleOfficeLabel ?? ""

  );
}, [valuationData]);

  const standardAuditFeesSubtotal = useMemo(() => {
    return calculateStandardAuditFeesSubtotal(standardAuditFeesByRole);
  }, [standardAuditFeesByRole]);
  const impulsa = useMemo(() => {
    return calculateImpulsa(standardAuditFeesSubtotal.totalHours);
  }, [standardAuditFeesSubtotal.totalHours]);
  const standardAuditFeesTotals = useMemo(() => {
    return calculateStandardAuditFeesTotal(standardAuditFeesSubtotal, impulsa);
  }, [standardAuditFeesSubtotal, impulsa]);

  const specialistsData = useMemo(() => {
    if (!valuationData?.specialists) {
      return {
        netFees: 0,
        breakdown: [] as Array<{
          function: string;
          serviceLine: string;
          fees: number;
        }>,
      };
    }
    const netFees = valuationData.specialists.reduce(
      (sum: number, s: any) => sum + (s.agreedFeesAmount || 0),
      0
    );
    const breakdown = valuationData.specialists.map((s: any) => ({
      function: s.functionLabel,
      serviceLine: s.serviceLineLabel,
      fees: s.agreedFeesAmount || 0,
    }));
    return { netFees, breakdown };
  }, [valuationData]);
  const specialistsToShow = showAllSpecialists
    ? specialistsData.breakdown
    : specialistsData.breakdown.slice(0, 5);
  const technologyRecoveryCost = useMemo(() => {
    return (
      feesAsProposed.totalFeesProposed *
      feesAsProposed.technologyRecoveryCostRate
    );
  }, [feesAsProposed]);
  const netAuditIncome = useMemo(() => {
      return feesAsProposed.totalFeesProposed + technologyRecoveryCost - specialistsData.netFees - expenses - impulsa.fees;// /* - expenses */ se elimino expences para que cuadrara
}, [
  feesAsProposed.totalFeesProposed,
  technologyRecoveryCost,
  specialistsData.netFees,
  expenses,
  impulsa.fees
]);

  const projectValuation = useMemo(() => {
    if (standardAuditFeesTotals.totalFees === 0) return 0;
    return (netAuditIncome / standardAuditFeesSubtotal.totalFees) * 100;
  }, [(netAuditIncome), standardAuditFeesTotals.totalFees]);


  const avgAuditRate = useMemo(() => {
    if (standardAuditFeesSubtotal.totalHours === 0) return 0;
    return (
        Math.round(netAuditIncome) / Math.round((standardAuditFeesSubtotal.totalHours))
    );
  }, [standardAuditFeesTotals]);

  
  const kpiValues = useMemo(
    () => ({
      auditHours: standardAuditFeesTotals.totalHours,
      netAuditIncome,
      projectValuation,
      avgAuditRate,
    }),
    [
      standardAuditFeesTotals.totalHours,
      netAuditIncome,
      projectValuation,
      avgAuditRate,
    ]
  );

const PvsFHoursOne = auditHoursPFY === null || auditHoursPFY === 0 ? null : ((Math.round(standardAuditFeesSubtotal.totalHours) - Math.round(auditHoursPFY)) / Math.round(auditHoursPFY)) * 100;
    const PvsFHours = Math.round(PvsFHoursOne)
  const isFormValid = () => {
    const loaded = !!valuationData && !loadingValuation;
    // A) Fees as Proposed: total > 0
    const hasFeesAsProposed = feesAsProposed.totalFeesProposed > 0;
    // B) Standard Audit Fees: totals > 0
    const hasStandardAuditFees =
      standardAuditFeesTotals.totalFees > 0 &&
      standardAuditFeesTotals.totalHours > 0;
    // C) Specialists: net fees > 0 y breakdown con elementos
    const hasSpecialists =
      specialistsData.netFees > 0 && specialistsData.breakdown.length > 0;
    // D) Net Income & Adjustments: Expenses capturado (touched) y número válido
    // (permite 0 si el usuario lo capturó intencionalmente)
      //const hasExpenses = expensesTouched && Number.isFinite(expenses);
      const hasExpenses = Number.isFinite(expenses);
    return (
      loaded &&
      hasFeesAsProposed &&
      hasStandardAuditFees &&
      hasSpecialists &&
      hasExpenses
    );
  };
  const persistStep = () => {
    const isComplete = isFormValid();
    saveStep(
      STEP_NUMBER,
      {
        expenses,
        expensesTouched, 
        showFormulas,
        feesAsProposedExpanded,
        standardAuditFeesExpanded,
        specialistsExpanded,
        netIncomeExpanded,
        showAllSpecialists,
      },
      isComplete
    );
    return isComplete;
  };
  useEffect(() => {
    markStepInProgress(STEP_NUMBER);
    const local = getStepData(STEP_NUMBER);
    if (local && Object.keys(local).length > 0) {
      if (typeof local.expenses === "number") {
        setExpenses(local.expenses);
        setExpensesTouched(true);
      }
      if (typeof local.expensesTouched === "boolean")
        setExpensesTouched(local.expensesTouched);
      if (typeof local.showFormulas === "boolean")
        setShowFormulas(local.showFormulas);
      if (typeof local.feesAsProposedExpanded === "boolean")
        setFeesAsProposedExpanded(local.feesAsProposedExpanded);
      if (typeof local.standardAuditFeesExpanded === "boolean")
        setStandardAuditFeesExpanded(local.standardAuditFeesExpanded);
      if (typeof local.specialistsExpanded === "boolean")
        setSpecialistsExpanded(local.specialistsExpanded);
      if (typeof local.netIncomeExpanded === "boolean")
        setNetIncomeExpanded(local.netIncomeExpanded);
      if (typeof local.showAllSpecialists === "boolean")
        setShowAllSpecialists(local.showAllSpecialists);
    }
    setIsHydrating(false);
  }, []);
  const buildValuationPayload = () => {
    if (!p8Id) return null;
    return {
      p8Id,
      auditRevenue: feesAsProposed.auditFees,
      reportRevenue: feesAsProposed.reportFees,
      taxRevenue: feesAsProposed.taxFees,
      standardAuditHours: standardAuditFeesSubtotal.totalHours,
      standardAuditRevenue: standardAuditFeesSubtotal.totalFees,
      specialistsRevenue: specialistsData.netFees,
      expenses,
      
      createBy: valuationData?.createdByUserEmail ?? "noreply@local",
    };
  };
  const handleBack = () => {
    persistStep();
    navigate(`/p8/specialists/${p8Id}`);
  };
  
    const handleSaveDraft = async () => {
        if (isSubmitting) return;

        try {
            setIsSubmitting(true);

            persistStep();

            if (!shouldSave()) {
                navigate("/p8/new");
                return;
            }

            const payload = buildValuationPayload();
            if (!payload || !p8Id) return;

            await pviiiValuation.update(p8Id, payload);

            navigate("/p8/new");
        } finally {
            setIsSubmitting(false);
        }
    };
 
    const handleContinueToReview = async () => {
        if (isSubmitting) return; 

        try {
            setIsSubmitting(true);

            persistStep();

            if (shouldSave()) {
                const payload = buildValuationPayload();
                if (!payload || !p8Id) return;

                await pviiiValuation.update(p8Id, payload);
            }

            navigate(`/p8/review/${p8Id}`);
        } finally {
            setIsSubmitting(false); 
        }
    };
  
  const handleStepClick = (stepIndex: number) => {
    persistStep();
    const routes = [
      `/p8/leadership/${p8Id}`,
      `/p8/general-data/${p8Id}`,
      `/p8/quality/${p8Id}`,
      `/p8/entities/${p8Id}`,
      `/p8/staffing/${p8Id}`,
      `/p8/specialists/${p8Id}`,
      `/p8/valuation/${p8Id}`,
      `/p8/review/${p8Id}`,
    ];
    navigate(routes[stepIndex]);
  };

  const isLargeOffice = ["México", "Monterrey"].includes(responsibleOfficeLabel);
  const threshold = isLargeOffice ? 500000 : 400000;
  const shouldShow = isfirstYearClient && netAuditIncome < threshold;

  const threshold2 =
    (isRegulatedEntity || isListedEntity) ? 1600 :
    isLargeOffice ? 1385 : 1225;

  const subtitle =
    (isRegulatedEntity || isListedEntity)
      ? "For listed / regulated entities"
      : isLargeOffice
        ? "For large offices"
        : "For small / medium offices";

  const goalText =
    threshold2 === 1600 ? "Below $1,600 goal" :
    threshold2 === 1385 ? "Below $1,385 goal" :
    "Below $1,225 goal";

  const show = avgAuditRate < threshold2;

  const [revenueFlag, setrevenueFlag] = useState(0);
  useEffect(() => {
      if (shouldShow) setrevenueFlag(1);
      else setrevenueFlag(0); 
  }, [shouldShow]);


  const [valuationFlag, setValuationFlag] = useState(0);
  const valuation = Number(projectValuation);
  const shouldFlag = (isfirstYearClient === false) && (valuation < 52);
  useEffect(() => {
    if (shouldFlag) setValuationFlag(1);
    else setValuationFlag(0);
  }, [shouldFlag]);


  const [AVRGFeeFlag, setAVRGFeeFlag] = useState(0);
  useEffect(() => {
    setAVRGFeeFlag(show ? 1 : 0);
  }, [show]);

const totatalFlags = revenueFlag + valuationFlag + AVRGFeeFlag + (!isfirstYearClient && PvsFHours > -5.9 ? 1 : 0);


const ROLE_PRIORITY = [
  "Partner",
  "Director",

  "Senior Manager",
  "Manager",

  "LSQCR",
  "EQCR",

  "Supervising Senior",

  "Senior",

  "Staff in charge",
  "Staff In Charge-Medio Tiempo",

  "Staff",
  "Staff-Medio Tiempo",
];

const standardAuditFeesByRoles = useMemo(() => {
  if (!valuationData?.valuationBreakdown) return [];

  const map = new Map<
    string,
    { role: string; hours: number; standardFees: number }
  >();

  valuationData.valuationBreakdown.forEach((s: any) => {
    const key = s.levelLabel;

    if (!map.has(key)) {
      map.set(key, { role: key, hours: 0, standardFees: 0 });
    }

    const entry = map.get(key)!;
    entry.hours += s.hours || 0;
    entry.standardFees += s.fees || 0;
  });

  const result = Array.from(map.values());

  result.sort((a, b) => {
    const indexA = ROLE_PRIORITY.indexOf(a.role);
    const indexB = ROLE_PRIORITY.indexOf(b.role);

    const safeIndexA = indexA === -1 ? 999 : indexA;
    const safeIndexB = indexB === -1 ? 999 : indexB;

    return safeIndexA - safeIndexB;
  });

  return result;
}, [valuationData]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/30 pb-24">
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <Stepper
            steps={wizardSteps.map((step, index) => ({
              ...step,
              status: getStepStatus(index + 1),
              completed: isStepCompleted(index + 1),
            }))}
            currentStep={6}
            onStepClick={handleStepClick}
          />
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-[#1e49e2] font-light text-[28px] tracking-[0.02em] transition-colors duration-300"
                style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
              > 
                Project Valuation
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowFormulas(!showFormulas);
                  markEdited();
                }}
                className="border-slate-300 text-slate-700"
              >
                <Info className="w-4 h-4 mr-2" />
                {showFormulas ? "Hide" : "Show"} Formulas
              </Button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <KPICard
            title="Audit Hours"
            cy={activeSaveZero ? (standardAuditFeesSubtotal.totalHours) : 0}
            py={activeSaveZero ? (auditHoursPFY) : 0}
            format="number"
            
          />
          <KPICard
            
            title= {"Net Revenue"}
            cy={activeSaveZero ? (kpiValues.netAuditIncome) : 0}
            py={activeSaveZero ? (netAuditRevenuePFY) : 0}
            format="currency"
          />
          <KPICard
            title="Valuation"
            cy={activeSaveZero ? (kpiValues.projectValuation) : 0}
            py={activeSaveZero ? (valuationPFY * 100) : 0}
            format="percentage"
          />
          <KPICard
            title="Average Fee"
            cy={activeSaveZero ? Math.round((Math.round(kpiValues.netAuditIncome) / Math.round(standardAuditFeesSubtotal.totalHours))) : 0 }//(kpiValues.avgAuditRate) : 0}
            py={activeSaveZero ? (averageFeePFY) : 0}
            format="currency"
          />
        </motion.div>
        
        <div style={{ display: 'none' }} >{isfirstYearClient? "isfirstYearClientTRUE": "isfirstYearClientFALSE"}</div>

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#00266A] to-[#00338D] px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white tracking-[0.02em]">
                Valuation Metrics Breakdown
              </h2>
              {totatalFlags > 0 &&(
                <button
                  onClick={() => setExceptionsDrawerOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Exceptions: {totatalFlags}
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                  {totatalFlags > 0 && (
                      <div className="w-2 h-2 rounded-full bg-red-400" title="High" />
                    )}
                  </div> 
                 
                </button>
              )}
            </div>
          </div>
          <div>{isfirstYearClient}</div>
          <div className="p-8 space-y-6">
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  setFeesAsProposedExpanded(!feesAsProposedExpanded);
                  markEdited();
                }}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4
                  bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                  hover:from-[#00338D] hover:to-[#00338D]
                  transition-all
                "
              >
                <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">
                  Fees as Proposed
                </h3>
                {feesAsProposedExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white/80" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/80" />
                )}
              </button>
              <AnimatePresence>
                {feesAsProposedExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 space-y-1">
                      <MetricRow label="Audit Fees" value={feesAsProposed.auditFees} />
                      <MetricRow label="Report Fees" value={feesAsProposed.reportFees} />
                      <MetricRow label="Tax Fees" value={feesAsProposed.taxFees} />
                      <MetricRow
                        label="Total Fees as Proposed"
                        value={feesAsProposed.totalFeesProposed}
                        emphasized
                      />
                      <MetricRow
                        label="Technology Recovery Cost (3.5%)"
                        value={technologyRecoveryCost}
                        formula={
                          showFormulas
                            ? "Total Fees as Proposed × 0.035"
                            : undefined
                        }
                        showFormula={showFormulas}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  setStandardAuditFeesExpanded(!standardAuditFeesExpanded);
                  markEdited();
                }}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4
                  bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                  hover:from-[#00338D] hover:to-[#00338D]
                  transition-all
                "
              >
                <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">
                  Standard Audit Fees (Breakdown)
                </h3>
                {standardAuditFeesExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white/80" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/80" />
                )}
              </button>
              <AnimatePresence>
                {standardAuditFeesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4">
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-[#1E49E2]/10 border-b border-slate-200">
                            <tr>
                              <th className="text-left px-4 py-3 font-semibold text-[#1E49E2]">
                                Role / Category
                              </th>
                              <th className="text-right px-4 py-3 font-semibold text-[#1E49E2]">
                                Hours
                              </th>
                              <th className="text-right px-4 py-3 font-semibold text-[#1E49E2]">
                                Standard Fees
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {standardAuditFeesByRoles.map((role, idx) => (
                              <tr
                                key={idx}
                                className="border-b border-slate-100 hover:bg-slate-50/50"
                              >
                                <td className="px-4 py-3 text-slate-700">
                                  {role.role}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-900 font-medium">
                                  {Math.round(role.hours).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                                  ${Math.round(role.standardFees).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                            <tr className="font-semibold">
                              <td className="px-4 py-3 text-slate-700 font-normal">
                                Impulsa
                              </td>
                              <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                                {Math.round(impulsa.hours).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right text-slate-900 font-semibold">
                                ${Math.round(impulsa.fees).toLocaleString()}
                              </td>
                            </tr>
                            <tr className="bg-[#1E49E2]/10 font-semibold">
                              <td className="px-4 py-3 text-[#1E49E2]">Total</td>
                              <td className="px-4 py-3 text-right text-[#1E49E2]">
                                {Math.round(
                                  standardAuditFeesTotals.totalHours
                                ).toLocaleString()}
                              </td>
                              <td className="px-4 py-3 text-right text-[#1E49E2]">
                                ${Math.round(
                                  standardAuditFeesTotals.totalFees
                                ).toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {showFormulas && (
                        <div className="mt-4 space-y-2">
                          <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded">
                            Project Valuation (%) = (Net Audit Income / Total
                            Standard Fees) × 100
                          </div>
                          <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded">
                            Average Audit Rate = Total Standard Fees / Total
                            Hours
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  setSpecialistsExpanded(!specialistsExpanded);
                  markEdited();
                }}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4
                  bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                  hover:from-[#00338D] hover:to-[#00338D]
                  transition-all
                "
              >
                <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">
                  Specialists
                </h3>
                {specialistsExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white/80" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/80" />
                )}
              </button>
              <AnimatePresence>
                {specialistsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4">
                      <MetricRow
                        label="Specialists Net Fees"
                        value={specialistsData.netFees}
                        emphasized
                      />
                      <div className="space-y-2 mt-4">
                        {specialistsToShow.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 px-4 rounded-lg bg-slate-50/50"
                          >
                            <div className="flex-1">
                              <p className="text-sm text-slate-700">
                                {item.serviceLine}
                              </p>
                              <p className="text-xs text-slate-500">
                                {item.function}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              ${item.fees.toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {specialistsData.breakdown.length > 5 &&
                          !showAllSpecialists && (
                            <button
                              onClick={() => {
                                setShowAllSpecialists(true);
                                markEdited();
                              }}
                              className="w-full py-2 text-sm text-[#1E49E2] hover:text-[#00338D] font-medium transition-colors"
                            >
                              View all ({specialistsData.breakdown.length})
                            </button>
                          )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => {
                  setNetIncomeExpanded(!netIncomeExpanded);
                  markEdited();
                }}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4
                  bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                  hover:from-[#00338D] hover:to-[#00338D]
                  transition-all
                "
              >
                <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">
                  Net Income &amp; Adjustments
                </h3>
                {netIncomeExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white/80" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/80" />
                )}
              </button>
              <AnimatePresence>
                {netIncomeExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 py-4 space-y-1">
                      <MetricRow
                        label="Audit Income"
                        value={feesAsProposed.totalFeesProposed + technologyRecoveryCost}
                      />
                      <div className="flex items-start justify-between py-3 px-4 rounded-lg bg-blue-50/30 border border-blue-100">
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            Expenses
                          </label>
                        </div>
                        <div className="ml-4 w-40">
                          <Input
                            type="number"
                            value={expenses}
                            onChange={(e) => {
                              setExpenses(Number(e.target.value));
                              setExpensesTouched(true); 
                              markEdited();
                            }}
                            className="text-right font-semibold"
                          />
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t-2 border-slate-200">
                        <MetricRow
                          label="Net Audit Income Total"
                          value={netAuditIncome}
                          emphasized
                          formula={
                            showFormulas ? "Audit Income + Technology Recovery Fee - Expenses - Impulsa Fees - Specialists Fees" : undefined
                          }
                          showFormula={showFormulas}
                        />
                      </div>
                      
                      {expensesTouched && (  
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-3 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200"
                        >
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-amber-800 font-medium">
                                Updated Values:
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-700">
                                Net Audit Income:
                              </span>
                              <span className="font-semibold text-amber-900">
                                ${netAuditIncome.toLocaleString() }
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-700">
                                Project Valuation:
                              </span>
                              <span className="font-semibold text-amber-900">
                                {Math.round(projectValuation)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-amber-700">
                                Average Audit Rate:
                              </span>
                              <span className="font-semibold text-amber-900">
                                ${Math.round(avgAuditRate).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-between mt-10"
        >
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-slate-300 text-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
                          disabled={!activeSaveZero || isSubmitting}
              className="border-slate-300 text-slate-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save &amp; Exit
            </Button>
            <Button
              onClick={handleContinueToReview}
                          disabled={!activeSaveZero || isSubmitting}
              className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 shadow-lg shadow-blue-500/30"
            >
                          {isSubmitting ? "Saving..." : "Save & Next"}
                          <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {exceptionsDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              onClick={() => setExceptionsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-[#00266A] to-[#00338D] px-6 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Business Rule Exceptions
                  </h3>
                  <p className="text-sm text-blue-200 mt-1">
                    {totatalFlags} exception
                    {totatalFlags !== 1 ? "s" : ""} detected
                    
                    
                  </p>
                </div>
                <button
                  onClick={() => setExceptionsDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

            {shouldShow ? (
                    <div className="p-6 space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className={`px-4 py-3 flex items-center justify-between ${
                            netAuditIncome < threshold ? "bg-red-50 border-b border-red-100" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                netAuditIncome < threshold ? "bg-red-500" : ""
                              }`}
                            />
                            <span
                              className={`text-xs font-semibold capitalize tracking-wider ${
                                netAuditIncome < threshold ? "text-red-700" : ""
                              }`}
                            >
                              Net Revenue
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">
                            Below ${threshold.toLocaleString()} goal
                          </h4>
                          <p className="text-sm text-slate-700">
                            {isLargeOffice
                              ? "For new clients from large offices"
                              : "For new clients from small / medium offices"}
                          </p>
                        </div>
                      </motion.div>
                    </div>
              ) : null}

              {isfirstYearClient === false ? (projectValuation < 52
                        ? (
                          <div className="p-6 space-y-4">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-slate-200 rounded-xl overflow-hidden"
                            >
                              <div
                                className={`px-4 py-3 flex items-center justify-between ${
                                  projectValuation < 52
                                    ? "bg-red-50 border-b border-red-100"
                                    : null
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      projectValuation < 52
                                        ? "bg-red-500"
                                        : null
                                    }`}
                                  />
                                  <span
                                    className={`text-xs font-semibold capitalize tracking-wider ${
                                      projectValuation < 52
                                        ? "text-red-700"
                                        : null
                                    }`}
                                  >
                                    Valuation
                                  </span>
                                </div>
                              </div>

                              <div className="p-4">
                                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                                  Below 52% goal
                                </h4>
                                <p className="text-sm text-slate-700">For recurring clients</p>
                              </div>
                            </motion.div>
                          </div>
                        )
                        : null
                      )
                  : null
                }

              {show ? (   
                <div className="p-6 space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className={`px-4 py-3 flex items-center justify-between ${
                            show ? "bg-red-50 border-b border-red-100" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${show ? "bg-red-500" : ""}`} />
                            <span className={`text-xs font-semibold capitalize tracking-wider ${show ? "text-red-700" : ""}`}>
                              Average Fee
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">{goalText}</h4>
                          <p className="text-sm text-slate-700">{subtitle}</p>
                        </div>
                      </motion.div>
                    </div>
                  ) : null}
           
              {!isfirstYearClient && (PvsFHours > -5.9) ? (
                <div className="p-6 space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className={`px-4 py-3 flex items-center justify-between ${
                            PvsFHours > -5.9 ? "bg-red-50 border-b border-red-100" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${PvsFHours > -5.9 ? "bg-red-500" : ""}`} />
                            <span className={`text-xs font-semibold capitalize tracking-wider ${PvsFHours > -5.9 ? "text-red-700" : ""}`}>
                              Hours
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Reduction greater than -6% </h4>
                          <p className="text-sm text-slate-700">For recurring clients</p>
                        </div>
                      </motion.div>
                    </div>
                  ) : null}
              
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
