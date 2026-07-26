import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { HelpCircle, Info, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";

interface ReactivoValue {
    score: number | null;
    comment: string;
    isNA: boolean;
}

interface EnhancedReactivoCardProps {
    competency: string;
    subCompetency: string;
    description: string;
    index: number;
    mode: "self" | "evaluator";

    // Self evaluation data (for evaluator mode)
    selfEvaluation?: ReactivoValue;

    // Current value
    value?: ReactivoValue;
    onChange?: (value: ReactivoValue) => void;

    // State
    state?: "default" | "error" | "saved";
    errorMessage?: string;

    // Validation
}

const scoreOptions = [
    { value: 1, label: "Needs Development", color: "bg-red-100 text-red-700 border-red-300" },
    { value: 2, label: "Competent", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    { value: 3, label: "Strong Performance", color: "bg-green-100 text-green-700 border-green-300" },
];
const MAX_COMMENT_LENGTH = 340;
export function EnhancedReactivoCard({
    competency,
    subCompetency,
    description,
    index,
    mode,
    selfEvaluation,
    value = { score: null, comment: "", isNA: false },
    onChange,
    state = "default",
    errorMessage,
    isCommentMandatory = false,

}: EnhancedReactivoCardProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleScoreChange = (score: number) => {
        const newValue = { ...localValue, score };
        setLocalValue(newValue);
        onChange?.(newValue);
    };


    const handleCommentChange = (comment: string) => {
        if (comment.length > MAX_COMMENT_LENGTH) return; 
        const newValue = { ...localValue, comment };
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    const handleNAChange = (isNA: boolean) => {
        const newValue = { ...localValue, isNA, score: isNA ? null : localValue.score };
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    const showNAWarning = selfEvaluation?.isNA && !localValue.isNA;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Card
                className={`border-0 group hover:shadow-xl transition-all duration-300 ${state === "error" ? "ring-2 ring-red-500" : ""
                    }`}
                style={{ boxShadow: "var(--shadow-lg)" }}
            >
                <CardContent className="p-6 space-y-4">
                    {/* Competency Metadata Block */}
                    <div
                        className="p-4 rounded-lg space-y-2"
                        style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E9F0FF 100%)" }}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        className="text-white font-medium"
                                        style={{ background: "var(--gradient-primary)" }}
                                    >
                                        Competency
                                    </Badge>
                                    <h3 className="font-semibold text-[var(--kpmg-blue)]">
                                        {competency}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 ml-1">
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                        Sub-Competency:
                                    </span>
                                    <span className="text-sm font-medium text-foreground">
                                        {subCompetency}
                                    </span>
                                </div>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-sm">
                                            {mode === "self"
                                                ? "Rate your performance or mark as N/A if not applicable."
                                                : "Review the self-evaluation and provide your assessment."}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    {/* Reactivo Description */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                            Evaluation Criteria
                        </Label>
                        <p className="text-sm leading-relaxed text-foreground">{description}</p>
                    </div>

                    {/* Self Evaluation (Read-only) - Only in Evaluator Mode */}
                    {mode === "evaluator" && selfEvaluation && (
                        <div
                            className="space-y-3 p-4 rounded-lg border-l-4"
                            style={{
                                background: "linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)",
                                borderColor: selfEvaluation.isNA ? "#F59E0B" : "var(--cobalt-blue)",
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">Self-Evaluation</Label>
                                {selfEvaluation.isNA && (
                                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-300">
                                        <Info className="h-3 w-3 mr-1" />
                                        Self marked N/A
                                    </Badge>
                                )}
                            </div>

                            {selfEvaluation.isNA ? (
                                <p className="text-sm text-muted-foreground italic">
                                    Marked as Not Applicable by Evaluated
                                </p>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Self Score:</span>
                                        <Badge
                                            className={`font-semibold ${scoreOptions.find((s) => s.value === selfEvaluation.score)?.color ||
                                                "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {selfEvaluation.score} -{" "}
                                            {scoreOptions.find((s) => s.value === selfEvaluation.score)?.label}
                                        </Badge>
                                    </div>

                                    {selfEvaluation.comment && (
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Self Comments:</Label>
                                            <div className="bg-white p-3 rounded border border-gray-200">
                                                <p className="text-sm text-muted-foreground">{selfEvaluation.comment}</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {showNAWarning && (
                                <div className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
                                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                    <p className="text-xs text-orange-700">
                                        Employee marked this N/A. If you're scoring it, please add a note explaining why.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* N/A Toggle */}
                    <div
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: "var(--gradient-card)" }}
                    >
                        <div className="flex items-center gap-2">
                            <Label htmlFor={`na-${index}`} className="text-sm font-medium cursor-pointer">
                                Mark as Not Applicable (N/A)
                            </Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs text-sm">
                                            Enable if this competency doesn't apply to this engagement. It will be excluded from scoring.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Switch
                            id={`na-${index}`}
                            checked={localValue.isNA}
                            onCheckedChange={handleNAChange}
                        />
                    </div>

                    {/* Score Selector - Disabled if N/A */}
                    {!localValue.isNA && (
                        <>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">
                                        {mode === "evaluator" ? "Evaluator " : ""}Score{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                </div>

                                {/* Desktop/Tablet: Segmented Control */}
                                <div className="hidden md:flex gap-2">
                                    {scoreOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleScoreChange(option.value)}
                                            className={`
                        flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200
                        ${localValue.score === option.value
                                                    ? `${option.color} border-current shadow-md scale-105`
                                                    : "bg-white border-border hover:border-primary hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent"
                                                }
                      `}
                                            style={
                                                localValue.score === option.value
                                                    ? { boxShadow: "var(--shadow-md)" }
                                                    : {}
                                            }
                                        >
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-2xl font-bold">{option.value}</span>
                                                <span className="text-xs font-medium">{option.label}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile: Dropdown */}
                                <div className="md:hidden">
                                    <Select
                                        value={localValue.score?.toString() || ""}
                                        onValueChange={(value) => handleScoreChange(parseInt(value))}
                                    >
                                        <SelectTrigger style={{ background: "var(--gradient-card)" }}>
                                            <SelectValue placeholder="Select a score..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {scoreOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value.toString()}>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-lg">{option.value}</span>
                                                        <span className="text-sm">{option.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Score Legend */}
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200">
                                        1 = Needs Development
                                    </span>
                                    <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
                                        2 = Competent
                                    </span>
                                    <span className="px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">
                                        3 = Strong Performance
                                    </span>
                                </div>
                            </div>

                            {/* Comment Box */}
                            <div className="space-y-2">

                                {/*</Label>*/}
                                <Label htmlFor={`comment-${index}`} className="text-sm font-medium">
                                    Comments & Evidence
                                    {(isCommentMandatory) && <span className="text-red-500 ml-1">*</span>}
                                </Label>

                                <Textarea
                                    id={`comment-${index}`}
                                    placeholder={
                                        isCommentMandatory
                                            ? "Required: Provide specific examples, evidence, or context to support your score..."
                                            : "Provide specific examples, evidence, or context to support your score..."
                                    }
                                    value={localValue.comment}
                                    maxLength={MAX_COMMENT_LENGTH} 
                                    onChange={(e) => handleCommentChange(e.target.value)}
                                    rows={4}
                                    style={{ background: "var(--gradient-card)" }}
                                    className={state === "error" ? "border-red-500" : ""}
                                />
                                <p className="text-xs text-muted-foreground">
                                    
                                </p>
                            </div>
                        </>
                    )}

                    {/* N/A Message */}
                    {localValue.isNA && (
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start gap-2">
                                <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-orange-900">
                                        Excluded from scoring
                                    </p>
                                    <p className="text-xs text-orange-700 mt-1">
                                        This item is marked as Not Applicable and will be excluded from competency and final averages.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {state === "error" && errorMessage && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <p className="text-sm text-red-700">{errorMessage}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
