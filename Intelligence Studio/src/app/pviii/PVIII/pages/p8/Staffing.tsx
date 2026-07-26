import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Stepper, Step } from "../../components/Stepper";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../../components/ui/command";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../../components/ui/accordion";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Save, ArrowRight, ArrowLeft, Plus, X, Minus } from "lucide-react";
import { motion } from "motion/react";
import { useProject } from "../../context/ProjectContext";
import { staffing } from "../../api/pviiiStaffing";

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

interface SegmentOption {
    segmentoId: string;
    segmento: string;
}

interface SuggestedCollaborator {
    id: number;
    name: string;
}

interface StaffingCategory {
    id: string;
    level: string;
    numberOfPeople: number;
}

interface StaffingWindow {
    id: string;
    startDate: string;
    endDate: string;
    categories: StaffingCategory[];
}

interface AdditionalNotes {
    travelRequired: "yes" | "no";
    notes: string;
    suggestedCollaborators: SuggestedCollaborator[];
}

export default function Staffing() {
    const navigate = useNavigate();
    const { p8Id } = useParams();
    const normalizeDate = (d?: string) => d?.substring(0, 10);
    const STEP_NUMBER = 5;
    const originalPayloadRef = useRef<string | null>(null);
    const {
        getStepStatus,
        getStepData,
        saveStep,
        markStepInProgress,
        editStep,
        isStepCompleted,
    } = useProject();

    const [isHydrating, setIsHydrating] = useState(true);

    const markEdited = () => {
        if (!isHydrating) editStep(STEP_NUMBER);
    };

    const [segments, setSegments] = useState<SegmentOption[]>([]);
    const [globalSegment, setGlobalSegment] = useState<string>("");

    const [backendStaffing, setBackendStaffing] = useState<any[]>([]);
    const [previewStaffing, setPreviewStaffing] = useState<any[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);

    const [selectedCostCenter, setSelectedCostCenter] = useState<string>("");
    const [costCenters, setCostCenters] = useState<any[]>([]);
    const [staffingTasas, setStaffingTasas] = useState<any[]>([]);
    const [collaborators, setCollaborators] = useState<any[]>([]);

    const [additionalNotes, setAdditionalNotes] = useState<AdditionalNotes>({
        travelRequired: "yes",
        notes: "",
        suggestedCollaborators: [],
    });

    const [staffingWindows, setStaffingWindows] = useState<StaffingWindow[]>([]);

    const effectiveStaffing = previewStaffing.length > 0 ? previewStaffing : backendStaffing;

  
    const isFormValid = () => {
        if (staffingWindows.length === 0) return false;

        for (const window of staffingWindows) {
            if (!window.startDate || !window.endDate) return false;
            if (window.categories.length === 0) return false;

            for (const category of window.categories) {
                if (!category.level || !category.numberOfPeople) return false;
                if (category.numberOfPeople <= 0) return false;
            }
        }

        return true;
    };

    const persistStep = () => {
        const isComplete = isFormValid();
        saveStep(
            STEP_NUMBER,
            { staffingWindows, globalSegment, selectedCostCenter, additionalNotes },
            isComplete
        );
        return isComplete;
    };

    const formatDateShort = (dateString: string) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-").map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    const normalizeStaffingWindows = (windows: StaffingWindow[]) => {
        return windows
            .map(w => ({
                startDate: normalizeDate(w.startDate) ?? "",
                endDate: normalizeDate(w.endDate) ?? "",
                categories: w.categories
                    .map(c => ({
                        level: c.level ?? "",
                        numberOfPeople: Number(c.numberOfPeople) || 0,
                    }))
                    .sort((a, b) => a.level.localeCompare(b.level)),
            }))
            .sort((a, b) => {
                const s = a.startDate.localeCompare(b.startDate);
                return s !== 0 ? s : a.endDate.localeCompare(b.endDate);
            });
    };
    const normalizeAdditionalNotes = (notes: AdditionalNotes) => ({
        travelRequired: notes.travelRequired,
        notes: notes.notes?.trim() ?? "",
        suggestedCollaborators: [...notes.suggestedCollaborators]
            .map(c => ({ id: c.id, name: c.name }))
            .sort((a, b) => a.id - b.id),
    });
    
    const getNormalizedPayload = () => {
        return JSON.stringify({
            staffingWindows: normalizeStaffingWindows(staffingWindows),
            globalSegment: globalSegment ?? "",
            additionalNotes: normalizeAdditionalNotes(additionalNotes),
        });
    };
    const hasChanges = (): boolean => {
        if (originalPayloadRef.current === null) return true;
        return originalPayloadRef.current !== getNormalizedPayload();
    };

    
    useEffect(() => {
        markStepInProgress(STEP_NUMBER);

        const local = getStepData(STEP_NUMBER);
        if (local && Object.keys(local).length > 0) {

            if (Array.isArray(local.staffingWindows)) setStaffingWindows(local.staffingWindows);
            if (typeof local.globalSegment === "string") setGlobalSegment(local.globalSegment);
            if (typeof local.selectedCostCenter === "string") setSelectedCostCenter(local.selectedCostCenter);
            if (local.additionalNotes) {
                setAdditionalNotes({
                    travelRequired: local.additionalNotes.travelRequired ?? "yes",
                    notes: local.additionalNotes.notes ?? "",
                    suggestedCollaborators: Array.isArray(local.additionalNotes.suggestedCollaborators)
                        ? local.additionalNotes.suggestedCollaborators
                        : [],
                });
            }
        }

        setIsHydrating(false);
    }, []);

    useEffect(() => {
        const loadCollaborators = async () => {
            try {
                const data = await staffing.suggestedCollaborator();
                setCollaborators(data);
            } catch (e) {
                console.error("Error loading collaborators", e);
            }
        };
        loadCollaborators();
    }, []);

    useEffect(() => {
        const loadTasas = async () => {
            try {
                const response = await staffing.listTasas();

                const tasasArray = Array.isArray(response)
                    ? response
                    : response?.objects ?? [];

                setStaffingTasas(tasasArray);
            } catch (error) {
                console.error("Error loading Tasas BU", error);
                setStaffingTasas([]);
            }
        };

        loadTasas();
    }, []);

    useEffect(() => {
        const loadSegments = async () => {
            try {
                const tasas = await staffing.listTasas();
                const uniqueSegments = new Map<string, SegmentOption>();

                tasas.forEach((t: any) => {
                    if (t.segmentId && t.segmentLabel) {
                        uniqueSegments.set(t.segmentId.toString(), {
                            segmentoId: t.segmentId.toString(),
                            segmento: t.segmentLabel,
                        });
                    }
                });

                setSegments(Array.from(uniqueSegments.values()));
            } catch (error) {
                console.error("Error loading segments", error);
            }
        };
        loadSegments();
    }, []);

    
    useEffect(() => {
        if (!globalSegment || staffingTasas.length === 0) {
            setCostCenters([]);
            setSelectedCostCenter("");
            return;
        }

        const filtered = staffingTasas
            .filter((t) => t.segmentId.toString() === globalSegment)
            .reduce((acc: any[], curr: any) => {
                if (!acc.some((c) => c.costCenter === curr.costCenterId.toString())) {
                    acc.push({
                        costCenter: curr.costCenterId.toString(),
                        description: curr.costCenterId.toString(),
                    });
                }
                return acc;
            }, []);

        setCostCenters(filtered);
        setSelectedCostCenter(prev =>
            filtered.some(f => f.costCenter === prev)
                ? prev
                : filtered[0]?.costCenter || ""
        );

    }, [globalSegment, staffingTasas]);

    const levelsForSegment = staffingTasas
        .filter(
            (t) =>
                t.segmentId.toString() === globalSegment &&
                t.costCenterId.toString() === selectedCostCenter
        )
        .map((t) => t.levelLabel)
        .filter((value, index, self) => self.indexOf(value) === index);

    
    useEffect(() => {
        if (!p8Id) return;

        const loadFromBackend = async () => {
            try {
                const data = await staffing.getById(p8Id);


                setBackendStaffing(
                    (data.staffing || []).map((s: any) => ({
                        ...s,
                        hours: s.hoursTotal ?? 0,
                        feesAmount: s.rateAmountTotal ?? 0,
                    }))
                );

                const staffingSegmentId =
                    data.staffing?.find((s: any) => s.engagementSegmentId != null)?.engagementSegmentId;

                setGlobalSegment(staffingSegmentId?.toString() ?? "");

                const map = new Map<string, StaffingWindow>();

                (data.staffing || []).forEach((item: any) => {
                    const key = `${item.startDate}-${item.endDate}`;

                    if (!map.has(key)) {
                        map.set(key, {
                            id: key,
                            startDate: item.startDate.substring(0, 10),
                            endDate: item.endDate.substring(0, 10),
                            categories: [],
                        });
                    }

                    map.get(key)!.categories.push({
                        id: item.keyId.toString(),
                        level: item.levelLabel,
                        numberOfPeople: item.peopleCount,
                    });
                });

                setStaffingWindows(
                    Array.from(map.values()).sort((a, b) => {
                        const startDiff =
                            new Date(a.startDate).getTime() -
                            new Date(b.startDate).getTime();

                        if (startDiff !== 0) return startDiff;

                        return (
                            new Date(a.endDate).getTime() -
                            new Date(b.endDate).getTime()
                        );
                    })
                );

                if (data.schedulingConsiderations) {
                    const sc = data.schedulingConsiderations;

                    setAdditionalNotes({
                        travelRequired: sc.travelRequired ? "yes" : "no",
                        notes: sc.schedulingNotes ?? "",
                        suggestedCollaborators: Array.isArray(sc.suggestedCollaborators)
                            ? sc.suggestedCollaborators.map((c: any) => ({
                                id: c.suggestedEmployeeId,
                                name: c.suggestedEmployeeName,
                            }))
                            : [],
                    });
                }

            } catch (e) {
                console.error("Error loading staffing detail", e);
            }
        };

        loadFromBackend();
    }, [p8Id/*, hasLocalDraft*/]);
    const windowKey = `${window.startDate}_${window.endDate}`;
    const windowBackendItems = effectiveStaffing.filter(
        (s) =>
            s.engagementSegmentId === Number(globalSegment) &&
            s.windowKey === windowKey
    );

    const mapToStaffingDtos = () => {
        const selectedSegment = segments.find(s => s.segmentoId === globalSegment);

        const result: any[] = [];

        staffingWindows.forEach(window => {
            window.categories.forEach(category => {
                result.push({
                    keyId: parseInt(category.id, 10) || 0,
                    startDate: window.startDate,
                    endDate: window.endDate,
                    levelLabel: category.level,
                    peopleCount: category.numberOfPeople,
                    engagementSegmentId: Number(globalSegment),
                    engagementSegmentLabel: selectedSegment?.segmento ?? "",
                    costCenter: selectedCostCenter ? Number(selectedCostCenter) : null,

                });
            });
        });

        return result;
    };
    const mapToSchedulingConsideration = () => {
        const selectedSegment = segments.find(s => s.segmentoId === globalSegment);
        const collaborator = additionalNotes.suggestedCollaborators[0];

        return {
            travelRequired: additionalNotes.travelRequired === "yes",
            schedulingNotes: additionalNotes.notes,
            suggestedCollaborators: additionalNotes.suggestedCollaborators.map(c => ({
                suggestedEmployeeId: c.id,
                suggestedEmployeeName: c.name
            })),

            engagementSegmentId: Number(globalSegment),
            engagementSegmentLabel: selectedSegment?.segmento ?? "",
        };
    };
    useEffect(() => {
        if (isHydrating) return;
        if (!globalSegment) return;
        if (staffingWindows.length === 0) return;
        if (originalPayloadRef.current !== null) return;

        originalPayloadRef.current = getNormalizedPayload();

        console.log("✅ Snapshot initialized", originalPayloadRef.current);
    }, [
        isHydrating,
        globalSegment,
        staffingWindows,
        additionalNotes
    ]);

    const saveStaffingDraft = async () => {
        if (!p8Id) return;

        const payload = {
            dtos: mapToStaffingDtos(),
            schedulingDto: mapToSchedulingConsideration(),
            cutoffDate: new Date().toISOString(),
        };

        await staffing.createUpStaffin(p8Id, payload);
    };
   
    const handleSaveDraft = async () => {
        try {
            persistStep();

            if (!hasChanges()) {
                navigate("/p8/new");
                return;
            }

            await saveStaffingDraft();
            originalPayloadRef.current = getNormalizedPayload();

            navigate("/p8/new");
        } catch (error) {
            console.error(error);
        }
    };
    
    const calculatePreview = async () => {
        try {
            const payload = mapToStaffingDtos();
            if (payload.length === 0) {
                setPreviewStaffing([]);
                return;
            }

            setIsCalculating(true);
            const result = await staffing.calculatePreview(payload);

            const normalized = result.map((r: any) => ({
                windowKey: r.windowKey,
                engagementSegmentId: Number(globalSegment),
                levelLabel: r.levelLabel,
                hours: r.hours,
                feesAmount: r.fees,
                startDate: r.windowStart.split("/").reverse().join("-"),
                endDate: r.windowEnd.split("/").reverse().join("-"),
            }));

            setPreviewStaffing(normalized);
     
        } catch (error: any) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Error inesperado";

            alert(message); 

            console.error("Error calculating staffing preview", error);
        
        } finally {
            setIsCalculating(false);
        }
    };

    useEffect(() => {
        if (!isFormValid()) return;
        calculatePreview();
    }, [staffingWindows, globalSegment, selectedCostCenter, additionalNotes.travelRequired]);

   
    const totalHours = effectiveStaffing
        .filter((s) => s.engagementSegmentId === Number(globalSegment))
        .reduce((sum, s) => sum + (s.hours ?? 0), 0);

    const totalFees = effectiveStaffing
        .filter((s) => s.engagementSegmentId === Number(globalSegment))
        .reduce((sum, s) => sum + (s.feesAmount ?? 0), 0);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [windowToDelete, setWindowToDelete] = useState<string | null>(null);
    const [collaboratorPopoverOpen, setCollaboratorPopoverOpen] = useState(false);
    const [expandedWindowId, setExpandedWindowId] = useState<string | undefined>(undefined);

    const addStaffingWindow = () => {
        const newWindow: StaffingWindow = {
            id: Date.now().toString(),
            startDate: "",
            endDate: "",
            categories: [{ id: `cat-${Date.now()}`, level: "", numberOfPeople: 1 }],
        };
        setStaffingWindows((prev) => [...prev, newWindow]);
        markEdited();
    };

    const confirmDeleteWindow = (id: string) => {
        setWindowToDelete(id);
        setDeleteDialogOpen(true);
    };

    const deleteWindow = () => {
        if (windowToDelete) {
            setStaffingWindows((prev) => prev.filter((w) => w.id !== windowToDelete));
            setWindowToDelete(null);
            markEdited();
        }
        setDeleteDialogOpen(false);
    };

    const updateWindow = (id: string, field: "startDate" | "endDate", value: string) => {
        setStaffingWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
        );
        markEdited();
    };

    const addCategory = (windowId: string) => {
        setStaffingWindows((prev) =>
            prev.map((w) =>
                w.id === windowId
                    ? {
                        ...w,
                        categories: [
                            ...w.categories,
                            { id: `cat-${Date.now()}`, level: "", numberOfPeople: 1 },
                        ],
                    }
                    : w
            )
        );
        markEdited();
    };

    const deleteCategory = (windowId: string, categoryId: string) => {
        setStaffingWindows((prev) =>
            prev.map((w) =>
                w.id === windowId
                    ? { ...w, categories: w.categories.filter((c) => c.id !== categoryId) }
                    : w
            )
        );
        markEdited();
    };

    const updateCategory = (
        windowId: string,
        categoryId: string,
        field: keyof StaffingCategory,
        value: string | number
    ) => {
        setStaffingWindows((prev) =>
            prev.map((w) =>
                w.id === windowId
                    ? {
                        ...w,
                        categories: w.categories.map((c) =>
                            c.id === categoryId ? { ...c, [field]: value } : c
                        ),
                    }
                    : w
            )
        );
        markEdited();
    };

    const toggleCollaborator = (collaborator: SuggestedCollaborator) => {
        setAdditionalNotes((prev) => {
            const exists = prev.suggestedCollaborators.some((c) => c.id === collaborator.id);
            return {
                ...prev,
                suggestedCollaborators: exists
                    ? prev.suggestedCollaborators.filter((c) => c.id !== collaborator.id)
                    : [...prev.suggestedCollaborators, collaborator],
            };
        });
        markEdited();
    };

    const removeCollaborator = (id: number) => {
        setAdditionalNotes((prev) => ({
            ...prev,
            suggestedCollaborators: prev.suggestedCollaborators.filter((c) => c.id !== id),
        }));
        markEdited();
    };

    const handleNext = async () => {
        if (!isFormValid() || !p8Id) return;

        try {
            persistStep();

            if (!hasChanges()) {
                navigate(`/p8/specialists/${p8Id}`);
                return;
            }

            await saveStaffingDraft();

            originalPayloadRef.current = getNormalizedPayload();

            navigate(`/p8/specialists/${p8Id}`);
        } catch (error) {
            console.error(error);
        }
    };
    const handleBack = async () => {
        if (!p8Id) return;
        try {
            persistStep();
            navigate(`/p8/entities/${p8Id}`);
        } catch (error) {
            console.error(error);
            navigate(`/p8/entities/${p8Id}`);
        }
    };
    const collaboratorsDisabled = false;
    return (
        <div className="min-h-screen bg-background pb-24 lg:pb-8">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <Stepper
                        steps={wizardSteps.map((step, index) => ({
                            ...step,
                            status: getStepStatus(index + 1),
                            completed: isStepCompleted(index + 1),
                        }))}
                        currentStep={4}
                        onStepClick={(stepIndex) => {
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
                        }}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2
                                    className="text-[#1e49e2] font-light text-[24px] tracking-[0.02em] transition-colors duration-300"
                                    style={{ textShadow: "0 1px 2px rgba(30, 73, 226, 0.2)" }}
                                >
                                    Staffing Schedule
                                </h2>
                            </div>

                            <Button
                                onClick={addStaffingWindow}
                                className="text-[13px] font-medium tracking-[0.04em] bg-gradient-to-r from-[#1E49E2] to-[#1E49E2] text-white shadow-sm hover:from-[#5B10C8] hover:to-[#163FCC] transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Staffing
                            </Button>
                        </div>

                        <div className="bg-gradient-to-br from-[#1E49E2]/[0.03] to-[#1E49E2]/[0.02] rounded-lg border border-[#1E49E2]/15 shadow-[0_1px_3px_rgba(0,51,141,0.08)] p-4 mb-5">
                            <div className="max-w-md">
                                <Label className="text-[11px] font-medium tracking-[0.06em] text-[#1E49E2]/80">
                                    Engagement Segment <span className="text-red-500">*</span>
                                </Label>

                                <Select
                                    value={globalSegment}
                                    onValueChange={(newSegment) => {
                                        setGlobalSegment(newSegment);

                                        setStaffingWindows(prev =>
                                            prev.map(w => ({
                                                ...w,
                                                categories: w.categories.map(c => {
                                                    const isLevelStillValid = staffingTasas.some(t =>
                                                        t.segmentId.toString() === newSegment &&
                                                        t.levelLabel === c.level
                                                    );

                                                    return {
                                                        ...c,
                                                        level: isLevelStillValid ? c.level : "",
                                                        numberOfPeople: c.numberOfPeople
                                                    };
                                                })
                                            }))
                                        );

                                        markEdited();
                                    }}
                                >
                                    <SelectTrigger className="h-10 mt-1.5">
                                        <SelectValue placeholder="Select segment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {segments.map((seg) => (
                                            <SelectItem key={seg.segmentoId} value={seg.segmentoId}>
                                                {seg.segmento}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                              
                            </div>
                        </div>

                        <div className="mb-6">
                            <Accordion
                                type="single"
                                collapsible
                                className="space-y-2.5"
                                value={expandedWindowId}
                                onValueChange={setExpandedWindowId}
                            >
                                {staffingWindows.map((window) => {


                                    const windowKey = `${window.startDate}_${window.endDate}`;

                                    const windowBackendItems = effectiveStaffing.filter(
                                        (s) =>
                                            s.engagementSegmentId === Number(globalSegment) &&
                                            s.windowKey === windowKey
                                    );



                                    const totalWindowHours = windowBackendItems.reduce(
                                        (sum, s) => sum + (s.hours ?? 0),
                                        0
                                    );

                                    const totalWindowFees = windowBackendItems.reduce(
                                        (sum, s) => sum + (s.feesAmount ?? 0),
                                        0
                                    );


                                    const startDateShort = formatDateShort(window.startDate);
                                    const endDateShort = formatDateShort(window.endDate);
                                    const isExpanded = expandedWindowId === window.id;

                                    const categoriesLabel =
                                        window.categories.length === 1
                                            ? window.categories[0].level || "No category"
                                            : `${window.categories.length} categories`;

                                    return (
                                        <AccordionItem
                                            key={window.id}
                                            value={window.id}
                                            className="order border-[#1E49E2]/15 rounded-xl overflow-hidden bg-gradient-to-br from-white via-white to-[#1E49E2]/[0.03] shadow-[0_6px_18px_rgba(30,73,226,0.08)] group relative"
                                        >
                                            <AccordionTrigger className="px-5 py-3.5 hover:no-underline transition-colors bg-[#1E49E2]/[0.04] hover:bg-[#1E49E2]/[0.04]">
                                                <div className="flex items-center justify-between w-full pr-2">
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#1E49E2] to-[#5B10C8] shadow-md flex-shrink-0">
                                                            <User className="w-4 h-4 text-white" />
                                                        </div>

                                                        {!isExpanded ? (
                                                            <div className="flex items-center gap-4 min-w-0">
                                                                <span className="font-medium text-[#1E49E2] text-[13px] tracking-[0.02em] whitespace-nowrap">
                                                                    {window.startDate && window.endDate ? (
                                                                        `${startDateShort} – ${endDateShort}`
                                                                    ) : (
                                                                        <span className="text-slate-400 italic">No dates set</span>
                                                                    )}
                                                                </span>

                                                                {window.startDate && window.endDate && (
                                                                    <div className="hidden md:flex items-center gap-3 text-[12px] text-[#00338D]/70 tracking-[0.04em]">
                                                                        <span className="whitespace-nowrap tracking-[0.04em]">{categoriesLabel}</span>

                                                                        {totalWindowHours > 0 && (
                                                                            <span className="text-[#1E49E2]/60 text-[16px] leading-none">•</span>
                                                                        )}
                                                                        {totalWindowHours > 0 && (
                                                                            <span className="whitespace-nowrap tracking-[0.04em]">
                                                                                {totalWindowHours.toLocaleString()} hrs
                                                                            </span>
                                                                        )}

                                                                        {totalWindowFees > 0 && (
                                                                            <span className="text-[#1E49E2]/60 text-[16px] leading-none">•</span>
                                                                        )}
                                                                        {totalWindowFees > 0 && (
                                                                            <span className="font-medium text-[#00338D] whitespace-nowrap tracking-[0.04em]">
                                                                                ${totalWindowFees.toLocaleString()}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <span className="font-medium text-[#1E49E2] text-[13px] tracking-[0.03em] whitespace-nowrap">
                                                                    {window.startDate && window.endDate ? (
                                                                        `${startDateShort} – ${endDateShort}`
                                                                    ) : (
                                                                        <span className="text-slate-400 italic">No dates set</span>
                                                                    )}
                                                                </span>

                                                                {window.categories.length > 0 && (
                                                                    <span className="text-xs text-slate-500 whitespace-nowrap">
                                                                        ({categoriesLabel})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDeleteWindow(window.id);
                                                }}
                                                className="absolute top-3 right-11 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <AccordionContent className="px-4 pb-3 bg-slate-50/30">
                                                <div className="pt-2.5 border-t border-slate-200/60">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 mb-3 pb-3 border-b border-slate-200/50">
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                                                Start Date <span className="text-red-500">*</span>
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                value={window.startDate}
                                                                onChange={(e) => updateWindow(window.id, "startDate", e.target.value)}
                                                                className="h-10"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                                                End Date <span className="text-red-500">*</span>
                                                            </Label>
                                                            <Input
                                                                type="date"
                                                                value={window.endDate}
                                                                onChange={(e) => updateWindow(window.id, "endDate", e.target.value)}
                                                                className="h-10"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2.5 mb-3">
                                                        <div className="flex items-center justify-between">
                                                            <Label className="text-[11px] font-medium tracking-[0.08em] text-[#1E49E2]/80 capitalize">
                                                                Resource Categories
                                                            </Label>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => addCategory(window.id)}
                                                                className="h-7 text-xs font-normal"
                                                            >
                                                                <Plus className="w-3 h-3 mr-1" />
                                                                Add Category
                                                            </Button>
                                                        </div>

                                                        {window.categories.map((category) => {
                                                            
                                                            const backendItems = effectiveStaffing.filter(
                                                                (s) =>
                                                                    s.engagementSegmentId === Number(globalSegment) &&
                                                                    s.windowKey === windowKey &&
                                                                    s.levelLabel === category.level
                                                            );



                                                            const totalHours = backendItems.reduce(
                                                                (sum, s) => sum + (s.hours ?? 0),
                                                                0
                                                            );

                                                            const totalFees = backendItems.reduce(
                                                                (sum, s) => sum + (s.feesAmount ?? 0),
                                                                0
                                                            );

                                                            return (
                                                                <div
                                                                    key={category.id}
                                                                    className="border border-slate-200/70 rounded-lg p-3 bg-gradient-to-br from-white to-[#1E49E2]/[0.015] shadow-[0_1px_2px_rgba(0,0,0,0.04)] relative group/category"
                                                                >
                                                                    {window.categories.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => deleteCategory(window.id, category.id)}
                                                                            className="absolute top-2 right-2 opacity-0 group-hover/category:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    )}

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2">
                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                                                                Level <span className="text-red-500">*</span>
                                                                            </Label>
                                                                            <Select
                                                                                value={category.level}
                                                                                onValueChange={(value) =>
                                                                                    updateCategory(window.id, category.id, "level", value)
                                                                                }
                                                                            >
                                                                                <SelectTrigger className="h-10 bg-white">
                                                                                    <SelectValue placeholder="Select level" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {levelsForSegment.map((level) => (
                                                                                        <SelectItem key={level} value={level}>
                                                                                            {level}
                                                                                        </SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>

                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                                                                # People <span className="text-red-500">*</span>
                                                                            </Label>
                                                                            <div className="flex items-center gap-1.5">
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-10 w-10 p-0 bg-white"
                                                                                    onClick={() =>
                                                                                        updateCategory(
                                                                                            window.id,
                                                                                            category.id,
                                                                                            "numberOfPeople",
                                                                                            Math.max(1, category.numberOfPeople - 1)
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Minus className="w-3 h-3" />
                                                                                </Button>

                                                                                <Input
                                                                                    type="number"
                                                                                    min="1"
                                                                                    value={category.numberOfPeople}
                                                                                    onChange={(e) =>
                                                                                        updateCategory(
                                                                                            window.id,
                                                                                            category.id,
                                                                                            "numberOfPeople",
                                                                                            Math.max(1, parseInt(e.target.value) || 1)
                                                                                        )
                                                                                    }
                                                                                    className="h-10 text-center text-sm w-16 bg-white"
                                                                                />

                                                                                <Button
                                                                                    type="button"
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    className="h-10 w-10 p-0 bg-white"
                                                                                    onClick={() =>
                                                                                        updateCategory(
                                                                                            window.id,
                                                                                            category.id,
                                                                                            "numberOfPeople",
                                                                                            category.numberOfPeople + 1
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <Plus className="w-3 h-3" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                                                                Hours
                                                                            </Label>
                                                                            <div className="h-10 flex items-center px-3 bg-slate-50/60 rounded-md border border-slate-200/70 shadow-inner text-sm font-normal text-slate-600">
                                                     
                                                                                {backendItems.length > 0 ? `${totalHours} hrs` : "-"}
                                                                            </div>
                                                                        </div>

                                                                        <div className="space-y-1.5">
                                                                            <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                                                                Fees
                                                                            </Label>
                                                                            <div className="h-10 flex items-center px-3 bg-slate-50/60 rounded-md border border-slate-200/70 shadow-inner text-sm font-normal text-[#00338D]">
                                                                                
                                                                                {backendItems.length > 0 ? `$${totalFees.toLocaleString()}` : "-"}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {window.categories.length > 1 && (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2.5 pt-3 border-t border-slate-200/60">
                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                                                                    Total Window Hours
                                                                </Label>
                                                                <div className="h-10 flex items-center px-3 bg-gradient-to-br from-[#00338D]/[0.03] to-[#1E49E2]/[0.02] rounded-md border border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-sm font-medium text-slate-700">
                                                                    {totalWindowHours.toLocaleString()} hrs
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1.5">
                                                                <Label className="text-[11px] font-normal tracking-[0.06em] text-[#00338D]/80">
                                                                    Total Window Fees
                                                                </Label>
                                                                <div className="h-10 flex items-center px-3 bg-gradient-to-r from-[#00338D]/[0.06] to-[#1E49E2]/[0.04] rounded-md border border-[#00338D]/20 shadow-[0_1px_2px_rgba(0,51,141,0.06)] text-sm font-medium text-[#00338D]">
                                                                    ${totalWindowFees.toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>

                        <div className="bg-gradient-to-br from-[#1E49E2]/[0.03] to-[#1E49E2]/[0.02] rounded-lg border border-[#1E49E2]/15 shadow-[0_1px_3px_rgba(0,51,141,0.08)] p-5 mb-6">
                            <h3 className="text-[11px] font-medium tracking-[0.08em] text-[#1E49E2]/80 capitalize mb-4">
                                Additional Scheduling Considerations
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                        Travel Required
                                    </Label>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setAdditionalNotes((prev) => ({ ...prev, travelRequired: "yes" }));
                                                markEdited();
                                            }}
                                            className={`px-4 py-2 rounded-md text-sm font-normal transition-colors ${additionalNotes.travelRequired === "yes"
                                                    ? "bg-[#1E49E2] text-white shadow-sm"
                                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                                }`}
                                        >
                                            Yes
                                        </button>

                                        <button
                                            onClick={() => {
                                                setAdditionalNotes((prev) => ({ ...prev, travelRequired: "no", suggestedCollaborators: [] }));
                                                markEdited();
                                            }}
                                            className={`px-4 py-2 rounded-md text-sm font-normal transition-colors ${additionalNotes.travelRequired === "no"
                                                    ? "bg-[#1E49E2] text-white shadow-sm"
                                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                                }`}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                        Suggested Collaborators
                                    </Label>

                                    <Popover
                                        open={collaboratorsDisabled ? false : collaboratorPopoverOpen}
                                        onOpenChange={(open) => {
                                            if (!collaboratorsDisabled) {
                                                setCollaboratorPopoverOpen(open);
                                            }
                                        }}
                                    >
                                        <PopoverTrigger asChild>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={collaboratorPopoverOpen}
                                                disabled={collaboratorsDisabled}
                                                className={`w-full justify-between h-auto min-h-[40px] py-2 font-normal ${collaboratorsDisabled
                                                    ? "opacity-50 cursor-not-allowed bg-slate-100"
                                                    : ""
                                                    }`}
                                            >

                                                <div className="flex flex-wrap gap-1.5">
                                                    {additionalNotes.suggestedCollaborators.length === 0 ? (
                                                        <span className="text-slate-500 text-sm">Select collaborators...</span>
                                                    ) : (
                                                        additionalNotes.suggestedCollaborators.map((collab) => (
                                                            <Badge key={collab.id} variant="secondary" className="text-xs px-2 py-0.5">
                                                                {collab.name}
                                                                <span
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeCollaborator(collab.id);
                                                                    }}
                                                                    className="ml-1.5 hover:text-slate-900 cursor-pointer"
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter" || e.key === " ") {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            removeCollaborator(collab.id);
                                                                        }
                                                                    }}
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </span>
                                                            </Badge>
                                                        ))
                                                    )}
                                                </div>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            align="start"
                                            sideOffset={6}
                                            className="p-0 z-[9999] w-[var(--radix-popover-trigger-width)]"
                                        >
                                            <Command key={collaborators.length}>
                                                <CommandInput placeholder="Search collaborators..." className="h-9" />
                                                <CommandList>
                                                    <CommandEmpty>No collaborator found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {collaborators.map((c) => (
                                                            <CommandItem
                                                                key={c.employeeId}
                                                                value={`${c.fullName}-${c.employeeId}`}
                                                                onSelect={() => toggleCollaborator({ id: c.employeeId, name: c.fullName })}
                                                            >
                                                                <Check
                                                                    className={`mr-2 h-4 w-4 ${additionalNotes.suggestedCollaborators.some((sc) => sc.id === c.employeeId)
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                        }`}
                                                                />
                                                                {c.fullName}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="space-y-2 mt-5">
                                <Label className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80">
                                    Notes
                                </Label>
                                <Textarea
                                    value={additionalNotes.notes}
                                    onChange={(e) => {
                                        setAdditionalNotes((prev) => ({ ...prev, notes: e.target.value }));
                                        markEdited();
                                    }}
                                    placeholder="Include travel needs, preferred collaborators, or any special scheduling considerations."
                                    className="resize-none min-h-[90px] text-sm"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-200/60 bg-gradient-to-br from-[#1E49E2]/[0.04] to-[#1E49E2]/[0.03] rounded-lg border border-[#1E49E2]/20 shadow-[0_2px_4px_rgba(0,51,141,0.1),0_1px_2px_rgba(0,0,0,0.06)] p-5">
                            <h3 className="text-[11px] font-medium tracking-[0.08em] text-[#1E49E2]/80 capitalize mb-4">
                                Engagement Summary
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <p className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80 mb-1">
                                        Total Hours
                                    </p>
                                    <p className="text-lg font-semibold text-[#1E49E2] tracking-[0.02em]">
                                        {totalHours.toLocaleString()} hrs
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[11px] font-normal tracking-[0.06em] text-[#0C233C]/80 mb-1">
                                        Total Fees
                                    </p>
                                    <p className="text-lg font-semibold text-[#1E49E2] tracking-[0.02em]">
                                        ${totalFees.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove Staffing Window</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to remove this staffing window? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={deleteWindow}>Remove</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <div className="flex items-center justify-between mt-6">
                        <Button variant="outline" onClick={handleBack} className="h-10 font-normal">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                disabled={!isFormValid()}
                                onClick={handleSaveDraft}
                                className="h-10 border-slate-300 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save & Exit
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={!isFormValid()}
                                className="h-10 bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save &amp; Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}