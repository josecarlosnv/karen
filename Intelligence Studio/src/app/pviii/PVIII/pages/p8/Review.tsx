import { useEffect, useMemo, useState, type ElementType, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { Stepper, type Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Building2,
  FileCheck,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useProject } from "../../context/ProjectContext";
import { toast } from "sonner";

import { pviiiApi } from "../../api/pviiiReview";

import { TeamLeaderStats } from "../../api/pviiiReview";

const wizardSteps: Step[] = [
  { id: "context", title: "Context" },
  { id: "details", title: "Details" },
  { id: "quality", title: "Quality" },
  { id: "entities", title: "Entities" },
  { id: "staffing", title: "Staffing" },
  { id: "specialists", title: "Specialists" },
  { id: "valuation", title: "Valuation" },
  { id: "review", title: "Review" },
];

const STEP_NUMBER = 8;

const reviewData = {
  entityAndRegulatory: {
    publicInterestEntity: "Yes",
    regulatedEntity: "Yes",
    listedEntity: "Yes",
    secSubsidiaryAffiliate: "No",
    subsidiaryOfListedNonSec: "No",
    significantSubsidiary: "Yes",
    localOrReferred: "Local",
  },
  auditAndEngagement: {
    reviewerType: "Engagement Quality Control Review (EQCR)",
    reportType: "Audit Report on Consolidated Financial Statements",
    natureOfWork: "Annual Audit",
  },
  effortAndSpecialists: {
    eqcrApplicable: true,
    eqcrName: "Patricia Hernández",
  },
};

interface AttributeRowProps {
  label: string;
  value: string;
}

function AttributeRow({ label, value }: AttributeRowProps) {
  return (
    <div className="flex items-start justify-between py-3 px-4 rounded-lg hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
      <span className="text-xs font-regular text-text-[##0C233C]/30 capitalize tracking-wider">
        {label}
      </span>
      <span className="text-sm font-medium text-[##0C233C] tracking-[0.02em]">
        {value}
      </span>
    </div>
  );
}

interface SectionCardProps {
  icon: ElementType;
  title: string;
  iconColor: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
}
type PviiiDetail = any
function SectionCard({
  icon: Icon,
  title,
  iconColor,
  children,
  defaultCollapsed = false,
}: SectionCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
    >
      <div
        className="bg-gradient-to-r from-[#00266A] to-[#1E49E2] px-8 py-6 cursor-pointer transition-colors border-b border-white/15"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-medium text-white">{title}</h2>
          </div>

          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-white/80" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white/80" />
          )}
        </div>
      </div>

      {!isCollapsed && <div className="p-8">{children}</div>}
    </motion.div>
  );
}

