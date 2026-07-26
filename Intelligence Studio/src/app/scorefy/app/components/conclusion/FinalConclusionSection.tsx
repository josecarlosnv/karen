
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Save, Edit2, Trash2, Lock, User, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SectionStatusPill } from "@/app/components/conclusion/SectionStatusPill";
import { RatingSelector1to5 } from "@/app/components/conclusion/RatingSelector1to5";
import { PromotionTypeSelector } from "@/app/components/conclusion/PromotionTypeSelector";
import { SegmentedControl } from "@/app/components/ui/segmented-control";
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
import { useState, useEffect } from "react";

interface FinalConclusionSectionProps {
    title: string;
    subtitle?: string;
    sectionType: "performance-manager" | "committee" | "calibration";
    state: "edit" | "view" | "locked";
    status: "pending" | "in-progress" | "completed";
    data?: SectionData;
    onSave?: (data: SectionData) => void;
    onEdit?: () => void;
    onDelete?: () => void;
    editorName?: string;
    lastUpdated?: string;
    employeeLevel?: string | null;
    hasEmployee?: boolean;
    canEdit?: boolean;
}

export interface SectionData {
    feedbackConversationCompleted?: boolean;
    promotionType?: "promotion" | "co" | null;
    promotionCategory?: string;
    justification?: string;
    openPDRating: number | null;
    strengths?: string;
    areasOfOpportunity?: string;
    generalComments?: string;
    // Compliance fields
    compliance806A?: {
        trainingCompleted?: string | null;
        independenceEthicsIssues?: string | null;
        rolePerformance?: string | null;
        codeOfConductIssues?: string | null;
    };
    compliance806B?: {
        trainingCompleted?: string | null;
        independenceEthicsIssues?: string | null;
        qprScore?: string | null;
        rolePerformance?: string | null;
        codeOfConductIssues?: string | null;
    };
    complianceComments?: string;
}

