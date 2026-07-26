

// components/evaluation/AddClientModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { X, Search, Check, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { selfEvalApi } from "../../api/selfEvaluationApi"; // validateExtra / addExtra / getIndex / lookupClientName
import { employeeDirectoryApi } from "../../api/employeeDirectoryApi"; // validateExtra / addExtra / getIndex / lookupClientName
import { useNavigate } from "react-router";


interface AddClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClientAdded: (client: { id: string; name: string; clientId: string }) => void;
}

interface Employee {
    id: string;     // EmployeeId
    name: string;
    initials: string;
    email?: string;
}

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
    // Form state
    const CLIENT_ID_LENGTH = 10;
    const [clientIdRaw, setClientIdRaw] = useState("");
    const [clientName, setClientName] = useState("");
    //const [employeeSearch, setEmployeeSearch] = useState("");
    const [hours, setHours] = useState("");
    const [notes, setNotes] = useState("");

    // Catalogs
    //const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // UI state
    const [errors, setErrors] = useState<{ clientId?: string; clientName?: string; employee?: string; hours?: string; notes?: string; }>({});
    //const [loadingEmployees, setLoadingEmployees] = useState(false);
    //const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isValid =
        clientIdRaw.length === CLIENT_ID_LENGTH &&
        !!clientName.trim() &&
        !!selectedEmployee &&
        !!hours.trim() &&
        !!notes.trim();


    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeSearch, setEmployeeSearch] = useState("");
    const [loadingEmployees, setLoadingEmployees] = useState(false);
    const [isEmpDropdownOpen, setIsEmpDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const MAX_NOTES_LENGTH = 100;

    const employeeSelectRef = useRef<HTMLDivElement | null>(null);
    

    useEffect(() => {
        const query = employeeSearch.trim();

        // SI el usuario abre el campo y no ha escrito nada ⇒ traer primeros 10 registros
        const termToSearch = query === "" ? "" : query;

        const h = setTimeout(async () => {
            try {
                setLoadingEmployees(true);

                const res = await employeeDirectoryApi.search(employeeSearch.trim());
                const formatted = (res.items ?? []).map((e) => ({
                    id: String(e.employeeId),
                    name: e.employeeName,
                    email: e.email,
                    initials: (e.employeeName.match(/\b\w/g) ?? [])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase(),
                }));

                setEmployees(formatted);
            } finally {
                setLoadingEmployees(false);
            }
        }, 250); // debounce suave

        return () => clearTimeout(h);
    }, [employeeSearch, isEmpDropdownOpen]);



    // Filtro de empleados por búsqueda
    const filteredEmployees = useMemo(() => {
        const term = employeeSearch.trim().toLowerCase();
        if (!term) return employees;
        return employees.filter(
            e =>
                e.name.toLowerCase().includes(term) ||
                (e.email ?? "").toLowerCase().includes(term)
        );
    }, [employees, employeeSearch]);

    // Util: extrae números de "CLI-005" → 5
    const parseClientId = (val: string): number | null => {
        const digits = (val.match(/\d+/g) || []).join("");
        if (!digits) return null;
        return Number(digits);
    };

    // === AUTOFILL DEL CLIENT NAME ===
    // Debounce de 400ms al teclear clientIdRaw; consulta al backend y llena clientName si found=true.
    const debounceRef = useRef<number | undefined>(undefined);
    useEffect(() => {
        if (debounceRef.current) {
            window.clearTimeout(debounceRef.current);
        }

        // 🔴 Si no son 10 dígitos, NO buscar y limpiar nombre
        if (clientIdRaw.length !== CLIENT_ID_LENGTH) {
            setClientName("");
            return;
        }

        const numericId = Number(clientIdRaw);
        if (Number.isNaN(numericId)) {
            setClientName("");
            return;
        }

        debounceRef.current = window.setTimeout(async () => {
            try {
                const res = await selfEvalApi.lookupClientName(numericId);

                if (res?.found && res.clientName) {
                    setClientName(res.clientName);
                } else {
                    setClientName("");
                }
            } catch {
                setClientName("");
            }
        }, 400);

        return () => {
            if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
            }
        };
    }, [clientIdRaw]);

    
    
    const handleSave = async () => {

        if (
            !clientIdRaw.trim() ||
            !clientName.trim() ||
            !selectedEmployee ||
            !hours.trim() ||
            !notes.trim()
        ) {
            setErrors({
                clientId: !clientIdRaw.trim() ? "Client ID is required" : undefined,
                clientName: !clientName.trim() ? "Client Name is required" : undefined,
                employee: !selectedEmployee ? "Employee is required" : undefined,
                hours: !hours.trim() ? "Hours are required" : undefined,
                notes: !notes.trim() ? "Reason is required" : undefined,
            });
            return;
        }


        const numericClientId = parseClientId(clientIdRaw);
        if (!numericClientId || Number.isNaN(numericClientId)) {
            setErrors({ ...errors, clientId: "Client ID must contain digits" });
            return;
        }

        try {
            setIsSaving(true);

            // ✅ UNA SOLA LLAMADA
            const addRes = await selfEvalApi.addExtra({
                clientId: numericClientId,
                clientName: clientName.trim(),
                employeeId: Number(selectedEmployee!.id),
                totalHours: hours ? Number(hours) : 0,
                generatedDocumentation: notes?.trim() || undefined,
            });

            const pk = addRes?.pkEvalGene ?? null;
            const label = addRes?.label ?? `${clientName} — ${selectedEmployee!.name}`;

            onClientAdded({
                id: pk ? String(pk) : "pending",
                name: label,
                clientId: `CLI-${numericClientId.toString().padStart(3, "0")}`,
            });

            toast.success("Client/project created.");

            navigate("/");

            handleClose();
        }
        catch (err: any) {
            // ✅ El backend decide el mensaje
            toast.error("Generation not available for this employee.");
        }
        finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setClientIdRaw("");
        setClientName("");
        setEmployeeSearch("");
        setSelectedEmployee(null);
        setHours("");
        setNotes("");
        setErrors({});
        onClose();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                employeeSelectRef.current &&
                !employeeSelectRef.current.contains(event.target as Node)
            ) {
                setIsEmpDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 bg-white rounded-2xl z-[60]"
                        style={{ boxShadow: "var(--shadow-xl)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-6 border-b border-border">
                            <div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--kpmg-blue)] to-[var(--cobalt-blue)] bg-clip-text text-transparent">
                                    Add New Client
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Enter client and employee to create a new project (extra).
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

                        {/* Form */}
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            {/* Client ID */}
                            <div className="space-y-2">
                                <Label htmlFor="clientId" className="text-sm font-medium">
                                    Client ID <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="clientId"
                                    inputMode="numeric"
                                    placeholder="10-digit Client ID"
                                    value={clientIdRaw}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, "");

                                        // ✅ Solo hasta 10 dígitos
                                        if (value.length <= CLIENT_ID_LENGTH) {
                                            setClientIdRaw(value);

                                            // 🔄 Si se borra o queda incompleto → limpiar Client Name
                                            if (value.length !== CLIENT_ID_LENGTH) {
                                                setClientName("");
                                            }

                                            if (errors.clientId) {
                                                setErrors({ ...errors, clientId: undefined });
                                            }
                                        }
                                    }}

                                    style={{ background: "var(--gradient-card)" }}
                                />
                                {clientIdRaw.length > 0 && clientIdRaw.length !== CLIENT_ID_LENGTH && (
                                    <p className="text-sm text-red-600">
                                        Client ID must be exactly {CLIENT_ID_LENGTH} digits
                                    </p>
                                )}
                                {errors.clientId && <p className="text-sm text-red-600">{errors.clientId}</p>}
                            </div>

                            {/* Client Name (auto-llenado si existe en catálogo) */}
                            <div className="space-y-2">
                                <Label htmlFor="clientName" className="text-sm font-medium">
                                    Client Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="clientName"
                                    placeholder="Auto-filled from Client ID"
                                    value={clientName}
                                    readOnly
                                    style={{
                                        background: "var(--gradient-card)",
                                        cursor: "not-allowed",
                                    }}
                                />
                                {errors.clientName && <p className="text-sm text-red-600">{errors.clientName}</p>}
                            </div>

                            

                            {/* Employee (selector con búsqueda segura y estilos iguales) */}
                            <div ref={employeeSelectRef} className="space-y-2 relative">
                                <Label className="text-sm font-medium">
                                    Employee <span className="text-red-500">*</span>
                                </Label>

                                {/* Input */}
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                                    <Input
                                        placeholder="Search by name or email..."
                                        value={selectedEmployee ? selectedEmployee.name : employeeSearch}
                                        onFocus={() => {
                                            setIsEmpDropdownOpen(true);
                                            setEmployeeSearch("");   // 🔥 disparar búsqueda de TODOS los empleados
                                        }}
                                        onChange={(e) => {
                                            setEmployeeSearch(e.target.value);
                                            setSelectedEmployee(null);
                                            setIsEmpDropdownOpen(true);
                                        }}
                                        className="pl-9"
                                        style={{ background: "var(--gradient-card)" }}
                                    />
                                </div>

                                {/* Dropdown */}
                                {isEmpDropdownOpen && (
                                    <div
                                        className="absolute left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-xl z-[999]"
                                        style={{
                                            top: "calc(100% + 4px)",
                                            maxHeight: "260px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {loadingEmployees ? (
                                            <div className="px-4 py-3 text-sm text-muted-foreground">Loading...</div>
                                        ) : employees.length > 0 ? (
                                            employees.map((emp) => (
                                                <button
                                                    key={emp.id}
                                                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                                                    onClick={() => {
                                                        setSelectedEmployee(emp);
                                                        setEmployeeSearch(emp.name);
                                                        setIsEmpDropdownOpen(false);
                                                    }}
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback
                                                            className="text-xs text-white"
                                                            style={{ background: "var(--gradient-primary)" }}
                                                        >
                                                            {emp.initials}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1">
                                                        <p className="font-medium">{emp.name}</p>
                                                        {emp.email && (
                                                            <p className="text-xs text-muted-foreground">{emp.email}</p>
                                                        )}
                                                    </div>

                                                    {selectedEmployee?.id === emp.id && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-8 text-center">
                                                <p className="text-sm text-muted-foreground">No results found</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {errors.employee && (
                                    <p className="text-sm text-red-600">{errors.employee}</p>
                                )}
                            </div>

                            {/* Hours (opcional) */}
                            <div className="space-y-2">
                                <Label htmlFor="hours" className="text-sm font-medium">
                                    Hours
                                </Label>

                                <Input
                                    id="hours"
                                    type="number"
                                    min={0}
                                    max={9999}
                                    inputMode="numeric"
                                    placeholder="e.g., 40"
                                    value={hours}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Solo números, máximo 4 dígitos
                                        if (/^\d{0,3}$/.test(value)) {
                                            setHours(value);
                                            if (errors.hours) {
                                                setErrors({ ...errors, hours: undefined });
                                            }
                                        }
                                    }}
                                    style={{ background: "var(--gradient-card)" }}
                                />
                                {errors.hours && (
                                    <p className="text-sm text-red-600">{errors.hours}</p>
                                )}

                            </div>

                            {/* Notes / Reason (opcional) */}
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-medium">Notes / Reason</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Explain the reason (max 100 characters)"
                                    value={notes}
                                    maxLength={MAX_NOTES_LENGTH}
                                    rows={3}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value.length <= MAX_NOTES_LENGTH) {
                                            setNotes(value);
                                            if (errors.notes) {
                                                setErrors({ ...errors, notes: undefined });
                                            }
                                        }
                                    }}
                                    style={{ background: "var(--gradient-card)" }}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-red-600">{errors.notes}</p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 p-6 border-t border-border">
                            <Button variant="ghost" onClick={handleClose} disabled={isSaving}>
                                Cancel
                            </Button>
                            {isValid && (
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-md)" }}
                                    className="text-white"
                                >
                                    {isSaving ? "Saving..." : "Save Client"}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}