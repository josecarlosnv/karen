
import { useEffect, useMemo, useState } from "react";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { ManagerEvaluationCard } from "../components/evaluation/ManagerEvaluationCard";
import { managerApi } from "../../app/api/managerEvaluationApi";
import { toast } from "sonner";
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

type EvaluatorState = "pending" | "submitted" | "completed";

interface ManagerEvaluation {
    id: string;            // IdColabEmpProy
    personName: string;    // EvaluatedName
    role: string;
    clientName: string;
    clientNumber: string;  // EntityNumber
    state: EvaluatorState; // pending|submitted|completed
    cutoffPeriod: string;
    evaluatedHours: number;
    dueDate: string;       // fecha objetivo/última modificación

    pkEvalGene?: number;
    keyReport?: string;
    generatedType?: number;

}

//function mapApiToCard(x: any): ManagerEvaluation {
//    return {
//        id: String(x.id ?? x.idColabEmpProy ?? ""),
//        personName: String(x.personName ?? x.evaluatedName ?? ""),
//        role: String(x.role ?? ""),
//        clientName: String(x.clientName ?? ""),
//        clientNumber: String(x.clientNumber ?? x.entityNumber ?? ""),
//        state: (x.state ?? "pending") as EvaluatorState,
//        cutoffPeriod: String(x.cutoffPeriod ?? ""),
//        evaluatedHours: Number(x.evaluatedHours ?? 0),
//        dueDate: String(x.dueDate ?? ""),
//    };
//}
function formatCutoffPeriodFromNumber(cutOff: number | string | undefined, refDate?: string) {
    const n = Number(cutOff);
    if (n !== 2 && n !== 3) return "";

    // Año de referencia: usa dueDate si llega, si no, hoy
    const d = refDate ? new Date(refDate) : new Date();
    const endFY = d.getFullYear();
    const startFY = endFY - 1;

    const monthStart = n === 3 ? "Junio" : "Diciembre";
    const monthEnd = "Mayo";
    return `${monthStart} ${startFY} - ${monthEnd} ${endFY}`;
}
function mapApiToCard(x: any): ManagerEvaluation {
    const cutOffNum = Number(x.cutoffPeriod ?? x.cutOff ?? 0); // el back te manda 2/3 aquí
    const due = String(x.dueDate ?? "");

    return {
        id: String(x.id ?? x.idColabEmpProy ?? ""),
        personName: String(x.personName ?? x.evaluatedName ?? ""),
        role: String(x.role ?? ""),
        clientName: String(x.clientName ?? ""),
        clientNumber: String(x.clientNumber ?? x.entityNumber ?? ""),
        state: (x.state ?? "pending") as EvaluatorState,
        // Derivamos el texto usando el número del back:
        cutoffPeriod: formatCutoffPeriodFromNumber(cutOffNum, due),
        evaluatedHours: Number(x.evaluatedHours ?? 0),
        dueDate: due,
        // (Opcional) conservar el número para otras lógicas:
        // @ts-ignore si tu interfaz no lo tiene aún, agrégalo allí:
        cutOff: cutOffNum,


        pkEvalGene: x.pkEvalGene,
        keyReport: x.keyReport,
        generatedType: x.generatedType

    };
}