export function FinalConclusionSection({
    title,
    subtitle,
    sectionType,
    state,
    status,
    data,
    onSave,
    onEdit,
    onDelete,
    editorName,
    lastUpdated,
    employeeLevel = null,
    hasEmployee,
    canEdit = false,
}: FinalConclusionSectionProps) {
    const [formData, setFormData] = useState<SectionData>(() =>
        data
            ? { ...data }
            : {
                feedbackConversationCompleted: false,
                promotionType: null,
                promotionCategory: "",
                justification: "",
                openPDRating: null,
                strengths: "",
                areasOfOpportunity: "",
                generalComments: "",
                compliance806A: {
                    trainingCompleted: null,
                    independenceEthicsIssues: null,
                    rolePerformance: null,
                    codeOfConductIssues: null,
                },
                compliance806B: {
                    trainingCompleted: null,
                    independenceEthicsIssues: null,
                    qprScore: null,
                    rolePerformance: null,
                    codeOfConductIssues: null,
                },
                complianceComments: "",
            }
    );

    const isManagerLevel =
        employeeLevel === "Manager" ||
        employeeLevel === "Senior Manager";

    useEffect(() => {
        if (data) {
            setFormData({ ...data });
        } else {
            // ✅ LIMPIAR FORMULARIO CUANDO CAMBIA EMPLEADO
            setFormData({
                feedbackConversationCompleted: false,
                promotionType: null,
                promotionCategory: "",
                justification: "",
                openPDRating: null,
                strengths: "",
                areasOfOpportunity: "",
                generalComments: "",
                compliance806A: {
                    trainingCompleted: null,
                    independenceEthicsIssues: null,
                    rolePerformance: null,
                    codeOfConductIssues: null,
                },
                compliance806B: {
                    trainingCompleted: null,
                    independenceEthicsIssues: null,
                    qprScore: null,
                    rolePerformance: null,
                    codeOfConductIssues: null,
                },
                complianceComments: "",
            });
        }
    }, [data]);




    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Feedback conversation validation (Performance Manager only)
        if (sectionType === "performance-manager" && !formData.feedbackConversationCompleted) {
            newErrors.feedbackConversation = "Please confirm the feedback conversation took place";
        }

        // Promotion/CO validation - only validate if a type is selected
        if (formData.promotionType === "promotion" && !formData.promotionCategory) {
            newErrors.promotionCategory = "Promotion category is required";
        }
        if (formData.promotionType === "co" && !formData.justification?.trim()) {
            newErrors.justification = "Justification is required for CO";
        }

        // Open PD Rating validation
        if (!formData.openPDRating) {
            newErrors.openPDRating = "Open PD rating is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            onSave?.(formData);
        }
    };

    const handleDelete = () => {
        setShowDeleteDialog(false);
        onDelete?.();
    };
    const isFormValid = () => {
        // 🔹 PM
        if (sectionType === "performance-manager") {
            if (!formData.feedbackConversationCompleted) return false;
            if (!formData.openPDRating) return false;
            if (!formData.strengths?.trim()) return false;
            if (!formData.areasOfOpportunity?.trim()) return false;

            // Promotion / CO validation
            if (formData.promotionType === "promotion" && !formData.promotionCategory) {
                return false;
            }

            if (formData.promotionType === "co" && !formData.justification?.trim()) {
                return false;
            }

            // ✅ Compliance obligatorio
            if (employeeLevel === "Manager" || employeeLevel === "Senior Manager") {
                // 806B
                const c = formData.compliance806B;
                if (!c?.trainingCompleted) return false;
                if (!c?.independenceEthicsIssues) return false;
                if (!c?.qprScore) return false;
                if (!c?.rolePerformance) return false;
                if (!c?.codeOfConductIssues) return false;
            } else {
                // 806A
                const c = formData.compliance806A;
                if (!c?.trainingCompleted) return false;
                if (!c?.independenceEthicsIssues) return false;
                if (!c?.rolePerformance) return false;
                if (!c?.codeOfConductIssues) return false;
            }

            return true;
        }

        // 🔹 Committee
        if (sectionType === "committee") {
            if (!formData.openPDRating) return false;

            if (formData.promotionType === "promotion" && !formData.promotionCategory) {
                return false;
            }

            if (formData.promotionType === "co" && !formData.justification?.trim()) {
                return false;
            }

            return true;
        }

        // 🔹 Calibration
        if (sectionType === "calibration") {
            if (!formData.openPDRating) return false;
            return true;
        }

        return false;
    };

    const hasRealData = () => {
        if (!data) return false;

        if (sectionType === "committee") {
            return (
                (data.openPDRating ?? 0) > 0 ||
                !!data.promotionType ||
                !!data.justification
            );
        }

        if (sectionType === "calibration") {
            return (
                (data.openPDRating ?? 0) > 0 ||
                (data.generalComments ?? "").trim() !== ""
            );
        }

        // PM (ya funcionaba bien)
        return true;
    };


    // Render locked state
    if (state === "locked") {
        return (
            <Card
                className="border-0 relative overflow-hidden"
                style={{ boxShadow: "var(--shadow-lg)" }}
            >
                <div className="absolute inset-0 bg-gray-50 opacity-50" />
                <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold text-muted-foreground">{title}</h2>
                                <SectionStatusPill status="locked" />
                            </div>
                            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                        </div>
                        <div
                            className="p-3 rounded-lg"
                            style={{ background: "var(--gradient-card)" }}
                        >
                            <Lock className="h-6 w-6 text-muted-foreground" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="relative">
                    <div className="text-center py-8">
                        <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground font-medium">
                            Unlocks after previous step is completed
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Render view (collapsed) state
    if (state === "view") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card
                    className="border-0"
                    style={{ boxShadow: "var(--shadow-lg)" }}
                >
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold" style={{ color: "var(--kpmg-blue)" }}>
                                        {title}
                                    </h2>
                                    <SectionStatusPill status={status} />
                                </div>
                                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                            </div>
                            {canEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onEdit}
                                className="hover:bg-blue-50"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Read-only content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Promotion/CO */}
                            {sectionType !== "calibration" && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Promotion or CO</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold capitalize">
                                            {formData.promotionType}
                                        </span>
                                        {formData.promotionType === "promotion" && formData.promotionCategory && (
                                            <span className="text-sm text-muted-foreground">
                                                • {formData.promotionCategory}
                                            </span>
                                        )}
                                    </div>
                                    {formData.promotionType === "co" && formData.justification && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {formData.justification}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Open PD Rating */}
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Open PD Rating</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold" style={{ color: "var(--kpmg-blue)" }}>
                                        {formData.openPDRating}
                                    </span>
                                    <span className="text-sm text-muted-foreground">/ 5</span>
                                </div>
                            </div>
                        </div>

                        {/* Strengths */}
                        {formData.strengths && sectionType === "performance-manager" && (
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Strengths</Label>
                                <div
                                    className="p-4 rounded-lg"
                                    style={{ background: "var(--gradient-card)" }}
                                >
                                    <p className="text-sm leading-relaxed">{formData.strengths}</p>
                                </div>
                            </div>
                        )}

                        {/* Areas of Opportunity */}
                        {formData.areasOfOpportunity && sectionType === "performance-manager" && (
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Areas of Opportunity</Label>
                                <div
                                    className="p-4 rounded-lg"
                                    style={{ background: "var(--gradient-card)" }}
                                >
                                    <p className="text-sm leading-relaxed">{formData.areasOfOpportunity}</p>
                                </div>
                            </div>
                        )}

                        {/* Compliance & Conduct Confirmation (Performance Manager only) */}
                        {/*{sectionType === "performance-manager" && (formData.compliance806A || formData.compliance806B || formData.complianceComments) && (*/}
                        {/*    <div className="space-y-3">*/}
                        {/*        <Label className="text-sm text-muted-foreground">Compliance & Conduct Confirmation</Label>*/}
                        {/*        <div*/}
                        {/*            className="p-4 rounded-lg space-y-3"*/}
                        {/*            style={{ background: "var(--gradient-card)" }}*/}
                        {/*        >*/}
                        {/*            */}{/* 806A Questions */}
                        {/*            {formData.compliance806A && (*/}
                        {/*                <div className="space-y-2">*/}
                        {/*                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">*/}
                        {/*                        {formData.compliance806A.trainingCompleted && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Training Completed:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806A.trainingCompleted}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806A.independenceEthicsIssues && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Independence/Ethics Issues:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806A.independenceEthicsIssues}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806A.rolePerformance && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Role Performance:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806A.rolePerformance}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806A.codeOfConductIssues && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Code of Conduct Issues:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806A.codeOfConductIssues}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            )}*/}

                        {/*            */}{/* 806B Questions */}
                        {/*            {formData.compliance806B && (*/}
                        {/*                <div className="space-y-2">*/}
                        {/*                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">*/}
                        {/*                        {formData.compliance806B.trainingCompleted && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Training Completed:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806B.trainingCompleted}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806B.independenceEthicsIssues && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Independence/Ethics Issues:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806B.independenceEthicsIssues}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806B.qprScore && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">QPR Score:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806B.qprScore}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806B.rolePerformance && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Role Performance:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806B.rolePerformance}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                        {formData.compliance806B.codeOfConductIssues && (*/}
                        {/*                            <div className="flex justify-between col-span-2">*/}
                        {/*                                <span className="text-muted-foreground">Code of Conduct Issues:</span>*/}
                        {/*                                <span className="font-medium">{formData.compliance806B.codeOfConductIssues}</span>*/}
                        {/*                            </div>*/}
                        {/*                        )}*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            )}*/}

                        {/*            */}{/* Comments */}
                        {/*            {formData.complianceComments && (*/}
                        {/*                <div className="pt-2 border-t border-border">*/}
                        {/*                    <p className="text-xs text-muted-foreground mb-1">Additional Comments:</p>*/}
                        {/*                    <p className="text-sm leading-relaxed">{formData.complianceComments}</p>*/}
                        {/*                </div>*/}
                        {/*            )}*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                        {/* Compliance & Conduct Confirmation (Performance Manager only) */}
                        {sectionType === "performance-manager" && (
                            <div className="space-y-3">
                                <Label className="text-sm text-muted-foreground">
                                    Compliance & Conduct Confirmation
                                </Label>

                                <div
                                    className="p-4 rounded-lg space-y-3"
                                    style={{ background: "var(--gradient-card)" }}
                                >
                                    {/* ✅ MANAGER / SENIOR MANAGER → 806B */}
                                    {isManagerLevel && formData.compliance806B && (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                            {formData.compliance806B.trainingCompleted && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Training Completed:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806B.trainingCompleted}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806B.independenceEthicsIssues && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Independence/Ethics Issues:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806B.independenceEthicsIssues}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806B.qprScore && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">QPR Score:</span>
                                                    <span className="font-medium">
                                                        {formData.compliance806B.qprScore}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806B.rolePerformance && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Role Performance:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806B.rolePerformance}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806B.codeOfConductIssues && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Code of Conduct Issues:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806B.codeOfConductIssues}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ✅ NO MANAGER → 806A */}
                                    {!isManagerLevel && formData.compliance806A && (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                            {formData.compliance806A.trainingCompleted && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Training Completed:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806A.trainingCompleted}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806A.independenceEthicsIssues && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Independence/Ethics Issues:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806A.independenceEthicsIssues}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806A.rolePerformance && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Role Performance:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806A.rolePerformance}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.compliance806A.codeOfConductIssues && (
                                                <div className="flex justify-between col-span-2">
                                                    <span className="text-muted-foreground">
                                                        Code of Conduct Issues:
                                                    </span>
                                                    <span className="font-medium">
                                                        {formData.compliance806A.codeOfConductIssues}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* General Comments */}
                        {formData.generalComments && sectionType !== "performance-manager" && (
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">General Comments</Label>
                                <div
                                    className="p-4 rounded-lg"
                                    style={{ background: "var(--gradient-card)" }}
                                >
                                    <p className="text-sm leading-relaxed">{formData.generalComments}</p>
                                </div>
                            </div>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
                            {editorName && (
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3.5 w-3.5" />
                                    <span>Editor: {editorName}</span>
                                </div>
                            )}
                            {lastUpdated && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>Last updated: {lastUpdated}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    // Render edit state
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card
                    className="border-0"
                    style={{ boxShadow: "var(--shadow-lg)" }}
                >
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold" style={{ color: "var(--kpmg-blue)" }}>
                                        {title}
                                    </h2>
                                    <SectionStatusPill status={status} />
                                </div>
                                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Feedback Conversation Confirmation (Performance Manager only) */}
                        {sectionType === "performance-manager" && (
                            <div className="space-y-2">
                                <div
                                    className="flex items-start gap-3 p-4 rounded-lg border-2"
                                    style={{
                                        background: "var(--gradient-card)",
                                        borderColor: formData.feedbackConversationCompleted ? "var(--kpmg-blue)" : errors.feedbackConversation ? "#EF4444" : "#E5E7EB",
                                    }}
                                >
                                    <Checkbox
                                        id="feedbackConversation"
                                        checked={formData.feedbackConversationCompleted}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, feedbackConversationCompleted: checked === true })
                                        }
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <Label
                                            htmlFor="feedbackConversation"
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            Performance manager met with the employee to discuss evaluation feedback
                                            <span className="text-red-500 ml-1">*</span>
                                        </Label>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            This confirmation is required before completing the section.
                                        </p>
                                    </div>
                                </div>
                                {errors.feedbackConversation && (
                                    <p className="text-xs text-red-500">{errors.feedbackConversation}</p>
                                )}
                            </div>
                        )}

                        {/* Compliance & Conduct Confirmation (Performance Manager only) */}
                        {sectionType === "performance-manager" && employeeLevel && (
                            <div
                                className="p-5 rounded-lg border space-y-4"
                                style={{
                                    background: "linear-gradient(135deg, #FAFBFC 0%, #F5F8FA 100%)",
                                    borderColor: "#E5E9EF",
                                }}
                            >
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold" style={{ color: "var(--kpmg-blue)" }}>
                                        Compliance & Conduct Confirmation
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        This section confirms compliance with training, independence, ethics, and conduct requirements.
                                    </p>
                                </div>

                                {/* Determine which group to show based on employee level */}
                                {(employeeLevel === "Staff" ||
                                    employeeLevel === "Senior Staff" ||
                                    employeeLevel === "Supervising Staff" ||
                                    employeeLevel === "Senior" ||
                                    employeeLevel === "Supervising Senior" ||
                                    employeeLevel === "Staff In Charge") && (
                                        <div className="space-y-4 pt-2">
                                            {/* Question 1 */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Cumple con el 100% de entrenamiento obligatorio <span className="text-red-500">*</span>
                                                </Label>
                                                <SegmentedControl
                                                    options={[
                                                        { value: "yes", label: "Yes" },
                                                        { value: "no", label: "No" },
                                                    ]}
                                                    value={formData.compliance806A?.trainingCompleted || null}
                                                    onChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            compliance806A: {
                                                                ...formData.compliance806A,
                                                                trainingCompleted: value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Question 2 */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Tiene incidencias relacionadas con requisitos de independencia y ética <span className="text-red-500">*</span>
                                                </Label>
                                                <SegmentedControl
                                                    options={[
                                                        { value: "yes", label: "Yes" },
                                                        { value: "no", label: "No" },
                                                    ]}
                                                    value={formData.compliance806A?.independenceEthicsIssues || null}
                                                    onChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            compliance806A: {
                                                                ...formData.compliance806A,
                                                                independenceEthicsIssues: value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Question 3 */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Desempeño de las funciones y responsabilidades con el perfil del puesto <span className="text-red-500">*</span>
                                                </Label>
                                                <SegmentedControl
                                                    options={[
                                                        { value: "yes", label: "Yes" },
                                                        { value: "no", label: "No" },
                                                    ]}
                                                    value={formData.compliance806A?.rolePerformance || null}
                                                    onChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            compliance806A: {
                                                                ...formData.compliance806A,
                                                                rolePerformance: value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>

                                            {/* Question 4 */}
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">
                                                    Tuvo alguna incidencia relacionada con el cumplimiento del código de conducta y los valores de la firma <span className="text-red-500">*</span>
                                                </Label>
                                                <SegmentedControl
                                                    options={[
                                                        { value: "yes", label: "Yes" },
                                                        { value: "no", label: "No" },
                                                    ]}
                                                    value={formData.compliance806A?.codeOfConductIssues || null}
                                                    onChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            compliance806A: {
                                                                ...formData.compliance806A,
                                                                codeOfConductIssues: value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}

                                {(employeeLevel === "Manager" || employeeLevel === "Senior Manager") && (
                                    <div className="space-y-4 pt-2">
                                        {/* Question 1 */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Cumple con el 100% de entrenamiento obligatorio <span className="text-red-500">*</span>
                                            </Label>
                                            <SegmentedControl
                                                options={[
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },
                                                ]}
                                                value={formData.compliance806B?.trainingCompleted || null}
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        compliance806B: {
                                                            ...formData.compliance806B,
                                                            trainingCompleted: value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Question 2 */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Tiene incidencias relacionadas con requisitos de independencia y ética <span className="text-red-500">*</span>
                                            </Label>
                                            <SegmentedControl
                                                options={[
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },
                                                ]}
                                                value={formData.compliance806B?.independenceEthicsIssues || null}
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        compliance806B: {
                                                            ...formData.compliance806B,
                                                            independenceEthicsIssues: value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Question 3 - QPR Score */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Score QPR <span className="text-red-500">*</span></Label>
                                            <div className="flex flex-wrap gap-2">
                                                <SegmentedControl
                                                    options={[
                                                        { value: "compliance", label: "Compliance" },
                                                        { value: "not-compliance", label: "Not Compliance" },
                                                        { value: "improvement-needed", label: "Compliance Improvement Needed" },
                                                        /*{ value: "n/a", label: "N/A" },*/
                                                    ]}
                                                    value={formData.compliance806B?.qprScore || null}
                                                    onChange={(value) =>
                                                        setFormData({
                                                            ...formData,
                                                            compliance806B: {
                                                                ...formData.compliance806B,
                                                                qprScore: value,
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Question 4 */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Desempeño de las funciones y responsabilidades con el perfil del puesto <span className="text-red-500">*</span>
                                            </Label>
                                            <SegmentedControl
                                                options={[
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },
                                                ]}
                                                value={formData.compliance806B?.rolePerformance || null}
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        compliance806B: {
                                                            ...formData.compliance806B,
                                                            rolePerformance: value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Question 5 */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                Tuvo alguna incidencia relacionada con el cumplimiento del código de conducta y los valores de la firma <span className="text-red-500">*</span>
                                            </Label>
                                            <SegmentedControl
                                                options={[
                                                    { value: "yes", label: "Yes" },
                                                    { value: "no", label: "No" },
                                                ]}
                                                value={formData.compliance806B?.codeOfConductIssues || null}
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        compliance806B: {
                                                            ...formData.compliance806B,
                                                            codeOfConductIssues: value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Optional Comments */}
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="complianceComments" className="text-sm font-medium">
                                        Comentarios adicionales{" "}
                                        <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
                                    </Label>
                                    <Textarea
                                        id="complianceComments"
                                        placeholder="Opcional"
                                        value={formData.complianceComments || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, complianceComments: e.target.value })
                                        }
                                        rows={3}
                                        className="text-sm resize-none"
                                        style={{ background: "white", borderColor: "#E5E9EF" }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {formData.complianceComments?.length || 0} caracteres
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Promotion/CO Selector (not for calibration) */}
                        {sectionType !== "calibration" && (
                            <PromotionTypeSelector
                                type={formData.promotionType}
                                promotionCategory={formData.promotionCategory}
                                justification={formData.justification}
                                onTypeChange={(type) => setFormData({ ...formData, promotionType: type })}
                                onPromotionCategoryChange={(category) =>
                                    setFormData({ ...formData, promotionCategory: category })
                                }
                                onJustificationChange={(justification) =>
                                    setFormData({ ...formData, justification })
                                }
                                errors={errors}
                            />
                        )}

                        {/* Open PD Rating */}
                        <RatingSelector1to5
                            value={formData.openPDRating}
                            onChange={(rating) => setFormData({ ...formData, openPDRating: rating })}
                        />
                        {errors.openPDRating && (
                            <p className="text-xs text-red-500">{errors.openPDRating}</p>
                        )}

                        {/* Strengths (Performance Manager only) */}
                        {sectionType === "performance-manager" && (
                            <div className="space-y-2">
                                <Label htmlFor="strengths" className="text-sm font-medium">
                                    Strengths <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="strengths"
                                    placeholder="Describe key strengths and achievements..."
                                    value={formData.strengths}
                                    onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                                    rows={4}
                                    style={{ background: "var(--gradient-card)" }}
                                />
                            </div>
                        )}

                        {/* Areas of Opportunity (Performance Manager only) */}
                        {sectionType === "performance-manager" && (
                            <div className="space-y-2">
                                <Label htmlFor="areasOfOpportunity" className="text-sm font-medium">
                                    Areas of Opportunity <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="areasOfOpportunity"
                                    placeholder="Identify areas for improvement and development..."
                                    value={formData.areasOfOpportunity}
                                    onChange={(e) =>
                                        setFormData({ ...formData, areasOfOpportunity: e.target.value })
                                    }
                                    rows={4}
                                    style={{ background: "var(--gradient-card)" }}
                                />
                            </div>
                        )}

                        {/* General Comments (Committee & Calibration) */}
                        {sectionType !== "performance-manager" && (
                            <div className="space-y-2">
                                <Label htmlFor="generalComments" className="text-sm font-medium">
                                    General Comments
                                </Label>
                                <Textarea
                                    id="generalComments"
                                    placeholder="Add general comments and observations..."
                                    value={formData.generalComments}
                                    onChange={(e) =>
                                        setFormData({ ...formData, generalComments: e.target.value })
                                    }
                                    rows={4}
                                    style={{ background: "var(--gradient-card)" }}
                                />
                            </div>
                        )}

                        {/* Actions */}
                        {hasEmployee && (
                            <div className="flex justify-between pt-4 border-t border-border">
                                {hasEmployee && hasRealData() &&(
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteDialog(true)}
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Section
                                    </Button>
                                )}
                                <Button
                                    onClick={handleSave}
                                    disabled={!isFormValid()}
                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
                                    className="text-white"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Section
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this section? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}