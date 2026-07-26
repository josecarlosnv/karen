import { useState, useEffect } from "react";
import { Search, Building2, ArrowRight, X, Plus, User, ChevronDown, Check } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover";
import { AddClientModal } from "../../components/AddClientModal";

import { clientsApi } from "../../api/clientsApi";
import type { Client } from "../../api/clientsApi";
import { staffApi } from "../../api/staffApi";
import { catalogoSegmentoApi } from "../../Api/CatalogoSegmentoApi";

import { pviiiApi } from "../../Api/pviiiApi";

type IncomeType = "Recurring" | "Contingent";

export default function NewProject() {
    const [currentStep, setCurrentStep] = useState<1 | 2>(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showAddClient, setShowAddClient] = useState(false);
    const [partners, setPartners] = useState([]);
    const [managers, setManagers] = useState([]);
    const [segmentos, setSegmentos] = useState<any[]>([]);
    const [userEmail, setUserEmail] = useState("");
    useEffect(() => {

        pviiiApi.getCurrentUserEmail().then(email => {
            setUserEmail(email);
        });

        staffApi.getPartners().then(setPartners);
        staffApi.getManagers().then(setManagers);
        loadSegmentos();
    }, []);

    const loadSegmentos = async () => {
        try {
            const data = await catalogoSegmentoApi.listSegmentos();
            setSegmentos(data);
        } catch (err) {
            console.error("Error loading segments", err);
        }
    };

    const [partner, setPartner] = useState("");
    const selectedPartner = partners.find((p) => p.id === partner);
    const [manager, setManager] = useState("");
    const [segment, setSegment] = useState("");
    const [incomeType, setIncomeType] = useState<IncomeType | "">();


    const [partnerOpen, setPartnerOpen] = useState(false);
    const [partnerSearchQuery, setPartnerSearchQuery] = useState("");

    const [managerOpen, setManagerOpen] = useState(false);
    const [managerSearchQuery, setManagerSearchQuery] = useState("");

    const [segmentOpen, setSegmentOpen] = useState(false);
    const [segmentSearchQuery, setSegmentSearchQuery] = useState("");



    const navigate = useNavigate();

    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setFilteredClients([]);
            return;
        }

        const delay = setTimeout(async () => {
            try {
                setLoading(true);

                const results = await clientsApi.search(searchQuery);
                setFilteredClients(results);

            } catch (err) {
                console.error("Error loading clients:", err);
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => clearTimeout(delay);

    }, [searchQuery]);
    const fiscalYear = incomeType === "Recurring" ? "2027" : incomeType === "Contingent" ? "2026" : "";

    const handleClientSelect = (client: Client) => {
        setSelectedClient(client);
        setSearchQuery("");
    };

    const handleAddNewClient = () => {
        setShowAddClient(true);
    };


    const handleSaveNewClient = async (newClient: Client) => {
        try {
            await clientsApi.create(newClient);
            setSelectedClient(newClient);
            setShowAddClient(false);
            setSearchQuery("");
        } catch (err) {
            console.error("Error creating client", err);
        }
    };
    const handleContinueToStep2 = () => {
        if (selectedClient) {
            setCurrentStep(2);
        }
    };
    const createProject = async (options: { redirectToHome: boolean }) => {
        if (
            !selectedClient ||
            !partner ||
            !manager ||
            !segment ||
            !incomeType
        ) {
            return;
        }

        const selectedPartner = partners.find(p => p.id === partner);
        const selectedManager = managers.find(m => m.id === manager);

        
        const payload = {
            entityGroupId: selectedClient.groupId ?? selectedClient.id,
            clientNumber: String(selectedClient.clientNumber),
            clientName: selectedClient.name,

            segmentId: Number(segment),
            fiscalYear: fiscalYear,
            revenueType: incomeType,

            partnerName: selectedPartner?.name ?? null,
            partnerEmployeeId: selectedPartner
                ? Number(String(selectedPartner.id).trim())
                : null,
            partnerEmail: selectedPartner?.email ?? null,

            srManagerName: selectedManager?.name ?? null,
            srManagerEmployeeId: selectedManager
                ? Number(String(selectedManager.id).trim())
                : null,
            srManagerEmail: selectedManager?.email ?? null,

            createdByUserEmail: userEmail
        };
        
        try {
            const response = await pviiiApi.createProject(payload);

            if (!response.correct) {
                alert("Backend error: " + response.errorMessage);
                return;
            }

            const p8Id = response.object.p8Id;

            if (options.redirectToHome) {
                navigate("/p8/new");
            } else {
                navigate(`/p8/Leadership/${p8Id}`);
            }

        } catch (error: any) {
            console.error("ERROR RAW:", error);
            if (error.response?.data) {
                alert("Backend error: " + error.response.data.errorMessage);
            } else {
                alert("Backend error: No response from backend");
            }
        }
    };
    const handleCreateProject = () => {
        createProject({ redirectToHome: false });
    };

    const handleSaveDraft = () => {
        createProject({ redirectToHome: true });
    };
    
    const isStep2Valid = partner && manager && segment && incomeType;
    return (
        <div className="min-h-screen bg-white pb-24 lg:pb-8">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 left-[10%] w-96 h-96 bg-gradient-to-br from-[#00338D]/8 via-[#1E49E2]/8 to-transparent rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-gradient-to-br from-[#1E49E2]/8 via-[#00338D]/8 to-transparent rounded-full blur-3xl"
                />
            </div>

            <div className="relative bg-white/95 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-normal bg-gradient-to-b from-[#00338D] via-[#1E49E2] to-[#00338D] bg-clip-text text-transparent">
                                New PVIII Project
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Step {currentStep} of 2: {currentStep === 1 ? "Select Client" : "Project Setup"}
                            </p>
                        </div>
                        <Link to="/p8/client-selection">
                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 mt-6">
                        <div className={`flex-1 h-1 rounded-full transition-colors ${currentStep >= 1 ? "bg-gradient-to-r from-[#00338D] to-[#1E49E2]" : "bg-slate-200"}`} />
                        <div className={`flex-1 h-1 rounded-full transition-colors ${currentStep >= 2 ? "bg-gradient-to-r from-[#00338D] to-[#1E49E2]" : "bg-slate-200"}`} />
                    </div>
                </div>
            </div>

            <div className="relative max-w-4xl mx-auto px-6 lg:px-8 py-12">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Search for a client
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <Input
                                            type="text"
                                            placeholder="Search by client name or client number..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-12 h-12 text-base"
                                            autoFocus
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Type at least 2 characters to search. Client numbers start with 100 or 300 (e.g., 1000000001)
                                    </p>
                                </div>

                                <AnimatePresence>
                                    {searchQuery && searchQuery.length >= 2 && filteredClients.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-2 mb-4"
                                        >
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                                                {filteredClients.length} {filteredClients.length === 1 ? "Result" : "Results"} (showing top 20)
                                            </p>
                                            <div className="space-y-2 max-h-[350px] overflow-y-auto">
                                                {filteredClients.map((client) => (
                                                    <button
                                                        key={client.id}
                                                        onClick={() => handleClientSelect(client)}
                                                        className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${selectedClient?.id === client.id
                                                                ? "border-[#1E49E2] bg-[#1E49E2]/5"
                                                                : "border-slate-200 hover:border-slate-300"
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedClient?.id === client.id
                                                                    ? "bg-gradient-to-br from-[#00338D] to-[#1E49E2]"
                                                                    : "bg-slate-100"
                                                                }`}>
                                                                <Building2 className={`w-5 h-5 ${selectedClient?.id === client.id ? "text-white" : "text-slate-600"
                                                                    }`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-baseline gap-2">
                                                                    <h3 className="font-medium text-slate-900">
                                                                        {client.name}
                                                                    </h3>
                                                                    <span className="text-xs font-mono text-slate-500">
                                                                        {client.clientNumber}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {selectedClient?.id === client.id && (
                                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1E49E2] flex items-center justify-center">
                                                                    <Check className="w-4 h-4 text-white" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {searchQuery && searchQuery.length >= 2 && filteredClients.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-6"
                                        >
                                            <Search className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                            <p className="text-sm text-slate-600 mb-4">
                                                No clients found matching "{searchQuery}"
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!searchQuery && (
                                    <div className="text-center py-8">
                                        <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                        <p className="text-sm text-slate-600 mb-1">
                                            Start typing to search for a client
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Search by name or client number from a catalogue of 50,000+ clients
                                        </p>
                                    </div>
                                )}

                                {searchQuery && searchQuery.length >= 2 && (
                                    <div className="pt-4 border-t border-slate-200">
                                        <Button
                                            onClick={handleAddNewClient}
                                            variant="outline"
                                            className="w-full border-dashed border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add new client
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {selectedClient && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="bg-gradient-to-br from-[#00338D]/5 to-[#1E49E2]/5 rounded-xl border border-[#1E49E2]/20 p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                                    Selected Client
                                                </p>
                                                <div className="flex items-baseline gap-3 mb-1">
                                                    <h3 className="text-xl font-semibold text-slate-900">
                                                        {selectedClient.name}
                                                    </h3>
                                                    <span className="text-sm font-mono text-slate-500">
                                                        {selectedClient.clientNumber}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600">
                                                    {selectedClient.segment}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedClient(null)}
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-end pt-4 border-t border-slate-200">
                                            <Button
                                                onClick={handleContinueToStep2}
                                                className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] hover:from-[#00266A] hover:to-[#0C233C] text-white"
                                            >
                                                Continue to Project Setup
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {currentStep === 2 && selectedClient && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white rounded-xl border border-slate-200 p-8 mb-6">
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">
                                        Project Setup
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        Configure the basic details for this PVIII project
                                    </p>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                                        Client
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="font-medium text-slate-900">{selectedClient.name}</p>
                                        <span className="text-xs font-mono text-slate-500">{selectedClient.clientNumber}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                   
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Partner <span className="text-red-500">*</span>
                                        </label>

                                        <Popover open={partnerOpen} onOpenChange={setPartnerOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="w-full h-11 px-3 py-2 text-left border border-slate-300 rounded-md hover:border-slate-400 transition-colors flex items-center justify-between bg-white"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className={partner ? "text font-normal text-[#00338D] truncate" : "text font-normal text-[#00338D] truncate"}>
                                                            {partner
                                                                ? (partners.find((p: any) => p.id === partner)?.name ?? "Select a partner")
                                                                : "Select a partner"}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                <div className="p-2 border-b border-slate-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Search partners..."
                                                            value={partnerSearchQuery}
                                                            onChange={(e) => setPartnerSearchQuery(e.target.value)}
                                                            className="pl-9 h-9"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>

                                                <div className="max-h-[250px] overflow-y-auto p-1">
                                                    {partners
                                                        .filter((p: any) =>
                                                            !partnerSearchQuery
                                                                ? true
                                                                : p.name?.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                                                                String(p.id).toLowerCase().includes(partnerSearchQuery.toLowerCase())
                                                        )
                                                        .map((p: any) => {
                                                            const isSelected = partner === p.id;
                                                            return (
                                                                <button
                                                                    key={p.id}
                                                                    onClick={() => {
                                                                        setPartner(p.id);
                                                                        setPartnerOpen(false);
                                                                        setPartnerSearchQuery("");
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-between ${isSelected ? "bg-[#1E49E2]/10 text-[#1E49E2]" : "text-slate-900"
                                                                        }`}
                                                                >
                                                                    <span className="truncate">{p.name}</span>
                                                                    {isSelected && <Check className="w-4 h-4" />}
                                                                </button>
                                                            );
                                                        })}

                                                    {partners.filter((p: any) =>
                                                        !partnerSearchQuery
                                                            ? true
                                                            : p.name?.toLowerCase().includes(partnerSearchQuery.toLowerCase()) ||
                                                            String(p.id).toLowerCase().includes(partnerSearchQuery.toLowerCase())
                                                    ).length === 0 && (
                                                            <div className="px-3 py-6 text-center text-sm text-slate-500">No partners found</div>
                                                        )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                  
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Manager <span className="text-red-500">*</span>
                                        </label>

                                        <Popover open={managerOpen} onOpenChange={setManagerOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="w-full h-11 px-3 py-2 text-left border border-slate-300 rounded-md hover:border-slate-400 transition-colors flex items-center justify-between bg-white"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className={manager ? "text font-normal text-[#00338D] truncate" : "text font-normal text-[#00338D] truncate"}>
                                                            {manager
                                                                ? (managers.find((m: any) => m.id === manager)?.name ?? "Select a manager")
                                                                : "Select a manager"}
                                                        </span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                <div className="p-2 border-b border-slate-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Search managers..."
                                                            value={managerSearchQuery}
                                                            onChange={(e) => setManagerSearchQuery(e.target.value)}
                                                            className="pl-9 h-9"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>

                                                <div className="max-h-[250px] overflow-y-auto p-1">
                                                    {managers
                                                        .filter((m: any) =>
                                                            !managerSearchQuery
                                                                ? true
                                                                : m.name?.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
                                                                String(m.id).toLowerCase().includes(managerSearchQuery.toLowerCase())
                                                        )
                                                        .map((m: any) => {
                                                            const isSelected = manager === m.id;
                                                            return (
                                                                <button
                                                                    key={m.id}
                                                                    onClick={() => {
                                                                        setManager(m.id);
                                                                        setManagerOpen(false);
                                                                        setManagerSearchQuery("");
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-between ${isSelected ? "bg-[#1E49E2]/10 text-[#1E49E2]" : "text-slate-900"
                                                                        }`}
                                                                >
                                                                    <span className="truncate">{m.name}</span>
                                                                    {isSelected && <Check className="w-4 h-4" />}
                                                                </button>
                                                            );
                                                        })}

                                                    {managers.filter((m: any) =>
                                                        !managerSearchQuery
                                                            ? true
                                                            : m.name?.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
                                                            String(m.id).toLowerCase().includes(managerSearchQuery.toLowerCase())
                                                    ).length === 0 && (
                                                            <div className="px-3 py-6 text-center text-sm text-slate-500">No managers found</div>
                                                        )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Segment <span className="text-red-500">*</span>
                                        </label>

                                        <Popover open={segmentOpen} onOpenChange={setSegmentOpen}>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="w-full h-11 px-3 py-2 text-left border border-slate-300 rounded-md 
                   hover:border-slate-400 transition-colors flex items-center justify-between bg-white"
                                                >
                                                    <span
                                                        className={
                                                            segment
                                                                ? "text font-normal text-[#00338D] truncate"
                                                                : "text font-normal text-[#00338D] truncate"
                                                        }
                                                    >
                                                        {segment
                                                            ? segmentos.find((s) => s.segmentoId === segment)?.segmentoNombre
                                                            : "Select a segment"}
                                                    </span>
                                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </PopoverTrigger>

                                            <PopoverContent
                                                className="w-[var(--radix-popover-trigger-width)] p-0"
                                                align="start"
                                            >
                                                <div className="p-2 border-b border-slate-200">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <Input
                                                            type="text"
                                                            placeholder="Search segments..."
                                                            value={segmentSearchQuery}
                                                            onChange={(e) => setSegmentSearchQuery(e.target.value)}
                                                            className="pl-9 h-9"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>

                                                <div className="max-h-[250px] overflow-y-auto p-1">
                                                    {segmentos
                                                        .filter((s) =>
                                                            !segmentSearchQuery
                                                                ? true
                                                                : s.segmentoNombre
                                                                    .toLowerCase()
                                                                    .includes(segmentSearchQuery.toLowerCase())
                                                        )
                                                        .map((s) => {
                                                            const isSelected = segment === s.segmentoId;
                                                            return (
                                                                <button
                                                                    key={s.segmentoId}
                                                                    onClick={() => {
                                                                        setSegment(s.segmentoId);
                                                                        setSegmentOpen(false);
                                                                        setSegmentSearchQuery("");
                                                                    }}
                                                                    className={`w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-between ${isSelected
                                                                            ? "bg-[#1E49E2]/10 text-[#1E49E2]"
                                                                            : "text-slate-900"
                                                                        }`}
                                                                >
                                                                    <span className="truncate">{s.segmentoNombre}</span>
                                                                    {isSelected && <Check className="w-4 h-4" />}
                                                                </button>
                                                            );
                                                        })}

                                                    {segmentos.filter((s) =>
                                                        !segmentSearchQuery
                                                            ? true
                                                            : s.segmentoNombre
                                                                .toLowerCase()
                                                                .includes(segmentSearchQuery.toLowerCase())
                                                    ).length === 0 && (
                                                            <div className="px-3 py-6 text-center text-sm text-slate-500">
                                                                No segments found
                                                            </div>
                                                        )}
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Income Type <span className="text-red-500">*</span>
                                        </label>
                                        <Select value={incomeType} onValueChange={(value) => setIncomeType(value as IncomeType)}>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select income type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Recurring">Recurring</SelectItem>
                                                <SelectItem value="Contingent">Contingent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Fiscal Year PVIII
                                        </label>
                                        <div className="relative">
                                            <Input
                                                type="text"
                                                value={fiscalYear}
                                                disabled
                                                className="h-11 bg-slate-50 text-slate-500 cursor-not-allowed"
                                                placeholder="Auto-calculated based on Income Type"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded">
                                                    Auto
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {incomeType === "Recurring" && "Recurring projects use fiscal year 2027"}
                                            {incomeType === "Contingent" && "Contingent projects use fiscal year 2026"}
                                            {!incomeType && "Select an income type to auto-calculate fiscal year"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <Button
                                    onClick={() => setCurrentStep(1)}
                                    variant="outline"
                                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                                    Back to Client Selection
                                </Button>
                                <div className="flex items-center gap-2">
                                    <div className="relative group">
                                        <Button
                                            onClick={handleSaveDraft}
                                            disabled={!isStep2Valid}
                                            className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] hover:from-[#00266A] hover:to-[#0C233C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Save as Draft
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                        {!isStep2Valid && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                                Complete required fields to save a draft
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                                    <div className="border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={handleCreateProject}
                                        disabled={!isStep2Valid}
                                        className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] hover:from-[#00266A] hover:to-[#0C233C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create Project
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {showAddClient && (
                    <AddClientModal
                        onClose={() => setShowAddClient(false)}
                        onSave={handleSaveNewClient}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}