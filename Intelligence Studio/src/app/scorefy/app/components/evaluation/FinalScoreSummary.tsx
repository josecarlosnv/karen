// import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
// import { Badge } from "@/app/components/ui/badge";
// import { TrendingUp, Award } from "lucide-react";
// import { motion } from "motion/react";

// interface ScoreData {
//   competency: string;
//   subCompetency: string;
//   score: number | null;
//   weight?: number; // Weight for the competency (only at competency level)
// }

// interface FinalScoreSummaryProps {
//   scores: ScoreData[];
// }

// const getScoreColor = (score: number | null) => {
//   if (score === null) return "bg-gray-100 text-gray-700";
//   if (score === 1) return "bg-red-100 text-red-700";
//   if (score === 2) return "bg-yellow-100 text-yellow-700";
//   if (score === 3) return "bg-green-100 text-green-700";
//   return "bg-gray-100 text-gray-700";
// };

// const getScoreLabel = (score: number | null) => {
//   if (score === null) return "Not Rated";
//   if (score === 1) return "Needs Development";
//   if (score === 2) return "Competent";
//   if (score === 3) return "Strong Performance";
//   return "Not Rated";
// };

// export function FinalScoreSummary({ scores }: FinalScoreSummaryProps) {
//   // Group scores by competency
//   const competencyGroups = scores.reduce((acc, item) => {
//     if (!acc[item.competency]) {
//       acc[item.competency] = {
//         weight: item.weight || 0,
//         items: []
//       };
//     }
//     acc[item.competency].items.push(item);
//     return acc;
//   }, {} as Record<string, { weight: number; items: ScoreData[] }>);

//   // Calculate weighted average score
//   let weightedSum = 0;
//   let totalWeight = 0;

//   Object.entries(competencyGroups).forEach(([competency, group]) => {
//     const validScoresInGroup = group.items.filter(item => item.score !== null);
//     if (validScoresInGroup.length > 0) {
//       const groupAverage = validScoresInGroup.reduce((sum, item) => sum + (item.score || 0), 0) / validScoresInGroup.length;
//       weightedSum += groupAverage * group.weight;
//       totalWeight += group.weight;
//     }
//   });

//   const finalWeightedScore = totalWeight > 0 ? (weightedSum / totalWeight).toFixed(2) : "0.00";

//   // Calculate simple average for completion stats
//   const validScores = scores.filter((s) => s.score !== null).map((s) => s.score as number);
//   const averageScore = validScores.length > 0
//     ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2)
//     : "0.00";

//   const completionRate = scores.length > 0
//     ? Math.round((validScores.length / scores.length) * 100)
//     : 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       <Card
//         className="border-0"
//         style={{
//           background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
//           boxShadow: "var(--shadow-xl)",
//         }}
//       >
//         <CardHeader className="pb-4">
//           <div className="flex items-start justify-between">
//             <div>
//               <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
//                 Evaluation Summary
//               </CardTitle>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Review your self-evaluation scores across all competencies
//               </p>
//             </div>
//             <div
//               className="p-3 rounded-lg"
//               style={{ background: "var(--gradient-primary)" }}
//             >
//               <TrendingUp className="h-6 w-6 text-white" />
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {/* Completion Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div
//               className="p-4 rounded-lg"
//               style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-sm)" }}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
//                     Completion Rate
//                   </p>
//                   <p className="text-3xl font-bold mt-1" style={{ color: "var(--kpmg-blue)" }}>
//                     {completionRate}%
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm text-muted-foreground">
//                     {validScores.length} of {scores.length}
//                   </p>
//                   <p className="text-xs text-muted-foreground">competencies rated</p>
//                 </div>
//               </div>
//             </div>

//             <div
//               className="p-4 rounded-lg"
//               style={{
//                 background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)",
//                 boxShadow: "var(--shadow-sm)",
//               }}
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
//                     Average Score
//                   </p>
//                   <p className="text-3xl font-bold mt-1" style={{ color: "var(--cobalt-blue)" }}>
//                     {averageScore}
//                   </p>
//                 </div>
//                 <div
//                   className="p-3 rounded-full"
//                   style={{ background: "var(--gradient-accent)" }}
//                 >
//                   <Award className="h-5 w-5 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Score Table */}
//           <div className="overflow-x-auto">
//             <div className="bg-white rounded-lg border border-border overflow-hidden">
//               {/* Table Header */}
//               <div
//                 className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold"
//                 style={{ background: "var(--gradient-card)" }}
//               >
//                 <div className="col-span-12 md:col-span-5">Competency</div>
//                 <div className="col-span-12 md:col-span-4">Sub-Competency</div>
//                 <div className="col-span-12 md:col-span-3 text-right">Self-Evaluation Score</div>
//               </div>

