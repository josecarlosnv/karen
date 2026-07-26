////////import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
////////import { Badge } from "@/app/components/ui/badge";
////////import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
////////import { motion } from "motion/react";

////////interface ComparisonData {
////////  competency: string;
////////  subCompetency: string;
////////  selfScore: number | null;
////////  evaluatorScore: number | null;
////////  selfNA: boolean;
////////  evaluatorNA: boolean;
////////  weight?: number; // Weight for the competency (only at competency level)
////////}

////////interface ComparisonSummaryProps {
////////  data: ComparisonData[];
////////}

////////const getScoreColor = (score: number | null) => {
////////  if (score === null) return "bg-gray-100 text-gray-700";
////////  if (score === 1) return "bg-red-100 text-red-700";
////////  if (score === 2) return "bg-yellow-100 text-yellow-700";
////////  if (score === 3) return "bg-green-100 text-green-700";
////////  return "bg-gray-100 text-gray-700";
////////};

////////const getDeltaIcon = (delta: number) => {
////////  if (delta > 0) return TrendingUp;
////////  if (delta < 0) return TrendingDown;
////////  return Minus;
////////};

////////const getDeltaColor = (delta: number) => {
////////  if (delta > 0) return "text-green-600";
////////  if (delta < 0) return "text-red-600";
////////  return "text-gray-600";
////////};

////////export function ComparisonSummary({ data }: ComparisonSummaryProps) {
////////  // Group data by competency
////////  const competencyGroups = data.reduce((acc, item) => {
////////    if (!acc[item.competency]) {
////////      acc[item.competency] = {
////////        weight: item.weight || 0,
////////        items: []
////////      };
////////    }
////////    acc[item.competency].items.push(item);
////////    return acc;
////////  }, {} as Record<string, { weight: number; items: ComparisonData[] }>);

////////  // Calculate averages (excluding N/A)
////////  const selfScores = data
////////    .filter((item) => !item.selfNA && item.selfScore !== null)
////////    .map((item) => item.selfScore as number);

////////  const evaluatorScores = data
////////    .filter((item) => !item.evaluatorNA && item.evaluatorScore !== null)
////////    .map((item) => item.evaluatorScore as number);

////////  const selfAverage = selfScores.length > 0
////////    ? (selfScores.reduce((a, b) => a + b, 0) / selfScores.length).toFixed(2)
////////    : "N/A";

////////  const evaluatorAverage = evaluatorScores.length > 0
////////    ? (evaluatorScores.reduce((a, b) => a + b, 0) / evaluatorScores.length).toFixed(2)
////////    : "N/A";

////////  const overallDelta =
////////    selfAverage !== "N/A" && evaluatorAverage !== "N/A"
////////      ? (parseFloat(evaluatorAverage) - parseFloat(selfAverage)).toFixed(2)
////////      : "N/A";

////////  return (
////////    <motion.div
////////      initial={{ opacity: 0, y: 20 }}
////////      animate={{ opacity: 1, y: 0 }}
////////      transition={{ duration: 0.4 }}
////////    >
////////      <Card
////////        className="border-0"
////////        style={{
////////          background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
////////          boxShadow: "var(--shadow-xl)",
////////        }}
////////      >
////////        <CardHeader className="pb-4">
////////          <div className="flex items-start justify-between">
////////            <div>
////////              <CardTitle className="text-2xl font-bold text-white">
////////                Evaluation Comparison
////////              </CardTitle>
////////              <p className="text-sm text-blue-200 mt-1">
////////                Side-by-side comparison of self-evaluation vs evaluator assessment
////////              </p>
////////            </div>
////////            <div
////////              className="p-3 rounded-lg"
////////              style={{ background: "rgba(255, 255, 255, 0.2)" }}
////////            >
////////              <BarChart3 className="h-6 w-6 text-white" />
////////            </div>
////////          </div>
////////        </CardHeader>

////////        <CardContent className="space-y-6">
////////          {/* Summary Stats */}
////////          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
////////            <div
////////              className="p-4 rounded-lg"
////////              style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
////////            >
////////              <div className="flex items-center justify-between">
////////                <div>
////////                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
////////                    Self Average
////////                  </p>
////////                  <p className="text-3xl font-bold mt-1 text-white">
////////                    {selfAverage}
////////                  </p>
////////                </div>
////////                <div className="text-right">
////////                  <p className="text-sm text-blue-200">
////////                    {selfScores.length} scored
////////                  </p>
////////                </div>
////////              </div>
////////            </div>

////////            <div
////////              className="p-4 rounded-lg"
////////              style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
////////            >
////////              <div className="flex items-center justify-between">
////////                <div>
////////                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
////////                    Evaluator Average
////////                  </p>
////////                  <p className="text-3xl font-bold mt-1 text-white">
////////                    {evaluatorAverage}
////////                  </p>
////////                </div>
////////                <div className="text-right">
////////                  <p className="text-sm text-blue-200">
////////                    {evaluatorScores.length} scored
////////                  </p>
////////                </div>
////////              </div>
////////            </div>

////////            <div
////////              className="p-4 rounded-lg"
////////              style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}
////////            >
////////              <div className="flex items-center justify-between">
////////                <div>
////////                  <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
////////                    Overall Δ
////////                  </p>
////////                  <p className="text-3xl font-bold mt-1 text-white">
////////                    {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
////////                    {overallDelta}
////////                  </p>
////////                </div>
////////                <div
////////                  className="p-2 rounded-full"
////////                  style={{ background: "rgba(255, 255, 255, 0.2)" }}
////////                >
////////                  <Award className="h-5 w-5 text-white" />
////////                </div>
////////              </div>
////////            </div>
////////          </div>

////////          {/* Comparison Table */}
////////          <div className="bg-white rounded-lg overflow-hidden">
////////            {/* Table Header */}
////////            <div
////////              className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
////////              style={{ background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)" }}
////////            >
////////              <div className="col-span-12 md:col-span-4">Competency</div>
////////              <div className="col-span-12 md:col-span-3">Sub-Competency</div>
////////              <div className="col-span-4 md:col-span-2 text-center">Self Score</div>
////////              <div className="col-span-4 md:col-span-2 text-center">Evaluator Score</div>
////////              <div className="col-span-4 md:col-span-1 text-center">Δ</div>
////////            </div>

////////            {/* Table Rows */}
////////            <div className="divide-y divide-border">
////////              {Object.entries(competencyGroups).map(([competency, group], groupIndex) => (
////////                <div key={groupIndex}>
////////                  {group.items.map((item, itemIndex) => {
////////                    const isFirstInGroup = itemIndex === 0;
////////                    const delta =
////////                      item.selfScore !== null &&
////////                      item.evaluatorScore !== null &&
////////                      !item.selfNA &&
////////                      !item.evaluatorNA
////////                        ? item.evaluatorScore - item.selfScore
////////                        : null;

////////                    const DeltaIcon = delta !== null ? getDeltaIcon(delta) : Minus;

////////                    return (
////////                      <motion.div
////////                        key={`${groupIndex}-${itemIndex}`}
////////                        initial={{ opacity: 0, x: -10 }}
////////                        animate={{ opacity: 1, x: 0 }}
////////                        transition={{ duration: 0.2, delay: (groupIndex * group.items.length + itemIndex) * 0.03 }}
////////                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
////////                      >
////////                        {/* Competency column with weight on first row of each group */}
////////                        <div className="col-span-12 md:col-span-4">
////////                          {isFirstInGroup ? (
////////                            <div className="font-semibold text-base" style={{ color: 'var(--kpmg-blue)' }}>
////////                              {item.competency} ({group.weight}%)
////////                            </div>
////////                          ) : (
////////                            <div className="text-sm text-transparent select-none">-</div>
////////                          )}
////////                        </div>
////////                        {/* Sub-competency column */}
////////                        <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground pl-4">
////////                          {item.subCompetency}
////////                        </div>
////////                        {/* Self Score column */}
////////                        <div className="col-span-4 md:col-span-2 flex justify-center">
////////                          {item.selfNA ? (
////////                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
////////                              N/A
////////                            </Badge>
////////                          ) : (
////////                            <Badge className={`font-semibold ${getScoreColor(item.selfScore)}`}>
////////                              {item.selfScore || "—"}
////////                            </Badge>
////////                          )}
////////                        </div>
////////                        {/* Evaluator Score column */}
////////                        <div className="col-span-4 md:col-span-2 flex justify-center">
////////                          {item.evaluatorNA ? (
////////                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
////////                              N/A
////////                            </Badge>
////////                          ) : (
////////                            <Badge className={`font-semibold ${getScoreColor(item.evaluatorScore)}`}>
////////                              {item.evaluatorScore || "—"}
////////                            </Badge>
////////                          )}
////////                        </div>
////////                        {/* Delta column */}
////////                        <div className="col-span-4 md:col-span-1 flex justify-center">
////////                          {delta !== null ? (
////////                            <div className={`flex items-center gap-1 font-semibold ${getDeltaColor(delta)}`}>
////////                              <DeltaIcon className="h-4 w-4" />
////////                              <span>{delta > 0 ? `+${delta}` : delta}</span>
////////                            </div>
////////                          ) : (
////////                            <span className="text-muted-foreground">—</span>
////////                          )}
////////                        </div>
////////                      </motion.div>
////////                    );
////////                  })}
////////                </div>
////////              ))}
////////            </div>

