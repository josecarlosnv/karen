
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Search, Plus, TrendingUp, Clock, Edit, Trash2 } from "lucide-react";
import { StartEvaluationPanel } from "../components/evaluation/StartEvaluationPanel";
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
import { toast } from "sonner";
import { selfEvalApi } from "../api/selfEvaluationApi"; // validateExtra / addExtra / getIndex / lookupClientName

// ------------------------------
// Tipos locales
// ------------------------------
type EvaluationState = "start" | "continue" | "submitted" | "completed";

export interface Evaluation {
    id: string;
    project: string;
    state: EvaluationState;
    evaluationPeriod?: string;
    createdDate?: string;
    dueDate?: string;
    progress?: number;
    role?: string;
    submittedDate?: string;
    evaluatorName?: string;
    cutOff?: number;
    evaluatorStatus?: "pending" | "completed";
    canEdit?: boolean;

    // API expone ColumnC como isClosed (entero): 0=COMPLETO, 1=PENDIENTE
    isClosed?: boolean;
    columnC?: number;

    submissionState?: "draft" | "submitted";
    score?: number;
    modifiedDate?: string;
    clientId?: string;
    pkEvalGene?: number | string | null;
    source?: "existing" | "startable";


    keyReport?: string | null;
    generatedType?: number | null;

}

// ------------------------------
// Cliente HTTP mínimo (usa VITE_SCOREFY_API_URL)
// ------------------------------
const API_BASE = import.meta.env.VITE_SCOREFY_API_URL ?? "";

async function http<T = any>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        credentials: "include", mode: "cors",
        
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    return res.json() as Promise<T>;
}

const api = {
    getIndex: (search?: string) =>
        http<{
            evaluations: Evaluation[];
            roles: string[];
            projects: { pkEvalGene: string; label: string }[];
            evaluators: { id: string; name: string; initials: string }[];
            warnings: string[];
        }>(`/api/self-evaluations?search=${encodeURIComponent(search ?? "")}`),

    getProgress: (id: string, role: string, evaluatorId?: string | number) => {
        const q = new URLSearchParams({ role });
        if (evaluatorId) q.set("evaluatorId", String(evaluatorId));
        return http<{ contestados: number; total: number; evaluatorOk: boolean; completo: boolean }>(
            `/api/self-evaluations/${id}/progress?${q.toString()}`
        );
    },

};