export default function Review() {
  const navigate = useNavigate();
  const { p8Id } = useParams();
    const [teamLeaderStats, setTeamLeaderStats] = useState<TeamLeaderStats[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pviii, setPviii] = useState<PviiiDetail | null>(null);
    const [loading, setLoading] = useState(true);

    const [framework, setFramework] = useState<any>(null);

    const requiredStepsCompleted = useMemo(() => {
        if (!pviii?.stepperStatus) return false;

        const {
            step1Context,
            step2Details,
            step3Quality,
            step4Entities,
            step5Staffing,
        } = pviii.stepperStatus;

        return (
            step1Context &&
            step2Details &&
            step3Quality &&
            step4Entities &&
            step5Staffing
        );
    }, [pviii]);
    const getMissingSteps = () => {
        if (!pviii?.stepperStatus) return [];

        const map = [
            { key: "step1Context", label: "Context" },
            { key: "step2Details", label: "Details" },
            { key: "step3Quality", label: "Quality" },
            { key: "step4Entities", label: "Entities" },
            { key: "step5Staffing", label: "Staffing" },
        ];

        return map
            .filter(step => !pviii.stepperStatus[step.key])
            .map(step => step.label);
    };
    
    useEffect(() => {
        if (!p8Id) return;

        const fetchData = async () => {
            try {
                const [pviiiData, teamLeaders, frameworkData] = await Promise.all([
                    pviiiApi.getById(p8Id),
                    pviiiApi.getTeamLeaderStats(),

                    pviiiApi.getFramework(p8Id),

                ]);

                setPviii(pviiiData);
                setTeamLeaderStats(teamLeaders);

                setFramework(frameworkData);


            } catch (error) {
                toast.error("Error loading project review data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        markStepInProgress(STEP_NUMBER);
    }, [p8Id]);
    const engagementLeader = teamLeaderStats.find(
        tl => tl.employeeId === pviii?.createProject?.partnerEmployeeId
    );

    const engagementManager = teamLeaderStats.find( 
        tl => tl.employeeId === pviii?.createProject?.srManagerEmployeeId
    );

  const {
    canCompleteStep8,
    saveStep,
    markStepInProgress,
    getStepStatus,
    isStepCompleted,
    getStepData,
  } = useProject();
    const valuationSeq = pviii?.valuation?.recordChangeSequence ?? null;

  const canComplete = canCompleteStep8();
    const calculateLeadershipRisk = (): "Low" | "High" => {
        if (!engagementLeader || !engagementManager) {
            return "Low";
        }

        const leaderIsFirstYear = engagementLeader.isFirstYear === true;
        const managerIsFirstYear = engagementManager.isFirstYear === true;

        const leaderHasLowQPR = engagementLeader.qprResult === false;
        const managerHasLowQPR = engagementManager.qprResult === false;

        if (
            (leaderIsFirstYear && managerHasLowQPR) ||
            (leaderIsFirstYear && managerIsFirstYear) ||
            (leaderHasLowQPR && managerHasLowQPR)
        ) {
            return "High";
        }

        return "Low";
    };

    const leadershipRisk = calculateLeadershipRisk();

  const calculateFinancialExceptions = (): string[] => {
    const exceptions: string[] = [];

    const projectValuation = 42.5;
    const avgAuditRate = 193.66;
    const totalFeesProposed = 294500;
    const isNewClient = pviii?.firstYearClient === true;

    const office = "Mexico City";

    if (projectValuation < 52) {
      exceptions.push("Project valuation below minimum threshold");
    }

    const minRateThresholds: Record<string, number> = {
      "Mexico City": 180,
      Monterrey: 180,
      Guadalajara: 170,
      Other: 160,
    };

    const minRate = minRateThresholds[office] || minRateThresholds.Other;
    if (avgAuditRate < minRate) {
      exceptions.push("Minimum average rate not met for office and entity type");
    }

    if (isNewClient) {
      const minFees =
        office === "Mexico City" || office === "Monterrey" ? 500000 : 400000;
      if (totalFeesProposed < minFees) {
        exceptions.push("New client minimum fees not met");
      }
    }

    return exceptions;
  };

  const financialExceptions = calculateFinancialExceptions();
    

  useEffect(() => {
    markStepInProgress(STEP_NUMBER);
  }, []);
    const apiProjectRisk = pviii?.proyectRisk?.preliminaryRiskProject;
    const projectRisk: "Low" | "Medium" | "High" = (() => {
        switch (apiProjectRisk?.toLowerCase()) {
            case "high":
                return "High";
            case "medium":
                return "Medium";
            case "low":
            default:
                return "Low";
        }
    })();
  const handleBack = () => {
    navigate(`/p8/valuation/${p8Id}`);
  };

    const handleConfirmAndSubmit = async () => {
        if (isSubmitting) return;
        if (!p8Id) return;

        try {
            setIsSubmitting(true);

            if (!requiredStepsCompleted) {
                toast.error(`Complete required steps: ${getMissingSteps().join(", ")}`);
                return;
            }

            const response: ApiResult = await pviiiApi.submitReview(p8Id, {
                p8Id,
                isHighRisk: isHighRisk !== 1,
                isFinancialRisk: cuota < 1200 || (PvsFHours > -6 && !newClient), 
                approvalLevelId: riskValue,
            });

            if (!response.correct) {
                if (
                    response.errorCode === "NOT_MANAGER" ||
                    response.errorCode === "NOT_ASSIGNED_MANAGER"
                ) {
                    toast.error("You don’t have permission to submit this review.");
                    return;
                }

                toast.error("Error submitting project review.");
                return;
            }
            if (!requiredStepsCompleted) {
                toast.error(`Complete required steps: ${getMissingSteps().join(", ")}`);
                return;
            }
            
            saveStep(STEP_NUMBER, {}, true);
            toast.success("Project submitted for approval");
            navigate("/p8/new");

        } catch (error: any) {
            const apiError = error?.response?.data;

            if (
                apiError?.errorCode === "NOT_MANAGER" ||
                apiError?.errorCode === "NOT_ASSIGNED_MANAGER"
            ) {
                toast.error("You don’t have permission to submit this review.");
                return;
            }

            toast.error("Unexpected error submitting project review.");
        }
        finally {
            setIsSubmitting(false);
        }


    };

  const [step7Valuation, setStep7Valuation] = useState(false); 

  const [openLEAP, setOpenLEAP] = useState(false); //open leap
  const [openMana, setOpenMana] = useState(false); //open manager

  const [QPRLEAP, setQPRLEAP] = useState(false); //QPR LEPA
  const [QPRMana, setQPRMana] = useState(false); //QPR Mana
  const [anoLEAP, setAnoLEAP] = useState(false); //año LEAP

  const [hours, seHours] = useState(0); //Horas
  const [cuota, setCuota] = useState(0); //cuota

  const [valuations, setValuation] = useState(0);
  const [office, setOffice] = useState("");
  const [isRegulatedEntity, setIsRegulatedEntity] = useState(false);
  const [isListedEntity, setIsListedEntity] = useState(false);
  const [netAuditIncome, setnetAuditIncome] = useState(0);
  //dato del año pasado
  const [auditHoursPFY, setauditHoursPFY] = useState(0);

  useEffect(() => {
    if (!pviii) return;
    setStep7Valuation(pviii.stepperStatus?.step7Valuation ?? false);
        
    setOpenLEAP(engagementLeader?.openPdIndicator ?? false);
    setOpenMana(engagementManager?.openPdIndicator ?? false);

    setQPRLEAP(engagementLeader?.qprResult ?? false);
    setQPRMana(engagementManager?.qprResult ?? false);

    setAnoLEAP(engagementLeader?.isFirstYear ?? false);
    seHours(pviii.valuation?.standardAuditHours ?? 0);

    setCuota(pviii.valuation?.averageAuditFee ?? 0);
    setValuation(pviii.valuation?.valuation ?? 0); 
    setOffice(pviii.engagementDetails?.responsibleOfficeLabel ?? "");
    setIsRegulatedEntity(pviii.quality?.isRegulatedEntity ?? false);
    setIsListedEntity(pviii.quality?.isListedEntity ?? false);
    setnetAuditIncome(pviii.valuation?.netAuditIncome ?? 0);
    //dato del año pasado
    setauditHoursPFY(pviii.lastYearMetrics?.auditHours ?? 0);
}, [pviii]);

const newClient = useMemo(() => {
  return (auditHoursPFY ?? 0) === 0;
}, [auditHoursPFY]); 

 const PvsFHoursOne = auditHoursPFY === null || auditHoursPFY === 0 ? null : ((Math.round(hours) - Math.round(auditHoursPFY)) / Math.round(auditHoursPFY)) * 100;

    const PvsFHours = Math.round(PvsFHoursOne)
const riskValue = (() => {

  if (apiProjectRisk === "N/A") return 99; 

  if (QPRLEAP && QPRMana && projectRisk === "High") return 99; 
  if (anoLEAP && projectRisk === "High") return 99; 
  if (openLEAP && projectRisk === "High") return 99; 

  if (QPRLEAP && !QPRMana && projectRisk === "High") return 5;  

  if (QPRLEAP && !QPRMana && (projectRisk === "Medium" || projectRisk === "Low")) return 4; 
  if (QPRLEAP && QPRMana && (projectRisk === "Medium" || projectRisk === "Low")) return 4; 

  if (PvsFHours > -6 && !newClient) return 3; 
  if (cuota < 1200) return 3; 

  if (openLEAP && (projectRisk === "Medium" || projectRisk === "Low")) return 3; 
  if (openMana) return 3; 

  if (!QPRLEAP && QPRMana) return 2; 

  return 1
})();

const isHighRisk = (() => {
  if (apiProjectRisk === "N/A") return 99; 

  if (QPRLEAP && QPRMana && projectRisk === "High") return 99; 
  if (anoLEAP && projectRisk === "High") return 99; 
  if (openLEAP && projectRisk === "High") return 99; 

  if (QPRLEAP && !QPRMana && projectRisk === "High") return 5; 

  if (QPRLEAP && !QPRMana && (projectRisk === "Medium" || projectRisk === "Low")) return 4; 
  if (QPRLEAP && QPRMana && (projectRisk === "Medium" || projectRisk === "Low")) return 4; 

  if (openLEAP && (projectRisk === "Medium" || projectRisk === "Low")) return 3; 
  if (openMana) return 3; 

  if (!QPRLEAP && QPRMana) return 2; 
  
  return 1
})();

  const isLargeOffice = ["México", "Monterrey"].includes(office);
  const threshold = isLargeOffice ? 500000 : 400000;
  const shouldShow = newClient && netAuditIncome < threshold;

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

  const show = cuota < threshold2;
  const [revenueFlag, setrevenueFlag] = useState(0);
  useEffect(() => {
      if (shouldShow) setrevenueFlag(1);
      else setrevenueFlag(0); 
  }, [shouldShow]);

  const [valuationFlag, setValuationFlag] = useState(0);
  const valuation = Number(valuations);
  const shouldFlag = (newClient === false) && (valuation < 52);
  useEffect(() => {
    if (shouldFlag) setValuationFlag(1);
    else setValuationFlag(0);
  }, [shouldFlag]);


  const [AVRGFeeFlag, setAVRGFeeFlag] = useState(0);
  useEffect(() => {
    setAVRGFeeFlag(show ? 1 : 0);
  }, [show]);

  const totatalFlags = revenueFlag + valuationFlag + AVRGFeeFlag + (!newClient && PvsFHours > -5.9 ? 1 : 0);

  const handleStepClick = (stepIndex: number) => {
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium":
        return "text-red-600 bg-red-50 border-red-200"; 
      case "Low":
        return "text-red-600 bg-red-50 border-red-200"; 
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return <AlertCircle className="w-5 h-5" />;
      case "Medium":
        return <AlertCircle className="w-5 h-5" />;
      case "Low":
        return <AlertCircle className="w-5 h-5" />; ;
      default:
        return null;
    }
  };
    if (loading || !pviii) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading review...</p>
            </div>
        );
    }
    const entities = pviii?.entities ?? [];
    const firstEntitys = entities[0];
    const firstEntity = pviii?.entities?.[0];


    const hasEqcr = entities.some(
        e => e.reviewerTypeLabel === "EQCR"
    );

    const natureOfWork =
        pviii.quality?.natureOfEngagementLabel || "Annual Audit";
    const reviewerEntities = pviii?.entitiesCurrent ?? [];

    const lsqcrEntities = reviewerEntities.filter(
        e => e.reviewerTypeLabel === "LSQCR"
    );

    const eqcrEntities = reviewerEntities.filter(
        e => e.reviewerTypeLabel === "EQCR"
    );

    const hasLSQCR = lsqcrEntities.length > 0;
    const hasEQCR = eqcrEntities.length > 0;
    const qualityData = pviii.qualityCFY ?? pviii.quality;
    const localOrReferredLabel =
        framework?.localOrReferred === "Referred"
            ? framework?.referredCountry || "Referred"
            : "Local";


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/30 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          <Stepper
            steps={wizardSteps.map((step, index) => ({
              ...step,
              status: getStepStatus(index + 1),
              completed: isStepCompleted(index + 1),
            }))}
            currentStep={7}
            onStepClick={handleStepClick}
          />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1
            className="text-[#1E49E2] font-light text-[28px] tracking-[0.02em] transition-colors duration-300"
            style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
          >
            Review &amp; Confirmation
          </h1>

          <p className="text-sm font-normal text-slate-500 leading-relaxed">
            These fields are Relevant Data Elements (RDE) for the Quality
            Management System (ISQM 1 and QC 1000).
          </p>
        </motion.div>

        <div className="space-y-8">
          <SectionCard
            icon={Shield}
            title="Project Risk Assessment"
            iconColor="from-[#00266A] to-[#1E49E2]"
            defaultCollapsed={false}
          >
                                
            {isHighRisk !== 1 && (
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
                <span className="text-sm font-medium text-slate-600">
                  Project Risk Level:
                </span>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${getRiskColor(
                    projectRisk
                  )} border-2`}
                >
                  {getRiskIcon(projectRisk)}
                  {isHighRisk > 1 ? "High Risk": "" } 
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1.5">
                <p className="text-xs font-light text-text-[##0C233C]/30 capitalize tracking-wider">
                  Engagement Leader
                </p>
                              <p>
                                  {requiredStepsCompleted
                                      ? pviii.createProject?.partnerName || "Not assigned"
                                      : ""}
                              </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-light text-text-[##0C233C]/30 capitalize tracking-wider">
                  Engagement Manager
                              </p>
                              <p>
                                  {requiredStepsCompleted
                                      ? pviii.createProject?.srManagerName || "Not assigned"
                                      : ""}
                              </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-light text-text-[##0C233C]/30 capitalize tracking-wider">
                  Accounting Framework
                </p>
                <p className="text-sm font-medium text-[##0C233C] tracking-[0.02em]">

                                  {pviii.proyectRisk?.accountingFrameworks?.join(", ") || "Not specified"}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-light text-text-[##0C233C]/30 capitalize tracking-wider">
                  Auditing Standards
                </p>
                <p className="text-sm font-medium text-[##0C233C] tracking-[0.02em]">

                                  {pviii.proyectRisk?.auditingStandards?.join(", ") || "Not specified"}
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-light text-text-[##0C233C]/30 capitalize tracking-wider">
                  Industry
                </p>
                <p className="text-sm font-medium text-[##0C233C] tracking-[0.02em]">
                                  {pviii.proyectRisk?.industry || "Not specified"}                </p>
              </div>
            </div>

            {isHighRisk === 99 && ( // {projectRisk === "High" && (
              <div className="bg-red-50/50 border border-red-200 rounded-lg p-6 mt-6">
                <p className="text-sm leading-relaxed text-slate-900">
                  Based on the current evaluation, the engagement presents a combination of risk factors requiring resolution prior to approval. 
                  The PVIII may be saved and retained as a pending; however, it will not be routed for approval until the applicable conditions 
                  have been addressed.
                  
                  {/*Based on the evaluation of the engagement leadership and
                  applicable regulations, this project has been classified as{" "}
                  <span className="font-semibold text-red-700">High Risk</span>{" "}
                  and will require additional documentation from the Lead
                  Partner.*/}
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            icon={Building2}
            title="Entity &amp; Regulatory Profile"
            iconColor="from-[#00266A] to-[#00338D]"
            defaultCollapsed={true}
          >
            {requiredStepsCompleted ?
            <div className="space-y-0">
                          <AttributeRow
                              label="Public Interest Entity"
                              value={qualityData?.isPublicEntity ? "Yes" : "No"}
                          />

                          <AttributeRow
                              label="Regulated Entity"
                              value={qualityData?.isRegulatedEntity ? "Yes" : "No"}
                          />

                          <AttributeRow
                              label="Listed Entity in Mexico"
                              value={qualityData?.isListedEntity ? "Yes" : "No"}
                          />

                          <AttributeRow
                              label="Substantial role in accordance with group audit instructions"
                              value={qualityData?.isReportGroup ? "Yes" : "No"}
                          />

                          <AttributeRow
                              label="SEC FPI"
                              value={qualityData?.isSecAffiliate ? "Yes" : "No"}
                          />

                          <AttributeRow
                              label="SEC Subsidiary"
                              value={qualityData?.isSignificantSecSubsidiary ? "Yes" : "No"}
                          />
                          <AttributeRow
                              label="Local or Referred"
                              value={localOrReferredLabel}
                          />
            </div>: <div></div>}
          </SectionCard>

          
                  <SectionCard
                      icon={FileCheck}
                      title="Audit & Engagement Characteristics"
                      iconColor="from-[#1E49E2] to-[#00338D]"
                      defaultCollapsed={true}
                  >
                      <div className="space-y-0">

                          {hasLSQCR && requiredStepsCompleted && (
                              <>
                                  <AttributeRow label="LSQCR" value="Yes" />

                                  <AttributeRow
                                      label="LSQCR Reviewer"
                                      value={
                                          [...new Set(
                                              lsqcrEntities
                                                  .map(e => e.lsqcrReviewerName)
                                                  .filter(Boolean)
                                          )].join(", ") || "Not specified"
                                      }
                                  />

                                  <AttributeRow
                                      label="LSQCR Report Type"
                                      value={
                                          [...new Set(
                                              lsqcrEntities.map(e => e.reportTypeLabel)
                                          )].join(", ")
                                      }
                                  />
                              </>
                          )}

                          {hasEQCR && (
                              <>
                                  <AttributeRow label="EQCR" value="Yes" />

                                  <AttributeRow
                                      label="EQCR Reviewer"
                                      value={
                                          [...new Set(
                                              eqcrEntities
                                                  .map(e => e.eqcrreviewer)
                                                  .filter(Boolean)
                                          )].join(", ") || "Not specified"
                                      }
                                  />

                                  <AttributeRow
                                      label="EQCR Report Type"
                                      value={
                                          [...new Set(
                                              eqcrEntities.map(e => e.reportTypeLabel)
                                          )].join(", ")
                                      }
                                  />
                              </>
                          )}

                          <AttributeRow
                              label="Nature of work"
                              value={requiredStepsCompleted ? natureOfWork : ""}
                              
                          />

                      </div>
                  </SectionCard>
          
          { totatalFlags > 0 && 
          (          
            <SectionCard
              icon={AlertCircle}
              title="Financial Risk Exceptions"
              iconColor="from-red-500 to-red-600"
              defaultCollapsed={false}
            >
              <div className="p-6 space-y-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden"
                      >
                        <div
                          className={`px-4 py-3 flex items-center justify-between ${"bg-red-50 border-b border-red-100"}`}
                        >
                          <div className="flex items-center gap-2" >
                            <div className={`w-2 h-2 rounded-full ${"bg-red-500"}`} />
                            <span className={`text-xs font-semibold capitalize tracking-wider ${"text-red-700"}`} >
                              Audit Rules
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">
                            This project does not meet one or more financial business rules.
                          </h4>
                          <p className="text-sm text-slate-700">
                            Additional documentation or approval will be required.
                          </p>
                        </div>
                      </motion.div>
                    </div>
              
            </SectionCard>            
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border-2 border-[#00338D]/20 shadow-[0_4px_24px_rgba(0,51,141,0.12)] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#00266A] to-[#1E49E2] px-8 py-5 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-white">Confirmation</h2>
            </div>

            <div className="p-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-[#00338D] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-normal text-[#0C233C] tracking-[0.02em]">
                    I confirm that I have reviewed all relevant data elements
                    (RDE) listed above and that the information is{" "}
                    <span className="font-semibold text-[#00338D] tracking-[0.02em]">
                      complete
                    </span>
                    ,{" "}
                    <span className="font-semibold text-[#00338D] tracking-[0.02em]">
                      accurate
                    </span>
                    , and correctly reflects the engagement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-[#00338D] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-normal text-[#0C233C] tracking-[0.02em]">
                    I confirm that I have reviewed all relevant data elements
                    (RDE) related to the engagement and the assigned
                    manager/director, which are correct and sufficient to carry
                    out adequate planning of the resources assigned to the
                    project referred to in this PVIII.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-[#00338D] flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-normal text-[#0C233C] tracking-[0.02em]">
                    I confirm that I have analyzed the reasonableness of the
                    resource plan considering changes in regulations, new
                    regulations, changes in the client's structure or reporting,
                    changes in the responsible team, and any other changes that
                    occurred between the prior fiscal year (PFY) and current
                    fiscal year (CFY). I confirm that the planned hours are
                    reasonable for the CFY and that the assigned personnel are
                    sufficient to support quality. Any subsequent changes will
                    be documented and approved in this PVIII when they occur.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>      
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-between pt-6"
          >
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-4">
              <Button
                onClick={handleConfirmAndSubmit}
                              disabled={!step7Valuation || !requiredStepsCompleted || isSubmitting}
                className={`min-w-[220px] shadow-lg transition-all duration-300 
                 
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm &amp; Submit
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