////////            {/* Summary Row */}
////////            <div
////////              className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2"
////////              style={{
////////                background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)",
////////                borderColor: "var(--kpmg-blue)",
////////              }}
////////            >
////////              <div className="col-span-12 md:col-span-7 flex items-center gap-2">
////////                <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
////////                <span style={{ color: "var(--kpmg-blue)" }}>
////////                  Final Averages
////////                </span>
////////              </div>
////////              <div className="col-span-4 md:col-span-2 flex justify-center">
////////                <div
////////                  className="px-4 py-2 rounded-lg text-white font-bold text-lg"
////////                  style={{
////////                    background: "var(--gradient-primary)",
////////                    boxShadow: "var(--shadow-md)",
////////                  }}
////////                >
////////                  {selfAverage}
////////                </div>
////////              </div>
////////              <div className="col-span-4 md:col-span-2 flex justify-center">
////////                <div
////////                  className="px-4 py-2 rounded-lg text-white font-bold text-lg"
////////                  style={{
////////                    background: "var(--gradient-accent)",
////////                    boxShadow: "var(--shadow-md)",
////////                  }}
////////                >
////////                  {evaluatorAverage}
////////                </div>
////////              </div>
////////              <div className="col-span-4 md:col-span-1 flex justify-center">
////////                <div className="px-3 py-2 rounded-lg bg-white font-bold text-lg" style={{ color: "var(--kpmg-blue)" }}>
////////                  {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
////////                  {overallDelta}
////////                </div>
////////              </div>
////////            </div>
////////          </div>

////////          {/* Legend */}
////////          <div className="flex flex-wrap gap-3 text-xs text-blue-200">
////////            <div className="flex items-center gap-2">
////////              <TrendingUp className="h-3 w-3" />
////////              <span>Evaluator scored higher</span>
////////            </div>
////////            <div className="flex items-center gap-2">
////////              <TrendingDown className="h-3 w-3" />
////////              <span>Evaluator scored lower</span>
////////            </div>
////////            <div className="flex items-center gap-2">
////////              <Minus className="h-3 w-3" />
////////              <span>Scores match</span>
////////            </div>
////////            <div className="flex items-center gap-2">
////////              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">N/A</span>
////////              <span className="text-blue-200">Not Applicable (excluded from averages)</span>
////////            </div>
////////          </div>
////////        </CardContent>
////////      </Card>
////////    </motion.div>
////////  );
////////}


//////import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
//////import { Badge } from "@/app/components/ui/badge";
//////import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
//////import { motion } from "motion/react";

//////interface ComparisonData {
//////    competency: string;
//////    subCompetency: string;
//////    selfScore: number | null;
//////    evaluatorScore: number | null;
//////    selfNA: boolean;
//////    evaluatorNA: boolean;
//////    weight?: number; // Weight at competency level (0..1 or 0..100)
//////}

//////interface ComparisonSummaryProps {
//////    data: ComparisonData[];
//////}

///////* === Helpers (mismo criterio que FinalScoreSummary) === */
//////const normalizeWeight = (w?: number) => {
//////    if (!w || w <= 0) return 0;
//////    return w > 1 ? w / 100 : w; // 47 -> 0.47
//////};

//////// Colores por rango decimal (no cambiamos clases de estilo, solo la lógica)
//////const getScoreColor = (score: number | null) => {
//////    if (score === null) return "bg-gray-100 text-gray-700";
//////    if (score < 1.5) return "bg-red-100 text-red-700";
//////    if (score < 2.5) return "bg-yellow-100 text-yellow-700";
//////    return "bg-green-100 text-green-700";
//////};

//////const getDeltaIcon = (delta: number) => {
//////    if (delta > 0) return TrendingUp;
//////    if (delta < 0) return TrendingDown;
//////    return Minus;
//////};

//////const getDeltaColor = (delta: number) => {
//////    if (delta > 0) return "text-green-600";
//////    if (delta < 0) return "text-red-600";
//////    return "text-gray-600";
//////};

//////export function ComparisonSummary({ data }: ComparisonSummaryProps) {
//////    // === 1) Agrupación por competencia (como FinalScoreSummary) ===
//////    const competencyGroups = data.reduce((acc, item) => {
//////        if (!acc[item.competency]) {
//////            acc[item.competency] = {
//////                weight: item.weight ?? 0,
//////                items: [] as ComparisonData[],
//////            };
//////        }
//////        // Si llega un weight válido y el grupo aún no tiene, úsalo
//////        if (!acc[item.competency].weight && item.weight) {
//////            acc[item.competency].weight = item.weight;
//////        }
//////        acc[item.competency].items.push(item);
//////        return acc;
//////    }, {} as Record<string, { weight: number; items: ComparisonData[] }>);

//////    // === 2) Promedios finales (ponderados por competencia) ===
//////    // Para cada competencia, promediamos sub‑competencias con score (excluimos null y N/A)
//////    // y multiplicamos por el weight normalizado. Igual a FinalScoreSummary, pero calculando
//////    // dos corridas: self y evaluator.
//////    let selfWeightedSum = 0;
//////    let selfUsedW = 0;
//////    let evaluatorWeightedSum = 0;
//////    let evaluatorUsedW = 0;

//////    Object.values(competencyGroups).forEach((g) => {
//////        const w = normalizeWeight(g.weight);

//////        // Self
//////        const selfValid = g.items
//////            .filter((r) => !r.selfNA && r.selfScore != null)
//////            .map((r) => r.selfScore as number);

//////        if (selfValid.length > 0 && w > 0) {
//////            const avgSelfComp = selfValid.reduce((a, b) => a + b, 0) / selfValid.length;
//////            selfWeightedSum += avgSelfComp * w;
//////            selfUsedW += w;
//////        }

//////        // Evaluator
//////        const evalValid = g.items
//////            .filter((r) => !r.evaluatorNA && r.evaluatorScore != null)
//////            .map((r) => r.evaluatorScore as number);

//////        if (evalValid.length > 0 && w > 0) {
//////            const avgEvalComp = evalValid.reduce((a, b) => a + b, 0) / evalValid.length;
//////            evaluatorWeightedSum += avgEvalComp * w;
//////            evaluatorUsedW += w;
//////        }
//////    });

//////    const selfAverage =
//////        selfUsedW > 0 ? (selfWeightedSum / selfUsedW).toFixed(2) : "N/A";
//////    const evaluatorAverage =
//////        evaluatorUsedW > 0 ? (evaluatorWeightedSum / evaluatorUsedW).toFixed(2) : "N/A";

//////    const overallDelta =
//////        selfAverage !== "N/A" && evaluatorAverage !== "N/A"
//////            ? (parseFloat(evaluatorAverage) - parseFloat(selfAverage)).toFixed(2)
//////            : "N/A";

//////    return (
//////        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
//////            <Card
//////                className="border-0"
//////                style={{
//////                    background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
//////                    boxShadow: "var(--shadow-xl)",
//////                }}
//////            >
//////                <CardHeader className="pb-4">
//////                    <div className="flex items-start justify-between">
//////                        <div>
//////                            <CardTitle className="text-2xl font-bold text-white">
//////                                Evaluation Comparison
//////                            </CardTitle>
//////                            <p className="text-sm text-blue-200 mt-1">
//////                                Side-by-side comparison of self-evaluation vs evaluator assessment
//////                            </p>
//////                        </div>
//////                        <div className="p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
//////                            <BarChart3 className="h-6 w-6 text-white" />
//////                        </div>
//////                    </div>
//////                </CardHeader>

//////                <CardContent className="space-y-6">
//////                    {/* Summary Stats */}
//////                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//////                        <div
//////                            className="p-4 rounded-lg"
//////                            style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
//////                        >
//////                            <div className="flex items-center justify-between">
//////                                <div>
//////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
//////                                        Self Average
//////                                    </p>
//////                                    <p className="text-3xl font-bold mt-1 text-white">
//////                                        {selfAverage}
//////                                    </p>
//////                                </div>
//////                                <div className="text-right">
//////                                    <p className="text-sm text-blue-200">
//////                                        {
//////                                            data.filter((d) => !d.selfNA && d.selfScore != null).length
//////                                        }{" "}
//////                                        scored
//////                                    </p>
//////                                </div>
//////                            </div>
//////                        </div>

//////                        <div
//////                            className="p-4 rounded-lg"
//////                            style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
//////                        >
//////                            <div className="flex items-center justify-between">
//////                                <div>
//////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
//////                                        Evaluator Average
//////                                    </p>
//////                                    <p className="text-3xl font-bold mt-1 text-white">
//////                                        {evaluatorAverage}
//////                                    </p>
//////                                </div>
//////                                <div className="text-right">
//////                                    <p className="text-sm text-blue-200">
//////                                        {
//////                                            data.filter((d) => !d.evaluatorNA && d.evaluatorScore != null).length
//////                                        }{" "}
//////                                        scored
//////                                    </p>
//////                                </div>
//////                            </div>
//////                        </div>

//////                        <div
//////                            className="p-4 rounded-lg"
//////                            style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}
//////                        >
//////                            <div className="flex items-center justify-between">
//////                                <div>
//////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
//////                                        Overall Δ
//////                                    </p>
//////                                    <p className="text-3xl font-bold mt-1 text-white">
//////                                        {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
//////                                        {overallDelta}
//////                                    </p>
//////                                </div>
//////                                <div className="p-2 rounded-full" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
//////                                    <Award className="h-5 w-5 text-white" />
//////                                </div>
//////                            </div>
//////                        </div>
//////                    </div>

//////                    {/* Comparison Table */}
//////                    <div className="bg-white rounded-lg overflow-hidden">
//////                        {/* Table Header */}
//////                        <div
//////                            className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
//////                            style={{ background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)" }}
//////                        >
//////                            <div className="col-span-12 md:col-span-4">Competency</div>
//////                            <div className="col-span-12 md:col-span-3">Sub-Competency</div>
//////                            <div className="col-span-4 md:col-span-2 text-center">Self Score</div>
//////                            <div className="col-span-4 md:col-span-2 text-center">Evaluator Score</div>
//////                            <div className="col-span-4 md:col-span-1 text-center">Δ</div>
//////                        </div>

