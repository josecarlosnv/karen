import { useState, useMemo, useEffect } from "react";
import {
    Search,
    Filter,
    Send,
    AlertTriangle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Plus,
    Trash2,
    Eye,
    FileText,
    Building2,
    User,
    Briefcase,
    DollarSign,
    Calendar,
    Target,
    Users,
    Check,
} from "lucide-react";
import { StatusChip, StatusType } from "../components/StatusChip";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../components/ui/utils";
import { SpecialistCard } from "../components/SpecialistCard";
import { toast } from "sonner";
import { specialistApi } from "../Api/SpecialistApi";


type Function = "Tax" | "Advisory" ;

const SERVICE_LINES_BY_FUNCTION: Record<Function, string[]> = {
    Tax: [
        "AAS Digital Finance",
        "Accounting Advisory Services",
        "Acctng K M Training Solutions",
        "Actuaria Obligaciones",
        "Actuaria Seguros",
        "ASG",
        "CIO Advisory (CIO A)",
        "Consulting Nacional",
        "Corporate Finance M&A",
        "Corporate Finance Valuacion Activos Fijos",
        "Corporate Finance Valuacion Financiera",
        "Credit Risk",
        "CRM Solutions",
        "Cyber (CYB)",
        "Data & Analytics",
        "Deal Advisory Nacional",
        "Direccion Nacional RAS",
        "Due Dilligence",
        "Enterprise Solutions (ES)",
        "Financial Instruments Accounting & Valuation",
        "Financial Management",
        "Forensic Corporate Intelligence",
        "Forensic Linea Etica",
        "Forensic Litigation Services",
        "GRC",
        "HR & Talent Management (HR&TM)",
        "IARCS",
        "IARCS Sustentabilidad",
        "Infraestructura Financiero",
        "Integration & Separation",
        "Operational Risk",
        "Regulatory Services",
        "SAP Solutions",
        "Strategy",
        "Supply Chain & Operation",
        "Technology Risk Management"
    ],
    Advisory: [
        "CIA",
        "Corporate and Business Tax Services",
        "Global Compliance Management Services",
        "Global Mobility Services",
        "GMS Migratorio",
        "Impuestos Internacionales",
        "Juridico Corporativo",
        "Legal",
        "Social Security and Compensation Tax Services",
        "SST Legal-Laboral",
        "Tax Reimagined",
        "Tax Transformation",
        "Transfer Pricing"
    ],
};

const OFFICES = ["Mexico", "Guadalajara", "Monterrey"] as const;
type Office = typeof OFFICES[number];

const CATEGORIES = [
    "Partner / Director",
    "Senior Manager / Manager",
    "Professional Staff",
] as const;
type Category = typeof CATEGORIES[number];

const RATES: Record<Office, Record<Category, number>> = {
    Mexico: {
        Partner: 400,
        Director: 300,
        "Senior Manager": 250,
        Manager: 200,
        "Supervising Senior": 175,
        Senior: 150,
        "Staff in Charge": 125,
        Staff: 100,
    },
    Guadalajara: {
        Partner: 380,
        Director: 280,
        "Senior Manager": 230,
        Manager: 180,
        "Supervising Senior": 160,
        Senior: 140,
        "Staff in Charge": 115,
        Staff: 90,
    },
    Monterrey: {
        Partner: 390,
        Director: 290,
        "Senior Manager": 240,
        Manager: 190,
        "Supervising Senior": 165,
        Senior: 145,
        "Staff in Charge": 120,
        Staff: 95,
    },
};

interface BreakdownRow {
    id: string;
    category: Category;
    preliminaryHours: number;
    interimHours: number;
    finalHours: number;
}

interface Client {
    id: string;
    name: string;
    project: string;
    bu: string; 
    office: string;
    function: string;
    serviceLine: string;
    leadPartner: string;
    targetFees: number;
    valuationPercent: number;
    requestedMonths: string[];
    partnerDirectorFee: number;
    seniorManagerManagerFee: number;
    professionalStaffFee: number;
}

interface SpecialistRequest {
    id: string;
    clientId: string;
    status: StatusType;
    confirmationStatus: "pending" | "confirmed" | "changes-requested";
    breakdown: BreakdownRow[];
    submittedBy?: string;
    submittedOn?: string;
    approvedBy?: string;
    approvedOn?: string;
    comments?: string;
    partnerComments?: string;
    needsRevision?: boolean; 
    serviceLinePartnerLead?: string;
    auditStage?: string;
    dueDate?: string;
    confirmationComment?: string;
    approvalComment?: string;
    auditStandards?: string;
    financialReportingStandards?: string;
}


