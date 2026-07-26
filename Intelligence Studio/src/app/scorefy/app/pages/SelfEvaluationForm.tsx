



// SelfEvaluationForm.tsx (validaciones unificadas + 1.10 obligatorio + asterisco visual)
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router"; // En SPA web, usa react-router-dom si aplica
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, Save, Send, CheckCircle, Edit2, Building2, Briefcase, User } from "lucide-react";
import { motion } from "motion/react";
import { StartEvaluationPanel } from "../components/evaluation/StartEvaluationPanel";
import { EnhancedReactivoCard } from "../components/evaluation/EnhancedReactivoCard";
import { ExcludedItemsAccordion } from "../components/evaluation/ExcludedItemsAccordion";
import { FinalScoreSummary } from "../components/evaluation/FinalScoreSummary";
import { toast } from "sonner";
import { selfEvalApi } from "../../app/api/selfEvaluationApi";

/** ===== Tipos del item que devuelve tu API (/form) ===== */
export interface ApiItem {
  ecdId: number; // puede venir 0 si no existe en BD
  competence?: string | null;
  subCompetence?: string | null;
  reactiveNum?: string | null; // identificador del reactivo (string esperado por el back)
  evaluatedResp?: number | null; // 1..3 = respuesta; 0 = N/A; null = no contestado
  evaluatedComent?: string | null;
  competenciaDescrip?: string | null;
  subCompetenceDescrip?: string | null;
  reactiveDescrip?: string | null;
  weight?: number | null; // peso de la competencia (0..1 o 0..100 según back)
}

export interface HeaderFromApi {
  client?: { id?: number; name?: string } | null;
  role?: string | null;
  evaluator?: { id?: number; name?: string } | null;
    isClosed?: boolean | null;
    column_C?: number | null;
}

interface EvalValue {
  score: number | null; // 1..3
  comment: string;
  isNA: boolean; // true => N/A
}

/** ==== Clave compuesta ESTABLE por REACTIVO (evita colisiones con ecdId=0) ==== */
function makeKey(it: ApiItem, idx?: number) {
  const c = it.competence ?? "";
  const s = it.subCompetence ?? "";
  const r = it.reactiveNum ?? `RN#${idx ?? ""}`;
  return `${c}__${s}__${r}`; // clave única estable
}

/** ==== Utilidades numéricas ==== */
function normalizeWeight(w?: number | null) {
  if (w == null || w <= 0) return 0;
  return w > 1 ? w / 100 : w; // 47 -> 0.47
}

/**
 * Ponderación por competencia usando summaryData (una fila por sub-competencia)
 * Devuelve número con 2 decimales.
 */
function computeClientFinalScore(
  summaryData: { competency: string; score: number | null; weight?: number }[]
) {
  // agrupa por competencia
  const byComp = new Map<string, { w: number; subs: number[] }>();
  for (const row of summaryData) {
    if (row.score == null) continue; // solo calificadas
    const key = row.competency || "(N/A)";
    const w = normalizeWeight(row.weight);
    const g = byComp.get(key) ?? { w, subs: [] };
    if (!g.w && w) g.w = w; // si no teníamos w y aquí hay, úsalo
    g.subs.push(row.score);
    byComp.set(key, g);
  }
  let weightedSum = 0;
  let usedW = 0;
  for (const { w, subs } of byComp.values()) {
    if (subs.length === 0 || w <= 0) continue;
    const avgComp = subs.reduce((a, b) => a + b, 0) / subs.length;
    weightedSum += avgComp * w;
    usedW += w;
  }
  if (usedW <= 0) return 0;
  const exact = weightedSum / usedW;
  return parseFloat(exact.toFixed(2)); // 2 decimales
}