//////                        {/* Table Rows */}
//////                        <div className="divide-y divide-border">
//////                            {Object.entries(competencyGroups).map(([competency, group], groupIndex) => (
//////                                <div key={groupIndex}>
//////                                    {group.items.map((item, itemIndex) => {
//////                                        const isFirstInGroup = itemIndex === 0;

//////                                        // Formatos por sub‑competencia:
//////                                        const selfDisplay =
//////                                            item.selfNA || item.selfScore == null
//////                                                ? null
//////                                                : Number(item.selfScore).toFixed(1); // 1 DECIMAL

//////                                        const evalDisplay =
//////                                            item.evaluatorNA || item.evaluatorScore == null
//////                                                ? null
//////                                                : Number(item.evaluatorScore).toFixed(1); // 1 DECIMAL

//////                                        // Delta (2 decimales si ambos existen)
//////                                        const delta =
//////                                            selfDisplay != null && evalDisplay != null
//////                                                ? parseFloat((parseFloat(evalDisplay) - parseFloat(selfDisplay)).toFixed(2))
//////                                                : null;

//////                                        const DeltaIcon = delta !== null ? getDeltaIcon(delta) : Minus;

//////                                        return (
//////                                            <motion.div
//////                                                key={`${groupIndex}-${itemIndex}`}
//////                                                initial={{ opacity: 0, x: -10 }}
//////                                                animate={{ opacity: 1, x: 0 }}
//////                                                transition={{ duration: 0.2, delay: (groupIndex * group.items.length + itemIndex) * 0.03 }}
//////                                                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
//////                                            >
//////                                                {/* Competency column with weight on first row of each group */}
//////                                                <div className="col-span-12 md:col-span-4">
//////                                                    {isFirstInGroup ? (
//////                                                        <div className="font-semibold text-base" style={{ color: 'var(--kpmg-blue)' }}>
//////                                                            {item.competency} ({Math.round((group.weight > 1 ? group.weight : (group.weight || 0) * 100))}%)
//////                                                        </div>
//////                                                    ) : (
//////                                                        <div className="text-sm text-transparent select-none">-</div>
//////                                                    )}
//////                                                </div>

//////                                                {/* Sub-competency column */}
//////                                                <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground pl-4">
//////                                                    {item.subCompetency}
//////                                                </div>

//////                                                {/* Self Score column (1 decimal o “—”) */}
//////                                                <div className="col-span-4 md:col-span-2 flex justify-center">
//////                                                    {selfDisplay == null ? (
//////                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
//////                                                            —
//////                                                        </Badge>
//////                                                    ) : (
//////                                                        <Badge className={`font-semibold ${getScoreColor(parseFloat(selfDisplay))}`}>
//////                                                            {selfDisplay}
//////                                                        </Badge>
//////                                                    )}
//////                                                </div>

//////                                                {/* Evaluator Score column (1 decimal o “—”) */}
//////                                                <div className="col-span-4 md:col-span-2 flex justify-center">
//////                                                    {evalDisplay == null ? (
//////                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
//////                                                            —
//////                                                        </Badge>
//////                                                    ) : (
//////                                                        <Badge className={`font-semibold ${getScoreColor(parseFloat(evalDisplay))}`}>
//////                                                            {evalDisplay}
//////                                                        </Badge>
//////                                                    )}
//////                                                </div>

//////                                                {/* Delta column (2 decimales si aplica) */}
//////                                                <div className="col-span-4 md:col-span-1 flex justify-center">
//////                                                    {delta !== null ? (
//////                                                        <div className={`flex items-center gap-1 font-semibold ${getDeltaColor(delta)}`}>
//////                                                            <DeltaIcon className="h-4 w-4" />
//////                                                            <span>{delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}</span>
//////                                                        </div>
//////                                                    ) : (
//////                                                        <span className="text-muted-foreground">—</span>
//////                                                    )}
//////                                                </div>
//////                                            </motion.div>
//////                                        );
//////                                    })}
//////                                </div>
//////                            ))}
//////                        </div>

//////                        {/* Summary Row (2 decimales, igual que Summary) */}
//////                        <div
//////                            className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2"
//////                            style={{
//////                                background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)",
//////                                borderColor: "var(--kpmg-blue)",
//////                            }}
//////                        >
//////                            <div className="col-span-12 md:col-span-7 flex items-center gap-2">
//////                                <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
//////                                <span style={{ color: "var(--kpmg-blue)" }}>
//////                                    Final Averages
//////                                </span>
//////                            </div>

//////                            <div className="col-span-4 md:col-span-2 flex justify-center">
//////                                <div
//////                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
//////                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
//////                                >
//////                                    {selfAverage}
//////                                </div>
//////                            </div>

//////                            <div className="col-span-4 md:col-span-2 flex justify-center">
//////                                <div
//////                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
//////                                    style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-md)" }}
//////                                >
//////                                    {evaluatorAverage}
//////                                </div>
//////                            </div>

//////                            <div className="col-span-4 md:col-span-1 flex justify-center">
//////                                <div className="px-3 py-2 rounded-lg bg-white font-bold text-lg" style={{ color: "var(--kpmg-blue)" }}>
//////                                    {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
//////                                    {overallDelta}
//////                                </div>
//////                            </div>
//////                        </div>
//////                    </div>

//////                    {/* Legend */}
//////                    <div className="flex flex-wrap gap-3 text-xs text-blue-200">
//////                        <div className="flex items-center gap-2">
//////                            <TrendingUp className="h-3 w-3" />
//////                            <span>Evaluator scored higher</span>
//////                        </div>
//////                        <div className="flex items-center gap-2">
//////                            <TrendingDown className="h-3 w-3" />
//////                            <span>Evaluator scored lower</span>
//////                        </div>
//////                        <div className="flex items-center gap-2">
//////                            <Minus className="h-3 w-3" />
//////                            <span>Scores match</span>
//////                        </div>
//////                        <div className="flex items-center gap-2">
//////                            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">—</span>
//////                            <span className="text-blue-200">Not Applicable / No score</span>
//////                        </div>
//////                    </div>
//////                </CardContent>
//////            </Card>
//////        </motion.div>
//////    );
//////}

////import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
////import { Badge } from "@/app/components/ui/badge";
////import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
////import { motion } from "motion/react";

////interface ComparisonData {
////    competency: string;
////    subCompetency: string;
////    selfScore: number | null;
////    evaluatorScore: number | null;
////    selfNA: boolean;
////    evaluatorNA: boolean;
////    weight?: number; // 0..1 (o 0..100, se normaliza)
////}

////interface ComparisonSummaryProps {
////    data: ComparisonData[];
////    onFinalScore?: (value: number) => void; // opcional: notificar el final ponderado
////}

////const getScoreColor = (score: number | null) => {
////    if (score === null) return "bg-gray-100 text-gray-700";
////    if (score === 1) return "bg-red-100 text-red-700";
////    if (score === 2) return "bg-yellow-100 text-yellow-700";
////    if (score === 3) return "bg-green-100 text-green-700";
////    return "bg-gray-100 text-gray-700";
////};

////const getDeltaIcon = (delta: number) => {
////    if (delta > 0) return TrendingUp;
////    if (delta < 0) return TrendingDown;
////    return Minus;
////};

////const getDeltaColor = (delta: number) => {
////    if (delta > 0) return "text-green-600";
////    if (delta < 0) return "text-red-600";
////    return "text-gray-600";
////};

////export function ComparisonSummary({ data, onFinalScore }: ComparisonSummaryProps) {
////    // =========================
////    // 1) Agrupar por competencia (y tomar un weight por grupo)
////    // =========================
////    const competencyGroups = data.reduce((acc, item) => {
////        if (!acc[item.competency]) {
////            acc[item.competency] = {
////                weight: 0, // lo normalizaremos a 0..1 más adelante
////                items: [] as ComparisonData[],
////            };
////        }
////        // si llega weight en 0..1 (del back) o 0..100, guárdalo
////        if (typeof item.weight === "number" && !Number.isNaN(item.weight) && item.weight > 0) {
////            acc[item.competency].weight = item.weight;
////        }
////        acc[item.competency].items.push(item);
////        return acc;
////    }, {} as Record<string, { weight: number; items: ComparisonData[] }>);

////    // =========================
////    // 2) Promedios simples (para tarjetas de "Self Average" y "Evaluator Average")
////    //    Se excluyen N/A y null.
////    // =========================
////    const selfScoresFlat = data
////        .filter((item) => !item.selfNA && item.selfScore !== null)
////        .map((item) => item.selfScore as number);

////    const evaluatorScoresFlat = data
////        .filter((item) => !item.evaluatorNA && item.evaluatorScore !== null)
////        .map((item) => item.evaluatorScore as number);

////    const selfAverage =
////        selfScoresFlat.length > 0
////            ? (selfScoresFlat.reduce((a, b) => a + b, 0) / selfScoresFlat.length).toFixed(2)
////            : "N/A";

////    const evaluatorAverage =
////        evaluatorScoresFlat.length > 0
////            ? (evaluatorScoresFlat.reduce((a, b) => a + b, 0) / evaluatorScoresFlat.length).toFixed(2)
////            : "N/A";

////    const overallDelta =
////        selfAverage !== "N/A" && evaluatorAverage !== "N/A"
////            ? (parseFloat(evaluatorAverage) - parseFloat(selfAverage)).toFixed(2)
////            : "N/A";