export function ManagerEvaluations() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState<ManagerEvaluation[]>([]);
    const [submitted, setSubmitted] = useState<ManagerEvaluation[]>([]);
    const [completed, setCompleted] = useState<ManagerEvaluation[]>([]);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [evaluationToDelete, setEvaluationToDelete] = useState<{ id: string; personName: string } | null>(null);

    // ManagerEvaluation.tsx
    


    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const data = await managerApi.getInbox(); // GET /api/manager-evaluations
                if (!mounted) return;

                setPending((data.pending || []).map(mapApiToCard));
                setSubmitted((data.submitted || []).map(mapApiToCard));
                setCompleted((data.completed || []).map(mapApiToCard));
                setWarnings(data.warnings || []);
                setError(null);
            } catch (err: any) {
                setError("Error loading manager evaluations");
                toast.error("Error loading manager evaluations");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, []);

    // Filtro por búsqueda (nombre/cliente/número)
    const filterList = (list: ManagerEvaluation[]) => {
        const term = searchQuery.trim().toLowerCase();
        if (!term) return list;
        return list.filter(e =>
            e.personName.toLowerCase().includes(term) ||
            e.clientName.toLowerCase().includes(term) ||
            e.clientNumber.toLowerCase().includes(term)
        );
    };

    const handleDelete = (id: string, personName: string) => {
        setEvaluationToDelete({ id, personName });
        setDeleteDialogOpen(true);
    };

    const filteredPending = useMemo(() => filterList(pending), [pending, searchQuery]);
    const filteredSubmitted = useMemo(() => filterList(submitted), [submitted, searchQuery]);
    const filteredCompleted = useMemo(() => filterList(completed), [completed, searchQuery]);
    
    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="inline-block text-4xl font-bold leading-tight pb-[2px] bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                    Manager Evaluations
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Review and evaluate your team members' performance
                </p>
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, client, or number..."
                        className="pl-9"
                        style={{ background: "var(--gradient-card)" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Warnings/Errors */}
            {loading && <div className="text-sm text-muted-foreground">Loading...</div>}
            {error && <div className="text-sm text-red-500">Error: {error}</div>}
            {warnings.length > 0 && (
                <div className="text-sm text-amber-600">
                    {warnings.map((w, i) => <div key={i}>• {w}</div>)}
                </div>
            )}

            {/* Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Tabs defaultValue="pending" className="space-y-6">
                    <TabsList className="grid w-full max-w-md grid-cols-3 bg-white" style={{ boxShadow: "var(--shadow-sm)" }}>
                        <TabsTrigger
                            value="pending"
                            className="justify-center text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--kpmg-blue)] data-[state=active]:to-[var(--cobalt-blue)] data-[state=active]:text-white"
                        >
                            Pending
                            {/*<span className="ml-2 text-xs opacity-70 data-[state=active]:opacity-100">*/}
                            {/*    ({pending.length})*/}
                            {/*</span>*/}
                        </TabsTrigger>

                        <TabsTrigger
                            value="submitted"
                            className="justify-center text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--kpmg-blue)] data-[state=active]:to-[var(--cobalt-blue)] data-[state=active]:text-white"
                        >
                            Submitted
                            {/*<span className="ml-2 text-xs opacity-70 data-[state=active]:opacity-100">*/}
                            {/*    ({submitted.length})*/}
                            {/*</span>*/}
                        </TabsTrigger>

                        <TabsTrigger
                            value="completed"
                            className="justify-center text-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[var(--kpmg-blue)] data-[state=active]:to-[var(--cobalt-blue)] data-[state=active]:text-white"
                        >
                            Completed
                            {/*<span className="ml-2 text-xs opacity-70 data-[state=active]:opacity-100">*/}
                            {/*    ({completed.length})*/}
                            {/*</span>*/}
                        </TabsTrigger>
                    </TabsList>

                    {/* Pending Tab */}
                    <TabsContent value="pending" className="space-y-4">
                        {filteredPending.length > 0 ? (
                            filteredPending.map((evaluation, index) => (
                                <ManagerEvaluationCard key={evaluation.id} {...evaluation} index={index} onDelete={handleDelete}
/>
                            ))
                        ) : (
                            <EmptyTab message={searchQuery ? "Try adjusting your search" : "No pending evaluations"} />
                        )}
                    </TabsContent>

                    {/* Submitted Tab */}
                    <TabsContent value="submitted" className="space-y-4">
                        {filteredSubmitted.length > 0 ? (
                            filteredSubmitted.map((evaluation, index) => (
                                <ManagerEvaluationCard key={evaluation.id} {...evaluation} index={index} onDelete={handleDelete}
/>
                            ))
                        ) : (
                            <EmptyTab message={searchQuery ? "Try adjusting your search" : "No drafts saved"} />
                        )}
                    </TabsContent>

                    {/* Completed Tab */}
                    <TabsContent value="completed" className="space-y-4">
                        {filteredCompleted.length > 0 ? (
                            filteredCompleted.map((evaluation, index) => (
                                <ManagerEvaluationCard key={evaluation.id} {...evaluation} index={index} onDelete={handleDelete}
/>
                            ))
                        ) : (
                            <EmptyTab message={searchQuery ? "Try adjusting your search" : "No completed evaluations"} />
                        )}
                    </TabsContent>
                </Tabs>
            </motion.div>
            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete evaluation?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {evaluationToDelete && (
                                <>
                                    You're about to delete the evaluation for <strong>{evaluationToDelete.personName}</strong>.
                                    This action cannot be undone.
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        {/*<AlertDialogAction*/}
                        {/*    onClick={() => {*/}
                        {/*        if (evaluationToDelete) {*/}
                        {/*            toast.success(`Deleted evaluation for "${evaluationToDelete.personName}"`);*/}
                        {/*            setDeleteDialogOpen(false);*/}
                        {/*            setEvaluationToDelete(null);*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*    className="bg-gray-600 hover:bg-gray-700 text-white"*/}
                        {/*>*/}
                        {/*    Delete*/}
                        {/*</AlertDialogAction>*/}

                        <AlertDialogAction
                            onClick={async () => {
                                if (!evaluationToDelete) return;

                                try {
                                    // Buscar la card completa en cualquiera de las pestañas
                                    const evalItem =
                                        pending.find(e => e.id === evaluationToDelete.id) ||
                                        submitted.find(e => e.id === evaluationToDelete.id) ||
                                        completed.find(e => e.id === evaluationToDelete.id);

                                    if (!evalItem) {
                                        toast.error("Could not find evaluation metadata.");
                                        return;
                                    }

                                    // Payload para la API
                                    const payload = {
                                        IdColabEmpProy: evalItem.id,
                                        PkEvalGene: evalItem.pkEvalGene,
                                        KeyReport: evalItem.keyReport,
                                        GeneratedType: evalItem.generatedType
                                    };

                                    await managerApi.deleteEvaluation(payload);

                                    toast.success(`Deleted evaluation for "${evaluationToDelete.personName}"`);

                                    // Cerrar modal
                                    setDeleteDialogOpen(false);
                                    setEvaluationToDelete(null);

                                    // Refrescar bandeja
                                    const refreshed = await managerApi.getInbox();
                                    setPending((refreshed.pending ?? []).map(mapApiToCard));
                                    setSubmitted((refreshed.submitted ?? []).map(mapApiToCard));
                                    setCompleted((refreshed.completed ?? []).map(mapApiToCard));

                                } catch (err: any) {
                                    toast.error("Error deleting evaluation.");
                                }
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                        >
                            Delete
                        </AlertDialogAction>

                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function EmptyTab({ message }: { message: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="inline-flex p-4 rounded-full mb-4" style={{ background: "var(--gradient-card)" }}>
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{message}</h3>
            <p className="text-sm text-muted-foreground">
                {message.includes("search") ? "Refine your query" : "Items will appear here when available"}
            </p>
        </motion.div>
    );
}


