

import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { ArrowLeft, Building2, Briefcase, User, Save, Send, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { EnhancedReactivoCard } from "@/app/components/evaluation/EnhancedReactivoCard";
import { ExcludedItemsAccordion } from "@/app/components/evaluation/ExcludedItemsAccordion";
import { ComparisonSummary } from "@/app/components/evaluation/ComparisonSummary";
import { toast } from "sonner";
import { managerApi, type ApiFormResponse } from "@/app/api/managerEvaluationApi";

// =============================
// Utils (clave compuesta y pesos)
// =============================
type EvaluatorValue = { score: number | null; comment: string; isNA: boolean };

// Clave compuesta estable POR REACTIVO (evita depender del índice)
function makeKey(it: any, idx?: number) {
    const c = it.competence ?? "";
    const s = it.subCompetence ?? "";
    const r = it.reactiveNum ?? `RN#${idx ?? ""}`;
    return `${c}::${s}::${r}`;
}

function normalizeWeight(w?: number | null) {
    if (!w || w <= 0) return 0;
    return w > 1 ? w / 100 : w; // 47 -> 0.47
}

export function ManagerEvaluationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<ApiFormResponse | null>(null);

    // Estado del evaluador POR REACTIVO usando la clave compuesta
    const [evaluatorData, setEvaluatorData] = useState<Record<string, EvaluatorValue>>({});

    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    // NUEVO: valor final (ponderado) del evaluator, reportado por ComparisonSummary
    const [evaluatorFinalScore, setEvaluatorFinalScore] = useState<number | null>(null);

    const [initialEvaluatorData, setInitialEvaluatorData] = useState<Record<string, EvaluatorValue>>({});
    // =============================
    // Carga desde API (sin cambiar tu UI)
    // =============================

    const [isClosed, setIsClosed] = useState<boolean | null>(null);



    useEffect(() => {
        let alive = true;
        (async () => {
            if (!id) return;
            setLoading(true);
            try {
                // GET /api/manager-evaluations/{id}/form
                const payload = await managerApi.getForm(id); // devuelve { IdColabEmpProy, Items, Header }  [2](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/FinalScoreSummary.txt)
                if (!alive) return;

                setForm(payload);
                setIsClosed(payload.header?.isClosed ?? null);

                // Inicializa estado "vivo" del evaluador desde BD, por REACTIVO (clave compuesta)
                const init: Record<string, EvaluatorValue> = {};
                (payload.items ?? []).forEach((it, idx) => {
                    const key = makeKey(it, idx);
                    const resp = it.evaluatorResp ?? null;
                    const isStoredNA = (it.ecdId ?? 0) > 0 && resp === 0; // NA guardado como 0 en BD
                    init[key] = {
                        score: resp != null && resp > 0 ? resp : null,
                        comment: it.evaluatorComent ?? "",
                        isNA: isStoredNA,
                    };
                });
                setEvaluatorData(init);
                setInitialEvaluatorData(init);
            } catch (e) {
                console.error(e);
                toast.error("No se pudo cargar el formulario del evaluador");
            } finally {
                setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    const hasChanges = useMemo(() => {
        const keys = Object.keys(evaluatorData);

        return keys.some((key) => {
            const current = evaluatorData[key];
            const initial = initialEvaluatorData[key];

            if (!initial) return true; // reactivo nuevo o inconsistencia

            return (
                current.score !== initial.score ||
                current.comment !== initial.comment ||
                current.isNA !== initial.isNA
            );
        });
    }, [evaluatorData, initialEvaluatorData]);


    // =============================
    // Aliases para UI (idéntico a tu estructura)
    // =============================
    const header = form?.header;
    const evaluationReactivos = form?.items ?? [];

    // Self (evaluado) solo para mostrar en tarjetas (fijo BD)
    const mockSelfScores = useMemo(
        () =>
            (form?.items ?? []).map((it) => {
                const s = it?.evaluatedResp ?? null;
                const isNA = s === null || s === 0;
                return {
                    score: isNA ? null : s,
                    comment: it?.evaluatedComent ?? "",
                    isNA,
                };
            }),
        [form]
    );
    // =============================
    // Handlers (sin tocar tu UI)
    // =============================
    const handleReactivoChange = (key: string, value: EvaluatorValue) => {
        setEvaluatorData((prev) => ({ ...prev, [key]: value }));
    };

    const handleRestore = (index: number) => {
        if (!form) return;
        const it = form.items[index];
        const key = makeKey(it, index);
        setEvaluatorData((prev) => {
            const next = { ...prev };
            if (next[key]) next[key] = { ...next[key], isNA: false };
            return next;
        });
        toast.success("Item restored to evaluation");
    };

    // =============================
    // Validación (misma lógica que tenías)
    // =============================
    const isFormValid = () => {
        for (let index = 0; index < evaluationReactivos.length; index++) {
            const it = evaluationReactivos[index];
            const key = makeKey(it, index);
            const evalData = evaluatorData[key];
            const selfData = mockSelfScores[index];

            // Si el evaluado marcó NA, se omite
            if (selfData?.isNA) continue;

            // Si el evaluador marcó NA, válido
            if (evalData?.isNA) continue;

            // Si no hay data, incompleto
            if (!evalData) return false;

            // Debe tener score
            if (evalData.score === null) return false;

            // Comentario obligatorio para cierta subcompetencia (ajusta a tu regla)

            const isCommentMandatory = it.subCompetence === "1.10";

            if (isCommentMandatory && (!evalData?.comment || evalData.comment.trim() === "")) {
                return false;
            }

        }
        return true;
    };

    // =============================
    // Progreso (por REACTIVO)
    // =============================
    const totalItems = evaluationReactivos.length;
    const completedItems = evaluationReactivos.filter((it, index) => {
        const key = makeKey(it, index);
        const evalData = evaluatorData[key];
        const selfData = mockSelfScores[index];
        if (evalData?.isNA || selfData?.isNA) return true;
        return evalData?.score !== null && evalData?.score !== undefined;
    }).length;
    //const progressPercentage = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

    const progressPercentage =
        isClosed === null ? 0 : isClosed === true ? 50 : 100;

    const progressLabel =
        isClosed === null ? "Not started" :
            isClosed === true ? "Draft saved" :
                "Submitted";


    // =============================
    // Excluidos (para tu ExcludedItemsAccordion)
    // =============================
    const excludedItems =
        evaluationReactivos
            .map((it, index) => {
                const key = makeKey(it, index);
                const evalData = evaluatorData[key];
                const selfData = mockSelfScores[index];
                if (evalData?.isNA || selfData?.isNA) {
                    return {
                        index, // mantiene el contrato original del Accordion (usa índice numérico)
                        competency: it.competenciaDescrip ?? "",
                        subCompetency: it.subCompetenceDescrip ?? "",
                        description: it.reactiveDescrip ?? "",
                        markedBy: (evalData?.isNA && selfData.isNA ? "both" : evalData?.isNA ? "evaluator" : "self") as
                            | "self"
                            | "evaluator"
                            | "both",
                    };
                }
                return null;
            })
            .filter(Boolean) ?? [];

    // =============================
    // ComparisonSummary (una fila por SUB-COMPETENCIA)
    // - SelfScore: SIEMPRE fijo de BD (EvaluatedResp)
    // - EvaluatorScore: estado "vivo" con fallback a BD (EvaluatorResp)
    // - Orden de competencias: el mismo orden que trae form.Items (no alfabético)
    // =============================
    const comparisonData = useMemo(() => {
        const items = form?.items ?? [];

        // Orden natural de competencias según llegan del back (para que coincida con los reactivos)
        const competencyOrder: Record<string, number> = {};
        let orderCounter = 0;
        items.forEach((it) => {
            const comp = it.competenciaDescrip ?? "";
            if (!(comp in competencyOrder)) competencyOrder[comp] = orderCounter++;
        });

        type Acc = Record<
            string,
            {
                competency: string;
                subCompetency: string;
                weight?: number | null;
                selfSum: number;
                selfCnt: number;
                evalSum: number;
                evalCnt: number;
            }
        >;

        const acc: Acc = {};

        items.forEach((it, idx) => {
            const keyReact = makeKey(it, idx);
            const compName = it.competenciaDescrip ?? "";
            const subName = it.subCompetenceDescrip ?? "";
            const w = it.weight ?? null;

            // agrupamos por subcompetencia real (competence+subCompetence)
            const gkey = `${it.competence}::${it.subCompetence}`;

            if (!acc[gkey]) {
                acc[gkey] = {
                    competency: compName,
                    subCompetency: subName,
                    weight: w,
                    selfSum: 0,
                    selfCnt: 0,
                    evalSum: 0,
                    evalCnt: 0,
                };
            }

            // SELF: fijo desde BD
            const selfResp = it.evaluatedResp ?? null;
            if (selfResp != null && selfResp > 0) {
                acc[gkey].selfSum += selfResp;
                acc[gkey].selfCnt += 1;
            }

            // EVALUATOR: estado “vivo”, fallback a BD
            const d = evaluatorData[keyReact];
            const evLive = d?.isNA ? null : (d?.score ?? it.evaluatorResp ?? null);
            if (evLive != null && evLive > 0) {
                acc[gkey].evalSum += evLive;
                acc[gkey].evalCnt += 1;
            }
        });

        const rows = Object.values(acc).map((r) => {
            const selfAvg = r.selfCnt > 0 ? +(r.selfSum / r.selfCnt).toFixed(1) : null;
            const evalAvg = r.evalCnt > 0 ? +(r.evalSum / r.evalCnt).toFixed(1) : null;
            return {
                competency: r.competency,
                subCompetency: r.subCompetency,
                selfScore: selfAvg,
                evaluatorScore: evalAvg,
                selfNA: selfAvg === null,
                evaluatorNA: evalAvg === null,
                weight: r.weight ?? null, // 0..1 desde el back (en BL ya normalizan a 0..1)  [3](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/Comparisoon.txt)
            };
        });

        // Orden EXACTO como lo entrega la API
        rows.sort((a, b) => {
            const oa = competencyOrder[a.competency] ?? 999;
            const ob = competencyOrder[b.competency] ?? 999;
            if (oa !== ob) return oa - ob;
            return a.subCompetency.localeCompare(b.subCompetency);
        });

        return rows;
    }, [form, evaluatorData]);



    function buildDetalles() {
        if (!form) return [];

        return (form.items ?? []).map((it, idx) => {
            const key = makeKey(it, idx);
            const v = evaluatorData[key] ?? { score: null, comment: "", isNA: false };

            const score = v.isNA ? 0 : (v.score ?? 0);

            return {
                EcdId: it.ecdId,
                Competence: it.competence ?? null,
                SubCompetence: it.subCompetence ?? null,
                ReactiveNum: it.reactiveNum ?? null,
                EvaluatorResp: score,

                CompetenciaDescrip: it.competenciaDescrip ?? "",
                SubCompetenceDescrip: it.subCompetenceDescrip ?? "",
                ReactiveDescrip: it.reactiveDescrip ?? "",

                EvaluatorComent: v.comment?.trim() ?? null,
            };
        });
    }

    // =============================
    // Acciones (manteniendo tu UI)
    // =============================
    const handleSaveDraft = async () => {
        if (!id || !form) return;
        try {
            const detalles = buildDetalles();
            const cfs = evaluatorFinalScore ?? 0; // usa exactamente lo que ve el usuario en el Summary
            // POST /api/manager-evaluations/{id}?accion=guardar  (ClientFinalScore es obligatorio)  [2](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/FinalScoreSummary.txt)
            await managerApi.saveDraft(id, detalles, cfs);
            setLastSaved(new Date());
            toast.success("Draft saved successfully");
            setTimeout(() => navigate("/evaluations"), 1000);
        } catch (e: any) {
            toast.error("Error saving draft");
        }
    };

    const handleSubmit = async () => {
        // Tu validación original (con la regla de comentario obligatorio)
        const errors: string[] = [];
        evaluationReactivos.forEach((it, index) => {
            const key = makeKey(it, index);
            const evalData = evaluatorData[key];
            const selfData = mockSelfScores[index];

            if (evalData?.isNA || selfData.isNA) return;
            if (!evalData || evalData.score === null) {
                errors.push(`Missing score for: ${it.competenciaDescrip ?? "Competency"}`);
            }
            //if (evalData?.score === 1 && !evalData.comment?.trim()) {
            //    errors.push(`Comment required for score of 1: ${it.competenciaDescrip ?? "Competency"}`);
            //}

            const isCommentMandatory = it.subCompetence === "1.10";

            if (isCommentMandatory && (!evalData?.comment || evalData.comment.trim() === "")) {
                errors.push(`Comment required for sub‑competence 1.10`);
            }

        });

        if (errors.length > 0) {
            toast.error(`Please complete all required fields:\n${errors.join("\n")}`);
            return;
        }

        if (!id || !form) return;
        try {
            const detalles = buildDetalles();
            const cfs = evaluatorFinalScore ?? 0;
            // POST /api/manager-evaluations/{id}?accion=cerrar  (ClientFinalScore obligatorio)  [2](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/FinalScoreSummary.txt)
            await managerApi.closeAndSend(id, detalles, cfs);
            toast.success("Evaluation submitted successfully!");
            setTimeout(() => {
                navigate("/evaluations");
            }, 1500);
        } catch (e: any) {
            toast.error("Error submitting evaluation");
        }
    };

    // =============================
    // Render (tus estilos intactos)
    // =============================
    if (loading) return <div className="p-6">Loading…</div>;
    if (!form) return <div className="p-6">No data</div>;

    return (
        <div className="space-y-6 pb-20 md:pb-8">
            {/* Header */}
            <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/evaluations")}
                    className="hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                        Evaluating: {header?.evaluatedName ?? "—"}
                    </h1>
                    <p className="text-muted-foreground mt-2">Review self-evaluation and provide your assessment</p>
                </div>
            </motion.div>

            {/* Context Summary */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Card
                    className="border-0"
                    style={{
                        background: "var(--gradient-card)",
                        boxShadow: "var(--shadow-md)",
                    }}
                >
                    <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                                    <Building2 className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Client</p>
                                    <p className="font-semibold">{header?.clientName ?? "—"}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border hidden md:block" />
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg" style={{ background: "var(--gradient-accent)" }}>
                                    <Briefcase className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Role</p>
                                    <Badge variant="secondary">{header?.role ?? "—"}</Badge>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-border hidden md:block" />
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg" style={{ background: "var(--gradient-purple)" }}>
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Evaluator</p>
                                    <p className="font-semibold">{header?.evaluatorName ?? "—"}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <Card className="border-0" style={{ boxShadow: "var(--shadow-md)" }}>
                    <CardContent className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span className="text-sm font-medium">
                                        Status:  {progressLabel}
                                    </span>
                                </div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {progressPercentage}%
                                </Badge>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                            {lastSaved && (
                                <p className="text-xs text-muted-foreground">
                                    Saved {lastSaved.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Evaluation Reactivos */}
            <div className="space-y-6">
                {evaluationReactivos.map((it, index) => {
                    const key = makeKey(it, index);
                    const evalData = evaluatorData[key];
                    const selfData = mockSelfScores[index];

                    // Skip si NA por el evaluador (mantiene tu lógica original)
                 

                    // Comentario obligatorio para Technical → Technical Knowledge & Application (ajusta a tu regla)
                    const isCommentMandatory = it.subCompetence?.trim() === '1.10';

                    return (
                        <EnhancedReactivoCard
                            key={key}
                            competency={it.competenciaDescrip ?? ""}
                            subCompetency={it.subCompetenceDescrip ?? ""}
                            description={it.reactiveDescrip ?? ""}
                            index={index} // mantiene tu prop visual
                            mode="evaluator"
                            selfEvaluation={selfData}
                            //value={evalData ?? { score: null, comment: "", isNA: false }}

                            value={
                                evalData ?? {
                                    score: it.evaluatorResp ?? null,
                                    comment: it.evaluatorComent ?? "",
                                    isNA: (it.evaluatorResp ?? null) === 0,
                                }
                            }

                            onChange={(value) => handleReactivoChange(key, value)} // usa clave compuesta
                            isCommentMandatory={isCommentMandatory}
                        />
                    );
                })}
            </div>

            {/* Excluded Items */}
            {excludedItems.length > 0 && (
                <ExcludedItemsAccordion items={excludedItems as any} onRestore={handleRestore} />
            )}

            {/* Comparison Summary (fila por sub‑competencia) */}

            <ComparisonSummary
                data={comparisonData}
                onEvaluatorFinal={(val) => setEvaluatorFinalScore(val)} // NUEVO
            />


            {/* Sticky Actions */}
            {/* Actions (hide when IsClosed == 0) */}
            {header?.isClosed !== false && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <Card className="border-0 sticky bottom-4 md:static" style={{ boxShadow: "var(--shadow-xl)" }}>
                        <CardContent className="p-4">
                            <div className="flex flex-col-reverse sm:flex-row justify-between sm:justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleSaveDraft}
                                    disabled={!isFormValid() || !hasChanges}
                                    className="w-full sm:w-auto"
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Draft
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!isFormValid()}
                                    style={{
                                        background: "var(--gradient-primary)",
                                        boxShadow: "var(--shadow-md)",
                                    }}
                                    className="text-white w-full sm:w-auto"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Evaluation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