////    // =========================
////    // 3) Promedio por SUB‑COMPETENCIA (Self vs Evaluator) y
////    //    FinalScore ponderado por COMPETENCIA (misma lógica que FinalScoreSummary).
////    //    - Para cada competencia: promedio simple de sub‑competencias con score.
////    //    - Ponderación por weight de la competencia (0..1; si viene 0..100, se normaliza).
////    // =========================
////    let weightedSum = 0;
////    let usedWeightSum = 0;

////    // Para la tabla seguimos mostrando fila por reactivo/subcompetencia (igual UI),
////    // pero el cálculo ponderado es por competencia.
////    Object.values(competencyGroups).forEach((group) => {
////        const wRaw = group.weight ?? 0;
////        const w = wRaw > 1 ? wRaw / 100 : wRaw; // normaliza si venía en %

////        // Para el promedio por competencia usamos las sub‑competencias con números válidos
////        // Aquí tomamos el "lado" del EVALUATOR para el FinalScore (si quieres Self, cambia a selfScore).
////        const subScores = group.items
////            .map((it) => (it.evaluatorNA || it.evaluatorScore == null ? null : it.evaluatorScore))
////            .filter((v): v is number => v != null && !Number.isNaN(v));

////        if (subScores.length > 0 && w > 0) {
////            const avgComp = subScores.reduce((a, b) => a + b, 0) / subScores.length;
////            weightedSum += avgComp * w;
////            usedWeightSum += w;
////        }
////    });

////    const finalWeightedScore =
////        usedWeightSum > 0 ? (weightedSum / usedWeightSum).toFixed(2) : "0.00";

////    // Notificar a quien consuma el componente (opcional)
////    // Equivale a tu onFinalScore de FinalScoreSummary.  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/FinalScoreSummary.txt)
////    // useEffect no es imprescindible si no necesitas side‑effect; si lo requieres, habilítalo:
////    // useEffect(() => { onFinalScore?.(Number(finalWeightedScore)); }, [finalWeightedScore]);

////    return (
////        <motion.div
////            initial={{ opacity: 0, y: 20 }}
////            animate={{ opacity: 1, y: 0 }}
////            transition={{ duration: 0.4 }}
////        >
////            <Card
////                className="border-0"
////                style={{
////                    background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
////                    boxShadow: "var(--shadow-xl)",
////                }}
////            >
////                <CardHeader className="pb-4">
////                    <div className="flex items-start justify-between">
////                        <div>
////                            <CardTitle className="text-2xl font-bold text-white">
////                                Evaluation Comparison
////                            </CardTitle>
////                            <p className="text-sm text-blue-200 mt-1">
////                                Side-by-side comparison of self-evaluation vs evaluator assessment
////                            </p>
////                        </div>
////                        <div className="p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
////                            <BarChart3 className="h-6 w-6 text-white" />
////                        </div>
////                    </div>
////                </CardHeader>

////                <CardContent className="space-y-6">
////                    {/* Summary Stats (mismo UI) */}
////                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
////                        <div
////                            className="p-4 rounded-lg"
////                            style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
////                        >
////                            <div className="flex items-center justify-between">
////                                <div>
////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
////                                        Self Average
////                                    </p>
////                                    <p className="text-3xl font-bold mt-1 text-white">
////                                        {selfAverage}
////                                    </p>
////                                </div>
////                                <div className="text-right">
////                                    <p className="text-sm text-blue-200">{selfScoresFlat.length} scored</p>
////                                </div>
////                            </div>
////                        </div>

////                        <div
////                            className="p-4 rounded-lg"
////                            style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}
////                        >
////                            <div className="flex items-center justify-between">
////                                <div>
////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
////                                        Evaluator Average
////                                    </p>
////                                    <p className="text-3xl font-bold mt-1 text-white">
////                                        {evaluatorAverage}
////                                    </p>
////                                </div>
////                                <div className="text-right">
////                                    <p className="text-sm text-blue-200">{evaluatorScoresFlat.length} scored</p>
////                                </div>
////                            </div>
////                        </div>

////                        <div
////                            className="p-4 rounded-lg"
////                            style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)" }}
////                        >
////                            <div className="flex items-center justify-between">
////                                <div>
////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
////                                        Overall Δ
////                                    </p>
////                                    <p className="text-3xl font-bold mt-1 text-white">
////                                        {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
////                                        {overallDelta}
////                                    </p>
////                                </div>
////                                <div className="p-2 rounded-full" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
////                                    <Award className="h-5 w-5 text-white" />
////                                </div>
////                            </div>
////                        </div>
////                    </div>

////                    {/* Comparison Table (mismo UI) */}
////                    <div className="bg-white rounded-lg overflow-hidden">
////                        {/* Table Header (mismo) */}
////                        <div
////                            className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
////                            style={{ background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)" }}
////                        >
////                            <div className="col-span-12 md:col-span-4">Competency</div>
////                            <div className="col-span-12 md:col-span-3">Sub-Competency</div>
////                            <div className="col-span-4 md:col-span-2 text-center">Self Score</div>
////                            <div className="col-span-4 md:col-span-2 text-center">Evaluator Score</div>
////                            <div className="col-span-4 md:col-span-1 text-center">Δ</div>
////                        </div>

////                        {/* Table Rows (mismo UI; delta con decimales y weight % por grupo) */}
////                        <div className="divide-y divide-border">
////                            {Object.entries(competencyGroups).map(([competency, group], groupIndex) => (
////                                <div key={groupIndex}>
////                                    {group.items.map((item, itemIndex) => {
////                                        const isFirstInGroup = itemIndex === 0;

////                                        const rawDelta =
////                                            item.selfScore !== null &&
////                                                item.evaluatorScore !== null &&
////                                                !item.selfNA &&
////                                                !item.evaluatorNA
////                                                ? item.evaluatorScore - item.selfScore
////                                                : null;

////                                        const delta =
////                                            rawDelta !== null
////                                                ? Number.isInteger(rawDelta)
////                                                    ? rawDelta
////                                                    : parseFloat(rawDelta.toFixed(2))
////                                                : null;

////                                        const DeltaIcon = delta !== null ? getDeltaIcon(delta) : Minus;

////                                        const wDisplay = (group.weight ?? 0) > 1
////                                            ? group.weight
////                                            : (group.weight ?? 0) * 100;

////                                        return (
////                                            <motion.div
////                                                key={`${groupIndex}-${itemIndex}`}
////                                                initial={{ opacity: 0, x: -10 }}
////                                                animate={{ opacity: 1, x: 0 }}
////                                                transition={{
////                                                    duration: 0.2,
////                                                    delay: (groupIndex * group.items.length + itemIndex) * 0.03,
////                                                }}
////                                                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
////                                            >
////                                                {/* Competency column with weight on first row of each group */}
////                                                <div className="col-span-12 md:col-span-4">
////                                                    {isFirstInGroup ? (
////                                                        <div className="font-semibold text-base" style={{ color: 'var(--kpmg-blue)' }}>
////                                                            {competency} ({Math.round(wDisplay)}%)
////                                                        </div>
////                                                    ) : (
////                                                        <div className="text-sm text-transparent select-none">-</div>
////                                                    )}
////                                                </div>

////                                                {/* Sub-competency */}
////                                                <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground pl-4">
////                                                    {item.subCompetency}
////                                                </div>

////                                                {/* Self Score */}
////                                                <div className="col-span-4 md:col-span-2 flex justify-center">
////                                                    {item.selfNA ? (
////                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
////                                                            N/A
////                                                        </Badge>
////                                                    ) : (
////                                                        <Badge className={`font-semibold ${getScoreColor(item.selfScore)}`}>
////                                                            {item.selfScore ?? "—"}
////                                                        </Badge>
////                                                    )}
////                                                </div>

////                                                {/* Evaluator Score */}
////                                                <div className="col-span-4 md:col-span-2 flex justify-center">
////                                                    {item.evaluatorNA ? (
////                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
////                                                            N/A
////                                                        </Badge>
////                                                    ) : (
////                                                        <Badge className={`font-semibold ${getScoreColor(item.evaluatorScore)}`}>
////                                                            {item.evaluatorScore ?? "—"}
////                                                        </Badge>
////                                                    )}
////                                                </div>

////                                                {/* Delta */}
////                                                <div className="col-span-4 md:col-span-1 flex justify-center">
////                                                    {delta !== null ? (
////                                                        <div className={`flex items-center gap-1 font-semibold ${getDeltaColor(delta)}`}>
////                                                            <DeltaIcon className="h-4 w-4" />
////                                                            <span>{delta > 0 ? `+${delta}` : delta}</span>
////                                                        </div>
////                                                    ) : (
////                                                        <span className="text-muted-foreground">—</span>
////                                                    )}
////                                                </div>
////                                            </motion.div>
////                                        );
////                                    })}
////                                </div>
////                            ))}
////                        </div>

////                        {/* Summary Row (mismo UI) — mostramos el FinalScore ponderado por competencia */}
////                        <div
////                            className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2"
////                            style={{
////                                background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)",
////                                borderColor: "var(--kpmg-blue)",
////                            }}
////                        >
////                            <div className="col-span-12 md:col-span-7 flex items-center gap-2">
////                                <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
////                                <span style={{ color: "var(--kpmg-blue)" }}>Final Evaluation Score</span>
////                            </div>
////                            <div className="col-span-4 md:col-span-2 flex justify-center">
////                                <div
////                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
////                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
////                                >
////                                    {finalWeightedScore /* ← ponderado por competencia, usando evaluatorScore */}
////                                </div>
////                            </div>
////                            <div className="col-span-4 md:col-span-2 flex justify-center">
////                                <div
////                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
////                                    style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-md)" }}
////                                >
////                                    {evaluatorAverage /* puedes dejar el simple avg aquí si lo prefieres */}
////                                </div>
////                            </div>
////                            <div className="col-span-4 md:col-span-1 flex justify-center">
////                                <div className="px-3 py-2 rounded-lg bg-white font-bold text-lg" style={{ color: "var(--kpmg-blue)" }}>
////                                    {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
////                                    {overallDelta}
////                                </div>
////                            </div>
////                        </div>
////                    </div>

