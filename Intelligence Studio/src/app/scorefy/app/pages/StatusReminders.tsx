
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

//import {
//  Search, Send, MoreVertical, Eye, UserX, AlertCircle, X,
//} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { Search, Send, MoreVertical, Eye, UserX, AlertCircle, X, Trash2 } from "lucide-react";

import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// Status UI parts (mantener rutas)
import { StatusTableHeader } from "../components/status/StatusTableHeader";
import { ChipStatus } from "../components/status/ChipStatus";
import { ChipEvaluationType } from "../components/status/ChipEvaluationType";
import { ActionRemindButton } from "../components/status/ActionRemindButton";
import { RemindModal } from "../components/status/RemindModal";
import { ExceptionCard } from "../components/status/ExceptionCard";
import { ExceptionModal, ExceptionFormData } from "../components/status/ExceptionModal";
import { ChangeEvaluatorModal } from "@/app/components/status/ChangeEvaluatorModal";
import { managerApi } from "../../app/api/managerEvaluationApi";
import { finalConclusionApi } from "../../app/api/finalConclusionApi";

// API (mismo patrón que selfEvaluationApi.ts)
import {
    statusRemindersApi,
    type StatusReminderRow,
    type ExceptionItem,
    type SortField,
    type SortDirection,
} from "../../app/api/statusReminders";
// Mock data for Final Conclusions tracking

const PAGE_SIZE = 50;

//normalización de texto para búsqueda más flexible (ignora mayúsculas, acentos, puntuación)charly
function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")  // quita acentos: á→a, é→e, ñ→n, etc.
        .replace(/[,;.()\-]/g, " ")         // comas y puntuación → espacio
        .replace(/\s+/g, " ")              // colapsa espacios múltiples
        .trim();
}

function matchesSearch(fields: (string | undefined)[], query: string): boolean {
    const terms = normalizeText(query).split(" ").filter(Boolean);
    const combined = normalizeText(fields.filter(Boolean).join(" "));
    return terms.every(term => combined.includes(term));
}

function shortEmployeeName(fullName?: string) {
    if (!fullName) return "";

    const clean = fullName.replace(/\s+/g, " ").trim();
    if (!clean) return "";

    // Caso: "Apellido Paterno Apellido Materno, Nombre SegundoNombre"
    if (clean.includes(",")) {
        const [lastPart, firstPart] = clean.split(",").map(s => s.trim());

        const firstName = (firstPart || "").split(" ").filter(Boolean)[0] ?? "";
        const firstLastName = (lastPart || "").split(" ").filter(Boolean)[0] ?? "";

        // Ej: "Acevedo Cordero, Cristian Alexis" => "Cristian Acevedo"
        return [firstName, firstLastName].filter(Boolean).join(" ");
    }

    // Caso: "Nombre SegundoNombre ApellidoPaterno ApellidoMaterno"
    const parts = clean.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0];

    const firstName = parts[0];
    const lastName = parts[parts.length - 1]; // último token como apellido
    return `${firstName} ${lastName}`;
}

export function StatusReminders() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("status");

    // Sorting state
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("none");

    // Filter state
    const [filterEvaluatorStatus, setFilterEvaluatorStatus] = useState<string>("all");
    const [filterEmployeeStatus, setFilterEmployeeStatus] = useState<string>("all");
    const [filterEvaluationType, setFilterEvaluationType] = useState<string>("all");

    // Modal state
    const [remindModalOpen, setRemindModalOpen] = useState(false);
    const [selectedRemindItem, setSelectedRemindItem] = useState<StatusReminderRow | null>(null);
    const [exceptionModalOpen, setExceptionModalOpen] = useState(false);
    const [exceptionModalMode, setExceptionModalMode] = useState<"create" | "edit">("create");
    const [selectedExceptionData, setSelectedExceptionData] = useState<Partial<ExceptionFormData>>();

    //nuevos cambios 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; employeeName: string; projectClient: string } | null>(null);
    const [changeEvaluatorModalOpen, setChangeEvaluatorModalOpen] = useState(false);
    const [selectedItemForEvaluatorChange, setSelectedItemForEvaluatorChange] = useState<any>(null);

    // Data state
    const [statusData, setStatusData] = useState<StatusReminderRow[]>([]);
    const [exceptions, setExceptions] = useState<ExceptionItem[]>([]);
    const [exceptionsOriginal, setExceptionsOriginal] = useState<ExceptionItem[]>([]);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Abort/cancel control para evitar "race conditions"
    const abortRef = useRef<AbortController | null>(null);
    const EXCEPTION_TYPES = [
        { value: "medical-leave", label: "Medical Leave" },
        { value: "project-cancelled", label: "Project Cancelled" },
        { value: "not-assigned", label: "Not Assigned" },
        { value: "other", label: "Other" },
    ];



    //llenado de evaluadores 
    const [availableEvaluators, setAvailableEvaluators] = useState<Array<{ id: string; name: string }>>([]);
    const [loadingEvaluators, setLoadingEvaluators] = useState(false);
    const [catalogWarnings, setCatalogWarnings] = useState<string[]>([]);
    //mapa para buscar por nombre cuando si hay evaluador 

    const evaluatorsByName = useMemo(() => {
        const map = new Map<string, string>();
        for (const e of availableEvaluators) {
            map.set(e.name.trim().toLowerCase(), e.id);
        }
        return map;
    }, [availableEvaluators]);
    const [currentEvaluatorForModal, setCurrentEvaluatorForModal] = useState<{ id: string; name: string } | null>(null);
    const [loadingCurrentEvaluator, setLoadingCurrentEvaluator] = useState(false);

    // =============================
    // LOADERS
    // =============================