//               {/* Table Rows */}
//               <div className="divide-y divide-border">
//                 {Object.entries(competencyGroups).map(([competency, group], groupIndex) => (
//                   <div key={groupIndex}>
//                     {group.items.map((item, itemIndex) => {
//                       const isFirstInGroup = itemIndex === 0;
//                       return (
//                         <motion.div
//                           key={`${groupIndex}-${itemIndex}`}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ duration: 0.2, delay: (groupIndex * group.items.length + itemIndex) * 0.05 }}
//                           className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
//                         >
//                           {/* Competency column with weight on first row of each group */}
//                           <div className="col-span-12 md:col-span-5">
//                             {isFirstInGroup ? (
//                               <div className="font-semibold text-base" style={{ color: 'var(--kpmg-blue)' }}>
//                                 {item.competency} ({group.weight}%)
//                               </div>
//                             ) : (
//                               <div className="text-sm text-transparent select-none">-</div>
//                             )}
//                           </div>
//                           {/* Sub-competency column */}
//                           <div className="col-span-12 md:col-span-4 text-sm text-muted-foreground pl-4">
//                             {item.subCompetency}
//                           </div>
//                           {/* Score column */}
//                           <div className="col-span-12 md:col-span-3 flex justify-end">
//                             <Badge
//                               className={`font-semibold ${getScoreColor(item.score)}`}
//                               style={item.score !== null ? { boxShadow: "var(--shadow-sm)" } : {}}
//                             >
//                               {item.score !== null ? (
//                                 <>
//                                   <span className="text-lg mr-2">{item.score}</span>
//                                   <span className="text-xs">{getScoreLabel(item.score)}</span>
//                                 </>
//                               ) : (
//                                 "Not Rated"
//                               )}
//                             </Badge>
//                           </div>
//                         </motion.div>
//                       );
//                     })}
//                   </div>
//                 ))}
//               </div>

//               {/* Final Score Row */}
//               <div
//                 className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2 border-primary"
//                 style={{
//                   background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)",
//                 }}
//               >
//                 <div className="col-span-12 md:col-span-9 flex items-center gap-2">
//                   <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
//                   <span style={{ color: "var(--kpmg-blue)" }}>
//                     Final Evaluation Score
//                   </span>
//                 </div>
//                 <div className="col-span-12 md:col-span-3 flex justify-end">
//                   <div
//                     className="px-4 py-2 rounded-lg text-white font-bold text-xl"
//                     style={{
//                       background: "var(--gradient-primary)",
//                       boxShadow: "var(--shadow-md)",
//                     }}
//                   >
//                     {finalWeightedScore}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Score Distribution */}
//           <div className="pt-4 border-t border-border">
//             <h4 className="text-sm font-semibold mb-3">Score Distribution</h4>
//             <div className="grid grid-cols-3 gap-3">
//               <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
//                 <p className="text-2xl font-bold text-red-700">
//                   {validScores.filter((s) => s === 1).length}
//                 </p>
//                 <p className="text-xs text-red-600 mt-1">Needs Development</p>
//               </div>
//               <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
//                 <p className="text-2xl font-bold text-yellow-700">
//                   {validScores.filter((s) => s === 2).length}
//                 </p>
//                 <p className="text-xs text-yellow-600 mt-1">Competent</p>
//               </div>
//               <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
//                 <p className="text-2xl font-bold text-green-700">
//                   {validScores.filter((s) => s === 3).length}
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">Strong Performance</p>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }


import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingUp, Award } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

interface ScoreData {
    competency: string;     // nombre competencia
    subCompetency: string;  // nombre sub‑competencia
    score: number | null;   // promedio (1..3 con decimales) o null
    weight?: number;        // peso de la competencia (0..1 o 0..100)
}