////                    {/* Legend (igual) */}
////                    <div className="flex flex-wrap gap-3 text-xs text-blue-200">
////                        <div className="flex items-center gap-2">
////                            <TrendingUp className="h-3 w-3" />
////                            <span>Evaluator scored higher</span>
////                        </div>
////                        <div className="flex items-center gap-2">
////                            <TrendingDown className="h-3 w-3" />
////                            <span>Evaluator scored lower</span>
////                        </div>
////                        <div className="flex items-center gap-2">
////                            <Minus className="h-3 w-3" />
////                            <span>Scores match</span>
////                        </div>
////                        <div className="flex items-center gap-2">
////                            <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700">N/A</span>
////                            <span className="text-blue-200">Not Applicable (excluded from averages)</span>
////                        </div>
////                    </div>
////                </CardContent>
////            </Card>
////        </motion.div>
////    );
////}-- ESTE SI ME SRIVE

////import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
////import { Badge } from "@/app/components/ui/badge";
////import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
////import { motion } from "motion/react";

////interface ComparisonData {
////    competency: string;
////    subCompetency: string;
////    selfScore: number | null;
////    evaluatorScore: number | null;
////    selfNA: boolean;
////    evaluatorNA: boolean;
////    weight?: number; // 0..1
////}

////interface ComparisonSummaryProps {
////    data: ComparisonData[];
////}

////const getScoreColor = (score: number | null) => {
////    if (score === null) return "bg-gray-100 text-gray-700";
////    if (score < 1.5) return "bg-red-100 text-red-700";
////    if (score < 2.5) return "bg-yellow-100 text-yellow-700";
////    return "bg-green-100 text-green-700";
////};

////const getDeltaIcon = (delta: number) => {
////    if (delta > 0) return TrendingUp;
////    if (delta < 0) return TrendingDown;
////    return Minus;
////};

////const getDeltaColor = (delta: number) => {
////    if (delta > 0) return "text-green-600";
////    if (delta < 0) return "text-red-600";
////    return "text-gray-600";
////};

////export function ComparisonSummary({ data }: ComparisonSummaryProps) {

////    // Agrupar por competencia
////    const competencyGroups = data.reduce((acc, item) => {
////        if (!acc[item.competency]) {
////            acc[item.competency] = {
////                weight: item.weight ?? 0,
////                items: []
////            };
////        }
////        acc[item.competency].items.push(item);

////        return acc;
////    }, {} as Record<string, { weight: number; items: ComparisonData[] }>);

////    // ---- Promedios generales ----
////    const selfScoresFlat = data
////        .filter((x) => !x.selfNA && x.selfScore !== null)
////        .map((x) => x.selfScore as number);

////    const evaluatorScoresFlat = data
////        .filter((x) => !x.evaluatorNA && x.evaluatorScore !== null)
////        .map((x) => x.evaluatorScore as number);

////    const selfAverage =
////        selfScoresFlat.length > 0
////            ? (selfScoresFlat.reduce((a, b) => a + b, 0) / selfScoresFlat.length).toFixed(2)
////            : "N/A";

////    const evaluatorAverage =
////        evaluatorScoresFlat.length > 0
////            ? (evaluatorScoresFlat.reduce((a, b) => a + b, 0) / evaluatorScoresFlat.length).toFixed(2)
////            : "N/A";

////    const overallDelta =
////        selfAverage !== "N/A" && evaluatorAverage !== "N/A"
////            ? (parseFloat(evaluatorAverage) - parseFloat(selfAverage)).toFixed(2)
////            : "N/A";

////    // ---- FINAL SCORE PONDERADO EXACTO (2.34) ----
////    let weightedSum = 0;
////    let usedWeightSum = 0;

////    Object.values(competencyGroups).forEach((g) => {

////        const wRaw = g.weight ?? 0;
////        const w = wRaw > 1 ? wRaw / 100 : wRaw;

////        const validSubs = g.items
////            .filter((it) => it.evaluatorScore !== null && !it.evaluatorNA)
////            .map((it) => it.evaluatorScore as number);

////        if (validSubs.length > 0 && w > 0) {
////            const avg = validSubs.reduce((a, b) => a + b, 0) / validSubs.length;

////            weightedSum += avg * w;
////            usedWeightSum += w;
////        }
////    });

////    const finalWeightedScore =
////        usedWeightSum > 0 ? (weightedSum / usedWeightSum).toFixed(2) : "0.00";

////    return (
////        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

////            <Card className="border-0"
////                style={{
////                    background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
////                    boxShadow: "var(--shadow-xl)",
////                }}
////            >
////                <CardHeader className="pb-4">
////                    <div className="flex items-start justify-between">
////                        <div>
////                            <CardTitle className="text-2xl font-bold text-white">
////                                Evaluation Comparison
////                            </CardTitle>
////                            <p className="text-sm text-blue-200 mt-1">
////                                Side-by-side comparison of self-evaluation vs evaluator assessment
////                            </p>
////                        </div>
////                        <div className="p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
////                            <BarChart3 className="h-6 w-6 text-white" />
////                        </div>
////                    </div>
////                </CardHeader>

////                <CardContent className="space-y-6">

////                    {/* TOP CARDS */}
////                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
////                        <div className="p-4 rounded-lg"
////                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
////                            <div className="flex items-center justify-between">
////                                <div>
////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Self Average</p>
////                                    <p className="text-3xl font-bold mt-1 text-white">{selfAverage}</p>
////                                </div>
////                                <p className="text-sm text-blue-200">{selfScoresFlat.length} scored</p>
////                            </div>
////                        </div>

////                        <div className="p-4 rounded-lg"
////                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
////                            <div className="flex items-center justify-between">
////                                <div>
////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Evaluator Average</p>
////                                    <p className="text-3xl font-bold mt-1 text-white">{evaluatorAverage}</p>
////                                </div>
////                                <p className="text-sm text-blue-200">{evaluatorScoresFlat.length} scored</p>
////                            </div>
////                        </div>

////                        <div className="p-4 rounded-lg"
////                            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
////                            <div className="flex items-center justify-between">
////                                <div>
////                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Overall Δ</p>
////                                    <p className="text-3xl font-bold mt-1 text-white">
////                                        {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
////                                        {overallDelta}
////                                    </p>
////                                </div>
////                                <div className="p-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
////                                    <Award className="h-5 w-5 text-white" />
////                                </div>
////                            </div>
////                        </div>
////                    </div>

////                    {/* TABLE */}
////                    <div className="bg-white rounded-lg overflow-hidden">
////                        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
////                            style={{ background: "linear-gradient(135deg,#E9F0FF 0%,#D4E4FF 100%)" }}>
////                            <div className="col-span-12 md:col-span-4">Competency</div>
////                            <div className="col-span-12 md:col-span-3">Sub-Competency</div>
////                            <div className="col-span-4 md:col-span-2 text-center">Self Score</div>
////                            <div className="col-span-4 md:col-span-2 text-center">Evaluator Score</div>
////                            <div className="col-span-4 md:col-span-1 text-center">Δ</div>
////                        </div>

////                        <div className="divide-y divide-border">
////                            {Object.entries(competencyGroups).map(([key, group], gi) => (
////                                <div key={gi}>
////                                    {group.items.map((item, ri) => {
////                                        const isFirst = ri === 0;

////                                        const rawDelta =
////                                            !item.selfNA &&
////                                                !item.evaluatorNA &&
////                                                item.selfScore !== null &&
////                                                item.evaluatorScore !== null
////                                                ? item.evaluatorScore - item.selfScore
////                                                : null;

////                                        const delta =
////                                            rawDelta !== null ? parseFloat(rawDelta.toFixed(2)) : null;

////                                        const DeltaIcon = delta !== null ? getDeltaIcon(delta) : Minus;

////                                        const wDisplay =
////                                            group.weight > 1 ? group.weight : group.weight * 100;

////                                        return (
////                                            <motion.div key={`${gi}-${ri}`}
////                                                initial={{ opacity: 0, x: -10 }}
////                                                animate={{ opacity: 1, x: 0 }}
////                                                transition={{
////                                                    duration: 0.2,
////                                                    delay: (gi * group.items.length + ri) * 0.03,
////                                                }}
////                                                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
////                                            >

////                                                <div className="col-span-12 md:col-span-4">
////                                                    {isFirst ? (
////                                                        <div className="font-semibold text-base"
////                                                            style={{ color: "var(--kpmg-blue)" }}>
////                                                            {key} ({Math.round(wDisplay)}%)
////                                                        </div>
////                                                    ) : (
////                                                        <div className="text-sm text-transparent select-none">-</div>
////                                                    )}
////                                                </div>

////                                                <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground pl-4">
////                                                    {item.subCompetency}
////                                                </div>

////                                                <div className="col-span-4 md:col-span-2 flex justify-center">
////                                                    {item.selfNA ? (
////                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
////                                                            N/A
////                                                        </Badge>
////                                                    ) : (
////                                                        <Badge className={`font-semibold ${getScoreColor(item.selfScore)}`}>
////                                                            {item.selfScore}
////                                                        </Badge>
////                                                    )}
////                                                </div>

