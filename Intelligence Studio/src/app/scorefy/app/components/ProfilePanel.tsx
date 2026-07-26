

import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
    Building2,
    GraduationCap,
    Languages,
    User as UserIcon,
    Edit,
    LogOut
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { personalProfileApi } from "../api/personalProfileApi";

interface ProfilePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Obtener el perfil real
    useEffect(() => {
        const load = async () => {
            try {
                const me = await personalProfileApi.getMe();
                setProfile(me);
            } catch {
                // Error handler opcional
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) load(); // cargar solo cuando se abra el panel
    }, [isOpen]);

    // Iniciales reales
    const initials = useMemo(() => {
        if (!profile?.fullName) return "NA";
        const parts = profile.fullName.split(" ").filter(Boolean);
        if (!parts.length) return "NA";
        const first = parts[0][0];
        const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][0];
        return (first + last).toUpperCase();
    }, [profile]);



    //const handleSignOutAndClose = () => {
    //    // Cerrar pestaña
    //    //window.open("", "_self");
    //    window.close();

    //    // Si el navegador NO permite cerrar pestaña
    //    //setTimeout(() => {
    //    //    window.location.href = "/"; // o una página que quieras
    //    //}, 300);
    //};

    const handleSignOutNewTab = () => {
        // Abre nueva pestaña
        window.open("https://spo-global.kpmg.com/sites/MX-OI-Intranet", "_blank");
        
        // Opcional: redirigir pestaña actual
        //window.location.href = "/";
    };




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
                        className="fixed inset-0 z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-20 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-96"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Arrow */}
                        <div className="absolute -top-2 right-6 md:right-4">
                            <div
                                className="w-4 h-4 rotate-45 bg-white/95 backdrop-blur-xl border-l border-t border-border"
                                style={{ boxShadow: 'var(--shadow-sm)' }}
                            />
                        </div>

                        <div
                            className="bg-white/95 backdrop-blur-xl rounded-2xl border border-border overflow-hidden"
                            style={{ boxShadow: 'var(--shadow-xl)' }}
                        >
                            {/* Header */}
                            <div
                                className="relative p-6 pb-4"
                                style={{ background: 'var(--gradient-card)' }}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <Avatar className="h-16 w-16 ring-4 ring-white/50">
                                            <AvatarFallback
                                                className="text-2xl font-bold text-white"
                                                style={{ background: 'var(--gradient-primary)' }}
                                            >
                                                {loading ? "…" : initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-green-500"
                                            title="Online"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-foreground truncate">
                                            {loading ? "Loading…" : profile?.fullName}
                                        </h3>
                                        <p className="text-sm text-muted-foreground truncate mt-0.5">
                                            {loading ? "…" : profile?.email}
                                        </p>

                                        <Badge
                                            className="mt-2 text-white"
                                            style={{ background: 'var(--gradient-primary)' }}
                                        >
                                            {loading ? "…" : (profile?.staffLevel ?? "N/A")}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Information */}
                            <div className="p-6 space-y-4">
                                {/* Performance Manager */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--kpmg-blue)' }}>
                                        <UserIcon className="h-3.5 w-3.5" />
                                        Performance Manager
                                    </div>
                                    <p className="text-sm font-semibold text-foreground pl-5">
                                        {loading ? "…" : (profile?.pmName ?? "Not assigned")}
                                    </p>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                {/* Degree Status */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--kpmg-blue)' }}>
                                        <GraduationCap className="h-3.5 w-3.5" />
                                        Professional License
                                    </div>
                                    <p className="text-sm font-semibold text-foreground pl-5">
                                        {loading ? "…" : (profile?.graduated ? "Yes" : "No")}
                                    </p>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                {/* English Level (SI NO LO TIENES, LO DEJO COMO PLACEHOLDER) */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--kpmg-blue)' }}>
                                        <Languages className="h-3.5 w-3.5" />
                                        English level
                                    </div>
                                    <p className="text-sm font-semibold text-foreground pl-5">
                                        {/* Si después me dices de dónde sale, lo llenamos */}
                                        {loading ? "…" : (profile?.english ?? "Not available")}
                                    </p>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                                {/* Office Location */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--kpmg-blue)' }}>
                                        <Building2 className="h-3.5 w-3.5" />
                                        Office location
                                    </div>
                                    <p className="text-sm font-semibold text-foreground pl-5">
                                        {loading ? "…" : (profile?.officeLocation ?? "Not available")}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            {/* Footer Actions */}
                            <div className="p-4 pt-0 space-y-2">


                                <Button
                                    asChild
                                    className="w-full justify-start text-white"
                                    style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-md)' }}
                                >
                                    <Link to="/profile">
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit information
                                    </Link>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleSignOutNewTab}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </Button>

                                
                            </div>

                            
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}