/** ============ Summary por Sub‑competencia (para el componente) ============ */
function buildSummaryBySubcompetence(
  items: ApiItem[],
  data: Record<string, EvalValue>
) {
  type K = string; // key comp__sub
  const byKey: Record<K, { comp: string; sub: string; scores: number[]; weight?: number }> = {};
  items.forEach((it, idx) => {
    const keyReact = makeKey(it, idx);
    const d = data[keyReact];
    if (!d || d.isNA || d.score == null) return;
    const compName = it.competenciaDescrip || it.competence || "";
    const subName = it.subCompetenceDescrip || it.subCompetence || "";
    const groupKey: K = `${compName}__${subName}`;
    if (!byKey[groupKey]) {
      byKey[groupKey] = { comp: compName, sub: subName, scores: [], weight: it.weight ?? undefined };
    }
    byKey[groupKey].scores.push(d.score);
    if (byKey[groupKey].weight == null && it.weight != null) byKey[groupKey].weight = it.weight;
  });
  return Object.values(byKey).map(g => ({
    competency: g.comp,
    subCompetency: g.sub,
    // promedio exacto (el componente formatea a 1 decimal)
    score: g.scores.length > 0 ? g.scores.reduce((a, b) => a + b, 0) / g.scores.length : null,
    weight: g.weight, // a nivel competencia; el componente normaliza 0..1 o %
  }));
}

/** ===== Comentario obligatorio para subcompetencia 1.10 (si NO es N/A) ===== */
function needsMandatoryComment(it: ApiItem) {
  return it.subCompetence?.trim() === "1.10";
}
function isMissingMandatoryComment(it: ApiItem, idx: number, data: Record<string, EvalValue>) {
  if (!needsMandatoryComment(it)) return false;
  const key = makeKey(it, idx);
  const d = data[key];
  if (d?.isNA) return false; // Si es N/A, NO requiere comentario
  const comment = d?.comment?.trim() ?? "";
  return comment.length === 0;
}

/** ============ Payload para guardar/enviar ============
 * Incluye ítems con score (1..3), N/A (0) o comentario no vacío.
 * - N/A viaja como evaluatedResp = 0 (se persiste como N/A).
 * - clientFinalScore: 2 decimales.
 */
function buildPostModel(
  id: string,
  items: ApiItem[],
  data: Record<string, EvalValue>,
  summaryData: { competency: string; subCompetency: string; score: number | null; weight?: number }[],
  clientFinalScoreOverride?: number | null
) {
  const detalles = items
    .map((it, idx) => {
      const key = makeKey(it, idx);
      const d = data[key] ?? { score: null, comment: "", isNA: false };
      const hasScore = d.score != null && d.score > 0;
      const hasNA = d.isNA === true;
      const hasComment = (d.comment ?? "").trim().length > 0;
      if (!hasScore && !hasNA && !hasComment) return null;
      if (!it.reactiveNum) return null; // seguridad: backend espera string
      return {
        ecdId: it.ecdId ?? 0, // 0 si no existe
        competence: it.competence ?? null,
        subCompetence: it.subCompetence ?? null,
        reactiveNum: String(it.reactiveNum),
        evaluatedResp: hasScore ? d.score : hasNA ? 0 : null, // N/A viaja como 0
        evaluatedComent: hasComment ? d.comment : null,
      };
    })
    .filter(Boolean) as {
      ecdId: number;
      competence: string | null;
      subCompetence: string | null;
      reactiveNum: string;
      evaluatedResp: number | null;
      evaluatedComent: string | null;
    }[];

  // Final del front (2 decimales)
  const computedFinal = computeClientFinalScore(
    summaryData.map(s => ({ competency: s.competency, score: s.score, weight: s.weight }))
  );

  const clientFinalScore =
    typeof clientFinalScoreOverride === "number" ? clientFinalScoreOverride : computedFinal;

  return {
    idColabEmpProy: id,
    detalles,
    clientFinalScore, // el back lo persistirá en GradeEvaluated
  };
}