////                                                <div className="col-span-4 md:col-span-2 flex justify-center">
////                                                    {item.evaluatorNA ? (
////                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
////                                                            N/A
////                                                        </Badge>
////                                                    ) : (
////                                                        <Badge className={`font-semibold ${getScoreColor(item.evaluatorScore)}`}>
////                                                            {item.evaluatorScore}
////                                                        </Badge>
////                                                    )}
////                                                </div>

////                                                <div className="col-span-4 md:col-span-1 flex justify-center">
////                                                    {delta !== null ? (
////                                                        <div className={`flex items-center gap-1 font-semibold ${getDeltaColor(delta)}`}>
////                                                            <DeltaIcon className="h-4 w-4" />
////                                                            <span>{delta > 0 ? `+${delta}` : delta}</span>
////                                                        </div>
////                                                    ) : (
////                                                        <span className="text-muted-foreground">—</span>
////                                                    )}
////                                                </div>

////                                            </motion.div>
////                                        );
////                                    })}
////                                </div>
////                            ))}
////                        </div>

////                        {/* FINAL SCORE (2.34 exacto) */}
////                        <div className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2"
////                            style={{
////                                background: "linear-gradient(135deg,#E9F0FF 0%,#D4E4FF 100%)",
////                                borderColor: "var(--kpmg-blue)",
////                            }}>
////                            <div className="col-span-12 md:col-span-7 flex items-center gap-2">
////                                <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
////                                <span style={{ color: "var(--kpmg-blue)" }}>Final Evaluation Score</span>
////                            </div>

////                            <div className="col-span-4 md:col-span-2 flex justify-center">
////                                <div className="px-4 py-2 rounded-lg text-white font-bold text-lg"
////                                    style={{
////                                        background: "var(--gradient-primary)",
////                                        boxShadow: "var(--shadow-md)"
////                                    }}>
////                                    {finalWeightedScore}
////                                </div>
////                            </div>

////                            <div className="col-span-4 md:col-span-2 flex justify-center">
////                                <div className="px-4 py-2 rounded-lg text-white font-bold text-lg"
////                                    style={{
////                                        background: "var(--gradient-accent)",
////                                        boxShadow: "var(--shadow-md)"
////                                    }}>
////                                    {evaluatorAverage}
////                                </div>
////                            </div>

////                            <div className="col-span-4 md:col-span-1 flex justify-center">
////                                <div className="px-3 py-2 rounded-lg bg-white font-bold text-lg"
////                                    style={{ color: "var(--kpmg-blue)" }}>
////                                    {overallDelta}
////                                </div>
////                            </div>
////                        </div>

////                    </div>

////                </CardContent>
////            </Card>
////        </motion.div>
////    );
////}


//import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
//import { Badge } from "@/app/components/ui/badge";
//import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
//import { motion } from "motion/react";

//interface ComparisonData {
//    competency: string;
//    subCompetency: string;
//    selfScore: number | null;
//    evaluatorScore: number | null;
//    selfNA: boolean;
//    evaluatorNA: boolean;
//    weight?: number; // 0..1
//}

//interface ComparisonSummaryProps {
//    data: ComparisonData[];
//}

//const getScoreColor = (score: number | null) => {
//    if (score === null) return "bg-gray-100 text-gray-700";
//    if (score < 1.5) return "bg-red-100 text-red-700";
//    if (score < 2.5) return "bg-yellow-100 text-yellow-700";
//    return "bg-green-100 text-green-700";
//};

//const getDeltaIcon = (delta: number) => {
//    if (delta > 0) return TrendingUp;
//    if (delta < 0) return TrendingDown;
//    return Minus;
//};

//const getDeltaColor = (delta: number) => {
//    if (delta > 0) return "text-green-600";
//    if (delta < 0) return "text-red-600";
//    return "text-gray-600";
//};

//export function ComparisonSummary({ data }: ComparisonSummaryProps) {
//    // Agrupar por competencia
//    const competencyGroups = data.reduce((acc, item) => {
//        if (!acc[item.competency]) {
//            acc[item.competency] = {
//                weight: item.weight ?? 0,
//                items: []
//            };
//        }
//        acc[item.competency].items.push(item);
//        return acc;
//    }, {} as Record<string, { weight: number; items: ComparisonData[] }>);

//    // ---- Promedios generales (se mantienen como en tu UI actual) ----
//    const selfScoresFlat = data
//        .filter((x) => !x.selfNA && x.selfScore !== null)
//        .map((x) => x.selfScore as number);

//    const evaluatorScoresFlat = data
//        .filter((x) => !x.evaluatorNA && x.evaluatorScore !== null)
//        .map((x) => x.evaluatorScore as number);

//    const selfAverage =
//        selfScoresFlat.length > 0
//            ? (selfScoresFlat.reduce((a, b) => a + b, 0) / selfScoresFlat.length).toFixed(2)
//            : "N/A";

//    const evaluatorAverage =
//        evaluatorScoresFlat.length > 0
//            ? (evaluatorScoresFlat.reduce((a, b) => a + b, 0) / evaluatorScoresFlat.length).toFixed(2)
//            : "N/A";

//    const overallDelta =
//        selfAverage !== "N/A" && evaluatorAverage !== "N/A"
//            ? (parseFloat(evaluatorAverage) - parseFloat(selfAverage)).toFixed(2)
//            : "N/A";

//    // ================================
//    // FINAL SCORES (redondeo intermedio)
//    // ================================
//    const AVG_DECIMALS = 1;   // redondeo del promedio por sub-competencia
//    const PROD_DECIMALS = 2;  // redondeo de cada producto avg*w
//    const OUT_DECIMALS = 2;   // decimales del resultado final

//    function roundTo(value: number, decimals: number) {
//        const f = Math.pow(10, decimals);
//        return Math.round((value + Number.EPSILON) * f) / f;
//    }

//    function normalizeWeight(wRaw?: number) {
//        if (!wRaw || wRaw <= 0) return 0;
//        return wRaw > 1 ? wRaw / 100 : wRaw;
//    }

//    //function computeFinalWeighted(by: "self" | "evaluator") {
//    //    let sumProducts = 0;
//    //    let usedWeightSum = 0;

//    //    Object.values(competencyGroups).forEach((g) => {
//    //        const w = normalizeWeight(g.weight);
//    //        if (w <= 0) return;

//    //        const arr = g.items
//    //            .map((it) =>
//    //                by === "self"
//    //                    ? it.selfNA || it.selfScore === null
//    //                        ? null
//    //                        : it.selfScore
//    //                    : it.evaluatorNA || it.evaluatorScore === null
//    //                        ? null
//    //                        : it.evaluatorScore
//    //            )
//    //            .filter((x): x is number => x !== null);

//    //        if (arr.length === 0) return;

//    //        // 1) promedio por competencia
//    //        const avgRaw = arr.reduce((a, b) => a + b, 0) / arr.length;

//    //        // 2) redondeo intermedio del promedio
//    //        const avgRounded = roundTo(avgRaw, AVG_DECIMALS);

//    //        // 3) multiplicación por peso + redondeo del producto
//    //        const productRounded = roundTo(avgRounded * w, PROD_DECIMALS);

//    //        sumProducts += productRounded;
//    //        usedWeightSum += w;
//    //    });

//    //    const final = usedWeightSum > 0 ? sumProducts / usedWeightSum : 0;
//    //    return roundTo(final, OUT_DECIMALS).toFixed(OUT_DECIMALS);
//    //}

//    function computeWeightedFinal(scores) {
//        // 1. Redondeo EXACTO de Summary
//        const rounded = scores.map(s => ({
//            ...s,
//            score: s.score == null ? null : Math.round(s.score * 10) / 10
//        }));

//        // 2. Agrupar por competencia
//        const groups = rounded.reduce((acc, it) => {
//            if (!acc[it.competency]) {
//                acc[it.competency] = { weight: it.weight ?? 0, subs: [] };
//            }
//            if (!acc[it.competency].weight && it.weight)
//                acc[it.competency].weight = it.weight;
//            acc[it.competency].subs.push(it);
//            return acc;
//        }, {});

//        // 3. Ponderado EXACTO
//        let weightedSum = 0;
//        let usedWeightSum = 0;

//        Object.values(groups).forEach(g => {
//            const wRaw = g.weight ?? 0;
//            const w = wRaw > 1 ? wRaw / 100 : wRaw; // normalizado

//            const validSubs = g.subs.filter(s => s.score != null);
//            if (validSubs.length > 0 && w > 0) {
//                const avgComp =
//                    validSubs.reduce((a, s) => a + s.score, 0) / validSubs.length;

//                weightedSum += avgComp * w;
//                usedWeightSum += w;
//            }
//        });

//        return usedWeightSum > 0
//            ? Number((weightedSum / usedWeightSum).toFixed(2))
//            : 0;
//    }


//    // Self final (estático desde BD) y Evaluator final (dinámico)
//    const finalSelfWeightedScore = computeFinalWeighted("self");
//    const finalEvaluatorWeightedScore = computeFinalWeighted("evaluator");
//    const finalDelta =
//        (parseFloat(finalEvaluatorWeightedScore) - parseFloat(finalSelfWeightedScore)).toFixed(2);

//    return (
//        <motion.div
//            initial={{ opacity: 0, y: 20 }}
//            animate={{ opacity: 1, y: 0 }}
//            transition={{ duration: 0.4 }}
//        >
//            <Card
//                className="border-0"
//                style={{
//                    background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
//                    boxShadow: "var(--shadow-xl)",
//                }}
//            >
//                <CardHeader className="pb-4">
//                    <div className="flex items-start justify-between">
//                        <div>
//                            <CardTitle className="text-2xl font-bold text-white">
//                                Evaluation Comparison
//                            </CardTitle>
//                            <p className="text-sm text-blue-200 mt-1">
//                                Side-by-side comparison of self-evaluation vs evaluator assessment
//                            </p>
//                        </div>
//                        <div className="p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
//                            <BarChart3 className="h-6 w-6 text-white" />
//                        </div>
//                    </div>
//                </CardHeader>

