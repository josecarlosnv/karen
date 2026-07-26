


//codigo Isaac

import { useState, useEffect, useMemo } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { AlertCircle, Check, ChevronDown, Search } from "lucide-react";
import { useStatusData } from "@/app/hooks/useStatusData";
import { statusRemindersApi } from "@/app/api/statusReminders";
import * as React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover";

export interface ExceptionFormData {
    id?: number;
    keyReport: string;
    employeeId: string;
    employeeName: string;
    projectClient: string;
    evaluatorName?: string;
    exceptionType: string;
    reason: string;
    markAsException: boolean;
}

interface Props {
    mode: "create" | "edit";
    open: boolean;
    onClose: () => void;
    onConfirm: (data: ExceptionFormData) => void;
    initialData?: Partial<ExceptionFormData>;
}

const exceptionTypes = [
    { value: "medical-leave", label: "Medical Leave" },
    { value: "project-cancelled", label: "Project Cancelled" },
    { value: "not-assigned", label: "Not Assigned" },
    { value: "other", label: "Other" },
];

export function ExceptionModal({
    mode,
    open,
    onClose,
    onConfirm,
    initialData
}: Props) {
    const { loading, projects, getEmployeesByProject } = useStatusData();

    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [projectOpen, setProjectOpen] = useState(false);
    const [projectSearchQuery, setProjectSearchQuery] = useState("");
    const [formData, setFormData] = useState<ExceptionFormData>({
        keyReport: "",
        employeeId: "",
        employeeName: "",
        projectClient: "",
        evaluatorName: "",
        exceptionType: "not-assigned",
        reason: "",
        markAsException: true,
    });

    const toExceptionValue = (s?: string) => {
        if (!s) return "other";
        const byValue = exceptionTypes.find(t => t.value === s);
        if (byValue) return byValue.value;          
        const byLabel = exceptionTypes.find(t => t.label === s);
        return byLabel?.value ?? "other";       
    };


    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    /** Empleados según proyecto seleccionado */
    const employees = useMemo(() => {
        if (!selectedProjectId) return [];
        return getEmployeesByProject(selectedProjectId);
    }, [selectedProjectId, getEmployeesByProject]);

    
    useEffect(() => {
        if (open) {
            if (initialData) {
                const projectId = initialData.projectClient ?? "";
                const employeeIdFromKeyReport = initialData.keyReport ?? ""; // tu <Select> de empleado usa este value
                const exceptionTypeValue = toExceptionValue(initialData.exceptionType as string | undefined);

                setSelectedProjectId(projectId);

                setFormData(prev => ({
                    ...prev,
                    ...initialData,
                    projectClient: projectId,
                    employeeId: employeeIdFromKeyReport,  // importantísimo para que el <Select> haga match
                    exceptionType: exceptionTypeValue,    // ahora sí coincide con algún option
                    keyReport: initialData.keyReport ?? prev.keyReport,
                    evaluatorName: initialData.evaluatorName ?? prev.evaluatorName,
                    employeeName: initialData.employeeName ?? prev.employeeName,
                    reason: initialData.reason ?? prev.reason,
                    markAsException: initialData.markAsException ?? true,
                }));
            }
        } else {
            // Reset ...
            setFormData({
                keyReport: "",
                employeeId: "",
                employeeName: "",
                projectClient: "",
                evaluatorName: "",
                exceptionType: "not-assigned",
                reason: "",
                markAsException: true,
            });
            setSelectedProjectId("");
            setErrors({});
        }
    }, [open, initialData]);

    /** Cambiar proyecto */
    const handleProjectChange = (projectId: string) => {
        setSelectedProjectId(projectId);
        setFormData(prev => ({
            ...prev,
            projectClient: projectId,
            employeeId: "",
            employeeName: "",
            evaluatorName: "",
            keyReport: "",
        }));
        setErrors(prev => ({ ...prev, projectClient: "" }));
        setProjectOpen(false);
        setProjectSearchQuery("");
    };

    /** Cambiar empleado */
    const handleEmployeeChange = (employeeId: string) => {
        const emp = employees.find(e => e.employeeId === employeeId);
        if (!emp) return;

        setFormData(prev => ({
            ...prev,
            employeeId,
            employeeName: emp.employeeName,
            evaluatorName: emp.evaluatorName,
            keyReport: emp.keyReport,
        }));

        setErrors(prev => ({ ...prev, employeeId: "", keyReport: "" }));
    };


    
    //Codigo Isaac
    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!selectedProjectId) newErrors.projectClient = "Project/Client is required";
        if (!formData.employeeId) newErrors.employeeId = "Employee is required";
        if (!formData.reason.trim()) newErrors.reason = "Reason is required";
        if (!formData.keyReport) newErrors.keyReport = "No keyReport available";
        if (!formData.exceptionType) newErrors.exceptionType = "Exception Type is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const mapLabelToValue = (label?: string) => {
        if (!label) return "other";
        const match = exceptionTypes.find(t => t.label === label);
        return match?.value ?? "other";
    };
    
    
    const handleConfirm = async () => {
        if (!validate()) return;
        setIsSaving(true);

        try {
            

            onConfirm(formData);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    // Calcula una lista de proyectos que garantice que el seleccionado exista
    const projectsForSelect = useMemo(() => {
        if (!selectedProjectId) return projects;
        const exists = projects.some(p => p.id === selectedProjectId);
        return exists ? projects : [...projects, { id: selectedProjectId, name: selectedProjectId }];
    }, [projects, selectedProjectId]);

    const filteredProjects = useMemo(() => {
        const q = projectSearchQuery.trim().toLowerCase();
        if (!q) return projectsForSelect;

        return projectsForSelect.filter((p) =>
            (p.name ?? "").toLowerCase().includes(q) ||
            String(p.id).toLowerCase().includes(q)
        );
        }, [projectsForSelect, projectSearchQuery]);

    // Calcula una lista de empleados que garantice que el seleccionado exista
    const employeesForSelect = useMemo(() => {
        const base = getEmployeesByProject(selectedProjectId);
        if (mode !== "edit" || !formData.employeeId) return base;

        const exists = base.some(e => e.employeeId === formData.employeeId);
        if (exists) return base;

        // Inyecta una opción mínima para que el <Select> pueda mostrar el valor, aunque esté deshabilitado
        const injected = {
            employeeId: formData.employeeId,
            employeeName: formData.employeeName || "(Employee)",
            evaluatorName: formData.evaluatorName || "",
            keyReport: formData.keyReport,
            projectClient: selectedProjectId,
        };

        return [...base, injected];
    }, [
        getEmployeesByProject,
        selectedProjectId,
        mode,
        formData.employeeId,
        formData.employeeName,
        formData.evaluatorName,
        formData.keyReport
    ]);
    

    // FIN DE CORRECION ESTILOS 
    //
    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/*<DialogContent className="sm:max-w-lg">*/}
            <DialogContent className="sm:max-w-lg w-full">
                <DialogHeader>
                    <div className="flex gap-3 items-center mb-2">
                        <div
                            className="p-2 rounded-lg"
                            style={{ background: "var(--gradient-primary)" }}
                        >
                            <AlertCircle className="h-5 w-5 text-white" />
                        </div>
                        <DialogTitle>
                            {mode === "create" ? "Create New Exception" : "Edit Exception"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        Mark an evaluation as an exception to exclude it from tracking.
                    </DialogDescription>
                </DialogHeader>

                

                {/* Project con búsqueda */}
                <div className="space-y-2">
                <Popover open={projectOpen} onOpenChange={setProjectOpen}>
                    <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={mode === "edit"}
                        className={`w-full max-w-full h-10 min-h-10 px-3 py-2 text-left rounded-md transition-colors flex items-center justify-between
  border border-transparent shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none
                        ${errors.projectClient ? "border-red-500" : "border-slate-300 hover:border-slate-400"}
                        ${mode === "edit" ? "opacity-60 cursor-not-allowed" : ""}`}
                        style={{ background: "var(--gradient-card)" }}
                    >
                        <div className="flex items-center gap-2 min-w-0">
                        <span className={selectedProjectId ? "text-slate-900 truncate" : "text-slate-500 truncate"}>
                            {selectedProjectId
                            ? (projectsForSelect.find((p) => p.id === selectedProjectId)?.name ?? "Select project...")
                            : "Select project..."}
                        </span>
                        </div>

                        <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>
                    </PopoverTrigger>

                    <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    >
                    {/* Search box */}
                    <div className="p-2 border-b border-slate-200">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Search projects..."
                            value={projectSearchQuery}
                            onChange={(e) => setProjectSearchQuery(e.target.value)}
                            className="pl-9 h-9"
                            autoFocus
                        />
                        </div>
                    </div>

                    {/* Filtered list */}
                    <div className="max-h-[250px] overflow-y-auto p-1">
                        {filteredProjects.map((p) => {
                        const isSelected = selectedProjectId === p.id;

                        return (
                            <button
                            key={p.id}
                            type="button"
                            onClick={() => handleProjectChange(p.id)}
                            className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-between
                                ${isSelected ? "bg-[#1E49E2]/10 text-[#1E49E2]" : "text-slate-900"}`}
                            title={p.name}
                            >
                            <span className="truncate">{p.name}</span>
                            {isSelected && <Check className="w-4 h-4" />}
                            </button>
                        );
                        })}

                        {/* Empty state */}
                        {filteredProjects.length === 0 && (
                        <div className="px-3 py-6 text-center text-sm text-slate-500">
                            No projects found
                        </div>
                        )}
                    </div>
                    </PopoverContent>
                </Popover>

                {errors.projectClient && (
                    <p className="text-red-500 text-xs">{errors.projectClient}</p>
                )}
                </div>


                
                <Select
                    value={formData.employeeId}
                    onValueChange={handleEmployeeChange}
                    disabled={!selectedProjectId || mode === "edit"}
                >
                    <SelectTrigger
                        className={`${errors.employeeId ? "border-red-500" : ""} w-full max-w-full h-10 min-h-10 overflow-hidden whitespace-nowrap text-ellipsis focus:outline-none`}
                        style={{ background: "var(--gradient-card)" }}
                    >
                        <SelectValue
                            placeholder="Select employee..."
                            className="truncate"
                        />
                    </SelectTrigger>

                    <SelectContent
                        className="w-[var(--radix-select-trigger-width)] max-h-64 overflow-y-auto overflow-x-hidden"
                        position="popper"
                        sideOffset={4}
                    >
                        {employeesForSelect.map(e => (
                            <SelectItem
                                key={e.employeeId}
                                value={e.employeeId}
                                className="whitespace-nowrap overflow-hidden text-ellipsis"
                                title={e.employeeName}
                            >
                                {e.employeeName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Evaluator */}
                {formData.evaluatorName && (
                    <div className="space-y-2">
                        <Label>Evaluator</Label>
                        <Input value={formData.evaluatorName} disabled className="bg-gray-50" />
                    </div>
                )}

                {/* Exception Type */}
                <div className="space-y-2">
                    <Label>Exception Type</Label>
                    <Select
                        value={formData.exceptionType}
                        onValueChange={v => setFormData(prev => ({ ...prev, exceptionType: v }))}
                    >
                        
                        <SelectTrigger style={{ background: "var(--gradient-card)" }}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {exceptionTypes.map(t => (
                                <SelectItem key={t.value} value={t.value}>
                                    {t.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                    <Label>Reason *</Label>
                    <Textarea
                        value={formData.reason}
                        onChange={e => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                        rows={4}
                        className={errors.reason ? "border-red-500" : ""}
                        style={{ background: "var(--gradient-card)" }}
                    />
                    {errors.reason && <p className="text-red-500 text-xs">{errors.reason}</p>}
                </div>

                {/* Mark as exception */}
                <div
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ background: "var(--gradient-card)" }}
                >
                    <Checkbox
                        checked={formData.markAsException}
                        onCheckedChange={c => setFormData(prev => ({ ...prev, markAsException: c as boolean }))}
                    />
                    <div className="flex-1 space-y-1">
                        <Label className="cursor-pointer text-sm">Mark as Exception</Label>
                        <p className="text-xs text-muted-foreground">
                            Excluded from reminders, tracking and reports.
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isSaving}
                        style={{ background: "var(--gradient-primary)" }}
                        className="text-white"
                    >
                        {isSaving ? "Saving..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