async function loadStatus(overrides?: {
    search?: string;
    sortField?: SortField | null;
    sortDirection?: SortDirection;
    evaluatorStatus?: string;
    employeeStatus?: string;
    evaluationType?: string;
}) {
    setLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
const vm = await statusRemindersApi.list({
    search: "",   // la búsqueda de texto se hace client-side con matchesSearch
    evaluatorStatus: overrides?.evaluatorStatus ?? filterEvaluatorStatus,
    employeeStatus: overrides?.employeeStatus ?? filterEmployeeStatus,
    evaluationType: overrides?.evaluationType ?? filterEvaluationType,
    sortField: (overrides?.sortField !== undefined ? overrides.sortField : sortField) ?? undefined,
    sortDirection: overrides?.sortDirection ?? sortDirection,
});


        if (ctrl.signal.aborted) return;

        const results = vm.results ?? [];
        // Deduplica por id por si el server devuelve duplicados
        const unique = Array.from(new Map(results.map((r: StatusReminderRow) => [r.id, r])).values());

        setStatusData(unique);
        setHasAccess(vm.hasAccess ?? true);
        setWarnings(vm.warnings ?? []);
    } catch (err: any) {
        if (!ctrl.signal.aborted && err.name !== "AbortError") {
            toast.error("Error loading status");
        }
    } finally {
        if (!ctrl.signal.aborted) {
            setLoading(false);
        }
    }
}

    async function loadExceptions() {
        try {
            const list = await statusRemindersApi.getExceptions();

            setExceptions(list ?? []);
            setExceptionsOriginal(list ?? []);

        } catch (err: any) {
            toast.error("Error loading exceptions");
        }
    }
    //para cargar el catalogo
    async function loadEvaluatorsCatalog() {
        try {
            setLoadingEvaluators(true);
            const vm = await statusRemindersApi.getCatEmpleados(); // método que añadimos al wrapper
            setCatalogWarnings(vm.warnings ?? []);
            if (!vm.hasAccess) {
                setAvailableEvaluators([]);
                return;
            }
            const mapped = (vm.results ?? []).map(r => ({
                id: String(r.employeeId),
                name: r.fullName,
            }));
            setAvailableEvaluators(mapped);
        } catch (err: any) {
            // puedes usar toast si quieres
            console.error("Error loading employees catalog");
        } finally {
            setLoadingEvaluators(false);
        }
    }
    async function loadCurrentEvaluator(keyReport: string) {
        try {
            setLoadingCurrentEvaluator(true);
            const data = await statusRemindersApi.getCurrentEvaluator(keyReport); // { id, name }
            setCurrentEvaluatorForModal({ id: String(data.id), name: data.name });
        } catch (err: any) {
            // Si falla, no forzamos nada; el usuario elegirá manualmente
            setCurrentEvaluatorForModal(null);
            console.error("Error loading current evaluator");
        } finally {
            setLoadingCurrentEvaluator(false);
        }
    }
    async function loadFinalConclusions() {
        try {
            setLoadingFinalConclusions(true);

            // ✅ Llamada directa a tu API real
            const data = await finalConclusionApi.getCatalogStatus();

            if (!data) {
                setFinalConclusionsData([]);
                setFilteredFinalConclusions([]);
                return;
            }

            const normalizeConclusionStatus = (value?: string) => {
                switch (value?.toLowerCase()) {
                    case "not started":
                        return "not-started";
                    case "in progress":
                        return "in-progress";
                    case "completed":
                        return "completed";
                    default:
                        return "not-started";
                }
            };


            // ✅ Mapear al formato que usa tu tabla actual
            //const mapped = data.map(item => ({
            //    id: item.id,
            //    employeeName: item.fullName,
            //    level: item.category,
            //    businessUnit: item.bu,
            //    performanceManager: item.pmName ?? "—",
            //    status: item.conclusionPM ?? "not-started",
            //    lastUpdate: item.lastUpdate ?? 2026,
            //}));
            const mapped = data.map(item => ({
                id: item.id,
                employeeName: item.fullName,
                level: item.category,
                businessUnit: item.bu,
                performanceManager: item.pmName ?? "—",
                conclusionStatus: normalizeConclusionStatus(item.conclusionPM),
                lastUpdate: item.lastUpdate ?? "2026"
            }));

            setFinalConclusionsData(mapped);
            setFilteredFinalConclusions(mapped);

        } catch (err) {
            console.error(err);
            toast.error("Error loading Final Conclusions");
        } finally {
            setLoadingFinalConclusions(false);
        }
    }
    //
    useEffect(() => {
        // Primera carga
        loadStatus();
        loadExceptions();
        loadEvaluatorsCatalog();
        loadFinalConclusions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleView = () => {
        navigate("/self-evaluations");
    };

    // =============================
    // SORTING
    // =============================
const handleSort = (field: SortField) => {
    let newField: SortField | null;
    let newDir: SortDirection;

    if (sortField === field) {
        if (sortDirection === "none")       { newField = field; newDir = "asc"; }
        else if (sortDirection === "asc")   { newField = field; newDir = "desc"; }
        else                                { newField = null;  newDir = "none"; }
    } else {
        newField = field;
        newDir = "asc";
    }

    setSortField(newField);
    setSortDirection(newDir);
    loadStatus({ sortField: newField, sortDirection: newDir });
};


    // =============================
    // FILTROS & BÚSQUEDA
    // =============================
    const getFilteredData = () => {
        let filtered = [...statusData];

if (searchQuery.trim()) {
    filtered = filtered.filter(item =>
        matchesSearch([item.employeeName, item.projectClient, item.evaluatorName], searchQuery)
    );
}

        if (filterEvaluatorStatus !== "all") {
            filtered = filtered.filter((item) => item.evaluatorStatus === filterEvaluatorStatus);
        }
        if (filterEmployeeStatus !== "all") {
            filtered = filtered.filter((item) => item.employeeStatus === filterEmployeeStatus);
        }
        if (filterEvaluationType !== "all") {
            filtered = filtered.filter((item) => item.evaluationType === filterEvaluationType);
        }

        if (sortField && sortDirection !== "none") {
            filtered.sort((a: any, b: any) => {
                let av = a[sortField];
                let bv = b[sortField];

                if (typeof av === "string") {
                    av = av.toLowerCase();
                    bv = (bv as string).toLowerCase();
                    return sortDirection === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
                }
                if (typeof av === "number") {
                    return sortDirection === "asc" ? av - (bv as number) : (bv as number) - av;
                }
                return 0;
            });
        }

        return filtered;
    };
    const [finalConclusionsData, setFinalConclusionsData] = useState([]);
    const [filteredFinalConclusions, setFilteredFinalConclusions] = useState([]);
    const [loadingFinalConclusions, setLoadingFinalConclusions] = useState(true);
    const filteredData = getFilteredData();

const filterFinalConclusions = (query: string) => {
    const term = query.trim();
    if (!term) {
        setFilteredFinalConclusions(finalConclusionsData);
        return;
    }
    const filtered = finalConclusionsData.filter(item =>
        matchesSearch([item.employeeName, item.businessUnit, item.performanceManager], term)
    );
    setFilteredFinalConclusions(filtered);
};


// Para excepciones, separamos la lógica de filtrado porque es un dataset diferente y queremos preservar el original para resetearlo//charly
const filterExceptions = (query: string) => {
    const term = query.trim();
    if (!term) {
        setExceptions(exceptionsOriginal);
        return;
    }
    const filtered = exceptionsOriginal.filter(exc =>
        matchesSearch([exc.employeeName, exc.projectClient], term)
    );
    setExceptions(filtered);
};



    // =============================
    // REMIND
    // =============================
    const handleRemind = (item: StatusReminderRow) => {
        setSelectedRemindItem(item);
        setRemindModalOpen(true);
    };

    const handleFinalConclusionRemind = async (item) => {
        try {
            await finalConclusionApi.sendRemind(
                Number(item.id), // EmployeeId
                2026             // FY
            );

            toast.success("Final Conclusion reminder sent");
        } catch (err: any) {
            toast.error(err?.message ?? "Error sending reminder");
        }
    };

    const handleRemindConfirm = async (note?: string) => {
        if (!selectedRemindItem) return;
        await statusRemindersApi.remind({ keyReport: selectedRemindItem.keyReport, note });
        toast.success("Reminder sent");
        setRemindModalOpen(false);
        setSelectedRemindItem(null);
    };

    // =============================
    // EXCEPTIONS
    // =============================
    const handleCreateException = () => {
        setExceptionModalMode("create");
        setSelectedExceptionData(undefined);
        setExceptionModalOpen(true);
    };


    // edicion de exception
    const handleEditException = (exception: ExceptionItem) => {
        setExceptionModalMode("edit");
        setSelectedExceptionData({
            id: exception.id,
            // Para selects:
            projectClient: exception.projectClient ?? "",
            keyReport: exception.keyReport,
            employeeId: exception.keyReport,
            employeeName: exception.employeeName ?? "",
            evaluatorName: exception.evaluatorName ?? "",
            exceptionType: exception.exceptionType ?? "other",
            reason: exception.reason ?? "",
            markAsException: exception.isException ?? true,
        });
        setExceptionModalOpen(true);
    };




    const handleExceptionConfirm = async (data: ExceptionFormData) => {
        const labelToSend =
            EXCEPTION_TYPES.find(t => t.value === data.exceptionType)?.label
            ?? data.exceptionType;

        if (exceptionModalMode === "create") {
            await statusRemindersApi.createException({
                keyReport: data.keyReport,
                reason: data.reason,
                isException: data.markAsException,
                fy: 2026,
                exceptionType: labelToSend,
            });
            toast.success("Exception created and removed from Status Tracking");
        } else {
            await statusRemindersApi.updateException(data.id!, {
                reason: data.reason!,
                exceptionType: labelToSend,
                isException: data.markAsException,
            });
            toast.success("Exception updated successfully");
        }

        setExceptionModalOpen(false);
        await loadStatus();
        await loadExceptions();
    };

    const handleRestoreException = async (exceptionId: number) => {
        await statusRemindersApi.restoreException(exceptionId);
        toast.success("Item restored to Status Tracking");
        await loadStatus();
        await loadExceptions();
    };

    const handleMarkAsException = (item: StatusReminderRow) => {
        setExceptionModalMode("create");
        setSelectedExceptionData({
            keyReport: item.keyReport,
            projectClient: item.projectClient, // ✅ AGREGADO
            employeeName: item.employeeName,   // opcional, ayuda al form
            evaluatorName: item.evaluatorName,
            exceptionType: "other",
            reason: "",
            markAsException: true,
        });
        setExceptionModalOpen(true);
    };

    //nuevos cambios 
    const handleDelete = (item: any) => {
        setItemToDelete({ id: item.id, employeeName: item.employeeName, projectClient: item.projectClient });
        setDeleteDialogOpen(true);
    };


    const handleOpenChangeEvaluatorModal = (item: any) => {
        setSelectedItemForEvaluatorChange(item);
        setChangeEvaluatorModalOpen(true);

        // Si el listado YA trae evaluatorName (caso Rocio), intenta resolver id por nombre
        const name = item.evaluatorName?.trim();
        if (name) {
            const idByName = evaluatorsByName.get(name.toLowerCase()) ?? "";
            // setea el estado “actual” a partir del catálogo (sin red)
            setCurrentEvaluatorForModal(
                idByName ? { id: idByName, name } : { id: "", name } // si no hay match, deja sin id
            );
        } else {
            // Si NO viene evaluatorName (viene vacío), pide el endpoint por keyReport
            loadCurrentEvaluator(item.keyReport);
        }
    };


    const handleConfirmChangeEvaluator = async (newEvaluatorId: string, newEvaluatorName: string) => {
        try {
            if (!selectedItemForEvaluatorChange) return;

            await statusRemindersApi.changeEvaluator({
                keyReport: selectedItemForEvaluatorChange.keyReport,
                newEvaluatorId: Number(newEvaluatorId),
            });

            // Optimistic UI
            const updatedData = statusData.map((item) =>
                item.id === selectedItemForEvaluatorChange.id
                    ? { ...item, evaluatorName: newEvaluatorName }
                    : item
            );
            setStatusData(updatedData);

            toast.success("Evaluator changed successfully");
        } catch (err: any) {
            toast.error("Error changing evaluator");
        } finally {
            setChangeEvaluatorModalOpen(false);
        }
    };


    // =============================
    // UI helpers
    // =============================
    const activeFilterCount =
        (filterEvaluatorStatus !== "all" ? 1 : 0) +
        (filterEmployeeStatus !== "all" ? 1 : 0) +
        (filterEvaluationType !== "all" ? 1 : 0);

const handleClearFilters = () => {
    setFilterEvaluatorStatus("all");
    setFilterEmployeeStatus("all");
    setFilterEvaluationType("all");
    loadStatus({ evaluatorStatus: "all", employeeStatus: "all", evaluationType: "all" });
};



    if (hasAccess === null) {
        return (
            <div className="h-full w-full min-h-screen flex items-center justify-center bg-white">
                <p className="text-sm text-muted-foreground">Checking access…</p>
            </div>
        );
    }

    if (hasAccess === false) {
        return (
            <div className="h-full w-full min-h-screen flex items-center justify-center bg-white">
                <p>Unauthorized</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                    Status & Reminders
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Track evaluation status and send reminders
                </p>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by employee, project, or evaluator..."
                        className="pl-9"
                        style={{ background: "var(--gradient-card)" }}
                        value={searchQuery}
                        
onChange={(e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Status: NO llamamos loadStatus aquí.
    // getFilteredData() aplica matchesSearch sobre los datos ya cargados.
    // Si enviamos el texto al servidor, él puede sobre-filtrar antes de que
    // matchesSearch tenga oportunidad de normalizar acentos/comas.

    if (activeTab === "exceptions") {
        filterExceptions(value);
    }

    if (activeTab === "final-conclusions") {
        filterFinalConclusions(value);
    }
}}



                    />
                </div>
            </motion.div>

            {/* Access / warnings */}
            {!hasAccess && (
                <div
                    className="p-3 rounded-lg border-l-4 border-red-300"
                    style={{ background: "linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)" }}
                >
                    <p className="text-xs text-muted-foreground">
                        <strong>Access:</strong> You do not have permission to view Status & Reminders.
                    </p>
                </div>
            )}
            {warnings.length > 0 && (
                <div
                    className="p-3 rounded-lg border-l-4 border-yellow-300"
                    style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)" }}
                >
                    <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> {warnings[0]}
                    </p>
                </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-transparent p-0 h-auto gap-2">
                    <TabsTrigger
                        value="status"
                        className="data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2"
                        style={activeTab === "status" ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" } : {}}
                    >
                        Status Tracking
                    </TabsTrigger>
                    <TabsTrigger
                        value="exceptions"
                        className="data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2"
                        style={activeTab === "exceptions" ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" } : {}}
                    >
                        Exceptions
                    </TabsTrigger>
                    <TabsTrigger
                        value="final-conclusions"
                        className="data-[state=active]:text-white data-[state=active]:border-0 rounded-lg px-4 py-2"
                        style={activeTab === "final-conclusions" ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" } : {}}
                    >
                        Final Conclusions
                    </TabsTrigger>
                </TabsList>

                {/* Status Tracking Tab */}
                <TabsContent value="status" className="space-y-4 mt-6">
                    {/* Filter Chips */}
                    {(activeFilterCount > 0 ||
                        filterEvaluatorStatus !== "all" ||
                        filterEmployeeStatus !== "all" ||
                        filterEvaluationType !== "all") && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2">
                                {filterEvaluatorStatus !== "all" && (
                                    <Badge variant="secondary" className="gap-2">
                                        Evaluator: {filterEvaluatorStatus}
<button onClick={() => { setFilterEvaluatorStatus("all"); loadStatus({ evaluatorStatus: "all" }); }} className="hover:bg-gray-200 rounded-full">
    <X className="h-3 w-3" />
</button>
                                    </Badge>
                                )}
                                {filterEmployeeStatus !== "all" && (
                                    <Badge variant="secondary" className="gap-2">
                                        Employee: {filterEmployeeStatus}
<button onClick={() => { setFilterEmployeeStatus("all"); loadStatus({ employeeStatus: "all" }); }} className="hover:bg-gray-200 rounded-full">
    <X className="h-3 w-3" />
</button>
                                    </Badge>
                                )}
                                {filterEvaluationType !== "all" && (
                                    <Badge variant="secondary" className="gap-2">
                                        Type: {filterEvaluationType}
<button onClick={() => { setFilterEvaluationType("all"); loadStatus({ evaluationType: "all" }); }} className="hover:bg-gray-200 rounded-full">
    <X className="h-3 w-3" />
</button>
                                    </Badge>
                                )}
                                {activeFilterCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-7 text-xs">
                                        Clear filters
                                    </Button>
                                )}
                            </motion.div>
                        )}

                    {/* Desktop Table */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="hidden md:block">
                        <Card className="border-0" style={{ boxShadow: "var(--shadow-lg)" }}>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow style={{ background: "var(--gradient-card)" }}>
                                                <StatusTableHeader
                                                    label="Employee"
                                                    sortable
                                                    sorted={sortField === "employeeName" ? sortDirection : "none"}
                                                    onSort={() => handleSort("employeeName")}
                                                />
                                                <StatusTableHeader
                                                    label="Project / Client"
                                                    sortable
                                                    sorted={sortField === "projectClient" ? sortDirection : "none"}
                                                    onSort={() => handleSort("projectClient")}
                                                />
                                                <StatusTableHeader
                                                    label="Evaluator Name"
                                                    sortable
                                                    sorted={sortField === "evaluatorName" ? sortDirection : "none"}
                                                    onSort={() => handleSort("evaluatorName")}
                                                />
                                                <StatusTableHeader
                                                    label="Evaluator Status"
                                                    sortable
                                                    sorted={sortField === "evaluatorStatus" ? sortDirection : "none"}
                                                    onSort={() => handleSort("evaluatorStatus")}
                                                />
                                                <StatusTableHeader
                                                    label="Evaluation Type"
                                                    sortable
                                                    sorted={sortField === "evaluationType" ? sortDirection : "none"}
                                                    onSort={() => handleSort("evaluationType")}
                                                />
                                                <StatusTableHeader
                                                    label="Hours"
                                                    sortable
                                                    sorted={sortField === "hours" ? sortDirection : "none"}
                                                    onSort={() => handleSort("hours")}
                                                    align="right"
                                                />
                                                <StatusTableHeader
                                                    label="Employee Status"
                                                    sortable
                                                    sorted={sortField === "employeeStatus" ? sortDirection : "none"}
                                                    onSort={() => handleSort("employeeStatus")}
                                                />
                                                <StatusTableHeader label="Actions" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {!loading && filteredData.length > 0 ? (
                                                filteredData.map((item) => (
                                                    <TableRow key={item.id} className="group">
                                                        <TableCell className="font-medium">
                                                            <button className="text-[var(--kpmg-blue)] hover:underline" title={item.employeeName}>
                                                                {shortEmployeeName(item.employeeName)}
                                                            </button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="max-w-[210px] truncate" title={item.projectClient}>
                                                                {item.projectClient}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell title={item.evaluatorName}>{shortEmployeeName(item.evaluatorName)}</TableCell>
                                                        <TableCell>
                                                            <ChipStatus role="evaluator" state={item.evaluatorStatus} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex justify-center">
                                                                <ChipEvaluationType type={item.evaluationType} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center font-medium">{item.hours}</TableCell>
                                                        <TableCell>
                                                            <ChipStatus role="employee" state={item.employeeStatus} />
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-1">

                                                                {item.evaluatorName?.trim() && (
                                                                    <ActionRemindButton onClick={() => handleRemind(item)} />
                                                                )}
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">

                                                                        <DropdownMenuItem onClick={() => handleView()}>
                                                                            <Eye className="mr-2 h-4 w-4" />
                                                                            View
                                                                        </DropdownMenuItem>

                                                                        {item.evaluatorStatus === "pending" && item.evaluatorName != "" && (
                                                                            <DropdownMenuItem onClick={() => handleOpenChangeEvaluatorModal(item)}>
                                                                                <UserX className="mr-2 h-4 w-4" />
                                                                                Change Evaluator
                                                                            </DropdownMenuItem>
                                                                        )}

                                                                        
                                                                        {/*{item.evaluatorStatus === "pending" && item.employeeStatus === "pending" && (*/}
                                                                        <DropdownMenuItem onClick={() => handleMarkAsException(item)}>
                                                                            <AlertCircle className="mr-2 h-4 w-4" />
                                                                            Mark Exception
                                                                            </DropdownMenuItem>
                                                                        {/*//)}*/}
                                                                        {item.evaluatorName?.trim() && (
                                                                        <DropdownMenuItem onClick={() => handleDelete(item)}>
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={8} className="text-center py-12">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Search className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm text-muted-foreground">
                                                                {loading ? "Loading..." : "No evaluations found. Adjust filters or invite evaluators."}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {filteredData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border-0" style={{ boxShadow: "var(--shadow-md)" }}>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <button className="text-[var(--kpmg-blue)] hover:underline font-medium">
                                                {item.employeeName}
                                            </button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">

                                                    <DropdownMenuItem onClick={() => handleView()}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
                                                    {/*<DropdownMenuItem onClick={() => handleOpenChangeEvaluatorModal(item)}>*/}
                                                    {/*    <UserX className="mr-2 h-4 w-4" />*/}
                                                    {/*    Change Evaluator*/}
                                                    {/*</DropdownMenuItem>*/}

                                                    {item.evaluatorName?.trim() && item.evaluatorStatus === "pending" && (
                                                        <DropdownMenuItem onClick={() => handleOpenChangeEvaluatorModal(item)}>
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            Change Evaluator
                                                        </DropdownMenuItem>
                                                    )}

                                                    <DropdownMenuItem onClick={() => handleMarkAsException(item)}>
                                                        <AlertCircle className="mr-2 h-4 w-4" />
                                                        Mark Exception
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(item)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="text-sm text-muted-foreground">{item.projectClient}</div>

                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Evaluator</p>
                                                <p className="font-medium">{item.evaluatorName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Hours</p>
                                                <p className="font-medium">{item.hours}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <ChipStatus role="evaluator" state={item.evaluatorStatus} />
                                            <ChipStatus role="employee" state={item.employeeStatus} />
                                            <ChipEvaluationType type={item.evaluationType} />
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => handleRemind(item)}
                                        >
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Reminder
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Final Conclusions Tab */}
                <TabsContent value="final-conclusions" className="space-y-4 mt-6">
                    {/* Desktop Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:block"
                    >
                        <Card className="border-0" style={{ boxShadow: "var(--shadow-lg)" }}>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow style={{ background: "var(--gradient-card)" }}>
                                                <StatusTableHeader label="Employee" sortable={false} />
                                                <StatusTableHeader label="Level" sortable={false} />
                                                <StatusTableHeader label="Business Unit" sortable={false} />
                                                <StatusTableHeader label="Performance Manager" sortable={false} />
                                                <StatusTableHeader label="Final Conclusion Status" sortable={false} />
                                                <StatusTableHeader label="Last Update" sortable={false} />
                                                <StatusTableHeader label="Actions" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            
                                            {loadingFinalConclusions ? (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-12">
                                                        Loading Final Conclusions...
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredFinalConclusions.length > 0 ? (
                                                filteredFinalConclusions.map(item => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">
                                                            <button className="text-[var(--kpmg-blue)] hover:underline">
                                                                {item.employeeName}
                                                            </button>
                                                        </TableCell>

                                                        <TableCell>{item.level}</TableCell>
                                                        <TableCell>{item.businessUnit}</TableCell>
                                                        <TableCell>{item.performanceManager}</TableCell>

                                                        {/*<TableCell>*/}
                                                        {/*    <Badge*/}
                                                        {/*        variant="secondary"*/}
                                                        {/*        className="capitalize"*/}
                                                        {/*        style={{*/}
                                                        {/*            background:*/}
                                                        {/*                item.conclusionPM === "Not Started"*/}
                                                        {/*                    ? "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"*/}
                                                        {/*                    : item.conclusionPM === "in-progress"*/}
                                                        {/*                        ? "linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)"*/}
                                                        {/*                        : "linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)",*/}
                                                        {/*            color:*/}
                                                        {/*                item.conclusionPM === "Completed"*/}
                                                        {/*                    ? "#2E7D32"*/}
                                                        {/*                    : item.conclusionPM === "in-progress"*/}
                                                        {/*                        ? "#F57C00"*/}
                                                        {/*                        : "#616161",*/}
                                                        {/*            border: "none",*/}
                                                        {/*        }}*/}
                                                        {/*    >*/}
                                                        {/*        {item.conclusionPM === "Not Started"*/}
                                                        {/*            ? "Started"*/}
                                                        {/*            : item.conclusionPM === "in-progress"*/}
                                                        {/*                ? "In Progress"*/}
                                                        {/*                : "Completed"}*/}
                                                        {/*    </Badge>*/}
                                                        {/*</TableCell>*/}
                                                        <TableCell>
                                                            <Badge
                                                                className="capitalize"
                                                                style={{
                                                                    background:
                                                                        item.conclusionStatus === "completed"
                                                                            ? "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"
                                                                            : item.conclusionStatus === "in-progress"
                                                                                ? "linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)"
                                                                                : "linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)",
                                                                    color:
                                                                        item.conclusionStatus === "completed"
                                                                            ? "#2E7D32"
                                                                            : item.conclusionStatus === "in-progress"
                                                                                ? "#F57C00"
                                                                                : "#616161",
                                                                    border: "none",
                                                                }}
                                                            >
                                                                {item.conclusionStatus === "not-started"
                                                                    ? "Not Started"
                                                                    : item.conclusionStatus === "in-progress"
                                                                        ? "In Progress"
                                                                        : "Completed"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-muted-foreground">
                                                            {item.lastUpdate ?? "—"}
                                                        </TableCell>

                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-1">
                                                                <ActionRemindButton onClick={() => handleFinalConclusionRemind(item)} />
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => navigate(`/final-conclusion/`)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                                    
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-12">
                                                        No Final Conclusions found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {finalConclusionsData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="border-0" style={{ boxShadow: "var(--shadow-md)" }}>
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <button className="text-[var(--kpmg-blue)] hover:underline font-medium">
                                                {item.employeeName}
                                            </button>
                                            <Badge
                                                variant="secondary"
                                                className="capitalize text-xs"
                                                style={{
                                                    background:
                                                        item.conclusionPM === "completed"
                                                            ? "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)"
                                                            : item.status === "in-progress"
                                                                ? "linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%)"
                                                                : "linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%)",
                                                    color:
                                                        item.conclusionPM === "completed"
                                                            ? "#2E7D32"
                                                            : item.conclusionPM === "in-progress"
                                                                ? "#F57C00"
                                                                : "#616161",
                                                    border: "none",
                                                }}
                                            >
                                                {item.conclusionPM === "not-started"
                                                    ? "Not Started"
                                                    : item.conclusionPM === "in-progress"
                                                        ? "In Progress"
                                                        : "Completed"}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Level</p>
                                                <p className="font-medium">{item.level}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Business Unit</p>
                                                <p className="font-medium">{item.businessUnit}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Performance Manager</p>
                                                <p className="font-medium">{item.performanceManager}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground">Last Update</p>
                                                <p className="font-medium">{item.lastUpdate || "—"}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleRemind(item)}
                                            >
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Reminder
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => toast.info("View Final Conclusion")}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Exceptions Tab */}
                <TabsContent value="exceptions" className="space-y-4 mt-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Button
                            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
                            className="text-white w-full sm:w-auto"
                            onClick={handleCreateException}
                        >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            Create New Exception
                        </Button>
                    </motion.div>

                    <div className="space-y-4">
                        {exceptions.length > 0 ? (
                            exceptions.map((exception, index) => (
                                <ExceptionCard
                                    key={exception.id}
                                    title={`${exception.employeeName} – ${exception.projectClient}`}
                                    reasonPreview={exception.reason ?? ""}
                                    createdOn={new Date().toISOString()}
                                    createdBy={"System"}
                                    exceptionType={exception.exceptionType ?? "other"}
                                    //exceptionType={exception.isException ??  "other"}
                                    onEdit={() => handleEditException(exception)}
                                    onRestore={() => handleRestoreException(exception.id)}
                                    index={index}
                                />
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                                <div className="inline-flex p-4 rounded-full mb-4" style={{ background: "var(--gradient-card)" }}>
                                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">No exceptions yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Click "Create New Exception" to add one
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <div
                        className="p-3 rounded-lg border-l-4 border-orange-300"
                        style={{ background: "linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)" }}
                    >
                        <p className="text-xs text-muted-foreground">
                            <strong>Note:</strong> Items marked as exceptions are excluded from Status Tracking,
                            reminders, and reports.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Modals */}
            {selectedRemindItem && (
                <RemindModal
                    open={remindModalOpen}
                    onClose={() => setRemindModalOpen(false)}
                    onConfirm={handleRemindConfirm}
                    evaluatorName={selectedRemindItem.evaluatorName}
                    employeeName={selectedRemindItem.employeeName}
                    projectClient={selectedRemindItem.projectClient}
                />
            )}

            <ExceptionModal
                mode={exceptionModalMode}
                open={exceptionModalOpen}
                onClose={() => setExceptionModalOpen(false)}
                onConfirm={handleExceptionConfirm}
                initialData={selectedExceptionData}
            />
            {/*{selectedItemForEvaluatorChange && (*/}
            {/*    <ChangeEvaluatorModal*/}
            {/*        open={changeEvaluatorModalOpen}*/}
            {/*        onClose={() => setChangeEvaluatorModalOpen(false)}*/}
            {/*        onConfirm={handleConfirmChangeEvaluator}*/}
            {/*        employeeName={selectedItemForEvaluatorChange.employeeName}*/}
            {/*        projectClient={selectedItemForEvaluatorChange.projectClient}*/}
            {/*        currentEvaluatorId={*/}
            {/*            availableEvaluators.find((e) => e.name === selectedItemForEvaluatorChange.evaluatorName)?.id || "e1"*/}
            {/*        }*/}
            {/*        currentEvaluatorName={selectedItemForEvaluatorChange.evaluatorName}*/}
            {/*        availableEvaluators={availableEvaluators}*/}
            {/*    />*/}
            {/*)}*/}

            {/*funciona solo trae catalogos*/}
            {/*{selectedItemForEvaluatorChange && (*/}
            {/*    <ChangeEvaluatorModal*/}
            {/*        open={changeEvaluatorModalOpen}*/}
            {/*        onClose={() => setChangeEvaluatorModalOpen(false)}*/}
            {/*        onConfirm={handleConfirmChangeEvaluator}*/}
            {/*        employeeName={selectedItemForEvaluatorChange.employeeName}*/}
            {/*        projectClient={selectedItemForEvaluatorChange.projectClient}*/}
            {/*        currentEvaluatorId={*/}
            {/*            availableEvaluators.find((e) => e.name.trim().toLowerCase() === selectedItemForEvaluatorChange.evaluatorName?.trim().toLowerCase())?.id*/}
            {/*            ?? ""*/}
            {/*        }*/}
            {/*        currentEvaluatorName={selectedItemForEvaluatorChange.evaluatorName}*/}
            {/*        availableEvaluators={availableEvaluators}*/}
            {/*    />*/}
            {/*)}*/}

            {selectedItemForEvaluatorChange && (
                <ChangeEvaluatorModal
                    open={changeEvaluatorModalOpen}
                    onClose={() => setChangeEvaluatorModalOpen(false)}
                    onConfirm={handleConfirmChangeEvaluator}
                    employeeName={selectedItemForEvaluatorChange.employeeName}
                    projectClient={selectedItemForEvaluatorChange.projectClient}
                    currentEvaluatorId={
                        currentEvaluatorForModal?.id
                        ?? (selectedItemForEvaluatorChange.evaluatorName
                            ? (evaluatorsByName.get(selectedItemForEvaluatorChange.evaluatorName.trim().toLowerCase()) ?? "")
                            : "")
                    }
                    currentEvaluatorName={
                        currentEvaluatorForModal?.name ?? selectedItemForEvaluatorChange.evaluatorName ?? ""
                    }
                    availableEvaluators={availableEvaluators}
                />
            )}
            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the evaluation for <strong>{itemToDelete?.employeeName}</strong> on <strong>{itemToDelete?.projectClient}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {/*<AlertDialogAction*/}
                        {/*    onClick={() => {*/}
                        {/*        if (itemToDelete) {*/}
                        {/*            setStatusData(statusData.filter((item) => item.id !== itemToDelete.id));*/}
                        {/*            toast.success("Evaluation deleted successfully");*/}
                        {/*        }*/}
                        {/*        setDeleteDialogOpen(false);*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    Delete*/}
                        {/*</AlertDialogAction>*/}

                        <AlertDialogAction
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={async () => {
                                if (!itemToDelete) return;

                                try {
                                    // Buscar item completo en statusData
                                    const evalItem = statusData.find(e => e.id === itemToDelete.id);
                                    if (!evalItem) {
                                        toast.error("Could not find evaluation metadata.");
                                        return;
                                    }

                                    // Construir payload EXACTO como ManagerEvaluation
                                    const payload = {
                                        IdColabEmpProy: evalItem.id,
                                        PkEvalGene: evalItem.pkEvalGene,
                                        KeyReport: evalItem.keyReport,
                                        GeneratedType: evalItem.generatedType
                                    };

                                    // Llamada a la API real
                                    await managerApi.deleteEvaluation(payload);

                                    toast.success(`Deleted evaluation for "${itemToDelete.employeeName}"`);

                                    // Cerrar modal
                                    setDeleteDialogOpen(false);
                                    setItemToDelete(null);

                                    // Refrescar tabla Status
                                    await loadStatus();

                                } catch (err: any) {
                                    toast.error("Error deleting evaluation.");
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default StatusReminders;