//                <CardContent className="space-y-6">
//                    {/* TOP CARDS (se mantienen) */}
//                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                        <div
//                            className="p-4 rounded-lg"
//                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
//                        >
//                            <div className="flex items-center justify-between">
//                                <div>
//                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
//                                        Self Average
//                                    </p>
//                                    <p className="text-3xl font-bold mt-1 text-white">{selfAverage}</p>
//                                </div>
//                                <p className="text-sm text-blue-200">{selfScoresFlat.length} scored</p>
//                            </div>
//                        </div>

//                        <div
//                            className="p-4 rounded-lg"
//                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
//                        >
//                            <div className="flex items-center justify-between">
//                                <div>
//                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
//                                        Evaluator Average
//                                    </p>
//                                    <p className="text-3xl font-bold mt-1 text-white">{evaluatorAverage}</p>
//                                </div>
//                                <p className="text-sm text-blue-200">{evaluatorScoresFlat.length} scored</p>
//                            </div>
//                        </div>

//                        <div
//                            className="p-4 rounded-lg"
//                            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
//                        >
//                            <div className="flex items-center justify-between">
//                                <div>
//                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
//                                        Overall Δ (Avg to Avg)
//                                    </p>
//                                    <p className="text-3xl font-bold mt-1 text-white">
//                                        {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
//                                        {overallDelta}
//                                    </p>
//                                </div>
//                                <div className="p-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
//                                    <Award className="h-5 w-5 text-white" />
//                                </div>
//                            </div>
//                        </div>
//                    </div>

//                    {/* TABLE */}
//                    <div className="bg-white rounded-lg overflow-hidden">
//                        <div
//                            className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
//                            style={{ background: "linear-gradient(135deg,#E9F0FF 0%,#D4E4FF 100%)" }}
//                        >
//                            <div className="col-span-12 md:col-span-4">Competency</div>
//                            <div className="col-span-12 md:col-span-3">Sub-Competency</div>
//                            <div className="col-span-4 md:col-span-2 text-center">Self Score</div>
//                            <div className="col-span-4 md:col-span-2 text-center">Evaluator Score</div>
//                            <div className="col-span-4 md:col-span-1 text-center">Δ</div>
//                        </div>

//                        <div className="divide-y divide-border">
//                            {Object.entries(competencyGroups).map(([key, group], gi) => (
//                                <div key={gi}>
//                                    {group.items.map((item, ri) => {
//                                        const isFirst = ri === 0;
//                                        const rawDelta =
//                                            !item.selfNA &&
//                                                !item.evaluatorNA &&
//                                                item.selfScore !== null &&
//                                                item.evaluatorScore !== null
//                                                ? item.evaluatorScore - item.selfScore
//                                                : null;
//                                        const delta = rawDelta !== null ? parseFloat(rawDelta.toFixed(2)) : null;
//                                        const DeltaIcon = delta !== null ? getDeltaIcon(delta) : Minus;
//                                        const wDisplay = group.weight > 1 ? group.weight : group.weight * 100;

//                                        return (
//                                            <motion.div
//                                                key={`${gi}-${ri}`}
//                                                initial={{ opacity: 0, x: -10 }}
//                                                animate={{ opacity: 1, x: 0 }}
//                                                transition={{
//                                                    duration: 0.2,
//                                                    delay: (gi * group.items.length + ri) * 0.03,
//                                                }}
//                                                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
//                                            >
//                                                <div className="col-span-12 md:col-span-4">
//                                                    {isFirst ? (
//                                                        <div className="font-semibold text-base" style={{ color: "var(--kpmg-blue)" }}>
//                                                            {key} ({Math.round(wDisplay)}%)
//                                                        </div>
//                                                    ) : (
//                                                        <div className="text-sm text-transparent select-none">-</div>
//                                                    )}
//                                                </div>

//                                                <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground pl-4">
//                                                    {item.subCompetency}
//                                                </div>

//                                                <div className="col-span-4 md:col-span-2 flex justify-center">
//                                                    {item.selfNA ? (
//                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
//                                                            N/A
//                                                        </Badge>
//                                                    ) : (
//                                                        <Badge className={`font-semibold ${getScoreColor(item.selfScore)}`}>
//                                                            {item.selfScore}
//                                                        </Badge>
//                                                    )}
//                                                </div>

//                                                <div className="col-span-4 md:col-span-2 flex justify-center">
//                                                    {item.evaluatorNA ? (
//                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
//                                                            N/A
//                                                        </Badge>
//                                                    ) : (
//                                                        <Badge className={`font-semibold ${getScoreColor(item.evaluatorScore)}`}>
//                                                            {item.evaluatorScore}
//                                                        </Badge>
//                                                    )}
//                                                </div>

//                                                <div className="col-span-4 md:col-span-1 flex justify-center">
//                                                    {delta !== null ? (
//                                                        <div className={`flex items-center gap-1 font-semibold ${getDeltaColor(delta)}`}>
//                                                            <DeltaIcon className="h-4 w-4" />
//                                                            <span>{delta > 0 ? `+${delta}` : delta}</span>
//                                                        </div>
//                                                    ) : (
//                                                        <span className="text-muted-foreground">—</span>
//                                                    )}
//                                                </div>
//                                            </motion.div>
//                                        );
//                                    })}
//                                </div>
//                            ))}
//                        </div>

//                        {/* FINAL SCORES (Self vs Evaluator, ponderados con redondeo intermedio) */}
//                        <div
//                            className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2"
//                            style={{
//                                background: "linear-gradient(135deg,#E9F0FF 0%,#D4E4FF 100%)",
//                                borderColor: "var(--kpmg-blue)",
//                            }}
//                        >
//                            <div className="col-span-12 md:col-span-7 flex items-center gap-2">
//                                <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
//                                <span style={{ color: "var(--kpmg-blue)" }}>Final Evaluation Score</span>
//                            </div>

//                            {/* Self Final (estático desde BD) */}
//                            <div className="col-span-4 md:col-span-2 flex justify-center">
//                                <div
//                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
//                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
//                                    title="Self Final (weighted with intermediate rounding)"
//                                >
//                                    {finalSelfWeightedScore}
//                                </div>
//                            </div>

//                            {/* Evaluator Final (dinámico) */}
//                            <div className="col-span-4 md:col-span-2 flex justify-center">
//                                <div
//                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
//                                    style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-md)" }}
//                                    title="Evaluator Final (weighted with intermediate rounding)"
//                                >
//                                    {finalEvaluatorWeightedScore}
//                                </div>
//                            </div>

//                            {/* Δ Final (Evaluator - Self) */}
//                            <div className="col-span-4 md:col-span-1 flex justify-center">
//                                <div className="px-3 py-2 rounded-lg bg-white font-bold text-lg" style={{ color: "var(--kpmg-blue)" }}>
//                                    {parseFloat(finalDelta) > 0 ? `+${finalDelta}` : finalDelta}
//                                </div>
//                            </div>
//                        </div>
//                    </div>
//                </CardContent>
//            </Card>
//        </motion.div>
//    );
//}

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react"; // si no está ya importado

interface ComparisonData {
    competency: string;
    subCompetency: string;
    selfScore: number | null;       // BD (estático)
    evaluatorScore: number | null;  // dinámico (evaluador)
    selfNA: boolean;
    evaluatorNA: boolean;
    weight?: number;                 // peso de la competencia (0..1 o 0..100)
}


interface ComparisonSummaryProps {
    data: ComparisonData[];
    onEvaluatorFinal?: (value: number) => void; // NUEVO
}


/* -------------------- Helpers visuales -------------------- */
const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-700";
    if (score < 1.5) return "bg-red-100 text-red-700";
    if (score < 2.5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
};

const getDeltaIcon = (delta: number) => {
    if (delta > 0) return TrendingUp;
    if (delta < 0) return TrendingDown;
    return Minus;
};

const getDeltaColor = (delta: number) => {
    if (delta > 0) return "text-green-600";
    if (delta < 0) return "text-red-600";
    return "text-gray-600";
};

/* -------------------- Lógica EXACTA de FinalScoreSummary --------------------
   1) Redondear cada sub-competencia a 1 decimal.
   2) Agrupar por competencia, tomar un peso (normalizado).
   3) Promedio por competencia (con valores redondeados).
   4) Sumar promedio*weight y dividir por la suma de pesos.
   5) Resultado final con 2 decimales.
   (Misma secuencia que en FinalScoreSummary.txt)
-------------------------------------------------------------------------- */
function computeWeightedFinal(
    rows: Array<{ competency: string; subCompetency: string; score: number | null; weight?: number }>
): string {
    // 1) redondeo por sub-competencia
    const rounded = rows.map((s) => ({
        ...s,
        score: s.score == null ? null : Math.round(s.score * 10) / 10, // 1 decimal
    }));

    // 2) agrupar por competencia
    const groups = rounded.reduce((acc, it) => {
        if (!acc[it.competency]) {
            acc[it.competency] = { weight: it.weight ?? 0, subs: [] as typeof rounded };
        }
        if (!acc[it.competency].weight && it.weight) acc[it.competency].weight = it.weight;
        acc[it.competency].subs.push(it);
        return acc;
    }, {} as Record<string, { weight: number; subs: typeof rounded }>);

    // 3) ponderado final
    let weightedSum = 0;
    let usedWeightSum = 0;

    Object.values(groups).forEach((g) => {
        const wRaw = g.weight ?? 0;
        const w = wRaw > 1 ? wRaw / 100 : wRaw; // normaliza si venía en %

        const validSubs = g.subs.filter((s) => s.score != null) as { score: number }[];
        if (validSubs.length > 0 && w > 0) {
            const avgComp = validSubs.reduce((a, s) => a + s.score, 0) / validSubs.length;
            weightedSum += avgComp * w;
            usedWeightSum += w;
        }
    });

    const final = usedWeightSum > 0 ? weightedSum / usedWeightSum : 0;
    return final.toFixed(2); // 2 decimales
}


