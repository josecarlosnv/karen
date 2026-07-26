
// components/evaluation/StartEvaluationPanel.tsx
import { useState, useEffect, useMemo, useRef } from "react";
import { X, Search, ChevronDown, User, Plus, Check, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { motion, AnimatePresence } from "motion/react";
import { AddClientModal } from "../evaluation/AddClientModal";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { selfEvalApi } from "../../api/selfEvaluationApi"; // Debe exponer getIndex() y startEvaluation()

/**
 * Este panel carga:
 *  - projects (pkEvalGene/label), roles y evaluators desde GET /api/self-evaluations  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/MyProjects.cs)
 *  - inicia evaluación con POST /api/self-evaluations/start { PkEvalGene, Role, EvaluatorId }  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/MyProjects.cs)
 */

interface StartEvaluationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    preselectedClient?: Client | null;
    evaluationId?: string;
}

interface Client {
    id: string;      // pkEvalGene
    name: string;    // label (cliente — empleado)
    clientId: string;
}

interface Evaluator {
    id: string;
    name: string;
    email: string;
    initials: string;
}

export function StartEvaluationPanel({
    isOpen,
    onClose,
    preselectedClient,
    evaluationId,
}: StartEvaluationPanelProps) {
    const navigate = useNavigate();

    // Selecciones del usuario
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedEvaluator, setSelectedEvaluator] = useState<Evaluator | null>(null);

    // Catálogos provenientes del backend
    const [clients, setClients] = useState<Client[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [evaluators, setEvaluators] = useState<Evaluator[]>([]);

    // UI / búsqueda
    const [clientSearch, setClientSearch] = useState("");
    const [evaluatorSearch, setEvaluatorSearch] = useState("");
    const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
    const [isEvaluatorDropdownOpen, setIsEvaluatorDropdownOpen] = useState(false);
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validación
    const [errors, setErrors] = useState<{ client?: string; role?: string; evaluator?: string }>({});
    const isClientLocked = !!preselectedClient;
    const isValid = !!(selectedClient && selectedRole && selectedEvaluator);
    const clientSelectRef = useRef<HTMLDivElement | null>(null);
    const roleSelectRef = useRef<HTMLDivElement | null>(null);
    const evaluatorSelectRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                clientSelectRef.current &&
                !clientSelectRef.current.contains(target)
            ) {
                setIsClientDropdownOpen(false);
            }

            if (
                roleSelectRef.current &&
                !roleSelectRef.current.contains(target)
            ) {
                setIsRoleDropdownOpen(false);
            }

            if (
                evaluatorSelectRef.current &&
                !evaluatorSelectRef.current.contains(target)
            ) {
                setIsEvaluatorDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    // Carga de catálogos en cuanto se abre el panel
    useEffect(() => {
        let mounted = true;
        if (!isOpen) return;

        (async () => {
            try {
                setIsLoadingCatalogs(true);

                // GET /api/self-evaluations => evaluations, roles, projects, evaluators  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/MyProjects.cs)
                const data = await selfEvalApi.getIndex();

                if (!mounted) return;

                // Mapeo de projects -> Client (usamos label para mostrar)
                const projAsClients: Client[] = (data.projects || []).map((p: any) => ({
                    id: String(p.pkEvalGene),
                    clientId: String(p.clientId ?? ""),          // se usará como PkEvalGene al iniciar
                    name: p.label,              // "Cliente — Empleado"
                }));

                setClients(projAsClients);
                setRoles(data.roles || []);
                // El API entrega evaluators con { id, name, initials }; 'email' puede no venir
                setEvaluators(
                    (data.evaluators || []).map((e: any) => ({
                        id: e.id,
                        name: e.name,
                        initials: e.initials,
                        email: e.email, // si existe
                    }))
                );

                // Si viene preseleccionado (cuando el panel se abre desde una card), lo fijamos
                if (preselectedClient) {
                    setSelectedClient(preselectedClient);
                    setClientSearch(preselectedClient.name);
                } else {
                    // Reinicia selección si es un "New Evaluation"
                    setSelectedClient(null);
                    setClientSearch("");
                }

                setErrors({});
            } catch (err: any) {
                toast.error("No fue posible cargar los catálogos");
            } finally {
                setIsLoadingCatalogs(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [isOpen, preselectedClient]);

    // Búsquedas
    const filteredClients = useMemo(() => {
        const term = clientSearch.trim().toLowerCase();
        if (!term) return clients;
        return clients.filter(
            (c) =>
                c.name.toLowerCase().includes(term) ||
                String(c.clientId).toLowerCase().includes(term) ||
                String(c.id).toLowerCase().includes(term)
        );
    }, [clients, clientSearch]);

    //const filteredEvaluators = useMemo(() => {
    //  const term = evaluatorSearch.trim().toLowerCase();
    //  if (!term) return evaluators;
    //  return evaluators.filter(
    //    (e) =>
    //      e.name.toLowerCase().includes(term) ||
    //      (e.email ?? "").toLowerCase().includes(term)
    //  );
    //}, [evaluators, evaluatorSearch]);

    const filteredEvaluators = useMemo(() => {
        const blockedEmail = "ivillalobosvigueras@kpmg.com.mx";

        const allowedEvaluators = evaluators.filter(
            (e) => (e.email ?? "").toLowerCase() !== blockedEmail
        );

        const term = evaluatorSearch.trim().toLowerCase();
        if (!term) return allowedEvaluators;

        return allowedEvaluators.filter(
            (e) =>
                e.name.toLowerCase().includes(term) ||
                (e.email ?? "").toLowerCase().includes(term)
        );
    }, [evaluators, evaluatorSearch]);

    // Acciones
    const handleContinue = async () => {
        if (!isValid) {
            setErrors({
                client: !selectedClient ? "Please select a client" : undefined,
                role: !selectedRole ? "Please select a role" : undefined,
                evaluator: !selectedEvaluator ? "Please select an evaluator" : undefined,
            });
            return;
        }

        try {
            setIsSubmitting(true);

            // POST /api/self-evaluations/start { PkEvalGene, Role, EvaluatorId }  [1](https://onedrive-global.kpmg.com/personal/mpalominogomez_kpmg_com_mx/Documents/Microsoft%20Copilot%20Chat%20Files/MyProjects.cs)
            const payload = {
                PkEvalGene: String(selectedClient!.id),
                Role: selectedRole,
                EvaluatorId: String(selectedEvaluator!.id),
            };

            const res = await selfEvalApi.startEvaluation(payload); // { success: true, id: "..." }

            toast.success("Evaluation created");
            onClose();

            // Navega a la pantalla de la evaluación recién creada
            navigate(`/self-evaluations/${res.id}`);
        } catch (err: any) {
            toast.error("Unable to start evaluation");
        } finally {
            setIsSubmitting(false);
        }
    };

    //const handleSaveDraft = () => {
    //  // Este panel no guarda nada en backend aún; dejamos un aviso local
    //  toast.success("Draft saved (local).");
    //  onClose();
    //};

    const handleSaveDraft = async () => {
        if (!isValid) {
            setErrors({
                client: !selectedClient ? "Please select a client" : undefined,
                role: !selectedRole ? "Please select a role" : undefined,
                evaluator: !selectedEvaluator ? "Please select an evaluator" : undefined,
            });
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                PkEvalGene: String(selectedClient!.id),
                Role: selectedRole,
                EvaluatorId: String(selectedEvaluator!.id),
            };

            const res = await selfEvalApi.startEvaluation(payload);

            toast.success("Draft saved.");

            onClose();

            // ✅ Redirige a SelEvaluations (NO al formulario)
            navigate("/");



        } catch (err: any) {
            toast.error("Unable to save draft");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClientAdded = (newClient: Client) => {
        setSelectedClient(newClient);
        setClientSearch(newClient.name);
        setIsClientDropdownOpen(false);
        toast.success("Client added.");
    };

    const handleClose = () => {
        // Reset form al cerrar
        setSelectedClient(null);
        setSelectedRole("");
        setSelectedEvaluator(null);
        setClientSearch("");
        setEvaluatorSearch("");
        setErrors({});
        onClose();
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                            onClick={handleClose}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed top-0 right-0 h-full w-full md:w-[560px] bg-white z-50 overflow-y-auto"
                            style={{ boxShadow: "var(--shadow-xl)" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-white border-b border-border p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                                            Start New Self-Evaluation
                                        </h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Provide context before starting your form.
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClose}
                                        className="hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-6 space-y-6">
                                {/* Client Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="client" className="text-sm font-medium">
                                        Client <span className="text-red-500">*</span>
                                    </Label>

                                    {isClientLocked && selectedClient ? (
                                        // Locked client display
                                        <div
                                            className="w-full px-3 py-2.5 border border-input rounded-md bg-secondary/50 cursor-not-allowed"
                                            style={{ background: "linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)" }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="font-medium" style={{ color: "var(--spectrum-blue)" }}>
                                                        {selectedClient.name}
                                                    </p>
                                                    {!!selectedClient.clientId && (
                                                        <p className="text-xs text-muted-foreground mt-0.5"> Client ID: {selectedClient.clientId}</p>
                                                    )}
                                                </div>
                                                <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                                            </div>
                                        </div>
                                    ) : (
                                        // Editable client search (para "+ New Evaluation")
                                        <div ref={clientSelectRef} className="relative">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="client"
                                                    placeholder={isLoadingCatalogs ? "Loading projects..." : "Search client or project..."}
                                                    value={selectedClient ? selectedClient.name : clientSearch}
                                                    onChange={(e) => {
                                                        setClientSearch(e.target.value);
                                                        setSelectedClient(null);
                                                        setIsClientDropdownOpen(true);
                                                        if (errors.client) setErrors({ ...errors, client: undefined });
                                                    }}
                                                    onFocus={() => setIsClientDropdownOpen(true)}
                                                    className="pl-9"
                                                    disabled={isLoadingCatalogs}
                                                    style={{ background: "var(--gradient-card)" }}
                                                />
                                            </div>

                                            {/* Client Dropdown */}
                                            {isClientDropdownOpen && (
                                                <div
                                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg overflow-hidden z-20"
                                                    style={{ boxShadow: "var(--shadow-lg)" }}
                                                >
                                                    <div className="max-h-64 overflow-y-auto">
                                                        {isLoadingCatalogs ? (
                                                            <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
                                                        ) : filteredClients.length > 0 ? (
                                                            filteredClients.map((client) => (
                                                                <button
                                                                    key={client.id}
                                                                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors"
                                                                    onClick={() => {
                                                                        setSelectedClient(client);
                                                                        setClientSearch(client.name);
                                                                        setIsClientDropdownOpen(false);
                                                                        if (errors.client) setErrors({ ...errors, client: undefined });
                                                                    }}
                                                                >
                                                                    <p className="font-medium">{client.name}</p>
                                                                    <p className="text-xs text-muted-foreground">CLI- {client.clientId || "-"}</p>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-8 text-center">
                                                                <p className="text-sm text-muted-foreground mb-3">No results found</p>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setIsClientDropdownOpen(false);
                                                                        setIsAddClientModalOpen(true);
                                                                    }}
                                                                >
                                                                    <Plus className="h-4 w-4 mr-2" />
                                                                    Add New Client
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {filteredClients.length > 0 && (
                                                        <div className="border-top border-border p-2">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="w-full justify-start"
                                                                onClick={() => {
                                                                    setIsClientDropdownOpen(false);
                                                                    setIsAddClientModalOpen(true);
                                                                }}
                                                            >
                                                                <Plus className="h-4 w-4 mr-2" />
                                                                Add New Client
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isClientLocked && (
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Lock className="h-3 w-3" />
                                            Client is locked for this evaluation.
                                        </p>
                                    )}
                                    {errors.client && <p className="text-sm text-red-600">{errors.client}</p>}
                                </div>

                                {/* Role Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-sm font-medium">
                                        Role <span className="text-red-500">*</span>
                                    </Label>
                                    <div ref={roleSelectRef} className="relative">
                                        <button
                                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                            className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-md hover:border-primary transition-colors text-left"
                                            style={{ background: "var(--gradient-card)" }}
                                            disabled={isLoadingCatalogs}
                                        >
                                            <span className={selectedRole ? "text-foreground" : "text-muted-foreground"}>
                                                {selectedRole || (isLoadingCatalogs ? "Loading roles..." : "Select role...")}
                                            </span>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </button>

                                        {isRoleDropdownOpen && (
                                            <div
                                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg overflow-hidden z-20"
                                                style={{ boxShadow: "var(--shadow-lg)" }}
                                            >
                                                {(roles || []).map((role) => (
                                                    <button
                                                        key={role}
                                                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between"
                                                        onClick={() => {
                                                            setSelectedRole(role);
                                                            setIsRoleDropdownOpen(false);
                                                            if (errors.role) setErrors({ ...errors, role: undefined });
                                                        }}
                                                    >
                                                        <span>{role}</span>
                                                        {selectedRole === role && <Check className="h-4 w-4 text-primary" />}
                                                    </button>
                                                ))}
                                                {(!roles || roles.length === 0) && (
                                                    <div className="px-4 py-3 text-sm text-muted-foreground">No roles available</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Select the role you performed for this engagement.</p>
                                    {errors.role && <p className="text-sm text-red-600">{errors.role}</p>}
                                </div>

                                {/* Evaluator Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="evaluator" className="text-sm font-medium">
                                        Evaluator <span className="text-red-500">*</span>
                                    </Label>
                                    <div ref={evaluatorSelectRef} className="relative">
                                        <div  className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="evaluator"
                                                placeholder={isLoadingCatalogs ? "Loading evaluators..." : "Search by name or email..."}
                                                value={selectedEvaluator ? selectedEvaluator.name : evaluatorSearch}
                                                onChange={(e) => {
                                                    setEvaluatorSearch(e.target.value);
                                                    setSelectedEvaluator(null);
                                                    setIsEvaluatorDropdownOpen(true);
                                                    if (errors.evaluator) setErrors({ ...errors, evaluator: undefined });
                                                }}
                                                onFocus={() => setIsEvaluatorDropdownOpen(true)}
                                                className="pl-9"
                                                disabled={isLoadingCatalogs}
                                                style={{ background: "var(--gradient-card)" }}
                                            />
                                        </div>

                                        {/* Evaluator Dropdown */}
                                        {isEvaluatorDropdownOpen && (
                                            <div
                                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg overflow-hidden z-20"
                                                style={{ boxShadow: "var(--shadow-lg)" }}
                                            >
                                                <div className="max-h-64 overflow-y-auto">
                                                    {isLoadingCatalogs ? (
                                                        <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
                                                    ) : filteredEvaluators.length > 0 ? (
                                                        filteredEvaluators.map((evaluator) => (
                                                            <button
                                                                key={evaluator.id}
                                                                className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                                                                onClick={() => {
                                                                    setSelectedEvaluator(evaluator);
                                                                    setEvaluatorSearch(evaluator.name);
                                                                    setIsEvaluatorDropdownOpen(false);
                                                                    if (errors.evaluator) setErrors({ ...errors, evaluator: undefined });
                                                                }}
                                                            >
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarFallback className="text-xs text-white" style={{ background: "var(--gradient-primary)" }}>
                                                                        {evaluator.initials}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{evaluator.name}</p>
                                                                    {!!evaluator.email && <p className="text-sm text-muted-foreground">{evaluator.email}</p>}
                                                                </div>
                                                                {selectedEvaluator?.id === evaluator.id && <Check className="h-4 w-4 text-primary" />}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-8 text-center">
                                                            <p className="text-sm text-muted-foreground">No results found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Choose who will evaluate your submission.</p>
                                    {errors.evaluator && <p className="text-sm text-red-600">{errors.evaluator}</p>}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="sticky bottom-0 bg-white border-t border-border p-6">
                                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <Button variant="ghost" onClick={handleClose} disabled={isSubmitting}>
                                        Cancel
                                    </Button>
                                    <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
                                        Save as Draft
                                    </Button>
                                    <Button
                                        disabled={!isValid || isSubmitting}
                                        onClick={handleContinue}
                                        style={isValid && !isSubmitting ? { background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" } : {}}
                                        className={isValid && !isSubmitting ? "text-white" : ""}
                                    >
                                        {isSubmitting ? "Starting..." : "Continue"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Client Modal (opcional; si conectas “extra” en backend, aquí podrás postear) */}
            <AddClientModal
                isOpen={isAddClientModalOpen}
                onClose={() => setIsAddClientModalOpen(false)}
                onClientAdded={handleClientAdded}
            />
        </>
    );
}