export function SelfEvaluationForm() {
  const { id } = useParams(); // IdColabEmpProy
  const location = useLocation();
  const navigate = useNavigate();
  const context = (location.state ?? {}) as {
    client?: { name?: string };
    role?: string;
    evaluator?: { id?: number; name?: string };
    };

    const [initialEvaluationData, setInitialEvaluationData] =
        useState<Record<string, EvalValue>>({});

  // Header proveniente de API o del location.state
  const [header, setHeader] = useState<HeaderFromApi>({});

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ApiItem[]>([]);
  const [role, setRole] = useState<string>("");
  const [isChangePanelOpen, setIsChangePanelOpen] = useState(false);

  // Respuestas del usuario por KEY compuesta
  const [evaluationData, setEvaluationData] = useState<Record<string, EvalValue>>({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [finalScore, setFinalScore] = useState<number | null>(null); // resultado final opcional

  // 1) Cargar formulario y header desde backend (solo lectura; NO inserta)
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        // GET /api/self-evaluations/{id}/form?role=&evaluatorId=
        const res = await selfEvalApi.getForm(id, context.role, context.evaluator?.id);
        const apiItems: ApiItem[] = (res.items ?? []) as ApiItem[];
        setItems(apiItems);



          const rawIsClosed = (res.header as any)?.isClosed;
          const isClosedBool =
              typeof rawIsClosed === "boolean"
                  ? rawIsClosed
                  : rawIsClosed == null
                      ? null
                      : Number(rawIsClosed) === 1;

        // HEADER: primero intentamos con res.header; si no viene, caemos al location.state
        const headerFromApi: HeaderFromApi = (res.header ?? {}) as HeaderFromApi;
        const mergedHeader: HeaderFromApi = {
          client: headerFromApi.clientName ?? (context.client ? { name: context.client.name } : null),
          role: headerFromApi.role ?? context.role ?? null,
            evaluator: headerFromApi.evaluatorName ?? context.evaluator ?? null,
            isClosed: isClosedBool,
            column_C: headerFromApi.column_C,
        };
        setHeader(mergedHeader);
        setRole(mergedHeader.role ?? "");

        // Inicializa valores según BD:
        // - score: it.evaluatedResp (1..3) o null
        // - N/A: SOLO si existe fila en BD (ecdId>0) y evaluatedResp === 0
        const init: Record<string, EvalValue> = {};
        apiItems.forEach((it, idx) => {
          const key = makeKey(it, idx);
          const resp = it.evaluatedResp;
          const isStoredNA = (it.ecdId ?? 0) > 0 && resp === 0; // evita marcar N/A por default
          init[key] = {
            score: resp != null && resp > 0 ? resp : null,
            comment: it.evaluatedComent ?? "",
            isNA: isStoredNA,
          };
        });
          setEvaluationData(init);
          setInitialEvaluationData(init);
      } catch (err: any) {
        toast.error("Failed to load evaluation.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, context.role, context.evaluator?.id]);


    const hasChanges = useMemo(() => {
        const keys = Object.keys(evaluationData);

        return keys.some((key) => {
            const current = evaluationData[key];
            const initial = initialEvaluationData[key];

            if (!initial) return true;

            return (
                current.score !== initial.score ||
                current.comment !== initial.comment ||
                current.isNA !== initial.isNA
            );
        });
    }, [evaluationData, initialEvaluationData]);
  // 2) Cambio local (SIN autosave) — por KEY compuesta
  const handleReactivoChange = (key: string, value: EvalValue) => {
    setEvaluationData(prev => ({ ...prev, [key]: value }));
  };

  // 3) Cálculos de progreso (por REACTIVO)
  const totalReactives = items.length;
  // Cuenta como “contestado” si tiene score o fue marcado N/A
  const answeredReactives = useMemo(
    () =>
      items.filter((it, idx) => {
        const d = evaluationData[makeKey(it, idx)];
        return !!d && (d.isNA === true || d.score != null);
      }).length,
    [items, evaluationData]
  );

  // 4) Excluidos (N/A)
  const excludedItems = useMemo(() => {
    return items.reduce(
      (acc, it, idx) => {
        const d = evaluationData[makeKey(it, idx)];
        if (d?.isNA) {
          acc.push({
            index: makeKey(it, idx),
            competency: it.competenciaDescrip || it.competence || "",
            subCompetency: it.subCompetenceDescrip || it.subCompetence || "",
            description: it.reactiveDescrip || "",
            markedBy: "self" as const,
          });
        }
        return acc;
      },
      [] as {
        index: string;
        competency: string;
        subCompetency: string;
        description: string;
        markedBy: "self";
      }[]
    );
  }, [items, evaluationData]);

  // 5) Summary por sub‑competencia (para el componente de resumen)
  const summaryData = useMemo(() => buildSummaryBySubcompetence(items, evaluationData), [items, evaluationData]);

  // ---- Validación UNIFICADA (aplica a guardar y enviar) ----
  const isFormValid = () => {
    for (let index = 0; index < items.length; index++) {
      const it = items[index];
      const d = evaluationData[makeKey(it, index)];
      if (!d) return false; // si no hay data, incompleto
      if (d.isNA) continue; // N/A es válido
      if (d.score == null) return false; // debe tener score
      if (isMissingMandatoryComment(it, index, evaluationData)) return false; // comentario obligatorio 1.10
    }
    return true;
  };

  // 6) Guardar borrador → validación completa
  const handleSaveDraft = async () => {
    if (!id) return;
    if (!isFormValid()) {
      toast.error("Por favor completa todos los reactivos requeridos y agrega comentario en la subcompetencia 1.10 (salvo N/A).");
      return;
    }
    try {
      const payload = buildPostModel(id, items, evaluationData, summaryData, finalScore);
      if (payload.detalles.length === 0) {
        toast.info("No changes to save.");
        return;
      }
      await selfEvalApi.saveDraft(id, payload);
      setLastSaved(new Date());
        toast.success("Draft saved.");
        setTimeout(() => navigate("/self-evaluations"), 1000);
    } catch (err: any) {
      toast.error("Could not save draft.");
    }
  };

  // 7) Enviar → validación completa
  const handleSubmit = async () => {
    if (!id) return;
    if (!isFormValid()) {
      toast.error("Por favor completa todos los reactivos requeridos y agrega comentario en la subcompetencia 1.10 (salvo N/A).");
      return;
    }
    try {
      const payload = buildPostModel(id, items, evaluationData, summaryData, finalScore);
      await selfEvalApi.submit(id, payload);
      toast.success("Evaluation submitted!");
      setTimeout(() => navigate("/self-evaluations"), 1000);
    } catch (err: any) {
      toast.error("Failed to submit evaluation.");
    }
  };

  // 8) Métricas visuales (UI)
  const progressPercentage = totalReactives > 0 ? Math.round((answeredReactives / totalReactives) * 100) : 0;
  const scoredCount = items.filter((it, idx) => {
    const d = evaluationData[makeKey(it, idx)];
    return d?.score != null;
  }).length;
  const naCount = items.filter((it, idx) => evaluationData[makeKey(it, idx)]?.isNA).length;

  if (loading) return <div className="p-4">Loading evaluation...</div>;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <motion.div className="flex items-center gap-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" size="icon" onClick={() => navigate("/self-evaluations")} className="hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
            New Self-Evaluation
          </h1>
          <p className="text-muted-foreground mt-2">Competency-based performance evaluation</p>
        </div>
      </motion.div>

      {/* Context Summary Bar */}
      {(header?.client || header?.role || header?.evaluator) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="border-0" style={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-md)' }}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  {header?.client && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-primary)' }}>
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Client</p>
                        <p className="font-semibold">{header.client}</p>
                      </div>
                    </div>
                  )}

                  <div className="h-8 w-px bg-border hidden md:block" />

                  {header?.role && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-accent)' }}>
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Role</p>
                        <Badge variant="secondary">{header.role}</Badge>
                      </div>
                    </div>
                  )}

                  <div className="h-8 w-px bg-border hidden md:block" />

                  {header?.evaluator && (
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ background: 'var(--gradient-purple)' }}>
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Evaluator</p>
                        <p className="font-semibold">{header.evaluator}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/*<Button variant="outline" size="sm" onClick={() => setIsChangePanelOpen(true)} className="hover:bg-white">*/}
                {/*  <Edit2 className="h-4 w-4 mr-2" />*/}
                {/*  Change*/}
                {/*</Button>*/}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress (por REACTIVO) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
        <Card className="border-0" style={{ boxShadow: "var(--shadow-md)" }}>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">{answeredReactives} of {totalReactives} items completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">{scoredCount} scored</Badge>
                  {naCount > 0 && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">{naCount} N/A</Badge>
                  )}
                  <Badge variant="secondary" className="bg-green-100 text-green-700">{progressPercentage}%</Badge>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2 mt-3" />
              {lastSaved && <p className="text-xs text-muted-foreground mt-2">Last saved: {lastSaved.toLocaleTimeString()}</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
        <Card className="border-0" style={{ background: 'linear-gradient(135deg, #E9F0FF 0%, #F0F4FF 100%)', boxShadow: 'var(--shadow-sm)' }}>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--kpmg-blue)' }}>
              Evaluation Instructions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-bold text-foreground">•</span>
                <span>Rate each competency using the 1-3 scale based on your performance during this engagement.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">•</span>
                <span>Mark items as "Not Applicable (N/A)" if they don't apply to this specific engagement.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">•</span>
                <span>Provide specific examples and evidence in the comments section to support your rating.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-foreground">•</span>
                <span>Items marked N/A are excluded from competency and final averages.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reactivos */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Competency Evaluation</h2>
          <p className="text-sm text-muted-foreground">Complete all {items.length} competency assessments below</p>
        </div>
        {items.map((it, idx) => {
          const key = makeKey(it, idx);
          const val = evaluationData[key] ?? { score: null, comment: "", isNA: false };
            const isMandatory = it.subCompetence?.trim() === '1.10';
            const isCommentMandatory = isMandatory;
          // Añadimos un asterisco visual al título de la subcompetencia 1.10
          const subLabel = `${it.subCompetenceDescrip || it.subCompetence || ''}${isMandatory ? ' ' : ''}`;
          return (
            <EnhancedReactivoCard
              key={key}
              competency={it.competenciaDescrip || it.competence || ""}
              subCompetency={subLabel}
              description={it.reactiveDescrip || ""}
              index={key}
              mode="self"
              value={val}
                  onChange={(value) => handleReactivoChange(key, value)}
                  isCommentMandatory={isCommentMandatory}
            />
          );
        })}
      </div>

      {/* Excluidos */}
      {excludedItems.length > 0 && (
        <ExcludedItemsAccordion
          items={excludedItems}
          onRestore={(key) =>
            setEvaluationData(prev => ({ ...prev, [key]: { ...(prev[key] ?? { score: null, comment: "" }), isNA: false } }))
          }
        />
      )}

      {/* Summary + Completion */}
      <FinalScoreSummary
        scores={summaryData}
        completion={{ answeredReactives, totalReactives }}
        onFinalScore={(value: number) => setFinalScore(value)}
      />

      {/* Actions (ambos botones con la MISMA validación) */}
      


          {/* Actions (hide when IsClosed == 0) */}
          {header?.isClosed === null && (
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
              >
                  <Card className="border-0 sticky bottom-4 md:static" style={{ boxShadow: "var(--shadow-xl)" }}>
                      <CardContent className="p-4">
                          <div className="flex flex-col-reverse sm:flex-row justify-between sm:justify-end gap-3">

                              {header?.column_C !== 0  && (
                                  <Button variant="outline" onClick={handleSaveDraft} disabled={!isFormValid() || !hasChanges} className="w-full sm:w-auto">
                                  <Save className="mr-2 h-4 w-4" />
                                  Save as Draft
                              </Button>
                              )}
                              <Button
                                  onClick={handleSubmit}
                                  disabled={!isFormValid()}
                                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
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


      {/* Change Context Panel */}
      <StartEvaluationPanel isOpen={isChangePanelOpen} onClose={() => setIsChangePanelOpen(false)} />
    </div>
  );
}