interface FinalScoreSummaryProps {
    scores: ScoreData[];    // **una fila por sub‑competencia**
    completion: {
        answeredReactives: number; // reactivos con score (1..3)
        totalReactives: number;    // total de reactivos
    };
    onFinalScore?: (value: number) => void;
}

// Colores por rango decimal
const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-100 text-gray-700";
    if (score < 1.5) return "bg-red-100 text-red-700";
    if (score < 2.5) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
};

// Etiqueta por tramo
const getScoreLabel = (score: number | null) => {
    if (score === null) return "";
    if (score < 1.5) return "Needs Development";
    if (score < 2.5) return "Competent";
    return "Strong Performance";
};

export function FinalScoreSummary({ scores, completion, onFinalScore }: FinalScoreSummaryProps) {


    const scoresRounded = scores.map(s => ({
        ...s,
        score: s.score == null ? null : Math.round(s.score * 10) / 10
    }));

    console.log("📌 SummaryData (valores EXACTOS usados por el cálculo):", scores);

    // 1) Agrupar por competencia

    // 1) Agrupar por competencia
    const groups = scoresRounded.reduce((acc, it) => {
        if (!acc[it.competency]) {
            acc[it.competency] = { weight: it.weight ?? 0, subs: [] as ScoreData[] };
        }
        if (!acc[it.competency].weight && it.weight) acc[it.competency].weight = it.weight;
        acc[it.competency].subs.push(it);
        return acc;
    }, {} as Record<string, { weight: number; subs: ScoreData[] }>);

    // 2) Ponderado final (sobre sub‑competencias con score)
    let weightedSum = 0;
    let usedWeightSum = 0;

    Object.values(groups).forEach(g => {
        const wRaw = g.weight ?? 0;
        const w = wRaw > 1 ? wRaw / 100 : wRaw; // normaliza si venía en %
        const validSubs = g.subs.filter(s => s.score != null) as { score: number }[];
        if (validSubs.length > 0 && w > 0) {
            const avgComp = validSubs.reduce((a, s) => a + s.score, 0) / validSubs.length;
            weightedSum += avgComp * w;
            usedWeightSum += w;
        }
    });

    console.log("📌 weightedSum:", weightedSum);
    console.log("📌 usedWeightSum:", usedWeightSum);
    console.log("📌 Final EXACT result:", weightedSum / usedWeightSum);


    const finalWeightedScore = usedWeightSum > 0 ? (weightedSum / usedWeightSum).toFixed(2) : "0.00";


    useEffect(() => {
        if (onFinalScore) {
            onFinalScore(Number(finalWeightedScore));
        }
    }, [finalWeightedScore, onFinalScore]);


    const averageScoreWeighted = finalWeightedScore;

    // 3) Completion **por REACTIVO**
    const { answeredReactives, totalReactives } = completion;
    const completionRate =
        totalReactives > 0 ? Math.round((answeredReactives / totalReactives) * 100) : 0;

    // 4) Distribución por tramos (opcional, sobre sub‑competencias)
    const validScores = scores.filter(s => s.score != null).map(s => s.score as number);
    const bucket1 = validScores.filter(v => v < 1.5).length;
    const bucket2 = validScores.filter(v => v >= 1.5 && v < 2.5).length;
    const bucket3 = validScores.filter(v => v >= 2.5).length;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="border-0" style={{ background: "linear-gradient(135deg, #0C233C 0%, #00338D 100%)", boxShadow: "var(--shadow-xl)" }}>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Evaluation Summary
                            </CardTitle>
                            <p className="text-sm text-blue-200 mt-1">
                                Review your self-evaluation scores across all competencies
                            </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Completion & Average */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Completion Rate (por reactivo) */}
                        <div className="p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)" }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">
                                        Completion Rate
                                    </p>
                                    <p className="text-3xl font-bold mt-1" style={{ color: "white" }}>
                                        {completionRate}%
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-blue-200">
                                        {answeredReactives} of {totalReactives}
                                    </p>
                                    <p className="text-sm text-blue-200">competencies rated</p>
                                </div>
                            </div>
                        </div>

                        {/* Average Score (ponderado) */}
                        <div className="p-4 rounded-lg" style={{
                            background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(10px)",
                            boxShadow: "var(--shadow-sm)" }}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Average Score</p>
                                    <p className="text-3xl font-bold mt-1" style={{ color: "white" }}>
                                        {averageScoreWeighted}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full" style={{ background: "var(--gradient-accent)" }}>
                                    <Award className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabla por sub‑competencia (agrupada por competencia) */}
                    <div className="overflow-x-auto">
                        <div className="bg-white rounded-lg border border-border overflow-hidden">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold" style={{ background: "var(--gradient-card)" }}>
                                <div className="col-span-12 md:col-span-5">Competency</div>
                                <div className="col-span-12 md:col-span-4">Sub-Competency</div>
                                <div className="col-span-12 md:col-span-3 text-right">Self-Evaluation Score</div>
                            </div>

                            {/* Filas */}
                            <div className="divide-y divide-border">
                                {Object.entries(groups).map(([comp, g], gi) => {
                                    const wDisplay = (g.weight ?? 0) > 1 ? g.weight : (g.weight ?? 0) * 100; // mostrar en %
                                    return (
                                        <div key={gi}>
                                            {g.subs.map((row, ri) => {
                                                const isFirst = ri === 0;
                                                return (
                                                    <motion.div
                                                        key={`${gi}-${ri}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2, delay: (gi * g.subs.length + ri) * 0.05 }}
                                                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors"
                                                    >
                                                        {/* Competencia + Weight */}
                                                        <div className="col-span-12 md:col-span-5">
                                                            {isFirst ? (
                                                                <div className="font-semibold text-base" style={{ color: "var(--kpmg-blue)" }}>
                                                                    {comp} ({Math.round(wDisplay)}%)
                                                                </div>
                                                            ) : (
                                                                <div className="text-sm text-transparent select-none">-</div>
                                                            )}
                                                        </div>

                                                        {/* Sub-competencia */}
                                                        <div className="col-span-12 md:col-span-4 text-sm text-muted-foreground pl-4">
                                                            {row.subCompetency}
                                                        </div>

                                                        {/* Score (decimales; sin "Not Rated") */}
                                                        <div className="col-span-12 md:col-span-3 flex justify-end">
                                                            <Badge
                                                                className={`font-semibold ${getScoreColor(row.score)}`}
                                                                style={row.score != null ? { boxShadow: "var(--shadow-sm)" } : {}}
                                                            >
                                                                {row.score != null ? (
                                                                    <>
                                                                        <span className="text-lg mr-2">{Number(row.score).toFixed(1)}</span>
                                                                        <span className="text-xs">{getScoreLabel(row.score)}</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-lg mr-2">—</span>
                                                                )}
                                                            </Badge>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Final Score */}
                            <div className="grid grid-cols-12 gap-4 px-4 py-4 font-bold text-base border-t-2 border-primary" style={{ background: "linear-gradient(135deg, #E9F0FF 0%, #D4E4FF 100%)" }}>
                                <div className="col-span-12 md:col-span-9 flex items-center gap-2">
                                    <Award className="h-5 w-5" style={{ color: "var(--kpmg-blue)" }} />
                                    <span style={{ color: "var(--kpmg-blue)" }}>Final Evaluation Score</span>
                                </div>
                                <div className="col-span-12 md:col-span-3 flex justify-end">
                                    <div className="px-4 py-2 rounded-lg text-white font-bold text-xl" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}>
                                        {finalWeightedScore}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Distribución por tramos (decimales) */}
                    <div className="pt-4 border-t border-border">
                        <h4 className="text-xs text-blue-200 uppercase tracking-wide font-medium mb-3">Score SubCompetence Distribution</h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                                <p className="text-2xl font-bold text-red-700">{bucket1}</p>
                                <p className="text-xs text-red-600 mt-1">Needs Development </p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                                <p className="text-2xl font-bold text-yellow-700">{bucket2}</p>
                                <p className="text-xs text-yellow-600 mt-1">Competent </p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                                <p className="text-2xl font-bold text-green-700">{bucket3}</p>
                                <p className="text-xs text-green-600 mt-1">Strong </p>

                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

    );
}