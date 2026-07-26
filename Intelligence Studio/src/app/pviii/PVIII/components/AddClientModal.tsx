import { useState } from "react";
import { X, Building2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { Client } from "../api/clientsApi";   
import { clientsApi } from "../api/clientsApi";

interface AddClientModalProps {
    onClose: () => void;
    onSave: (client: Client) => void;
    existingClients?: Client[];
}

export function AddClientModal({ onClose, onSave, existingClients = [] }: AddClientModalProps) {
    const [clientName, setClientName] = useState("");
    const [clientId, setClientId] = useState("");
    const [clientIdError, setClientIdError] = useState("");

    const handleClientIdChange = (value: string) => {
        const numericValue = value.replace(/\D/g, "");
        setClientId(numericValue);

        if (clientIdError) setClientIdError("");
    };

    const validateClientId = async () => {
        if (clientId.length !== 10) {
            setClientIdError("Client ID must be exactly 10 digits.");
            return false;
        }

        const existsLocal = existingClients.some(
            (x) => x.clientNumber === clientId || x.id.toString() === clientId
        );

        if (existsLocal) {
            setClientIdError("A client with this ID already exists.");
            return false;
        }

        try {
            const existing = await clientsApi.getById(Number(clientId));
            if (existing) {
                setClientIdError("A client with this ID already exists.");
                return false;
            }
        } catch (_) {
            
        }

        setClientIdError("");
        return true;
    };

    
    const handleSave = async () => {
        const isValidId = await validateClientId();
        if (!clientName || clientId.length !== 10 || !isValidId) return;

        const newClient: Client = {
            id: Number(clientId),
            clientNumber: clientId,
            name: clientName,
            segment: "New Client"
        };

        onSave(newClient);
    };

    const handleClientIdBlur = async () => {
        if (clientId && clientId.length > 0) {
            await validateClientId();
        }
    };
    const isValid = clientName && clientId.length === 10 && !clientIdError;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4"
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00338D] to-[#1E49E2] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Add New Client</h2>
                            <p className="text-sm text-slate-600">Create a new client record</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter client name"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="h-11"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Client ID <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter 10-digit client ID"
                            value={clientId}
                            onChange={(e) => handleClientIdChange(e.target.value)}
                            onBlur={handleClientIdBlur}
                            maxLength={10}
                            className={`h-11 font-mono ${clientIdError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                        />
                        {clientIdError && (
                            <div className="flex items-start gap-2 mt-2 text-red-600">
                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <p className="text-xs">{clientIdError}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                    <Button onClick={onClose} variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={!isValid}
                        className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] hover:from-[#00266A] hover:to-[#0C233C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save Client
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}