// ------------------------------
// Componente principal
// ------------------------------
export function SelfEvaluations() {
    const [isStartPanelOpen, setIsStartPanelOpen] = useState(false);
    const [preselectedClient, setPreselectedClient] = useState<{ id: string; name: string; clientId: string } | null>(null);
    const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null);

    const [allEvaluations, setAllEvaluations] = useState<Evaluation[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [projects, setProjects] = useState<{ pkEvalGene: string; label: string }[]>([]);
    const [evaluators, setEvaluators] = useState<{ id: string; name: string; initials: string }[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //const [search, setSearch] = useState< >("");
    const [search, setSearch] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);

    // ------------------------------
    // Cargar bandeja desde el backend
    // ------------------------------
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);

                // 🔥 Llamada remota con búsqueda
                const data = await api.getIndex(search);
                if (!mounted) return;

                // Normalizar estados por compatibilidad:
                let mapped = (data.evaluations || []).map((e) => {
                    let state = e.state as EvaluationState;
                    if (state === "not-started") state = "start";
                    if (state === "in-progress") state = "continue";
                    return { ...e, state };
                });

                // Si quieres mantener tu fix temporal del 50%
                mapped = mapped.map(e => {
                    if (e.state === "continue") {
                        return { ...e, progress: 50 };
                    }
                    return e;
                });

                // Setear resultados normalizados
                setAllEvaluations(mapped);
                setRoles(data.roles || []);
                setProjects(data.projects || []);
                setEvaluators(data.evaluators || []);
                setWarnings(data.warnings || []);
                setError(null);

            } catch (err: any) {
                setError("Error al cargar evaluaciones");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [search]); // 🔥 muy importante: depende de “search”

    
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return allEvaluations;

        return allEvaluations.filter(e =>
            [
                e.project,
                e.role,
                e.evaluatorName,
                e.clientId,
                e.pkEvalGene,
                e.keyReport,
            ]
                .map(v => String(v ?? "").toLowerCase())
                .some(v => v.includes(term))
        );
    }, [allEvaluations, search]);


    // Pestaña "Pending": start + continue
    const activeEvaluations = useMemo(
        () => filtered.filter((e) => e.state === "start" || e.state === "continue"),
        [filtered]
    );
    const submittedEvaluations = useMemo(() => filtered.filter((e) => e.state === "submitted"), [filtered]);
    const completedEvaluations = useMemo(() => filtered.filter((e) => e.state === "completed"), [filtered]);

    const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

    // Año de referencia: dueDate -> submittedDate -> createdDate -> año actual
    const getReferenceYear = (e: Evaluation) => {
        const parse = (d?: string) => (d ? new Date(d) : null);
        return (
            parse(e.dueDate)?.getFullYear() ??
            parse(e.submittedDate)?.getFullYear() ??
            parse(e.createdDate)?.getFullYear() ??
            new Date().getFullYear()
        );
    };

    // "junio YYYY - mayo YYYY+1" (cutOff=3) | "diciembre YYYY - mayo YYYY+1" (cutOff=2).
    const formatCutoffPeriod = (e: Evaluation, options?: { capitalizeMonths?: boolean }) => {
        if (e.cutOff !== 2 && e.cutOff !== 3) return null;

        const cap = options?.capitalizeMonths ?? false;
        const endFY = getReferenceYear(e);
        const startFY = endFY - 1;

        const monthStart = e.cutOff === 3 ? "Junio" : "Diciembre";
        const monthEnd = "Mayo";

        const sm = cap ? capitalize(monthStart) : monthStart;
        const em = cap ? capitalize(monthEnd) : monthEnd;

        return `${sm} ${startFY} - ${em} ${endFY}`;
    };

    // ------------------------------
    // Helpers UI (colores/labels)
    // ------------------------------
    const getStateColor = (state: EvaluationState) => {
        switch (state) {
            case "continue":
                return "var(--kpmg-blue)";
            case "start":
                return "#94a3b8";
            case "submitted":
                return "var(--pacific-blue)";
            case "completed":
                return "#7213EA";
            default:
                return "#94a3b8";
        }
    };

    const getStateLabel = (state: EvaluationState) => {
        switch (state) {
            case "continue":
                return "Continue";
            case "start":
                return "Start";
            case "submitted":
                return "Submitted";
            case "completed":
                return "Completed";
            default:
                return "";
        }
    };

    // ------------------------------
    // Render de tarjeta
    // ------------------------------
    const renderEvaluationCard = (evaluation: Evaluation, index: number) => {
        const stateColor = getStateColor(evaluation.state);
        const isActive = evaluation.state === "start" || evaluation.state === "continue";
        const isPending = evaluation.state === "start" || evaluation.state === "continue";
        const isSubmitted = evaluation.state === "submitted";

        const cutoffPeriodText = formatCutoffPeriod(evaluation, { capitalizeMonths: false });

        // Línea de metadatos consolidada
        //Separar los valores del role
        const metadataItems: string[] = [];

        //if (evaluation.state !== "start" && evaluation.role) {
        //    metadataItems.push(cutoffPeriodText ? `${evaluation.role} · ${cutoffPeriodText}` : evaluation.role);
        //} else if (cutoffPeriodText) {
        //    metadataItems.push(cutoffPeriodText);
        //}

        if (evaluation.state !== "start") {

            if (cutoffPeriodText) {
                metadataItems.push(cutoffPeriodText);   // Primero cutoff
            }

            if (evaluation.role) {
                metadataItems.push(evaluation.role);    // Después el rol
            }

        } else if (cutoffPeriodText) {
            metadataItems.push(cutoffPeriodText);
        }


        if (evaluation.evaluationPeriod) {
            metadataItems.push(evaluation.evaluationPeriod);
        }
        if (evaluation.state === "completed" && evaluation.modifiedDate) {
            metadataItems.push(
                `Modified ${new Date(evaluation.modifiedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}`
            );
        } else if (evaluation.state !== "start" && evaluation.createdDate) {
            metadataItems.push(
                `Created ${new Date(evaluation.createdDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}`
            );
        }



        const handleStartEvaluation = (evaluation: Evaluation) => {
            // Si por alguna razón viniera sin pkEvalGene (no debería), abrir panel sin preselección
            if (!evaluation.pkEvalGene) {
                setPreselectedClient(null);
                setSelectedEvaluationId(null);
                setIsStartPanelOpen(true);
                return;
            }

            setPreselectedClient({
                id: String(evaluation.pkEvalGene), // ← valor para POST /start
                name: evaluation.project,
                clientId: String(evaluation.clientId ?? ""),
            });
            setSelectedEvaluationId(evaluation.id);
            setIsStartPanelOpen(true);
        };

        const lockedCompleted = (evaluation.isClosed ?? true) === false; // 0=COMPLETO → locked

        return (
            //<motion.div key={evaluation.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>

            <motion.div
                key={evaluation.id ?? evaluation.pkEvalGene ?? index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >

                <Card className="border-0 group hover:shadow-xl transition-all duration-300 overflow-hidden relative" style={{ boxShadow: "var(--shadow-lg)" }}>
                    {/* Left accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: stateColor }} />

                    
                    {(evaluation.state === "submitted"
                        || evaluation.state === "completed"
                        || evaluation.state === "pending")
                        && evaluation.isClosed === null && (   // ⬅️ Aquí se oculta cuando está cerrado
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20"
                                style={{ color: '#94a3b8' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEvaluationToDelete(evaluation);
                                    setDeleteDialogOpen(true);
                                }}
                                aria-label="Delete evaluation"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        )}


                    <CardContent className={`relative h-full ${isPending ? "p-4 pl-6" : isSubmitted ? "p-4 pl-6" : "p-5 pl-7"}`}>
                        {/* Subtle gradient overlay on hover - only for active items */}
                        {isActive && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "var(--gradient-card)" }} />}

                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10 h-full">
                            <div className={`flex-1 ${isPending ? "space-y-2" : isSubmitted ? "space-y-2" : "space-y-3"}`}>
                                {/* Title and Metadata */}
                                <div className={isPending ? "space-y-1.5" : "space-y-2"}>
                                    <h3 className="font-semibold text-xl" style={{ color: "var(--kpmg-blue)" }}>
                                        {evaluation.project}
                                    </h3>

                                    {/*Aqui esta el punto de la bolita*/}
                                    <div className="text-sm" style={{ color: "#64748b" }}>

                                        {metadataItems.map((item, i) => (
                                            <span key={i} className="inline-flex items-center">
                                                {item}
                                                {i < metadataItems.length - 1 && (
                                                    <span className="mx-2 inline-block w-1 h-1 rounded-full bg-slate-400" />
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Progress Bar - only for continue */}
                                {evaluation.state === "continue" && evaluation.progress !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#64748b" }} />
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: "linear-gradient(90deg, #0C233C 0%, #00338D 100%)" }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${evaluation.progress}%` }}
                                                transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold flex-shrink-0 min-w-[3ch]" style={{ color: "var(--kpmg-blue)" }}>
                                            {evaluation.progress}%
                                        </span>
                                    </div>
                                )}

                                {/* Submitted / Completed info */}
                                {(evaluation.state === "submitted" || evaluation.state === "completed") && (
                                    <div className="space-y-1.5">
                                        {evaluation.state === "submitted" && (
                                            <>
                                                <Badge
                                                    variant="secondary"
                                                    className="font-normal text-xs"
                                                    style={{ backgroundColor: `${stateColor}15`, color: stateColor, border: `1px solid ${stateColor}30` }}
                                                >
                                                    {evaluation.submissionState === "draft" ? "Draft" : "Submitted"}
                                                </Badge>

                                                <div className="text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span style={{ color: "#64748b" }}>Evaluator:</span>
                                                        <span className="font-medium" style={{ color: "var(--spectrum-blue)" }}>
                                                            {evaluation.evaluatorName || "Assigned evaluator"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Clock className="h-3.5 w-3.5" style={{ color: "#64748b" }} />
                                                        <span style={{ color: "#64748b" }}>
                                                            {evaluation.submissionState === "draft" ? "Status: Not sent" : "Status: Waiting for send evaluation"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {evaluation.state === "completed" && (
                                            <>
                                                <Badge
                                                    variant="secondary"
                                                    className="font-normal text-xs"
                                                    style={{ color: stateColor }}
                                                >
                                                    {/*{getStateLabel(evaluation.state)}*/}
                                                    <span style={{ color: "#64748b" }}>
                                                        {evaluation.isClosed === false ? "Status: Completed" : "Status: Waiting for evaluator"}
                                                    </span>
                                                </Badge>

                                                <div className="text-sm space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span style={{ color: "#64748b" }}>Evaluator:</span>
                                                        <span className="font-medium" style={{ color: "var(--spectrum-blue)" }}>
                                                            {evaluation.evaluatorName || "N/A"}
                                                        </span>
                                                    </div>
                                                    {evaluation.score !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ color: "#64748b" }}>Score:</span>
                                                            <span className="font-semibold text-base" style={{ color: "#0C233C" }}>
                                                                {evaluation.score}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 md:self-start min-w-[140px] md:mr-8">
                                {evaluation.state === "start" && (
                                    <Button
                                        className="w-full text-white"
                                        style={{ background: "linear-gradient(135deg, #00338D 0%, #1E49E2 100%)" }}
                                        onClick={() => handleStartEvaluation(evaluation)}
                                    >
                                        Start
                                    </Button>
                                )}

                                {evaluation.state === "continue" && (
                                    <Button asChild className="w-full text-white" style={{ background: "linear-gradient(135deg, #7213EA 0%, #1E49E2 100%)" }}>
                                        <Link to={`/self-evaluations/${evaluation.id}`}>Continue</Link>
                                    </Button>
                                )}

                                {evaluation.state === "submitted" && (
                                    <Button asChild variant="ghost" size="sm" className="w-full text-white" style={{ background: 'linear-gradient(135deg, #00338D 0%, #1E49E2 100%)' }}>
                                        <Link to={`/self-evaluations/${evaluation.id}/edit`}>
                                            <Edit className="h-3.5 w-3.5 mr-1.5" />
                                            Edit answers
                                        </Link>
                                    </Button>
                                )}

                                {evaluation.state === "completed" && (
                                    <>
                                        <Button asChild className="w-full text-white" style={{ background: "linear-gradient(135deg, #00338D 0%, #1E49E2 100%)" }}>
                                            <Link to={`/self-evaluations/${evaluation.id}`}>View answers</Link>
                                        </Button>

                                        {evaluation.canEdit && !lockedCompleted && (
                                            <Button asChild variant="ghost" size="sm" className="w-full" style={{ color: "var(--kpmg-blue)" }}>
                                                <Link to={`/self-evaluations/${evaluation.id}/edit`}>
                                                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                                                    Edit
                                                </Link>
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };

    // ------------------------------
    // Render principal
    // ------------------------------
    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <motion.div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                        Self-Evaluations
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your self-evaluation submissions</p>
                </div>
                <Button
                    size="lg"
                    style={{ background: "linear-gradient(135deg, #00338D 0%, #1E49E2 100%)", boxShadow: "var(--shadow-md)" }}
                    className="hover:shadow-lg transition-all text-white"
                    onClick={() => {
                        setPreselectedClient(null);
                        setSelectedEvaluationId(null);
                        setIsStartPanelOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-5 w-5" />
                    New Evaluation
                </Button>
            </motion.div>

            <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search evaluations..."
                        className="pl-9"
                        style={{ background: "var(--gradient-card)" }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Mensajes de carga/errores/advertencias */}
            {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            {warnings?.length > 0 && (
                <div className="text-sm text-amber-600">
                    {warnings.map((w, i) => (
                        <div key={i}>• {w}</div>
                    ))}
                </div>
            )}

            <Tabs defaultValue="pending">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-white" style={{ boxShadow: 'var(--shadow-sm)' }}>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--kpmg-blue)] data-[state=active]:to-[var(--cobalt-blue)] data-[state=active]:text-white">
                        Pending
                    </TabsTrigger>
                    <TabsTrigger value="submitted" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--kpmg-blue)] data-[state=active]:to-[var(--cobalt-blue)] data-[state=active]:text-white">
                        Submitted
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--kpmg-blue)] data-[state=active]:to-[var(--cobalt-blue)] data-[state=active]:text-white">
                        Completed
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4 mt-6">
                    {activeEvaluations.map((evaluation, index) => renderEvaluationCard(evaluation, index))}
                    {!loading && activeEvaluations.length === 0 && <div className="text-sm text-muted-foreground">No pending evaluations found.</div>}
                </TabsContent>

                <TabsContent value="submitted" className="space-y-4 mt-6">
                    {submittedEvaluations.map((evaluation, index) => renderEvaluationCard(evaluation, index))}
                    {!loading && submittedEvaluations.length === 0 && <div className="text-sm text-muted-foreground">No submitted evaluations found.</div>}
                </TabsContent>

                <TabsContent value="completed" className="space-y-4 mt-6">
                    {completedEvaluations.map((evaluation, index) => renderEvaluationCard(evaluation, index))}
                    {!loading && completedEvaluations.length === 0 && <div className="text-sm text-muted-foreground">No completed evaluations found.</div>}
                </TabsContent>
            </Tabs>

            <StartEvaluationPanel
                isOpen={isStartPanelOpen}
                onClose={() => {
                    setIsStartPanelOpen(false);
                    setPreselectedClient(null);
                    setSelectedEvaluationId(null);
                    // TIP: refresca bandeja si el panel hizo POST /start
                    // (por ejemplo, volviendo a llamar api.getIndex() aquí con un setTimeout o con un flag que observe onClose)
                }}
                preselectedClient={preselectedClient}
                evaluationId={selectedEvaluationId || undefined}
            />

            {/*{evaluation.isClosed !== 0 && (*/}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete evaluation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {evaluationToDelete && (
                                <>
                                    You're about to delete <strong>{evaluationToDelete.project}</strong>.
                                    This action cannot be undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        
                        <AlertDialogAction
                            onClick={async () => {
                                if (!evaluationToDelete) return;

                                try {
                                    const evalItem = evaluationToDelete;

                                    const payload = {
                                        IdColabEmpProy: evalItem.id,
                                        PkEvalGene: evalItem.pkEvalGene ,
                                        KeyReport: evalItem.keyReport ,
                                        GeneratedType: evalItem.generatedType ,
                                    };

                                    await selfEvalApi.deleteEvaluation(payload);

                                    toast.success(`Deleted "${evalItem.project}"`);

                                    // Cerrar popup
                                    setDeleteDialogOpen(false);
                                    setEvaluationToDelete(null);

                                    // Refrescar bandeja SelfEvaluations
                                    setLoading(true);
                                    const data = await api.getIndex();

                                    const mapped = (data.evaluations ?? []).map(e => {
                                        let state = e.state;
                                        if (state === "not-started") state = "start";
                                        if (state === "in-progress") state = "continue";
                                        return { ...e, state };
                                    });

                                    setAllEvaluations(mapped);

                                    setRoles(data.roles ?? []);
                                    setProjects(data.projects ?? []);
                                    setEvaluators(data.evaluators ?? []);
                                    setWarnings(data.warnings ?? []);

                                } catch (err: any) {
                                    toast.error("Error deleting evaluation");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>


                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/*)}*/}

        </div>
    );
}