import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { User, Calendar, Clock, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

interface ManagerEvaluationCardProps {
    id: string;
    personName: string;
    role: string;
    clientName: string;
    clientNumber: string;
    state: "pending" | "submitted" | "completed";
    cutoffPeriod: string;
    evaluatedHours: number;
    dueDate: string;
    index: number;
    isClosed?: boolean | null;
    onDelete?: (id: string, personName: string) => void;
}

export function ManagerEvaluationCard({
    id,
    personName,
    role,
    clientName,
    clientNumber,
    state,
    cutoffPeriod,
    evaluatedHours,
    dueDate,
    index,
    onDelete,
    isClosed
}: ManagerEvaluationCardProps) {
    const getStateColor = () => {
        switch (state) {
            case "pending":
                return "#94a3b8"; // neutral gray
            case "submitted":
                return "var(--pacific-blue)";
            case "completed":
                return "#7213EA"; // success green
            default:
                return "#94a3b8";
        }
    };

    const getActionLabel = () => {
        if (state === "completed") return "Review";
        if (state === "submitted") return "Continue";
        return "Start";
    };

    const stateColor = getStateColor();
    const isCompleted = state === "completed";
    const isPending = state === "pending";

    // Build consolidated metadata line
    const metadataItems: string[] = [];
    metadataItems.push(cutoffPeriod);
    metadataItems.push(role);
    

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Card
                className="border-0 group hover:shadow-xl transition-all duration-300 overflow-hidden relative"
                style={{ boxShadow: "var(--shadow-lg)" }}
            >
                {/* Left accent line */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: stateColor }}
                />
                {onDelete && state != "completed" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20"
                        style={{ color: '#94a3b8' }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(id, personName);
                        }}
                        aria-label="Delete evaluation"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                )}

                <CardContent className="relative h-full p-4 pl-6 pr-12">

                    {/* Subtle gradient overlay on hover - only for non-completed */}
                    {!isCompleted && (
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: "var(--gradient-card)" }}
                        />
                    )}

                    <div className="relative z-10 flex flex-col gap-3">
                        {/* Header: Person Name + Icon */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xl truncate">
                                    {personName}
                                </h3>
                            </div>
                            <div
                                className="p-2 rounded-lg flex-shrink-0 mr-2"
                                style={{ background: "var(--gradient-primary)" }}
                            >
                                <User className="h-5 w-5 text-white" />
                            </div>
                        </div>

                        {/* Metadata: Role · Cut-off period */}
                        <div className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                            <span className="flex items-center flex-wrap">
                                {metadataItems.map((item, i) => (
                                    <span key={i} className="inline-flex items-center">
                                        <span>{item}</span>

                                        {i < metadataItems.length - 1 && (
                                            <span className="mx-2 inline-block w-1 h-1 rounded-full bg-slate-400" />
                                        )}
                                    </span>
                                ))}
                            </span>
                        </div>

                        {/* Key fields row */}
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span style={{ color: '#64748b' }}>Modified:</span>
                                <span className="font-medium" style={{ color: '#0C233C' }}>
                                    {new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span style={{ color: '#64748b' }}>Hours evaluated:</span>
                                <span className="font-medium" style={{ color: '#0C233C' }}>
                                    {evaluatedHours}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span style={{ color: '#64748b' }}>Client:</span>
                                <span className="font-medium" style={{ color: '#64748b' }}>
                                    {clientName} ({clientNumber})
                                </span>
                            </div>
                        </div>

                        {/* Footer: Action button */}
                        <div className="flex items-center justify-end pt-2 mt-1 border-t border-border">
                            {isCompleted ? (
                                <Button
                                    asChild
                                    className="text-white"
                                    style={{ background: 'linear-gradient(135deg, #00338D 0%, #1E49E2 100%)' }}
                                >
                                    <Link to={`/evaluations/${id}`}>{getActionLabel()}</Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    style={
                                        !isCompleted
                                            ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }
                                            : {}
                                    }
                                    className="text-white"
                                >
                                    <Link to={`/evaluations/${id}`}>{getActionLabel()}</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}