function roundTo1(v: number) {
    return Math.round((v + Number.EPSILON) * 10) / 10; // 1 decimal
}
function meanTo2(nums: number[]): string {
    if (!nums.length) return "N/A";
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return avg.toFixed(2); // salida 2 decimales
}


export function ComparisonSummary({ data, onEvaluatorFinal }: ComparisonSummaryProps) {
    // Agrupar para la tabla (solo para pintar encabezado de competencia + %)
    const competencyGroups = data.reduce((acc, item) => {
        if (!acc[item.competency]) {
            acc[item.competency] = {
                weight: item.weight ?? 0,
                items: [] as ComparisonData[],
            };
        }
        acc[item.competency].items.push(item);
        return acc;
    }, {} as Record<string, { weight: number; items: ComparisonData[] }>);

    /* -------------------- Promedios (cards superiores) -------------------- */

    /* ---------- Averages (con redondeo por sub‑competencia) ---------- */

    const selfRoundedScores = data
        .filter((row) => !row.selfNA && row.selfScore !== null)
        .map((row) => roundTo1(row.selfScore as number));



    const evaluatorRoundedScores = data
        .filter((row) => !row.evaluatorNA && row.evaluatorScore !== null)
        .map((row) => roundTo1(row.evaluatorScore as number));

    const selfAverage = meanTo2(selfRoundedScores);           // ej. "2.31"
    const evaluatorAverage = meanTo2(evaluatorRoundedScores); // ej. "2.31"

    const selfScoredCount = selfRoundedScores.length;
    const evaluatorScoredCount = evaluatorRoundedScores.length;

    // Δ (Avg to Avg), a 2 decimales; si alguno es N/A, mostramos "N/A"
    const overallDelta =
        selfAverage !== "N/A" && evaluatorAverage !== "N/A"
            ? (parseFloat(evaluatorAverage) - parseFloat(selfAverage)).toFixed(2)
            : "N/A";

    /* -------------------- Finales ponderados EXACTOS (Summary) --------------------
       - Self Final: usa selfScore (BD, estático).
       - Evaluator Final: usa evaluatorScore (dinámico).
       - Ambos con la misma fórmula y redondeos descritos arriba.
    --------------------------------------------------------------------------- */
    const finalSelfWeightedScore = computeWeightedFinal(
        data.map((d) => ({
            competency: d.competency,
            subCompetency: d.subCompetency,
            score: d.selfScore,
            weight: d.weight,
        }))
    );

    const finalEvaluatorWeightedScore = computeWeightedFinal(
        data.map((d) => ({
            competency: d.competency,
            subCompetency: d.subCompetency,
            score: d.evaluatorScore,
            weight: d.weight,
        }))
    );

    const handleEvaluatorFinal = onEvaluatorFinal ?? (() => { });

    useEffect(() => {
        handleEvaluatorFinal(Number(finalEvaluatorWeightedScore));
    }, [finalEvaluatorWeightedScore, handleEvaluatorFinal]);



    const finalDelta = (
        parseFloat(finalEvaluatorWeightedScore) - parseFloat(finalSelfWeightedScore)
    ).toFixed(2);



    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card
                className="border-0"
                style={{
                    background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)",
                    boxShadow: "var(--shadow-xl)",
                }}
            >
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-white">Evaluation Comparison</CardTitle>
                            <p className="text-sm text-blue-200 mt-1">
                                Side-by-side comparison of self-evaluation vs evaluator assessment
                            </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* TOP CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            className="p-4 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Self Average</p>
                                    <p className="text-3xl font-bold mt-1 text-white">{finalSelfWeightedScore}</p>
                                </div>
                                <p className="text-sm text-blue-200">{selfScoredCount} scored</p>
                            </div>
                        </div>

                        <div
                            className="p-4 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Evaluator Average</p>
                                    <p className="text-3xl font-bold mt-1 text-white">{finalEvaluatorWeightedScore}</p>
                                </div>
                                <p className="text-sm text-blue-200">{evaluatorScoredCount} scored</p>
                            </div>
                        </div>

                        <div
                            className="p-4 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Overall Δ (Avg to Avg)</p>
                                    <p className="text-3xl font-bold mt-1 text-white">
                                        {overallDelta !== "N/A" && parseFloat(overallDelta) > 0 && "+"}
                                        {overallDelta}
                                    </p>
                                </div>
                                <div className="p-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
                                    <Award className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-lg overflow-hidden">
                        <div
                            className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
                            style={{ background: "linear-gradient(135deg,#E9F0FF 0%,#D4E4FF 100%)" }}
                        >
                            <div className="col-span-12 md:col-span-4">Competency</div>
                            <div className="col-span-12 md:col-span-3">Sub-Competency</div>
                            <div className="col-span-4 md:col-span-2 text-center">Self Score</div>
                            <div className="col-span-4 md:col-span-2 text-center">Evaluator Score</div>
                            <div className="col-span-4 md:col-span-1 text-center">Δ</div>
                        </div>

                        <div className="divide-y divide-border">
                            {Object.entries(competencyGroups).map(([key, group], gi) => (
                                <div key={gi}>
                                    {group.items.map((item, ri) => {
                                        const isFirst = ri === 0;
                                        const rawDelta =
                                            !item.selfNA &&
                                                !item.evaluatorNA &&
                                                item.selfScore !== null &&
                                                item.evaluatorScore !== null
                                                ? item.evaluatorScore - item.selfScore
                                                : null;

                                        const delta = rawDelta !== null ? parseFloat(rawDelta.toFixed(2)) : null;
                                        const DeltaIcon = delta !== null ? getDeltaIcon(delta) : Minus;
                                        const wDisplay = group.weight > 1 ? group.weight : group.weight * 100;

                                        return (
                                            <motion.div
                                                key={`${gi}-${ri}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: (gi * group.items.length + ri) * 0.03,
                                                }}
                                                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
                                            >
                                                {/* Competency + weight */}
                                                <div className="col-span-12 md:col-span-4">
                                                    {isFirst ? (
                                                        <div className="font-semibold text-base" style={{ color: "var(--kpmg-blue)" }}>
                                                            {key} ({Math.round(wDisplay)}%)
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-transparent select-none">-</div>
                                                    )}
                                                </div>

                                                {/* Sub-competency */}
                                                <div className="col-span-12 md:col-span-3 text-sm text-muted-foreground pl-4">
                                                    {item.subCompetency}
                                                </div>

                                                {/* Self Score */}
                                                <div className="col-span-4 md:col-span-2 flex justify-center">
                                                    {item.selfNA ? (
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                                            N/A
                                                        </Badge>
                                                    ) : (
                                                        <Badge className={`font-semibold ${getScoreColor(item.selfScore)}`}>
                                                            {item.selfScore}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Evaluator Score */}
                                                <div className="col-span-4 md:col-span-2 flex justify-center">
                                                    {item.evaluatorNA ? (
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                                            N/A
                                                        </Badge>
                                                    ) : (
                                                        <Badge className={`font-semibold ${getScoreColor(item.evaluatorScore)}`}>
                                                            {item.evaluatorScore}
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Δ */}
                                                <div className="col-span-4 md:col-span-1 flex justify-center">
                                                    {delta !== null ? (
                                                        <div className={`flex items-center gap-1 font-semibold ${getDeltaColor(delta)}`}>
                                                            <DeltaIcon className="h-4 w-4" />
                                                            <span>{delta > 0 ? `+${delta}` : delta}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">—</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* FINAL SCORES (Self vs Evaluator, ponderados EXACTOS y consistentes con Summary) */}
                        <div
                            className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2"
                            style={{
                                background: "linear-gradient(135deg,#E9F0FF 0%,#D4E4FF 100%)",
                                borderColor: "var(--kpmg-blue)",
                            }}
                        >
                            <div className="col-span-12 md:col-span-7 flex items-center gap-2">
                                <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
                                <span style={{ color: "var(--kpmg-blue)" }}>Final Evaluation Score</span>
                            </div>

                            {/* Self Final (BD estático) */}
                            <div className="col-span-4 md:col-span-2 flex justify-center">
                                <div
                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
                                    title="Self Final (weighted, rounded as in FinalScoreSummary)"
                                >
                                    {finalSelfWeightedScore}
                                </div>
                            </div>

                            {/* Evaluator Final (dinámico) */}
                            <div className="col-span-4 md:col-span-2 flex justify-center">
                                <div
                                    className="px-4 py-2 rounded-lg text-white font-bold text-lg"
                                    style={{ background: "var(--gradient-accent)", boxShadow: "var(--shadow-md)" }}
                                    title="Evaluator Final (weighted, rounded as in FinalScoreSummary)"
                                >
                                    {finalEvaluatorWeightedScore}
                                </div>
                            </div>

                            {/* Δ Final */}
                            <div className="col-span-4 md:col-span-1 flex justify-center">
                                <div className="px-3 py-2 rounded-lg bg-white font-bold text-lg" style={{ color: "var(--kpmg-blue)" }}>
                                    {parseFloat(finalDelta) > 0 ? `+${finalDelta}` : finalDelta}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}