export default function SpecialistConfirmations() {
    const [statusFilter, setStatusFilter] = useState<string>("Confirmation");
    const mapStep = (id: number): 1 | 2 | 3 | 4 => {
        switch (id) {
            case 3: return 1; 
            case 2: return 2; 
            case 1: return 4; 
            default: return 1;
        }
    };
   
    const mapApiToModel = (item: any) => {
        console.log("MAP ITEM", item); 
        const stages: string[] = [];
        console.log("partnerDirectorFee", item.partnerDirectorFee);
        console.log("seniorManagerManagerFee", item.seniorManagerManagerFee);
        console.log("professionalStaffFee", item.professionalStaffFee); 
        if (item?.auditStagePreliminaryMths) {
            stages.push(`Preliminary — ${item.auditStagePreliminaryMths}`);
        }

        if (item?.auditStageInterimIndMths) {
            stages.push(`Interim — ${item.auditStageInterimIndMths}`);
        }

        if (item?.auditStageFinalIndMths) {
            stages.push(`Final — ${item.auditStageFinalIndMths}`);
        }
        
        return {
            id: item?.p8Id ?? "",
            clientId: item?.p8Id ?? "",

            clientName: item?.clientName ?? "",
            project: item?.projectDescription ?? "",
            bu: item?.businessUnitIdLabel ?? "",
            office: item?.officeLabel ?? "",

            leadPartner: item?.currentEngagementPartnerName ?? "",
            leadPartnerEmail: item?.currentEngagementPartnerEmail ?? "",

            targetFees: Number(item?.agreedFeesAmount ?? 0),

            function: item.functionLabel ?? "",
            serviceLine: item?.specialistServiceLineLabel ?? "",

            auditStage: stages.join("\n"),

            auditingStandards: item?.auditingStandards ?? "",
            accountingFrameworks: item?.accountingFrameworks ?? "",

            valuationPercent: Number(item?.valuation ?? 0),
            costCenter: item?.costCenter ?? 0,
            status: item?.lvlStatusEsp ?? "",
            serviceLinePartnerLead: item?.serviceLineInChargeLabel ?? "",
            workflowStep: mapStep(item?.lvlStatusEspId),
            lvlStatusEspId: item?.lvlStatusEspId,
            existsConfirm: item?.existsConfirm,
            existsBreakdown: item?.existsBreakdown,

            partnerDirectorFee: item.partnerDirectorFee,
            seniorManagerManagerFee: item.seniorManagerManagerFee,
            professionalStaffFee: item.professionalStaffFee,

            breakdown: item?.breakdown ?? []

        };
    };
    
    const [functionFilter, setFunctionFilter] = useState<Function | "all">("all");
    const [serviceLineFilter, setServiceLineFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [pipelineStatusFilter, setPipelineStatusFilter] = useState<string>("all");

    const LEVEL_MAP: Record<string, number> = {
        "Partner / Director": 1,
        "Senior Manager / Manager": 2,
        "Professional Staff": 3
    };

    const [apiData, setApiData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
const flattenedData = useMemo(() => {
    return apiData.map((item) => ({
        ...item,
        specialist: {
            serviceLineLabel: item.serviceLine,
            functionLabel: item.function,
            costCenter: item.costCenter,
        }
    }));
}, [apiData]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await specialistApi.getAll();
                console.log("RAW API:", resp);
                console.log("FIRST ROW:", resp.objects?.[0]);
                if (resp?.correct) {
                    const mapped = (resp.objects ?? []).map(mapApiToModel);
                    setApiData(mapped);
                } else {
                    setApiData([]);
                }

            } catch (err) {
                console.error("Error al consumir API", err);
                setError("Error al consumir API");
            }
        };

        fetchData();

        const interval = setInterval(fetchData, 10000);

        return () => clearInterval(interval);

    }, []);


    type ServiceLineItem = {
        specialistServiceLineId: number;
        serviceLineLabel: string | null;
        serviceLineGroup: string | null;
        officeLabel: string | null;
        serviceLineLeadPartnerId: number | null;
        serviceLineLeadPartnerEmail: string | null;
        costCenter: number | null;
        updatedByUserEmail: string | null;
        updatedDateTime: string | null;
        functionLabel: string | null;
    };

    const [serviceLinesData, setServiceLinesData] = useState<ServiceLineItem[]>([]);
    const [serviceLines, setServiceLines] = useState<string[]>([]);
    const [loadingServiceLines, setLoadingServiceLines] = useState(false);

    useEffect(() => {
        const fetchServiceLines = async () => {
            try {
                setLoadingServiceLines(true);

                const data = await specialistApi.listServiceLines();

                const uniqueServiceLines = [
                    ...new Set(
                        (data || [])
                            .map((item: any) => item?.serviceLineLabel || "")
                            .filter((x: string) => x !== "")
                    )
                ].sort();

                setServiceLines(uniqueServiceLines);
            } catch (error) {
                console.error("Error loading service lines", error);
                setServiceLines([]);
            } finally {
                setLoadingServiceLines(false);
            }
        };

        fetchServiceLines();
    }, []);


    useEffect(() => {
        const fetchServiceLines = async () => {
            try {
                setLoadingServiceLines(true);

                const data = await specialistApi.listServiceLines();

                setServiceLinesData(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error loading service lines", error);
                setServiceLinesData([]);
            } finally {
                setLoadingServiceLines(false);
            }
        };

        fetchServiceLines();
    }, []);


    const Function = useMemo(() => {
        return [
            ...new Set(
                serviceLinesData
                    .map((item) => item?.functionLabel?.trim() || "")
                    .filter((value) => value !== "")
            )
        ].sort((a, b) => a.localeCompare(b));
    }, [serviceLinesData]);

    const [activeSection, setActiveSection] = useState<"pending-confirmation" | "pending-details" | "awaiting-approval" | "completed">("pending-confirmation");
    const [viewMode, setViewMode] = useState<"main-page" | "review-confirm" | "breakdown">("main-page");
    const [currentWorkflowStep, setCurrentWorkflowStep] = useState<1 | 2 | 3 | 4>(1);
    const isEditable = currentWorkflowStep === 2;
    const [selectedRequest, setSelectedRequest] = useState<SpecialistRequest | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const enabledStages = useMemo(() => {
        const stagesText = selectedRequest?.auditStage || "";
        return {
            preliminary: stagesText.toLowerCase().includes("preliminary"),
            interim: stagesText.toLowerCase().includes("interim"),
            final: stagesText.toLowerCase().includes("final"),
        };
    }, [selectedRequest]);
    const [confirmationComment, setConfirmationComment] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false); 
    const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
    const [showApprovalReview, setShowApprovalReview] = useState(false);
    const [approvalComment, setApprovalComment] = useState("");
    const [showApprovalChangesDialog, setShowApprovalChangesDialog] = useState(false);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [breakdown, setBreakdown] = useState<BreakdownRow[]>([]);
    const [summaryCollapsed, setSummaryCollapsed] = useState(false);
    const [monthTotalsExpanded, setMonthTotalsExpanded] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showOverBudgetDialog, setShowOverBudgetDialog] = useState(false);
    const [submitComments, setSubmitComments] = useState("");
    const availableServiceLines = useMemo(() => {
        if (functionFilter === "all") {
            return [...SERVICE_LINES_BY_FUNCTION.Tax, ...SERVICE_LINES_BY_FUNCTION.Advisory, ];
        }
        return SERVICE_LINES_BY_FUNCTION[functionFilter];
    }, [functionFilter]);
    
    
