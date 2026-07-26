import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {
    ArrowLeft,
    CheckCircle,
    Building2,
    Shield,
    AlertCircle,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Users,
    FileCheck,
    Info,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { approvalsApi } from "../../Api/useVwApprovals";


const calculateYoYChange = (cy: number, py: number | null) => {
    if (py === null || py === 0) return null;
    const absolute = cy - py;
    const percentage = ((cy - py) / py) * 100;
    return { absolute, percentage };
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

    const formatValue = (val: number) => {
        if (format === "currency") return `$${Math.round(val).toLocaleString()}`;
        if (format === "percentage") return `${Math.round(val)}%`;
        return Math.round(val).toLocaleString();
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

                            <span className={`text-xs font-medium ${simpleColor}`}>
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

function MetricRow({ label, value, emphasized, formula, showFormula }: MetricRowProps) {
    return (
        <div
            className={`flex items-start justify-between py-3 px-4 rounded-lg hover:bg-slate-50/50 transition-colors ${emphasized ? "bg-[#00338d]/5" : ""
                }`}
        >
            <div className="flex-1">
                <span
                    className={`text-sm ${emphasized ? "font-semibold text-[#00338d]" : "text-[#0C233C]/90"
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
                className={`text-sm ${emphasized ? "font-bold text-[#00338D] text-lg" : "font-semibold text-[#0C233C]"
                    } ml-4`}
            >
                {typeof value === "number" ? `$${value.toLocaleString()}` : value}
            </span>
        </div>
    );
}

interface AttributeRowProps {
    label: string;
    value: string;
}

function AttributeRow({ label, value }: AttributeRowProps) {
    return (
        <div className="flex items-start justify-between py-3 px-4 rounded-lg hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
            <span className="text-xs text-[#0C233C] capitalize tracking-wider">{label}</span>
            <span className="text-sm font-medium text-[#0C233C] tracking-[0.02em]">{value}</span>
        </div>
    );
}

interface SectionCardProps {
    icon: React.ElementType;
    title: string;
    iconColor: string;
    children: React.ReactNode;
    defaultCollapsed?: boolean;
}

function SectionCard({ icon: Icon, title, iconColor, children, defaultCollapsed = false }: SectionCardProps) {
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
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-lg font-medium text-white tracking-[0.03em]">{title}</h2>
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

type ApprovalNavState = {
    requiresAdditionalReview?: boolean; 
    role?: "lead-partner" | "bu-leader" | "hofa" | "buppp";
};


export default function ApprovalDetail() {
    const [documentationList, setDocumentationList] = useState<any[]>([]);
    const [approvalStatus, setApprovalStatus] = useState<any[]>([]);

    const [serviceLinesCatalog, setServiceLinesCatalog] = useState<any[]>([]);
    const [showReturnToReviewModal, setShowReturnToReviewModal] = useState(false);//para modal de reject
    //Este metodo es para abrir el modal y asi se pueda confirmar el reject de la P8
    const confirmReturnToReview = async () => {

        if (userRole !== "bu-leader") return;

        try {
            setSaving(true);

            await approvalsApi.ReturnToReview(id!, {
                role: roleMap[userRole],
                additionalComments: confirmComments
            });

            navigate("/approvals");
        } catch (error) {
            console.error("Error returning to review", error);
        } finally {
            setSaving(false);
            setShowReturnToReviewModal(false);
        }
    };
    

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const data = await approvalsApi.listServiceLines();
                setServiceLinesCatalog(data);
            } catch (error) {
                console.error("Error loading service lines catalog", error);
            }
        };

        fetchCatalog();
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const [apiData, setApiData] = useState<any>(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const data = await approvalsApi.getById(id);
                setApiData(data);
            } catch (error) {
                console.error("Error fetching detail", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [id]);

    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
    const [reviewData, setReviewData] = useState<any>(null);
    const [loadingReview, setLoadingReview] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchReview = async () => {
            try {
                const data = await approvalsApi.getByIdReview(id);
                setReviewData(Array.isArray(data) ? data[0] : data);
            } catch (error) {
                console.error("Error fetching review data", error);
            } finally {
                setLoadingReview(false);
            }
        };

        fetchReview();
    }, [id]);
    const review = reviewData
        ? {
            partner: reviewData.currentEngagementPartnerName,
            manager: reviewData.currentEngagementManagerName,

            accountingFrameworks: reviewData.accountingFrameworks,
            auditingStandards: reviewData.auditingStandards,
            industry: reviewData.industry,

            reviewerType: reviewData.reviewerTypeLabel,
            reportType: reviewData.reportType,
            natureOfWork: reviewData.natureOfEngagementLabel,

            preliminaryRiskAssessment: reviewData.isHighRisk === 1 ? "High" : "Low",

            entityAndRegulatory: {
                publicInterestEntity: reviewData.isPublicEntity ? "Yes" : "No",
                regulatedEntity: reviewData.isRegulatedEntity ? "Yes" : "No",
                listedEntity: reviewData.isListedEntity ? "Yes" : "No",
                secSubsidiaryAffiliate: reviewData.isSubstantialRoleGrp ? "Yes" : "No",
                subsidiaryOfListedNonSec: reviewData.isSecAffiliate ? "Yes" : "No",
                significantSubsidiary: reviewData.isSignificantSecSubsidiary ? "Yes" : "No",
                localOrReferred: reviewData.localReferedLabel,
            },
        }
        : null;

    const [validationData, setValidationData] = useState<any>(null);

    useEffect(() => {
        if (!apiData) return
        const fetchValidation = async () => {
            try {
                const rows = await approvalsApi.list();
                if (!rows || rows.length === 0) {
                    console.warn("⚠️ List vacío, usando fallback");
                }

                let selected = rows?.find(
                    r => String(r.p8Id).trim().toLowerCase() === String(id).trim().toLowerCase()
                );
                if (!selected && apiData) {
                    selected = {
                        p8Id: id,
                        p8revenueTypeLabel:
                            apiData.revenueType ??
                            apiData.engagementDetails?.incomeType ??
                            "N/A"
                    };
                }
                setValidationData(selected);
            } catch (error) {
                console.error("Error loading validation data", error);
            }
        };

        fetchValidation();
    }, [id, apiData]);
    const revenueType =
        validationData?.p8revenueTypeLabel ||
        apiData?.revenueType ||
        apiData?.engagementDetails?.incomeType ||
        "N/A";
    useEffect(() => {
        if (!id || currentStep !== 3) return;

        const fetchDocumentation = async () => {
            try {
                const data = await approvalsApi.GetDocumentation(id);
                setDocumentationList(data);
                const leadDoc = data.find(x =>
                    x.competenceDocumentation ||
                    x.capabilitiesDocumentation ||
                    x.financialRiskDocumentation ||
                    x.othersDocumentation
                );

                if (leadDoc) {
                    setDocCompetence(leadDoc.competenceDocumentation ?? "");
                    setDocCapabilities(leadDoc.capabilitiesDocumentation ?? "");
                    setDocFinancialRisk(leadDoc.financialRiskDocumentation ?? "");
                    setDocOthers(leadDoc.othersDocumentation ?? "");
                    setConfirmComments(leadDoc.additionalComments ?? "");
                }

            } catch (error) {
                console.error("Error loading documentation", error);
            }
        };

        fetchDocumentation();
    }, [id, currentStep]);
    const [showFormulas, setShowFormulas] = useState(false);
    const [exceptionsDrawerOpen, setExceptionsDrawerOpen] = useState(false);
    const [feesAsProposedExpanded, setFeesAsProposedExpanded] = useState(true);
    const [standardAuditFeesExpanded, setStandardAuditFeesExpanded] = useState(true);
    const [specialistsExpanded, setSpecialistsExpanded] = useState(true);
    const [netIncomeExpanded, setNetIncomeExpanded] = useState(true);

const standardAuditFeesByRole = useMemo(() => {
    if (!apiData?.valuationBreakdown) return [];
    const map = new Map<
      string,
      { role: string; hours: number; standardFees: number }
    >();
    apiData.valuationBreakdown.forEach((s: any) => { 
      const key = s.levelLabel;
      if (!map.has(key)) {
        map.set(key, { role: key, hours: 0, standardFees: 0 });
      }
      const entry = map.get(key)!;
      entry.hours += s.hours || 0; 
      entry.standardFees += s.fees || 0; 
    });
    return Array.from(map.values());
  }, [apiData]);
    const IMPULSA_RATE = 0.05;
    const IMPULSA_HOURLY_RATE = 325;
    type FeesTotals = { totalHours: number; totalFees: number };
    const calculateImpulsa = (baseHours: number) => {
        const hours = baseHours * IMPULSA_RATE;
        const fees = Math.round(hours) * Math.round(IMPULSA_HOURLY_RATE);
        return { hours, fees };
    };
    const calculateStandardAuditFeesSubtotal = (
  roles: Array<{ hours: number; standardFees: number }>
): FeesTotals => {
  const totalHours = roles.reduce((sum, r) => sum + (r.hours || 0), 0);
  const totalFees = roles.reduce((sum, r) => sum + (r.standardFees || 0), 0);
  return { totalHours, totalFees };
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
      const standardAuditFeesSubtotal = useMemo(() => {
        return calculateStandardAuditFeesSubtotal(standardAuditFeesByRole);
      }, [standardAuditFeesByRole]);
      const impulsa = useMemo(() => {
        return calculateImpulsa(standardAuditFeesSubtotal.totalHours);
      }, [standardAuditFeesSubtotal.totalHours]);
      const standardAuditFeesTotals = useMemo(() => {
        return calculateStandardAuditFeesTotal(standardAuditFeesSubtotal, impulsa);
      }, [standardAuditFeesSubtotal, impulsa]);

      
    const [docCompetence, setDocCompetence] = useState("");
    const [docCapabilities, setDocCapabilities] = useState("");
    const [docFinancialRisk, setDocFinancialRisk] = useState("");
    const [docOthers, setDocOthers] = useState("");

    const [reviewerDocCompetence, setReviewerDocCompetence] = useState("");
    const [reviewerDocCapabilities, setReviewerDocCapabilities] = useState("");
    const [reviewerDocFinancialRisk, setReviewerDocFinancialRisk] = useState("");

    const data = {
        client: apiData?.clientName ?? "",
        partner: apiData?.createProject?.partnerName ?? "",
        manager: apiData?.createProject?.srManagerName ?? "",
        projectType:
            apiData?.revenueType ??
            apiData?.engagementDetails?.incomeType ??
            "N/A",

        fiscalYear:
            apiData?.fiscalYear ??
            apiData?.engagementDetails?.auditYear ??
            "N/A",

        valuation: {
            pastYear: {

                auditHours: apiData?.lastYearMetrics?.auditHours ?? 0,
                netAuditIncome: apiData?.lastYearMetrics?.netAuditRevenue ?? 0,
                projectValuation: (apiData?.lastYearMetrics?.valuation ?? 0) * 100,

                avgAuditRate: apiData?.lastYearMetrics?.averageFee ?? 0,
            },
            current: {
                auditHours: apiData?.valuation?.standardAuditHours ?? 0,
                netAuditIncome: apiData?.valuation?.netAuditIncome ?? 0,
                projectValuation: apiData?.valuation?.valuation ?? 0,
                avgAuditRate: apiData?.valuation?.averageAuditFee ?? 0,
            },
            feesAsProposed: {
                auditFees: apiData?.valuation?.auditRevenue ?? 0,
                reportFees: apiData?.valuation?.reportRevenue ?? 0,
                taxFees: apiData?.valuation?.taxRevenue ?? 0,
                totalFeesProposed:
                    (apiData?.valuation?.auditRevenue ?? 0) +
                    (apiData?.valuation?.reportRevenue ?? 0) +
                    (apiData?.valuation?.taxRevenue ?? 0),
                technologyRecoveryCostRate: 0.035,
            },
            standardAuditFees: {
                roles:
                    apiData?.valuationBreakdown?.map((x: any) => ({
                        role: x.levelLabel,
                        hours: Math.round(x.hours),
                        standardFees: Math.round(x.fees),
                    })) ?? [],
            },
            specialists: {
                netFees:
                    apiData?.specialists?.reduce(
                        (sum: number, s: any) => sum + (s.agreedFeesAmount ?? 0),
                        0
                    ) ?? 0,
               
                breakdown:
                    Object.values(
                        (apiData?.specialists ?? []).reduce((acc: any, s: any) => {
                            const key = s.serviceLineLabel;

                            if (!acc[key]) {
                                const match = serviceLinesCatalog.find(
                                    (c: any) => c.serviceLineLabel === key
                                );

                                acc[key] = {
                                    serviceLine: key, 
                                    function: match?.serviceLineGroup ?? match?.functionLabel ?? "", // ✅ subtítulo
                                    fees: 0,
                                };
                            }

                            acc[key].fees += s.agreedFeesAmount || 0;

                            return acc;
                        }, {})
                    )
  
            },
            netIncome: {
                auditIncomeBase: apiData?.valuation?.auditRevenue ?? 0,
                expensesInitial: apiData?.valuation?.expenses ?? 0,
            },
        },

        preliminaryRiskAssessment:
            apiData?.proyectRisk?.preliminaryRiskProject === "medium"
                ? "Medium"
                : apiData?.proyectRisk?.preliminaryRiskProject === "high"
                    ? "High"
                    : "Low",

        leadershipRiskAssessment: "Low",


        exceptions:
            validationData?.isFinancialRisk === 1
                ? [{
                    id: "1",
                    severity: "high",
                    rule: "Additional documentation or approval is required.",
                    description: "Valuation below expected threshold"
                }]
                : [],
        entityAndRegulatory: {
            publicInterestEntity: apiData?.quality?.isPublicEntity ? "Yes" : "No",
            regulatedEntity: apiData?.quality?.isRegulatedEntity ? "Yes" : "No",
            listedEntity: apiData?.quality?.isListedEntity ? "Yes" : "No",
            secSubsidiaryAffiliate: apiData?.quality?.isSecAffiliate ? "Yes" : "No",
            subsidiaryOfListedNonSec: "No",
            significantSubsidiary:
                apiData?.quality?.isSignificantSecSubsidiary ? "Yes" : "No",
            secComponent: "No",
            substantialRole: "Yes",
            localOrReferred: "Local",
        },
    };
    const totalStandardAuditFees = data.valuation.standardAuditFees.roles.reduce(
        (sum, role) => sum + role.standardFees,
        0
    );

    const totalStandardAuditHours = data.valuation.standardAuditFees.roles.reduce(
        (sum, role) => sum + role.hours,
        0
    );

    const netIncomeAfterAdjustments =
        data.valuation.netIncome.auditIncomeBase -
        data.valuation.netIncome.expensesInitial;
    const pathname = location.pathname;

    const userRole: "lead-partner" | "bu-leader" | "hofa" | "buppp" =
        pathname.startsWith("/approvals/bu-leader/")
            ? "bu-leader"
            : pathname.startsWith("/approvals/hofa/")
                ? "hofa"
                : pathname.startsWith("/approvals/buppp/")
                    ? "buppp"
                    : "lead-partner";

    const isReviewerRole = userRole !== "lead-partner";

    const roleLabel =
        userRole === "lead-partner"
            ? "Lead Partner Approval"
            : userRole === "bu-leader"
                ? "BU Leader Approval"
                : userRole === "hofa"
                    ? "HofA Approval"
                    : "BUPPP Approval";
    const navState = (location.state as ApprovalNavState) ?? {};
    const approvalLevel = validationData?.approvalLevelId ?? 0;
    const isTwoStepWithComments = approvalLevel === 2;
    const requiresAdditionalReview =
        (validationData?.isHighRisk === 1) ||
        (validationData?.isFinancialRisk === 1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmComments, setConfirmComments] = useState("");
    const isHighRisk = validationData?.isHighRisk === 1;
    const hasFinancialRiskException = validationData?.isFinancialRisk === 1;
    const shouldShowStep3 =
        approvalLevel >= 2 ||
        validationData?.isHighRisk === 1 ||
        validationData?.isFinancialRisk === 1;

    const highRisk = validationData?.isHighRisk ?? 0; 
    const financialRisk = validationData?.isFinancialRisk ?? 0; 

    const showHighRiskSections = isHighRisk;
    const showFinancialRiskSection = hasFinancialRiskException;
    const showCommentSections = highRisk > 0; 
 
    const canProceedFromStep2 = () => true;

    const canProceedFromStep3 = () => {
        if (isReviewerRole) return true;

        if (showHighRiskSections) {
            if (!docCompetence.trim() || !docCapabilities.trim()) return false;
        }
        if (showFinancialRiskSection && !docFinancialRisk.trim()) return false;

        return true;
    };

    const finalStep: 2 | 3 = shouldShowStep3 ? 3 : 2;

    const canGoToStep = (target: 1 | 2 | 3) => {
        if (target === 3) {
            if (!shouldShowStep3) return false;
            return canProceedFromStep2();
        }
        if (target === 2) return true;
        return true;
    };

    const goToStep = (target: 1 | 2 | 3) => {
        if (!canGoToStep(target)) return;
        if (target === 3 && !shouldShowStep3) return;
        if (target > finalStep) return;
        setCurrentStep(target);
    };

    const handleBack = () => {
        if (currentStep === 3) setCurrentStep(2);
        else if (currentStep === 2) setCurrentStep(1);
        else navigate("/approvals");
    };

    const handleNext = () => {
        if (currentStep === 1) setCurrentStep(2);
        else if (currentStep === 2 && shouldShowStep3) {
            if (canProceedFromStep2()) setCurrentStep(3);
        }
    };
    const roleMap = {
        "lead-partner": "LEAP",
        "bu-leader": "BUPIC",
        "hofa": "HofA",
        "buppp": "BUPPP"
    };

    const payload = {
        role: roleMap[userRole],
        approve: true,
        documentation: {
            competenceDocumentation: isReviewerRole
                ? reviewerDocCompetence
                : docCompetence,
            capabilitiesDocumentation: isReviewerRole
                ? reviewerDocCapabilities
                : docCapabilities,
            financialRiskDocumentation: isReviewerRole
                ? reviewerDocFinancialRisk
                : docFinancialRisk,
            othersDocumentation: isReviewerRole
                ? ""
                : docOthers,
            additionalComments: confirmComments
        }
    };
    useEffect(() => {
        if (!id) return;

        const fetchApprovalStatus = async () => {
            try {
                const data = await approvalsApi.GetApprovalStatus(id);
                setApprovalStatus(data);
            } catch (error) {
                console.error("Error loading approval status", error);
            }
        };

        fetchApprovalStatus();
    }, [id]);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [hours, seHours] = useState(0); 
    const [cuota, setCuota] = useState(0); 

    

    const [valuations, setValuation] = useState(0); 
    const [office, setOffice] = useState(""); 
    const [isRegulatedEntity, setIsRegulatedEntity] = useState(false); 
    const [isListedEntity, setIsListedEntity] = useState(false); 
    const [netAuditIncome, setnetAuditIncome] = useState(0); 
    const [auditHoursPFY, setauditHoursPFY] = useState(0);

    useEffect(() => {
        if (!apiData) return;
        seHours(apiData.valuation?.standardAuditHours ?? 0);
        setCuota(apiData.valuation?.averageAuditFee ?? 0);
        setValuation(apiData.valuation?.valuation ?? 0); 
        setOffice(apiData.engagementDetails?.responsibleOfficeLabel ?? "");
        setIsRegulatedEntity(apiData.quality?.isRegulatedEntity ?? false);
        setIsListedEntity(apiData.quality?.isListedEntity ?? false);
        setnetAuditIncome(apiData.valuation?.netAuditIncome ?? 0);
        setauditHoursPFY(apiData.lastYearMetrics?.auditHours ?? 0);

        }, [apiData]);
    const newClient = useMemo(() => {
        return (auditHoursPFY ?? 0) === 0;
    }, [auditHoursPFY]);

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

    const PvsFHours = auditHoursPFY === null || auditHoursPFY === 0 ? null : ((Math.round(hours) - Math.round(auditHoursPFY)) / Math.round(auditHoursPFY)) * 100;

    const totatalFlags = revenueFlag + valuationFlag + AVRGFeeFlag + (!newClient && PvsFHours > -5.9 ? 1 : 0);

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

const standardAuditFeesExpandeds = useMemo(() => {
  if (!apiData?.valuationBreakdown) return [];

  const map = new Map<
    string,
    { role: string; hours: number; standardFees: number }
  >();

  apiData.valuationBreakdown.forEach((s: any) => {
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
}, [apiData]);


    const currentRole = roleMap[userRole];
    const hasApproved = approvalStatus.some((x: any) => {
        const level = String(x.approverLevel ?? x.ApproverLevel)?.toLowerCase();
        const approved = x.approved ?? x.Approved;

        return level === currentRole.toLowerCase() && approved === true;
    });
    const [saving, setSaving] = useState(false);
    const isBlocked = approvalLevel === 99 || hasApproved; 
    
    const canReturnToReview =
        currentStep === 3 &&
        ( userRole === "bu-leader");


    const canApprove = () => {
        if (isBlocked) return false;

        if (currentStep !== finalStep) return false;

        if (currentStep === 3 && !canProceedFromStep3()) return false;


        return true;
    };
    const performApproval = async () => {
        try {
            setSaving(true);

            const roleMap = {
                "lead-partner": "LEAP",
                "bu-leader": "BUPIC",
                "hofa": "HofA",
                "buppp": "BUPPP"
            };

            const payload = {
                role: roleMap[userRole],
                approve: true,
                documentation: {
                    competenceDocumentation: isReviewerRole
                        ? reviewerDocCompetence
                        : docCompetence,
                    capabilitiesDocumentation: isReviewerRole
                        ? reviewerDocCapabilities
                        : docCapabilities,
                    financialRiskDocumentation: isReviewerRole
                        ? reviewerDocFinancialRisk
                        : docFinancialRisk,
                    othersDocumentation: isReviewerRole ? "" : docOthers,
                    additionalComments: confirmComments
                }
            };

            await approvalsApi.SaveDocumentation(id!, payload);

            console.log("✅ OK");
            navigate("/approvals");

        } catch (error) {
            console.error("❌ Error", error);
        } finally {
            setSaving(false);
        }
    };
    

//     const handleReturnToReview = async () => {
//     try {
//         setSaving(true);

//         await approvalsApi.ReturnToReview(id!, {
//             role: roleMap[userRole]
//         });

//         navigate("/approvals");
//     } catch (error) {
//         console.error("Error returning to review", error);
//     } finally {
//         setSaving(false);
//     }
// };

    const handleApprove = () => {
        if (!canApprove()) return;
        if (currentStep === 3) {
            setShowConfirmModal(true);
            return;
        }
        performApproval();
    };

    const handleConfirmApproval = () => {
        setShowConfirmModal(false);
        performApproval();
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case "High":
                return "text-red-600 bg-red-50 border-red-200";
            case "Medium":
                return "text-[#E06D15]";
            case "Low":
                return "text-[#1DA44E]";
            default:
                return "text-slate-600 bg-slate-50 border-slate-200";
        }
    };
    if (loadingData) return <div>Cargando detalle...</div>;
    if (!apiData) return <div>No data</div>;
    const getRiskIcon = (risk: string) => {
        switch (risk) {
            case "High":
                return <AlertCircle className="w-5 h-5" />;
            case "Medium":
                return <TrendingUp className="w-5 h-5" />;
            case "Low":
                return <Shield className="w-5 h-5" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/30 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Building2 className="w-6 h-6 text-[#00338D]" />
                                <h1 className="text-lg font-normal text-[#00338D] tracking-[0.02em]">{data.client}</h1>
                            </div>
                            <p className="text-xs text-slate-600 tracking-[0.02em]">
                                {roleLabel} • {validationData?.p8FiscalYearLabel ?? data.fiscalYear} • {revenueType} </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => goToStep(1)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 1 ? "bg-[#00266A] text-white" : "bg-[#E5E5E5] text-slate-600 hover:bg-slate-300/70"
                                    }`}
                            >
                                <span className="text-sm font-medium">Step 1</span>
                                <span className="text-xs">Valuation</span>
                            </button>

                            <div className="w-8 h-px bg-slate-300" />

                            <button
                                type="button"
                                onClick={() => goToStep(2)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 2 ? "bg-[#00266A] text-white" : "bg-[#E5E5E5] text-slate-600 hover:bg-slate-300/70"
                                    }`}
                            >
                                <span className="text-sm font-medium">Step 2</span>
                                <span className="text-xs">Review &amp; Approval</span>
                            </button>

                            {shouldShowStep3 && (
                                <>
                                    <div className="w-8 h-px bg-slate-300" />
                                    <button
                                        type="button"
                                        onClick={() => goToStep(3)}
                                        disabled={!canGoToStep(3)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentStep === 3
                                                ? "bg-[#00266A] text-white"
                                                : canGoToStep(3)
                                                    ? "bg-[#E5E5E5] text-slate-600 hover:bg-slate-300/70"
                                                    : "bg-[#E5E5E5] text-slate-400 cursor-not-allowed opacity-60"
                                            }`}
                                        aria-disabled={!canGoToStep(3)}
                                    >
                                        <span className="text-sm font-medium">Step 3</span>
                                        <span className="text-xs">Documentation</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            

            <div className="max-w-[1440px] mx-auto px-8 py-10">
                {currentStep === 1 && (
                    <div className="space-y-8">
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
                                        onClick={() => setShowFormulas(!showFormulas)}
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
                            <KPICard title="Audit Hours" cy={data.valuation.current.auditHours} py={data.valuation.pastYear.auditHours} format="number" />
                            <KPICard title="Net Revenue" cy={data.valuation.current.netAuditIncome} py={data.valuation.pastYear.netAuditIncome} format="currency" />
                            <KPICard title="Valuation" cy={Math.round(data.valuation.current.projectValuation)} py={Math.round(data.valuation.pastYear.projectValuation)} format="percentage" />
                            <KPICard title="Average Fee" cy={data.valuation.current.avgAuditRate} py={data.valuation.pastYear.avgAuditRate} format="currency" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-[#00266A] to-[#00338D] px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-white tracking-[0.02em]">Valuation Metrics Breakdown</h2>
                                    {totatalFlags > 0 && (
                                        <button
                                            onClick={() => setExceptionsDrawerOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                                        >
                                            <AlertCircle className="w-4 h-4" />
                                            <span className="text-sm font-medium">Exceptions: {totatalFlags}</span>
                                            <div className="flex items-center gap-1 ml-1">
                                                {totatalFlags > 0 && <div className="w-2 h-2 rounded-full bg-red-400" title="High" />}
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setFeesAsProposedExpanded(!feesAsProposedExpanded)}
                                        className="
                      w-full flex items-center justify-between
                      px-6 py-4
                      bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                      hover:from-[#00338D] hover:to-[#00338D]
                      transition-all
                    "
                                    >
                                        <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">Fees as Proposed</h3>
                                        {feesAsProposedExpanded ? <ChevronDown className="w-5 h-5 text-white/80" /> : <ChevronRight className="w-5 h-5 text-white/80" />}
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
                                                    <MetricRow label="Audit Fees" value={data.valuation.feesAsProposed.auditFees} />
                                                    <MetricRow label="Report Fees" value={data.valuation.feesAsProposed.reportFees} />
                                                    <MetricRow label="Tax Fees" value={data.valuation.feesAsProposed.taxFees} />
                                                    <MetricRow label="Total Fees as Proposed" value={data.valuation.feesAsProposed.totalFeesProposed} emphasized />
                                                    <MetricRow
                                                        label="Technology Recovery Cost (3.5%)"
                                                        value={Math.round(data.valuation.feesAsProposed.totalFeesProposed * data.valuation.feesAsProposed.technologyRecoveryCostRate)}
                                                        formula={showFormulas ? "Total Fees as Proposed × 0.035" : undefined}
                                                        showFormula={showFormulas}
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setStandardAuditFeesExpanded(!standardAuditFeesExpanded)}
                                        className="
                      w-full flex items-center justify-between
                      px-6 py-4
                      bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                      hover:from-[#00338D] hover:to-[#00338D]
                      transition-all
                    "
                                    >
                                        <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">Standard Audit Fees (Breakdown)</h3>
                                        {standardAuditFeesExpanded ? <ChevronDown className="w-5 h-5 text-white/80" /> : <ChevronRight className="w-5 h-5 text-white/80" />}
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
                                                                    <th className="text-left px-4 py-3 font-semibold text-[#1E49E2]">Role / Category</th>
                                                                    <th className="text-right px-4 py-3 font-semibold text-[#1E49E2]">Hours</th>
                                                                    <th className="text-right px-4 py-3 font-semibold text-[#1E49E2]">Standard Fees</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {standardAuditFeesExpandeds.map((role, idx) => ( // by ñerik //{data.valuation.standardAuditFees.roles.map((role, idx) => (
                                                                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                                        <td className="px-4 py-3 text-slate-700">{role.role}</td>
                                                                        <td className="px-4 py-3 text-right text-slate-900 font-medium">{role.hours.toLocaleString()}</td>
                                                                        <td className="px-4 py-3 text-right text-slate-900 font-semibold">${role.standardFees.toLocaleString()}</td>
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
                                                                    <td className="px-4 py-3 text-right text-[#1E49E2]">{Math.round(standardAuditFeesTotals.totalHours).toLocaleString()}</td>
                                                                    <td className="px-4 py-3 text-right text-[#1E49E2]">${Math.round(standardAuditFeesTotals.totalFees).toLocaleString()}</td>
                                                                   
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {showFormulas && (
                                                        <div className="mt-4 space-y-2">
                                                            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded">
                                                                Project Valuation (%) = (Net Audit Income / Total Standard Fees) × 100
                                                            </div>
                                                            <div className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-2 rounded">
                                                                Average Audit Rate = Total Standard Fees / Total Hours
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
                                        onClick={() => setSpecialistsExpanded(!specialistsExpanded)}
                                        className="
                      w-full flex items-center justify-between
                      px-6 py-4
                      bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                      hover:from-[#00338D] hover:to-[#00338D]
                      transition-all
                    "
                                    >
                                        <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">Specialists</h3>
                                        {specialistsExpanded ? <ChevronDown className="w-5 h-5 text-white/80" /> : <ChevronRight className="w-5 h-5 text-white/80" />}
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
                                                <div className="px-6 py-4 space-y-4">
                                                    <MetricRow label="Specialists Net Fees" value={data.valuation.specialists.netFees} emphasized />

                                                    <div>
                                                        <div className="space-y-2">
                                                            {data.valuation.specialists.breakdown.map((item, idx) => (
                                                                <div key={idx} className="flex items-center justify-between py-2 px-4 rounded-lg bg-slate-50/50">
                                                                    <div className="flex-1">
                                                                        <p className="text-sm text-slate-700">{item.serviceLine}</p>
                                                                        <p className="text-xs text-slate-500">{item.function}</p>
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-slate-900">${item.fees.toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="border border-slate-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setNetIncomeExpanded(!netIncomeExpanded)}
                                        className="
                      w-full flex items-center justify-between
                      px-6 py-4
                      bg-gradient-to-r from-[#00338D] to-[#1E49E2]
                      hover:from-[#00338D] hover:to-[#00338D]
                      transition-all
                    "
                                    >
                                        <h3 className="text-[14px] font-normal tracking-[0.04em] text-white">Average Fee</h3>
                                        {netIncomeExpanded ? <ChevronDown className="w-5 h-5 text-white/80" /> : <ChevronRight className="w-5 h-5 text-white/80" />}
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
                                                    <MetricRow label="Audit Income" 
                                                    value={apiData?.valuation?.netAuditIncome + apiData?.valuation?.specialistsRevenue+impulsa.fees}                                                    /*value={data.valuation.netIncome.auditIncomeBase}*/
                                                    />

                                                    <div className="flex items-start justify-between py-3 px-4 rounded-lg hover:bg-slate-50/50 transition-colors">
                                                        <span className="text-sm text-slate-700">Expenses</span>
                                                        <span className="text-sm font-semibold text-slate-900 ml-4">
                                                            ${data.valuation.netIncome.expensesInitial.toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <MetricRow
                                                        label="Net Audit Income Total"
                                                        value={apiData?.valuation?.netAuditIncome} 
                                                        emphasized
                                                        formula={showFormulas ? "Audit Income - Expenses" : undefined}
                                                        showFormula={showFormulas}
                                                    />
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
                            <Button variant="outline" onClick={handleBack} className="border-slate-300 text-slate-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Approvals
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 shadow-lg shadow-blue-500/30"
                            >
                                Continue to Review &amp; Approval
                                <ArrowLeft className="w-4 h-4 rotate-180 ml-2" />
                            </Button>
                        </motion.div>
                    </div>
                )}

                {currentStep === 2 && (
                    <>
                        {loadingReview ? (
                            <div>Cargando review...</div>
                        ) : !review ? (
                            <div>No review data</div>
                        ) : (

                            <div className="space-y-8">
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
                                        These fields are Relevant Data Elements (RDE) for the Quality Management System (ISQM 1 and QC 1000).
                                    </p>
                                </motion.div>

                                <SectionCard icon={Shield} title="Project Risk Assessment" iconColor="from-[#00266A] to-[#1E49E2]" defaultCollapsed={false}>

                                    {review.preliminaryRiskAssessment === "High" && (
                                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
                                            <span className="text-sm font-normal text-[#0C233C]/80 tracking-wider">Project Risk Level:</span>
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold ${getRiskColor(review.preliminaryRiskAssessment)} border-2`}>
                                                {getRiskIcon(review.preliminaryRiskAssessment)}
                                                {review.preliminaryRiskAssessment} Risk
                                            </span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-light text-[#0C233C] capitalize tracking-wider">Engagement Leader</p>
                                            <p className="text-sm font-medium text-[#0C233C] tracking-[0.02em]">{review.partner}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-light text-[#0C233C] capitalize tracking-wider">Engagement Manager</p>
                                            <p className="text-sm font-medium text-[#0C233C] tracking-[0.02em]">{review.manager}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-light text-[#0C233C] capitalize tracking-wider">Financial Reporting Standards</p>
                                            <p>{review.accountingFrameworks}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-light text-[#0C233C] capitalize tracking-wider">Auditing Standards</p>
                                            <p>{review.auditingStandards}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <p className="text-xs font-light text-[#0C233C] capitalize tracking-wider">Industry</p>
                                            <p>{review.industry}</p>
                                        </div>


                                    </div>

                                    {review.preliminaryRiskAssessment === "High" && (
                                        <div className="bg-red-50/50 border border-red-200 rounded-lg p-6 mt-6">
                                            <p className="text-sm font-light leading-relaxed text-slate-900">
                                                Based on the evaluation of the engagement leadership, applicable regulations, and industry risk, this project has been classified as <span className="font-semibold text-red-700">High Risk</span> and will require additional documentation from the Lead Partner.
                                            </p>
                                        </div>
                                    )}

                                </SectionCard>

                                <SectionCard icon={Building2} title="Entity &amp; Regulatory Profile" iconColor="from-[#00338D] to-[#1E49E2]" defaultCollapsed={true}>
                                    <div className="space-y-0">
                                        <AttributeRow label="Public Interest Entity" value={review.entityAndRegulatory.publicInterestEntity} />
                                        <AttributeRow label="Regulated Entity" value={review.entityAndRegulatory.regulatedEntity} />
                                        <AttributeRow label="Listed Entity in Mexico" value={review.entityAndRegulatory.listedEntity} />
                                        <AttributeRow
                                            label="Substancial role in accordance with group audit instructions"
                                            value={review.entityAndRegulatory.secSubsidiaryAffiliate}
                                        />
                                        <AttributeRow label="SEC FPI" value={review.entityAndRegulatory.subsidiaryOfListedNonSec} />
                                        <AttributeRow label="SEC Subsidiary" value={review.entityAndRegulatory.significantSubsidiary} />
                                        <AttributeRow label="Local or Referred" value={review.entityAndRegulatory.localOrReferred} />
                                    </div>
                                </SectionCard>

                                <SectionCard icon={FileCheck} title="Audit & Engagement Characteristics" iconColor="from-[#1E49E2] to-[#00338D]">
                                    <AttributeRow label="Reviewer type" value={review.reviewerType} />
                                    <AttributeRow label="Report type" value={review.reportType} />
                                    <AttributeRow label="Nature of work" value={review.natureOfWork} />
                                </SectionCard>

                                {totatalFlags > 0 && (
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
                                                            Additional documentation or approval is required.
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
                                        <h2 className="text-lg font-semibold text-white tracking-[0.2em] ">
                                            Confirmation
                                        </h2>
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
                                                    I confirm that I have reviewed all relevant
                                                    data elements (RDE) listed above and that
                                                    the information is{" "}
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
                                                <p className="text-sm font-normal text-[##0C233C] tracking-[0.02em]">
                                                    I confirm that I have reviewed all relevant
                                                    data elements (RDE) related to the
                                                    engagement and the assigned
                                                    manager/director, which are correct and
                                                    sufficient to carry out adequate planning of
                                                    the resources assigned to the project
                                                    referred to in this PVIII.
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
                                                <p className="text-sm font-normal text-[##0C233C] tracking-[0.02em]">
                                                    I confirm that I have analyzed the
                                                    reasonableness of the resource plan
                                                    considering changes in regulations, new
                                                    regulations, changes in the client's
                                                    structure or reporting, changes in the
                                                    responsible team, and any other changes that
                                                    occurred between the prior fiscal year (PFY)
                                                    and current fiscal year (CFY). I confirm
                                                    that the planned hours are reasonable for
                                                    the CFY and that the assigned personnel are
                                                    sufficient to support quality. Any
                                                    subsequent changes will be documented and
                                                    approved in this PVIII when they occur.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                                    <Button variant="outline" onClick={handleBack} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Valuation
                                    </Button>

                                    {shouldShowStep3 ? (
                                        <Button onClick={handleNext}>
                                            Continue to Documentation
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleApprove}
                                            disabled={
                                                isBlocked ||
                                                (!confirmComments.trim() && isTwoStepWithComments)
                                            }
                                        >
                                            Approve
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
                
                {currentStep === 3 && shouldShowStep3 && (
                    <div className="space-y-8">
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
                                Additional Documentation
                            </h1>

                        </motion.div>

                        {showCommentSections && (
                            <>
                                {/* Competence */}
                                <SectionCard icon={Shield} title="Competence" iconColor="from-[#00266A] to-[#1E49E2]" defaultCollapsed={false}>
                                    <div className="space-y-4">
                                        {!isReviewerRole && (
                                        <p className="text-sm text-slate-600">
                                            Document the professional qualifications, certifications, and relevant experience of the engagement team that demonstrate their competence to handle this high-risk engagement.
                                        </p>
                                        )}

                                        {isReviewerRole && (
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Users className="w-4 h-4 text-[#00338D]" />
                                                    <label className="block text-sm font-semibold text-slate-900">Lead Partner Documentation</label>
                                                </div>
                                                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                    {documentationList
                                                        .filter(x => x.competenceDocumentation)
                                                        .map((doc, i) => (
                                                            <div key={i} className="mb-2 border-b pb-2">
                                                                <p className="text-sm">
                                                                    {doc.competenceDocumentation}
                                                                </p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {userRole === "lead-partner" && (
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-900 mb-3">
                                                    Competence Justification <span className="text-red-600 ml-1">*</span>
                                                </label>
                                                <Textarea
                                                    value={docCompetence}
                                                    onChange={(e) => setDocCompetence(e.target.value)}
                                                    placeholder="El LAEP/ lead manager asignado al proyecto debe tener el perfil profesional adecuado, de acuerdo con lo establecido en el Role Profile. Detallar como cumple con las competencias profesionales en relación a su desempeño de acuerdo con su evaluación “5 Point Scale” en Open PD o Non compliant en QPR...."
                                                    className="min-h-[140px] border-slate-300 focus:border-[#00338D] focus:ring-[#00338D]/20 bg-white"
                                                />
                                                {!docCompetence.trim() && (
                                                    <p className="text-xs text-red-600 mt-2">This documentation is required before approval can be granted.</p>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </SectionCard>

                                <SectionCard icon={Users} title="Capabilities" iconColor="from-[#00266A] to-[#1E49E2]" defaultCollapsed={false}>
                                    <div className="space-y-4">
                                        {!isReviewerRole && (
                                        <p className="text-sm text-slate-600">
                                            Document the specific skills, resources, and infrastructure available to the engagement team that enable them to deliver quality work on this high-risk engagement.
                                        </p>
                                        )}

                                        {isReviewerRole && (
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Users className="w-4 h-4 text-[#00338D]" />
                                                    <label className="block text-sm font-semibold text-slate-900">Lead Partner Documentation</label>
                                                </div>
                                                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                    {documentationList
                                                        .filter(x => x.capabilitiesDocumentation)
                                                        .map((doc, i) => (
                                                            <div key={i} className="mb-2 border-b pb-2">
                                                                <p className="text-sm">
                                                                    {doc.capabilitiesDocumentation}
                                                                </p>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {userRole === "lead-partner" && (
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-900 mb-3">
                                                    Capabilities Justification <span className="text-red-600 ml-1">*</span>
                                                </label>
                                                <Textarea
                                                    value={docCapabilities}
                                                    onChange={(e) => setDocCapabilities(e.target.value)}
                                                    placeholder="Explicar cómo el LAEP/ lead manager asignado cumplió oportunamente con los cursos necesarios para el proyecto de acuerdo con la Política de Entrenamiento vigente. Esta explicación deberá ser consistente con lo documentado en el proceso de CEAC con relación al AoTE...."
                                                    className="min-h-[140px] border-slate-300 focus:border-[#00338D] focus:ring-[#00338D]/20 bg-white"
                                                />
                                                {!docCapabilities.trim() && (
                                                    <p className="text-xs text-red-600 mt-2">This documentation is required before approval can be granted.</p>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </SectionCard>

                                <SectionCard
                                    icon={FileCheck}
                                    title="Others"
                                    iconColor="from-[#00266A] to-[#1E49E2]"
                                    defaultCollapsed={false}
                                    >
                                    <div className="space-y-4">
                                        {isReviewerRole && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                            <Users className="w-4 h-4 text-[#00338D]" />
                                            <label className="block text-sm font-semibold text-slate-900">
                                                Lead Partner Documentation
                                            </label>
                                            </div>

                                            {documentationList.some((x) => x.othersDocumentation) ? (
                                            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {documentationList
                                                .filter((x) => x.othersDocumentation)
                                                .map((doc, i) => (
                                                    <div key={i} className="mb-2 border-b pb-2 last:border-b-0 last:pb-0">
                                                    <p className="text-sm">{doc.othersDocumentation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            ) : (
                                            <p className="text-sm text-slate-500">No documentation provided yet.</p>
                                            )}
                                        </div>
                                        )}

                                        {userRole === "lead-partner" && (
                                        <div>
                                            <Textarea
                                            value={docOthers}
                                            onChange={(e) => setDocOthers(e.target.value)}
                                            placeholder="Detallar otras salvaguardas que consideren incluir en el proyecto, por ejemplo: 2LoD, Reducción de workload, etc."
                                            className="min-h-[140px] border-slate-300 focus:border-[#00338D] focus:ring-[#00338D]/20 bg-white"
                                            />
                                        </div>
                                        )}
                                    </div>
                                    </SectionCard>
                            </>
                        )}
                        {showFinancialRiskSection && (                        
                            <SectionCard icon={AlertCircle} title="Financial Risk" iconColor="from-red-500 to-red-600" defaultCollapsed={false}>
                                <div className="space-y-4">
                                    {!isReviewerRole && (
                                    <p className="text-sm text-slate-600">
                                    </p>
                                    )}

                                    

                                    {isReviewerRole && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Users className="w-4 h-4 text-[#00338D]" />
                                                <label className="block text-sm font-semibold text-slate-900">Lead Partner Documentation</label>
                                            </div>
                                            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {documentationList
                                                    .filter(x => x.financialRiskDocumentation)
                                                    .map((doc, i) => (
                                                        <div key={i} className="mb-2 border-b pb-2">
                                                            <p className="text-sm">
                                                                {doc.financialRiskDocumentation}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {userRole === "lead-partner" && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 mb-3">
                                                Financial Risk Justification <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <Textarea
                                                value={docFinancialRisk}
                                                onChange={(e) => setDocFinancialRisk(e.target.value)}
                                                placeholder="Provide detailed justification for accepting this engagement despite financial risk exceptions. Include strategic considerations, client relationship factors, market positioning, expected future value, compensating controls, or other business rationale..."
                                                className="min-h-[140px] border-slate-300 focus:border-[#00338D] focus:ring-[#00338D]/20 bg-white"
                                            />
                                            {!docFinancialRisk.trim() && (
                                                <p className="text-xs text-red-600 mt-2">This documentation is required before approval can be granted.</p>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </SectionCard>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="flex items-center justify-between pt-6 border-t border-slate-200"
                        >
                            <Button variant="outline" onClick={handleBack} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                                <ArrowLeft className="w-4 h-4" />
                                Back to Review
                            </Button>

                            <div className="flex items-center gap-3">
                                {canReturnToReview  && (
                                    <Button
                                        variant="outline"
                                        // onClick={handleReturnToReview}

                                        onClick={() => setShowReturnToReviewModal(true)}//para abrir un modal de confirmacion esto igual que cuando se aprueba 
                                        
                                        disabled={saving|| isBlocked }
                                        // className="border-[#E06D15] text-[#E06D15] hover:bg-[#E06D15]/10"




                                        className="
    bg-white
    border border-[#00338D]
    text-[#00338D]
    hover:bg-white
    hover:text-[#00338D]
"

                                    >

                                        Return to Review
                                    </Button>
                                )}

                                <Button
                                    onClick={handleApprove}
                                    disabled={!canApprove() || isBlocked}
                                    className="bg-gradient-to-r from-[#00338D] to-[#00338D] hover:from-[#00338D] hover:to-[#1E49E2] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {isBlocked ? "Already Approved" : "Approve"}
                                </Button>
                            </div>



                        </motion.div>

                        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Approval</DialogTitle>
                                    <DialogDescription>
                                        You are about to approve this project. Please review your documentation and optionally add any final comments.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label htmlFor="confirm-comments" className="text-sm font-medium text-slate-700">
                                            Additional Comments (Optional)
                                        </label>
                                        <Textarea
                                            id="confirm-comments"
                                            placeholder="Add any final comments or observations..."
                                            value={confirmComments}
                                            onChange={(e) => setConfirmComments(e.target.value)}
                                            rows={4}
                                            className="resize-none"
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowConfirmModal(false)}
                                        className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmApproval}
                                        className="bg-gradient-to-r from-[#00338D] to-[#00338D] hover:from-[#00338D] hover:to-[#1E49E2]"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Confirm Approval
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {/*Modall para bton return to review*/}
                        <Dialog
                            open={showReturnToReviewModal}
                            onOpenChange={setShowReturnToReviewModal}
                        >
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Return to Review</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to return this engagement to the review stage?
                                    </DialogDescription>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <label htmlFor="confirm-comments" className="text-sm font-medium text-slate-700">
                                                Additional Comments (Optional)
                                            </label>
                                            <Textarea
                                                id="confirm-comments"
                                                placeholder="Add any final comments or observations..."
                                                value={confirmComments}
                                                onChange={(e) => setConfirmComments(e.target.value)}
                                                rows={4}
                                                className="resize-none"
                                            />
                                        </div>
                                    </div>
                                </DialogHeader>
                               
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowReturnToReviewModal(false)}
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        onClick={confirmReturnToReview}
                                        className="bg-gradient-to-r from-[#00338D] to-[#00338D] hover:from-[#00338D] hover:to-[#1E49E2]"
                                    >
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
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
                                    <h3 className="text-lg font-semibold text-white">Business Rule Exceptions</h3>
                                    <p className="text-sm text-blue-200 mt-1">
                                        {totatalFlags} exception{totatalFlags !== 1 ? "s" : ""} detected
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

              {newClient === false ? (valuations < 52
                        ? (
                          <div className="p-6 space-y-4">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border border-slate-200 rounded-xl overflow-hidden"
                            >
                              <div
                                className={`px-4 py-3 flex items-center justify-between ${
                                  valuations < 52
                                    ? "bg-red-50 border-b border-red-100"
                                    : null
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      valuations < 52
                                        ? "bg-red-500"
                                        : null
                                    }`}
                                  />
                                  <span
                                    className={`text-xs font-semibold capitalize tracking-wider ${
                                      valuations < 52
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
                  
            {!newClient && (PvsFHours > -5.9) ? (
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