const STATUS_MAP: Record<string, string[]> = {
    Confirmation: ["confirmation", "pendiente confirmación", "pending confirmation", "Confirmation"],
    Resourcing: ["resourcing", "pending details", "en resourcing", "Resourcing"],
    Completed: ["completed", "approved", "completado", "Completed"]
};

    
const filteredData = useMemo(() => {
    return flattenedData.filter((item) => {

        if (searchQuery) {
            const query = searchQuery.toLowerCase();

            const name = item.clientName?.toLowerCase() ?? "";
            const partner = item.leadPartner?.toLowerCase() ?? "";

            if (!name.includes(query) && !partner.includes(query)) {
                return false;
            }
        }

        
        

if (statusFilter !== "all") {
    const status = (item.status ?? "").toLowerCase();

    const map: Record<string, string> = {
        Confirmation: "confirmation",
        Resourcing: "resourcing",
        Completed: "completed"
    };

    if (status !== map[statusFilter]) {
        return false;
    }
}
        if (functionFilter !== "all") {
            const fn = item.function ?? "";
            if (fn !== functionFilter) {
                return false;
            }
        }

        if (serviceLineFilter !== "all") {
            if (item.specialist?.serviceLineLabel !== serviceLineFilter) {
                return false;
            }
        }

        return true;
    });
}, [
    flattenedData,
    searchQuery,
    serviceLineFilter,
    functionFilter,
    statusFilter
]);

    const groupedRequests = useMemo(() => {
        const mapped: SpecialistRequest[] = apiData.map((item) => {
            return {
                id: item.p8Id,
                clientId: item.p8Id,
                status: "draft",
                confirmationStatus: "pending",

                breakdown: item.breakdown || []
            } as SpecialistRequest;
        });
        return {
            pendingDetails: mapped.filter(x => x.confirmationStatus === "confirmed" && x.status === "draft"),
            awaitingApproval: mapped.filter(x => x.status === "submitted"),
            completed: mapped.filter(x => x.status === "approved")
        };
    }, [apiData]);

    console.log("FILTERED:", filteredData);


    const handleOpenConfirmationModal = (request: SpecialistRequest) => {
        const client = CLIENTS.find((c) => c.id === request.clientId);
        if (!client) return;

        setSelectedRequest(request);
        setSelectedClient(client);
        setIsConfirmed(false);
        setConfirmationComment("");
        setCurrentWorkflowStep(1);

        setViewMode("review-confirm");
    };

    const handleConfirm = () => {
        setShowConfirmationModal(true);
    };
    const handleSaveAndContinue = async () => {
        if (!selectedRequest || !selectedClient) return;

        try {
            const p8Id = selectedRequest.id; 
            console.log("p8Id enviado:", selectedRequest.id);

            const payload = {
                
                confirmationIndicator: true,
                agreedFeesSpecialist: selectedClient.targetFees,
                confirmationComments: confirmationComment || null,
                costCenter: (selectedRequest as any).costCenter || 0,
                specialistServiceLineLabel: selectedClient.serviceLine
            };

            console.log("payload:", payload);

            await specialistApi.saveConfirmation(p8Id, payload);

            console.log(" Guardado correctamente");

            selectedRequest.confirmationStatus = "confirmed";
            selectedRequest.confirmationComment = confirmationComment;

            setCurrentWorkflowStep(2);
            setConfirmationComment("");
            setShowConfirmationModal(false);
            setViewMode("breakdown");

            if (selectedRequest.breakdown?.length > 0) {
                setBreakdown(selectedRequest.breakdown);
            } else {
                initializeBreakdown();
            }

        } catch (error) {
            console.error(" Error:", error);
        }
    };

    const handleRequestChanges = () => {
        if (!confirmationComment.trim() || !selectedClient) return;

        console.log("Changes requested for client:", selectedClient.name, {
            comment: confirmationComment,
            notifyPartner: selectedClient.leadPartner,
        });

        if (selectedRequest) {
            selectedRequest.confirmationStatus = "changes-requested";
        }

        setConfirmationComment("");
        setIsConfirmed(false);
        resetToMainPage();
    };

    const handleOpenChangesDialog = () => {
        setIsConfirmed(true); 
    };

    const handleStartDetails = (request: SpecialistRequest) => {
        const client = CLIENTS.find((c) => c.id === request.clientId);
        if (!client) return;

        setSelectedRequest(request);
        setSelectedClient(client);

        if (request.status === "approved") {
            setCurrentWorkflowStep(4);
        } else if (request.status === "submitted") {
            setCurrentWorkflowStep(3);
        } else if (request.confirmationStatus === "confirmed") {
            setCurrentWorkflowStep(2);
        } else {
            setCurrentWorkflowStep(1);
        }

        if (request.breakdown && request.breakdown.length > 0) {
            setBreakdown(request.breakdown);
        } else {
            const initialBreakdown: BreakdownRow[] = CATEGORIES.map((category) => ({
                id: category,
                category: category,
                preliminaryHours: 0,
                interimHours: 0,
                finalHours: 0,
            }));
            setBreakdown(initialBreakdown);
        }
        setViewMode("breakdown");
    };

    const handleReviewApproval = (request: SpecialistRequest) => {
        const client = CLIENTS.find((c) => c.id === request.clientId);
        if (!client) return;

        setSelectedRequest(request);
        setSelectedClient(client);

        setCurrentWorkflowStep(3);

        if (request.breakdown && request.breakdown.length > 0) {
            setBreakdown(request.breakdown);
        } else {
            const initialBreakdown: BreakdownRow[] = CATEGORIES.map((category) => ({
                id: category,
                category: category,
                preliminaryHours: 0,
                interimHours: 0,
                finalHours: 0,
            }));
            setBreakdown(initialBreakdown);
        }
        setShowApprovalReview(true);
    };

    const handleApprove = () => {
        setShowApprovalDialog(true);
    };

    const handleConfirmApproval = () => {
        if (!selectedRequest || !selectedClient) return;

        selectedRequest.status = "approved";
        selectedRequest.approvedBy = "Current User"; 
        selectedRequest.approvedOn = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });

        console.log("Approved:", selectedClient.name, {
            comment: approvalComment,
        });

        setCurrentWorkflowStep(4);

        setShowApprovalDialog(false);
        setShowApprovalReview(false);
        setSelectedRequest(null);
        setSelectedClient(null);
        setBreakdown([]);
        setApprovalComment("");
    };

    const handleRequestApprovalChanges = () => {
        if (!approvalComment.trim() || !selectedClient || !selectedRequest) return;

        console.log("Changes requested for approval:", selectedClient.name, {
            comment: approvalComment,
        });

        selectedRequest.status = "draft";
        selectedRequest.needsRevision = true;

        setShowApprovalChangesDialog(false);
        setShowApprovalReview(false);
        setApprovalComment("");
        setSelectedRequest(null);
        setSelectedClient(null);
        setBreakdown([]);
    };

    const handleViewDetails = (request: SpecialistRequest) => {
        const client = CLIENTS.find((c) => c.id === request.clientId);
        if (!client) return;

        setSelectedRequest(request);
        setSelectedClient(client);
        if (request.status === "approved") {
            setCurrentWorkflowStep(4);
        } else if (request.status === "submitted") {
            setCurrentWorkflowStep(3);
        } else if (request.confirmationStatus === "confirmed") {
            setCurrentWorkflowStep(2);
        } else {
            setCurrentWorkflowStep(1);
        }

        if (request.breakdown && request.breakdown.length > 0) {
            setBreakdown(request.breakdown);
        } else {
            const initialBreakdown: BreakdownRow[] = CATEGORIES.map((category) => ({
                id: category,
                category: category,
                preliminaryHours: 0,
                interimHours: 0,
                finalHours: 0,
            }));
            setBreakdown(initialBreakdown);
        }
        setViewMode("breakdown");
    };
    const handleFromApi = (item: any) => {
        const spec = item.specialist;

        const clientMapped = {
            id: item.id,
            name: item.clientName ?? "",
            project: item.project ?? "",
            bu: item.bu ?? "",
            office: item.office ?? "",
            function: item.function ?? "",
            serviceLine: item.serviceLine ?? "",
            leadPartner: item.leadPartner ?? "",
            targetFees: Number(item.targetFees ?? 0),
            valuationPercent: Number(item.valuationPercent ?? 0),

            partnerDirectorFee: item.partnerDirectorFee,
            seniorManagerManagerFee: item.seniorManagerManagerFee,
            professionalStaffFee: item.professionalStaffFee,

            requestedMonths: []

        };

        const LEVEL_TO_CATEGORY: Record<number, string> = {
            1: "Partner / Director",
            2: "Senior Manager / Manager",
            3: "Professional Staff"
        };

        const mappedBreakdown = (item.breakdown || []).map((b: any) => ({
            id: LEVEL_TO_CATEGORY[b.specialistLevelId],
            category: LEVEL_TO_CATEGORY[b.specialistLevelId],
            preliminaryHours: b.resourceHoursPreliminary || 0,
            interimHours: b.resourceHoursInterim || 0,
            finalHours: b.resourceHoursFinal || 0
        }));

        const stages: string[] = [];
        if (spec?.auditStagePreliminaryMths) stages.push("Preliminary");
        if (spec?.auditStageInterimMths) stages.push("Interim");
        if (spec?.auditStageFinalMths) stages.push("Final");
        console.log("CLIENT MAPPED", clientMapped); 
        setSelectedClient(clientMapped as any);

        setSelectedRequest({
            
            id: item.id,
            p8Id: item.id, 
            clientId: item.id,
            status: item.lvlStatusEspId === 1
                ? "approved"
                : item.existsBreakdown === 1
                    ? "submitted"
                    : "draft",
            confirmationStatus: item.existsConfirm === 1 ? "confirmed" : "pending",
            breakdown: mappedBreakdown,
            costCenter: item?.costCenter,
            serviceLinePartnerLead: item?.serviceLinePartnerLead || "N/A",
            auditStage: item?.auditStage ?? "N/A",
            auditStandards: item?.auditingStandards ?? "N/A",
            financialReportingStandards: item?.accountingFrameworks ?? "N/A",
} as any);


        setCurrentWorkflowStep(item.workflowStep);

        if (item.workflowStep === 1) {
            setViewMode("review-confirm");
        } else {
            setViewMode("breakdown");
        }
        if (mappedBreakdown.length > 0) {
            setBreakdown(mappedBreakdown);
        } else {
            initializeBreakdown();
        }
        
    };
    const resetToMainPage = () => {
        setViewMode("main-page");
        setSelectedRequest(null);
        setSelectedClient(null);
        setBreakdown([]);
        setSummaryCollapsed(false);
        setConfirmationComment("");
        setIsConfirmed(false);
        setCurrentWorkflowStep(1);
    };

    const initializeBreakdown = () => {
        const initialBreakdown: BreakdownRow[] = CATEGORIES.map((category) => ({
            id: category,
            category: category,
            preliminaryHours: 0,
            interimHours: 0,
            finalHours: 0,
        }));
        setBreakdown(initialBreakdown);
    };

    const updateBreakdownRow = (id: string, field: keyof BreakdownRow, value: any) => {
        setBreakdown(
            breakdown.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        );
    };

    const calculateRowTotalHours = (row: BreakdownRow): number => {
        return row.preliminaryHours + row.interimHours + row.finalHours;
    };

    const calculateRowFee = (row: BreakdownRow): number => {
        const totalHours = calculateRowTotalHours(row);

        console.log("row", row);

        switch (row.category) {
            case "Partner / Director":
                console.log("PD Fee", selectedClient?.partnerDirectorFee);
                return totalHours * (selectedClient?.partnerDirectorFee ?? 0);

            case "Senior Manager / Manager":
                console.log("SM Fee", selectedClient?.seniorManagerManagerFee);
                return totalHours * (selectedClient?.seniorManagerManagerFee ?? 0);

            case "Professional Staff":
                console.log("PS Fee", selectedClient?.professionalStaffFee);
                return totalHours * (selectedClient?.professionalStaffFee ?? 0);

            default:
                console.log("NO MATCH", row.category);
                return 0;
        }
    };

    const calculateRowHonorarios = (row: BreakdownRow): number => {
        const totalHours = calculateRowTotalHours(row);
        const DUMMY_AVERAGE_RATE = 1650;
        return totalHours * DUMMY_AVERAGE_RATE;
    };

    const grandTotalHours = useMemo(() => {
        return breakdown.reduce((sum, row) => sum + calculateRowTotalHours(row), 0);
    }, [breakdown]);

    // const grandTotalFee = useMemo(() => {
    //     return breakdown.reduce((sum, row) => sum + calculateRowFee(row), 0);
    // }, [breakdown]);

    const grandTotalFee = useMemo(() => {
        return breakdown.reduce(
            (sum, row) => sum + calculateRowFee(row),
            0
        );
    }, [breakdown, selectedClient]);

    const grandTotalHonorarios = useMemo(() => {
        return breakdown.reduce((sum, row) => sum + calculateRowHonorarios(row), 0);
    }, [breakdown, selectedClient]);

    const remainingBudget = useMemo(() => {
        return (selectedClient?.targetFees || 0) - grandTotalFee;
    }, [grandTotalFee, selectedClient]);

    const isOverBudget = remainingBudget < 0;

    const feeAlignmentPercentage = useMemo(() => {
        if (!selectedClient?.targetFees || selectedClient.targetFees === 0) return 0;
        return Math.round((grandTotalFee / selectedClient.targetFees) * 100);
    }, [grandTotalFee, selectedClient]);

    const isFeeAlignmentOutOfRange = useMemo(() => {
        return feeAlignmentPercentage < 80 || feeAlignmentPercentage > 120;
    }, [feeAlignmentPercentage]);

    const handleSubmitBreakdown = () => {
        if (!selectedClient) return;
        if (isFeeAlignmentOutOfRange) {
            setShowOverBudgetDialog(true);
        } else {
            setShowSubmitDialog(true);
        }
    };

    const handleConfirmSubmit = async () => {
        if (!selectedRequest || !selectedClient) return;

        try {
            const p8Id = selectedRequest.id;

            const payload = {
                p8Id,
                costCenter: selectedRequest.costCenter,
                specialistServiceLineLabel: selectedClient.serviceLine,
                rows: breakdown.map(row => ({
                    specialistServiceLineLabel: selectedClient.serviceLine, 
                    specialistLevelId: LEVEL_MAP[row.category],
                    resourceHoursPreliminary: row.preliminaryHours || 0,
                    resourceHoursInterim: row.interimHours || 0,
                    resourceHoursFinal: row.finalHours || 0
                }))
            };

            console.log("payload:", payload);

            await specialistApi.savebreakdown(p8Id, payload);

            console.log("Breakdown guardado correctamente");

            selectedRequest.status = "submitted";

            setShowSubmitDialog(false);
            setShowOverBudgetDialog(false);
            resetToMainPage();

            toast.success("Breakdown saved successfully ");

        } catch (error) {
            console.error("Error saving breakdown", error);
            toast.error("Error saving breakdown ");
        }
    };

    const getPipelineStatusBadge = (request: SpecialistRequest) => {
        if (request.confirmationStatus === "pending") {
            return { label: "Confirmation required", color: "bg-amber-100 text-amber-800 border-amber-200" };
        } else if (request.confirmationStatus === "confirmed" && request.status === "draft") {
            return { label: "Confirmed – details pending", color: "bg-blue-100 text-blue-800 border-blue-200" };
        } else if (request.status === "submitted") {
            return { label: "Submitted", color: "bg-purple-100 text-purple-800 border-purple-200" };
        } else if (request.status === "approved") {
            return { label: "Completed", color: "bg-green-100 text-green-800 border-green-200" };
        }
        return { label: "Draft", color: "bg-slate-100 text-slate-800 border-slate-200" };
    };
    if (showApprovalReview && selectedRequest && selectedClient) {
        return (
            <div className="min-h-screen bg-slate-50/50 pb-24 lg:pb-8">
                {/* Breadcrumb & Actions */}
                <div className="bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                                <button
                                    onClick={() => {
                                        setShowApprovalReview(false);
                                        setSelectedRequest(null);
                                        setSelectedClient(null);
                                        setBreakdown([]);
                                        setApprovalComment("");
                                    }}
                                    className="text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    Specialists
                                </button>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-900 font-medium">Final Review & Approval</span>
                            </div>

                            {/* Top Action Buttons */}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowApprovalChangesDialog(true)}
                                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Request Changes
                                </Button>
                                <Button
                                    onClick={handleApprove}
                                    className="bg-gradient-to-r from-[#00338D] to-[#1A66FF] text-white hover:from-[#00338D]/90 hover:to-[#1A66FF]/90 border-0"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">
                    {/* Client & Engagement Details */}
                    <div className="bg-white rounded-xl border border-[#1E49E2]/20 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] px-8 py-6">
                            <h2 className="text-xl font-semibold text-white">Client & Engagement Details</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Client & Audit Engagement Section */}
                            {/* Aqui inicia secciond de las cards*/}
                            <div className="bg-[#00338D]/5 rounded-lg p-6 border border-[#00338D]/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 className="w-5 h-5 text-[#00338D]" />
                                    <h3 className="text-sm font-semibold text-[#00338D] uppercase tracking-wide">Client & Audit Engagement</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Client Name</p>
                                        <p className="text-base font-semibold text-slate-900">{selectedClient.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Project</p>
                                        <p className="text-base font-medium text-slate-900">{selectedClient.project}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Business Unit</p>
                                            <p className="text-base font-medium text-slate-900">{selectedClient.bu}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Office</p>
                                            <p className="text-base font-medium text-slate-900">{selectedClient.office}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Lead Partner</p>
                                            <p className="text-base font-semibold text-slate-900">{selectedClient.leadPartner}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#1E49E2]/5 rounded-lg p-6 border border-[#1E49E2]/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-[#1E49E2]" />
                                    <h3 className="text-sm font-semibold text-[#1E49E2] uppercase tracking-wide">Specialist Scope</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Agreed Fees</p>
                                        <p className="text-2xl font-bold text-[#00338D]">
                                            ${selectedClient.targetFees.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Function</p>
                                        <p className="text-base font-medium text-[#1E49E2]">{selectedClient.function}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Service Line</p>
                                        <p className="text-base font-medium text-slate-900">{selectedClient.serviceLine}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Service Line Partner Lead</p>
                                        <p className="text-base font-medium text-slate-900">{selectedRequest.serviceLinePartnerLead || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Details Section */}
                            <div className="bg-[#00338D]/5 rounded-lg p-6 border border-[#00338D]/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-5 h-5 text-[#00338D]" />
                                    <h3 className="text-sm font-semibold text-[#00338D] uppercase tracking-wide">Engagement Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Project Valuation</p>
                                        <p className="text-2xl font-bold text-[#1E49E2]">{selectedClient.valuationPercent}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Audit Stage</p>
                                        <p className="text-base font-medium text-slate-900 leading-relaxed">
                                           
                                            {selectedRequest.auditStage
                                                ? selectedRequest.auditStage.split('\n').map((line: string, index: number) => (
                                                    <span key={index}>
                                                        {line}
                                                        {index < selectedRequest.auditStage.split('\n').length - 1 && <br />}
                                                    </span>
                                                ))
                                                : "N/A"}
                                            
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Audit Standards</p>
                                        <p className="text-base font-medium text-slate-900">{selectedRequest.auditStandards || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Reporting Standards</p>
                                        <p className="text-base font-medium text-slate-900">{selectedRequest.financialReportingStandards || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resource Breakdown */}
                    <div className="bg-white rounded-xl border border-[#1E49E2]/20 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] px-8 py-6">
                            <h2 className="text-xl font-semibold text-white">Resource Breakdown</h2>
                        </div>

                        <div className="p-8 space-y-4">
                            {/* Partner / Director Group */}
                            <div className="bg-gradient-to-br from-[#00338D]/5 to-[#1E49E2]/5 rounded-xl border border-[#00338D]/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10 px-6 py-3 border-b border-[#00338D]/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-[#00338D]" />
                                            <h3 className="text-base font-semibold text-[#00338D]">Partner / Director</h3>
                                        </div>
                                        <span className="text-xs font-medium text-[#00338D]/70 bg-white/50 px-2.5 py-1 rounded-full">
                                            {calculateRowTotalHours(breakdown[0] || { preliminaryHours: 0, interimHours: 0, finalHours: 0 })} hrs
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {breakdown[0] && (
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Preliminary</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {isEditable ? (
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={breakdown[0]?.preliminaryHours || 0}
                                                                onChange={(e) =>
                                                                    updateBreakdownRow(
                                                                        breakdown[0].id,
                                                                        "preliminaryHours",
                                                                        Number(e.target.value)
                                                                    )
                                                                }
                                                                className="text-center font-medium h-9"
                                                            />
                                                        ) : (
                                                            <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border">
                                                                {breakdown[0].preliminaryHours}
                                                            </p>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Interim</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {isEditable ? (
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={breakdown[0]?.interimHours || 0}
                                                                onChange={(e) =>
                                                                    updateBreakdownRow(
                                                                        breakdown[0].id,
                                                                        "interimHours",
                                                                        Number(e.target.value)
                                                                    )
                                                                }
                                                                className="text-center font-medium h-9"
                                                            />
                                                        ) : (
                                                            <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border">
                                                                    {breakdown[0].interimHours}
                                                            </p>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Final</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {isEditable ? (
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                value={breakdown[0]?.finalHours || 0}
                                                                onChange={(e) =>
                                                                    updateBreakdownRow(
                                                                        breakdown[0].id,
                                                                        "finalHours",
                                                                        Number(e.target.value)
                                                                    )
                                                                }
                                                                className="text-center font-medium h-9"
                                                            />
                                                        ) : (
                                                            <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border">
                                                                    {breakdown[0].finalHours}
                                                            </p>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Senior Manager / Manager Group */}
                            <div className="bg-gradient-to-br from-[#1E49E2]/5 to-[#00338D]/5 rounded-xl border border-[#1E49E2]/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1E49E2]/10 to-[#00338D]/10 px-6 py-3 border-b border-[#1E49E2]/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-5 h-5 text-[#1E49E2]" />
                                            <h3 className="text-base font-semibold text-[#1E49E2]">Senior Manager / Manager</h3>
                                        </div>
                                        <span className="text-xs font-medium text-[#1E49E2]/70 bg-white/50 px-2.5 py-1 rounded-full">
                                            {calculateRowTotalHours(breakdown[1] || { preliminaryHours: 0, interimHours: 0, finalHours: 0 })} hrs
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {breakdown[1] && (
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Preliminary</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {breakdown[1].preliminaryHours}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Interim</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {breakdown[1].interimHours}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Final</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {breakdown[1].finalHours}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Professional Staff Group */}
                            <div className="bg-gradient-to-br from-slate-50 to-[#00338D]/5 rounded-xl border border-slate-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-100 to-[#00338D]/10 px-6 py-3 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-5 h-5 text-slate-600" />
                                            <h3 className="text-base font-semibold text-slate-700">Professional Staff</h3>
                                        </div>
                                        <span className="text-xs font-medium text-slate-600/70 bg-white/50 px-2.5 py-1 rounded-full">
                                            {calculateRowTotalHours(breakdown[2] || { preliminaryHours: 0, interimHours: 0, finalHours: 0 })} hrs
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {breakdown[2] && (
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Preliminary</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {breakdown[2].preliminaryHours}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Interim</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {breakdown[2].interimHours}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Final</label>
                                                    <p className="text-center font-medium text-slate-900 py-2 px-3 bg-slate-50 rounded border border-slate-200">
                                                        {breakdown[2].finalHours}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Grand Total */}
                            <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Total Hours</h3>
                                    <p className="text-3xl font-bold text-white">{grandTotalHours} hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Summary */}
                    <div className="bg-slate-50/30 rounded-lg border border-slate-200/60 overflow-hidden">
                        <div className="px-6 py-3">
                            {(() => {
                                //esto se comento dado que parece que se consume igual con el metodo de la linea 2511
                                // const percentage = selectedClient.targetFees > 0
                                //     ? Math.round((grandTotalFee / selectedClient.targetFees) * 100)
                                //     : 0;
                                // const isLow = percentage < 80;
                                // const isHigh = percentage > 120;
                                // const isHealthy = !isLow && !isHigh;

                                return (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isHealthy ? "bg-emerald-500" : "bg-amber-500"
                                            )} />
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fee Alignment</p>
                                                <p className="text-sm text-slate-600 mt-0.5">
                                                    {isLow && "Below expected range"}
                                                    {isHigh && "Above expected range"}
                                                    {isHealthy && "Within expected range"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-semibold text-slate-700">{percentage}%</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Target: 80–120%</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* Request Changes Dialog */}
                <Dialog open={showApprovalChangesDialog} onOpenChange={setShowApprovalChangesDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Request Changes</DialogTitle>
                            <DialogDescription>
                                Explain what changes are needed. The specialist will be notified and can revise their submission.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <label className="text-sm font-medium text-slate-900 mb-2 block">
                                Comment (Required)
                            </label>
                            <Textarea
                                placeholder="Describe the changes needed..."
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                rows={5}
                            />
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowApprovalChangesDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleRequestApprovalChanges}
                                disabled={!approvalComment.trim()}
                            >
                                Send Request
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Approval Dialog */}
                <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Approve Specialist Request</DialogTitle>
                            <DialogDescription>
                                Please confirm your approval by reviewing the statement below.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 px-2">
                            <p className="text-base text-slate-900 leading-relaxed">
                                I confirm that I have reviewed the information, considering its relevance within the Firm's Quality Management System under ISQM 1 and QC 1000 standards.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmApproval}
                                className="bg-gradient-to-r from-[#00338D] to-[#1A66FF] text-white hover:from-[#00338D]/90 hover:to-[#1A66FF]/90 border-0"
                            >
                                Confirm Approval
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // Review & Confirm full-page view
    if (viewMode === "review-confirm" && selectedClient && selectedRequest) {
        return (
            <div className="min-h-screen bg-slate-50">
                {/* Top Bar - Breadcrumb and Actions */}
                <div className="bg-white border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-3 text-sm">
                                <button
                                    onClick={resetToMainPage}
                                    className="text-slate-500 hover:text-[#00338D] transition-colors"
                                >
                                    Specialists
                                </button>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-900 font-medium">Review & Confirm</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleConfirm}
                                    className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90"
                                >
                                    Confirmation
                                </Button>
                            </div>
                        </div>

                        {/* Compact Step Indicator */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-6 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-0.5 bg-[#00338D]" />
                                    <span className="font-medium text-[#00338D]">Step 1: Confirmation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-0.5 bg-slate-200" />
                                    <span className="text-slate-400">Step 2: Resourcing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                    <div className="space-y-8">
                        {/* Client & Engagement Details */}
                        <div className="bg-white rounded-xl border border-[#1E49E2]/20 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] px-8 py-6">
                                <h2 className="text-xl font-semibold text-white">Client & Engagement Details</h2>
                            </div>

                            <div className="p-8 space-y-6">
                                {/* Client & Audit Engagement Section */}
                                <div className="bg-[#00338D]/5 rounded-lg p-6 border border-[#00338D]/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Building2 className="w-5 h-5 text-[#00338D]" />
                                        <h3 className="text-sm font-semibold text-[#00338D] uppercase tracking-wide">Client & Audit Engagement</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Client Name</p>
                                            <p className="text-base font-semibold text-slate-900">{selectedClient.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Project</p>
                                            <p className="text-base font-medium text-slate-900">{selectedClient.project}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1.5">Business Unit</p>
                                                <p className="text-base font-medium text-slate-900">{selectedClient.bu}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1.5">Office</p>
                                                <p className="text-base font-medium text-slate-900">{selectedClient.office}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1.5">Lead Partner</p>
                                                <p className="text-base font-semibold text-slate-900">{selectedClient.leadPartner}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Specialist Scope Section */}
                                <div className="bg-[#1E49E2]/5 rounded-lg p-6 border border-[#1E49E2]/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <User className="w-5 h-5 text-[#1E49E2]" />
                                        <h3 className="text-sm font-semibold text-[#1E49E2] uppercase tracking-wide">Specialist Scope</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Agreed Fees</p>
                                            <p className="text-2xl font-bold text-[#00338D]">
                                                ${selectedClient.targetFees.toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Function</p>
                                            <p className="text-base font-medium text-[#1E49E2]">{selectedClient.function}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Service Line</p>
                                            <p className="text-base font-medium text-slate-900">{selectedClient.serviceLine}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Service Line Partner Lead</p>
                                            <p className="text-base font-medium text-slate-900">{selectedRequest.serviceLinePartnerLead || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Engagement Details Section */}
                                <div className="bg-[#00338D]/5 rounded-lg p-6 border border-[#00338D]/10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <DollarSign className="w-5 h-5 text-[#00338D]" />
                                        <h3 className="text-sm font-semibold text-[#00338D] uppercase tracking-wide">Engagement Details</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Project Valuation</p>
                                            <p className="text-2xl font-bold text-[#1E49E2]">{selectedClient.valuationPercent}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Audit Stage</p>
                                            <p className="text-base font-medium text-slate-900 leading-relaxed">
                                               
                                                {selectedRequest.auditStage
                                                    ? selectedRequest.auditStage.split('\n').map((line: string, index: number) => (
                                                        <span key={index}>
                                                            {line}
                                                            {index < selectedRequest.auditStage.split('\n').length - 1 && <br />}
                                                        </span>
                                                    ))
                                                    : "N/A"}
                                                
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Audit Standards</p>
                                            <p className="text-base font-medium text-slate-900">{selectedRequest.auditStandards || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Reporting Standards</p>
                                            <p className="text-base font-medium text-slate-900">{selectedRequest.financialReportingStandards || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Section */}
                        <div className="bg-white rounded-xl border border-[#1E49E2]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                            <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] px-8 py-6">
                                <h3 className="text-lg font-semibold text-white">Confirmation</h3>
                            </div>

                            <div className="px-8 py-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-[#00338D] flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base text-slate-900 leading-relaxed">
                                                I have reviewed and agreed on the specialist initial fees with the lead partner; these fees are preliminary and subject to change.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-[#00338D] flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base text-slate-900 leading-relaxed">
                                                I have reviewed the engagement's needs and the mix of KPMG Specialists it may require, and I have verified that the specialists have the appropriate competence, capabilities, objectivity, and time needed to fulfill their responsibilities on engagements, in accordance with applicable professional, legal, and regulatory requirements and the member firm's policies and procedures.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-[#00338D] flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base text-slate-900 leading-relaxed">
                                                I confirm that I have sufficient installed capacity, both in hours and specialists, to fulfill the agreed services.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Confirmation Modal */}
                <Dialog open={showConfirmationModal} onOpenChange={setShowConfirmationModal}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Confirm information</DialogTitle>
                            <DialogDescription>
                                You are about to confirm the information displayed in this section.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <label className="text-xs text-slate-500 mb-2 block">
                                Optional comment (if needed)
                            </label>
                            <Textarea
                                placeholder="Add an additional note (optional)"
                                value={confirmationComment}
                                onChange={(e) => setConfirmationComment(e.target.value)}
                                rows={3}
                                className="resize-none text-sm"
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowConfirmationModal(false);
                                    setConfirmationComment("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveAndContinue}
                                className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90"
                            >
                                Save & Continue
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
    if (viewMode === "main-page") {
        return (
            <div className="min-h-screen bg-white pb-24 lg:pb-8">
                {/* Sub-Navigation - Rounded Container */}
                <div className="px-6 lg:px-8 py-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-[#00266A] rounded-3xl px-8 py-5">
                            <nav className="flex items-center justify-center gap-12">
                                <button
                                   
                                    onClick={() => {
                                        setStatusFilter("Confirmation");
                                    }}

                                    className="transition-all duration-300 relative"
                                >
                                    {statusFilter === "Confirmation" && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/15 rounded-lg -mx-3 -my-2 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                                            layoutId="activeTab"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-sm font-medium transition-colors whitespace-nowrap",
                                                    statusFilter === "Confirmation"
                                                        ? "text-white"
                                                        : activeSection === "pending-details" || activeSection === "completed"
                                                            ? "text-white/80"
                                                            : "text-white/60"
                                                )}>
                                                    Confirmation
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    
                                onClick={() => {
                                    setStatusFilter("Resourcing");
                                }}

                                    className={cn(
                                        "transition-all duration-300 relative",
                                        statusFilter === "Resourcing"
                                            ? "opacity-100"
                                            : activeSection === "completed"
                                                ? "opacity-90 hover:opacity-100"
                                                : "opacity-60 hover:opacity-80"
                                    )}
                                >
                                    {statusFilter === "Resourcing" && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/15 rounded-lg -mx-3 -my-2 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                                            layoutId="activeTab"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-sm font-medium transition-colors whitespace-nowrap",
                                                    statusFilter === "Resourcing"
                                                        ? "text-white"
                                                        : activeSection === "completed"
                                                            ? "text-white/80"
                                                            : "text-white/60"
                                                )}>
                                                    Resourcing
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    
                                onClick={() => {
                                    setStatusFilter("Completed");
                                }}

                                    className={cn(
                                        "transition-all duration-300 relative",
                                        statusFilter === "Completed"
                                            ? "opacity-100"
                                            : "opacity-60 hover:opacity-80"
                                    )}
                                >
                                    {statusFilter === "Completed" && (
                                        <motion.div
                                            className="absolute inset-0 bg-white/15 rounded-lg -mx-3 -my-2 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                                            layoutId="activeTab"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-sm font-medium transition-colors whitespace-nowrap",
                                                    statusFilter === "Completed"
                                                        ? "text-white"
                                                        : "text-white/60"
                                                )}>
                                                    Completed
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Filters - Reduced Visual Weight */}
                <div className="border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                        <div className="flex flex-col lg:flex-row gap-3 items-end">
                            {/* Function Filter */}
                            <div className="flex-shrink-0">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setFunctionFilter("all");
                                            setServiceLineFilter("all");
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                                            functionFilter === "all"
                                                ? "bg-slate-100 text-slate-700"
                                                : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        All
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFunctionFilter("Tax");
                                            setServiceLineFilter("all");
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                                            functionFilter === "Tax"
                                                ? "bg-slate-100 text-slate-700"
                                                : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        Tax
                                    </button>
                                    <button
                                        onClick={() => {
                                            setFunctionFilter("Advisory");
                                            setServiceLineFilter("all");
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                                            functionFilter === "Advisory"
                                                ? "bg-slate-100 text-slate-700"
                                                : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        Advisory
                                    </button>
                                </div>
                            </div>
                            {/* Service Line Filter */}
                            <div className="flex-shrink-0 min-w-[220px]">
                                <Select
                                    value={serviceLineFilter}
                                    onValueChange={(value) => setServiceLineFilter(value ?? "all")}
                                >
                                    <SelectTrigger className="bg-white border-slate-200 hover:border-slate-300 h-9 text-xs text-slate-600">
                                        <SelectValue placeholder="All Service Lines" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="all">All Service Lines</SelectItem>

                                        {serviceLines.map((sl) => (
                                            <SelectItem key={sl} value={sl}>
                                                {sl}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Search */}
                            <div className="flex-1 min-w-[280px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search by client or lead partner..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-white border-slate-200 hover:border-slate-300 h-9 text-xs placeholder:text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid - Elevated Content Area */}
                <div className="relative overflow-hidden min-h-screen bg-gradient-to-b from-slate-50/30 to-white">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Gradient Orbs */}
                        <motion.div
                            animate={{
                                x: [0, 30, 0],
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-br from-[#00338D]/6 via-[#1E49E2]/6 to-transparent rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                x: [0, -40, 0],
                                y: [0, 30, 0],
                            }}
                            transition={{
                                duration: 25,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#1E49E2]/6 via-[#00338D]/6 to-transparent rounded-full blur-3xl"
                        />

                        {/* Floating Grid Pattern */}
                        <motion.div
                            animate={{
                                opacity: [0.04, 0.06, 0.04],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
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

                    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
                        <AnimatePresence mode="wait">
                            
                            {activeSection === "pending-confirmation" && (
                                <motion.div
                                    key="pending-confirmation"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    
{filteredData.length === 0 ? (
    <div className="col-span-full text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-600">No pending confirmations</p>
        <p className="text-sm text-slate-500 mt-1">
            Requests requiring confirmation will appear here
        </p>
    </div>

                                    ) : (
                                        filteredData.map((item) => {
                                            const clientMapped = {
                                                id: item.id,
                                                
                                                name: item.clientName ?? "",
                                                project: item.project ?? "",
                                                bu: item.bu ?? "",
                                                office: item.office ?? "",
                                                function: item.function ?? "",
                                                serviceLine: item.serviceLine ?? "",
                                                leadPartner: item.leadPartner ?? "",
                                                targetFees: Number(item.targetFees ?? 0),
                                                valuationPercent: Number(item.valuationPercent ?? 0),
                                                partnerDirectorFee: item.partnerDirectorFee,
                                                seniorManagerManagerFee: item.seniorManagerManagerFee,
                                                professionalStaffFee: item.professionalStaffFee,
                                                requestedMonths: []

                                            };

                                            return (
                                                <SpecialistCard
                                                    key={item.p8Id}
                                                    client={clientMapped}
                                                    status="Pending"
                                                    statusType="pending"
                                                    buttonLabel="Review & Confirm"
                                                    onButtonClick={() => handleFromApi(item)}
                                                />
                                            );
                                        })

                                    )}

                                </motion.div>
                            )}

                            {activeSection === "pending-details" && (
                                <motion.div
                                    key="pending-details"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {groupedRequests.pendingDetails.length === 0 ? (
                                        <div className="col-span-full text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600">No pending details</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                All confirmed requests have details captured
                                            </p>
                                        </div>
                                        
                                    ) : (
                                        groupedRequests.pendingDetails.map((request) => {
                                            const client = CLIENTS.find((c) => c.id === request.clientId);
                                            if (!client) return null;

                                            const detailsStatus = request.breakdown.length > 0 ? "Draft" : "Pending Details";
                                            const statusType = request.breakdown.length > 0 ? "draft" : "pending";

                                            return (
                                                <SpecialistCard
                                                    key={request.id}
                                                    client={client}
                                                    status={detailsStatus}
                                                    statusType={statusType}
                                                    buttonLabel={request.breakdown.length > 0 ? "Edit Details" : "Start Details"}
                                                    onButtonClick={() => handleStartDetails(request)}
                                                />
                                            );
                                        })
                                    )}
                                </motion.div>
                            )}

                            {activeSection === "awaiting-approval" && (
                                <motion.div
                                    key="awaiting-approval"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {groupedRequests.awaitingApproval.length === 0 ? (
                                        <div className="col-span-full text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600">No requests awaiting approval</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Submitted requests will appear here
                                            </p>
                                        </div>
                                    ) : (
                                        groupedRequests.awaitingApproval.map((request) => {
                                            const client = CLIENTS.find((c) => c.id === request.clientId);
                                            if (!client) return null;

                                            return (
                                                <SpecialistCard
                                                    key={request.id}
                                                    client={client}
                                                    status="Submitted"
                                                    statusType="submitted"
                                                    buttonLabel="Review & Approve"
                                                    onButtonClick={() => handleReviewApproval(request)}
                                                />
                                            );
                                        })
                                    )}
                                </motion.div>
                            )}

                            {activeSection === "completed" && (
                                <motion.div
                                    key="completed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {groupedRequests.completed.length === 0 ? (
                                        <div className="col-span-full text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600">No completed requests</p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Completed requests will appear here
                                            </p>
                                        </div>
                                    ) : (
                                        groupedRequests.completed.map((request) => {
                                            const client = CLIENTS.find((c) => c.id === request.clientId);
                                            if (!client) return null;

                                            const badge = getPipelineStatusBadge(request);

                                            return (
                                                <SpecialistCard
                                                    key={request.id}
                                                    client={client}
                                                    status={badge.label}
                                                    statusType="pending"
                                                    buttonLabel="View Details"
                                                    onButtonClick={() => handleViewDetails(request)}
                                                />
                                            );
                                        })
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        );
    }

    const isCompleted = selectedRequest?.status === "approved";

    
    const getEnabledStages = () => {
        const auditStage = selectedRequest?.auditStage || "";

        const stages = auditStage
            .split('\n')
            .map(s => s.split('—')[0].trim().toLowerCase());

        return {
            preliminary: stages.includes('preliminary'),
            interim: stages.includes('interim'),
            final: stages.includes('final')
        };
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/50 to-white">
            {/* Top Bar - Breadcrumb and Actions */}
            <div className="bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-3 text-sm">
                            <button
                                onClick={resetToMainPage}
                                className="text-slate-500 hover:text-[#00338D] transition-colors"
                            >
                                Specialists
                            </button>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-900 font-medium">
                                {isCompleted ? "Completed" : "Specialist Details"}
                            </span>
                        </div>

                        {!isCompleted && (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={resetToMainPage}
                                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmitBreakdown}
                                    disabled={grandTotalHours === 0}
                                    className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Save & Complete
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Compact Step Indicator */}
                    {!isCompleted && (
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-4">
                            <div className="flex items-center gap-6 text-xs pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-0.5 bg-slate-300" />
                                    <span className="text-slate-400">Step 1: Confirmation</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-0.5 bg-[#00338D]" />
                                    <span className="font-medium text-[#00338D]">Step 2: Resourcing</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                <div className="space-y-8">
                    {/* Client & Engagement Details - Redesigned */}
                    <div className="bg-white rounded-xl border border-[#1E49E2]/20 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] px-8 py-6">
                            <h2 className="text-xl font-semibold text-white">Client & Engagement Details</h2>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Client & Audit Engagement Section */}
                            <div className="bg-[#00338D]/5 rounded-lg p-6 border border-[#00338D]/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 className="w-5 h-5 text-[#00338D]" />
                                    <h3 className="text-sm font-semibold text-[#00338D] uppercase tracking-wide">Client & Audit Engagement</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Client Name</p>
                                        <p className="text-base font-semibold text-slate-900">{selectedClient?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Project</p>
                                        <p className="text-base font-medium text-slate-900">{selectedClient?.project}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Business Unit</p>
                                            <p className="text-base font-medium text-slate-900">{selectedClient?.bu}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Office</p>
                                            <p className="text-base font-medium text-slate-900">{selectedClient?.office}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 mb-1.5">Lead Partner</p>
                                            <p className="text-base font-semibold text-slate-900">{selectedClient?.leadPartner}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Specialist Scope Section */}
                            <div className="bg-[#1E49E2]/5 rounded-lg p-6 border border-[#1E49E2]/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-[#1E49E2]" />
                                    <h3 className="text-sm font-semibold text-[#1E49E2] uppercase tracking-wide">Specialist Scope</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Agreed Fees</p>
                                        <p className="text-2xl font-bold text-[#00338D]">
                                            ${selectedClient?.targetFees.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Function</p>
                                        <p className="text-base font-medium text-[#1E49E2]">{selectedClient?.function}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Service Line</p>
                                        <p className="text-base font-medium text-slate-900">{selectedClient?.serviceLine}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Service Line Partner Lead</p>
                                        <p className="text-base font-medium text-slate-900">{selectedRequest?.serviceLinePartnerLead || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Engagement Details Section */}
                            <div className="bg-[#00338D]/5 rounded-lg p-6 border border-[#00338D]/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <DollarSign className="w-5 h-5 text-[#00338D]" />
                                    <h3 className="text-sm font-semibold text-[#00338D] uppercase tracking-wide">Engagement Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Project Valuation</p>
                                        <p className="text-2xl font-bold text-[#1E49E2]">{selectedClient?.valuationPercent}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Audit Stage</p>
                                        <p className="text-base font-medium text-slate-900 leading-relaxed">
                                            
                                            {selectedRequest.auditStage
                                                ? selectedRequest.auditStage.split('\n').map((line: string, index: number) => (
                                                    <span key={index}>
                                                        {line}
                                                        {index < selectedRequest.auditStage.split('\n').length - 1 && <br />}
                                                    </span>
                                                ))
                                                : "N/A"}
                                            
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Audit Standards</p>
                                        <p className="text-base font-medium text-slate-900">{selectedRequest?.auditStandards || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1.5">Reporting Standards</p>
                                        <p className="text-base font-medium text-slate-900">{selectedRequest?.financialReportingStandards || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#1E49E2]/20 shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                        <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] px-8 py-6">
                            <h2 className="text-xl font-semibold text-white">Resource Breakdown</h2>
                            <p className="text-sm text-white/80 mt-1">Enter estimated hours by stage for each resource group</p>
                        </div>

                        <div className="p-8 space-y-4">
                            <div className="bg-gradient-to-br from-[#00338D]/5 to-[#1E49E2]/5 rounded-xl border border-[#00338D]/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#00338D]/10 to-[#1E49E2]/10 px-6 py-3 border-b border-[#00338D]/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-[#00338D]" />
                                            <h3 className="text-base font-semibold text-[#00338D]">Partner / Director</h3>
                                        </div>
                                        <span className="text-xs font-medium text-[#00338D]/70 bg-white/50 px-2.5 py-1 rounded-full">
                                            {calculateRowTotalHours(breakdown[0] || { preliminaryHours: 0, interimHours: 0, finalHours: 0 })} hrs
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {breakdown[0] && (
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Preliminary</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[0]?.preliminaryHours || 0}
                                                        onChange={(e) =>
                                                            updateBreakdownRow(
                                                                breakdown[0].id,
                                                                "preliminaryHours",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        disabled={!enabledStages.preliminary}
                                                        className="text-center font-medium h-9"
                                                    />


                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Interim</label>
                                                    
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[0]?.interimHours || 0}
                                                        onChange={(e) =>
                                                            updateBreakdownRow(
                                                                breakdown[0].id,
                                                                "interimHours",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        disabled={!enabledStages.interim} 
                                                    className="text-center font-medium h-9"/>
                                                    

                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Final</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[0]?.finalHours || 0}
                                                        onChange={(e) =>
                                                            updateBreakdownRow(
                                                                breakdown[0].id,
                                                                "finalHours",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        disabled={!enabledStages.final} 
                                                    className="text-center font-medium h-9"/>

                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-[#1E49E2]/5 to-[#00338D]/5 rounded-xl border border-[#1E49E2]/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#1E49E2]/10 to-[#00338D]/10 px-6 py-3 border-b border-[#1E49E2]/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="w-5 h-5 text-[#1E49E2]" />
                                            <h3 className="text-base font-semibold text-[#1E49E2]">Senior Manager / Manager</h3>
                                        </div>
                                        <span className="text-xs font-medium text-[#1E49E2]/70 bg-white/50 px-2.5 py-1 rounded-full">
                                            {calculateRowTotalHours(breakdown[1] || { preliminaryHours: 0, interimHours: 0, finalHours: 0 })} hrs
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {breakdown[1] && (
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Preliminary</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[1].preliminaryHours}
                                                        onChange={(e) => updateBreakdownRow(breakdown[1].id, "preliminaryHours", Number(e.target.value))}
                                                        className="text-center font-medium h-9"
                                                        placeholder="0"
                                                        disabled={isCompleted || !enabledStages.preliminary}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Interim</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[1].interimHours}
                                                        onChange={(e) => updateBreakdownRow(breakdown[1].id, "interimHours", Number(e.target.value))}
                                                        className="text-center font-medium h-9"
                                                        placeholder="0"
                                                        disabled={isCompleted || !enabledStages.interim}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Final</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[1].finalHours}
                                                        onChange={(e) => updateBreakdownRow(breakdown[1].id, "finalHours", Number(e.target.value))}
                                                        className="text-center font-medium h-9"
                                                        placeholder="0"
                                                        disabled={isCompleted || !enabledStages.final}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-50 to-[#00338D]/5 rounded-xl border border-slate-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-slate-100 to-[#00338D]/10 px-6 py-3 border-b border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-5 h-5 text-slate-600" />
                                            <h3 className="text-base font-semibold text-slate-700">Professional Staff</h3>
                                        </div>
                                        <span className="text-xs font-medium text-slate-600/70 bg-white/50 px-2.5 py-1 rounded-full">
                                            {calculateRowTotalHours(breakdown[2] || { preliminaryHours: 0, interimHours: 0, finalHours: 0 })} hrs
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {breakdown[2] && (
                                        <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                                            <div className="grid grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Preliminary</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[2].preliminaryHours}
                                                        onChange={(e) => updateBreakdownRow(breakdown[2].id, "preliminaryHours", Number(e.target.value))}
                                                        className="text-center font-medium h-9"
                                                        placeholder="0"
                                                        disabled={isCompleted || !enabledStages.preliminary}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Interim</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[2].interimHours}
                                                        onChange={(e) => updateBreakdownRow(breakdown[2].id, "interimHours", Number(e.target.value))}
                                                        className="text-center font-medium h-9"
                                                        placeholder="0"
                                                        disabled={isCompleted || !enabledStages.interim}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 mb-1.5 block">Final</label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={breakdown[2].finalHours}
                                                        onChange={(e) => updateBreakdownRow(breakdown[2].id, "finalHours", Number(e.target.value))}
                                                        className="text-center font-medium h-9"
                                                        placeholder="0"
                                                        disabled={isCompleted || !enabledStages.final}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] rounded-xl p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">Total Hours</h3>
                                    <p className="text-3xl font-bold text-white">{grandTotalHours} hrs</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50/30 rounded-lg border border-slate-200/60 overflow-hidden">
                        <div className="px-6 py-3">
                            {(() => {
                                const percentage = selectedClient?.targetFees && selectedClient.targetFees > 0
                                    ? Math.round((grandTotalFee / selectedClient.targetFees) * 100)
                                    : 0;
                                const isLow = percentage < 80;
                                const isHigh = percentage > 120;
                                const isHealthy = !isLow && !isHigh;

                                return (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                isHealthy ? "bg-emerald-500" : "bg-amber-500"
                                            )} />
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Fee Alignment</p>
                                                <p className="text-sm text-slate-600 mt-0.5">
                                                    {isLow && "Below expected range"}
                                                    {isHigh && "Above expected range"}
                                                    {isHealthy && "Within expected range"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-semibold text-slate-700">{percentage}%</p>
                                            
                                            <p className="text-xs text-slate-400 mt-0.5">Target: 80–120%</p>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Save & Complete</DialogTitle>
                        <DialogDescription>
                            This will save your changes and mark this section as completed.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmSubmit}
                            className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90"
                        >
                            Save & Complete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showOverBudgetDialog} onOpenChange={setShowOverBudgetDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle className="w-5 h-5" />
                            Values Outside Expected Range
                        </DialogTitle>
                        <DialogDescription>
                            Some values are outside the expected range. Please confirm that you have reviewed them before proceeding.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowOverBudgetDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmSubmit}
                            className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90"
                        >
                            Save & Complete Anyway
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}