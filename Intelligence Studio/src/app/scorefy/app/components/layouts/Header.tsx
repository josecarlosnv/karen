


import { Bell, HelpCircle, Menu } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useNavigate } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { ProfilePanel } from "@/app/components/ProfilePanel";
import { personalProfileApi } from "../../api/personalProfileApi";
import { useSecurityAccess } from "@/app/hooks/useSecurityAccess";
interface HeaderProps {
    onMenuClick: () => void;
    isSidebarCollapsed: boolean;
}

const pendingEvaluations = [
    { id: 1, name: "Q4 2025 Self-Evaluation", project: "Digital Transformation Project" },
    { id: 2, name: "Manager Review - Sarah Johnson", project: "Financial Audit Q4" },
    { id: 3, name: "Team Lead Evaluation", project: "Cloud Migration Initiative" },
    { id: 4, name: "Peer Review - Mike Chen", project: "Risk Assessment Project" },
];



export function Header({ onMenuClick, isSidebarCollapsed }: HeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { hasAccess } = useSecurityAccess();

    const navigate = useNavigate();

    // Load initials from backend
    useEffect(() => {
        const load = async () => {
            try {
                const me = await personalProfileApi.getMe();
                setProfile(me);
            } catch {
                // handle error if needed
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // Compute initials
    const initials = useMemo(() => {
        if (!profile?.fullName) return "NA";
        const n = profile.fullName.split(" ").filter(Boolean);
        if (n.length === 0) return "NA";
        const first = n[0][0];
        const last = n.length > 1 ? n[n.length - 1][0] : n[0][0];
        return (first + last).toUpperCase();
    }, [profile]);

    // Ocultar botón si el usuario tiene acceso a seguridad

    const showUserButton = hasAccess;
    //const showUserButton = true;

    return (
        <>
            <header
                className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0C233C] to-[#00338D] text-white shadow-lg"
                style={{ boxShadow: "var(--shadow-md)" }}
            >
                <div className="flex h-16 items-center gap-4 px-4 md:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                            style={{
                                background: "var(--gradient-primary)",
                                boxShadow: "var(--shadow-glow)",
                            }}
                        >
                            <span className="text-lg font-bold text-white">K</span>
                        </div>
                        <div className="hidden md:block">
                            <span className="text-lg font-semibold text-white">Scorefy</span>
                        </div>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Help Icon */}
                        {/*<Button*/}
                        {/*    variant="ghost"*/}
                        {/*    size="icon"*/}
                        {/*    className="relative hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent transition-all"*/}
                        {/*    onClick={() => window.open("/user-manual.pdf", "_blank")}*/}
                        {/*    title="User Manual"*/}
                        {/*>*/}
                        {/*    <HelpCircle className="h-5 w-5" />*/}
                        {/*</Button>*/}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent transition-all"
                            onClick={() =>
                                window.open(
                                    "https://spo-global.kpmg.com/:b:/r/sites/MX-InteligenciadeNegociosAudit-AppPVIII/Shared%20Documents/PS03%20-%20Scorefy/Manual/Manual%20Scorefy%20(Vf-d)%20(1).pdf?csf=1&web=1&e=hfZXwU",
                                    "_blank"
                                )
                            }
                            title="User Manual"
                        >
                            <HelpCircle className="h-5 w-5" />
                        </Button>

                        {/* Notification Bell */}
                        {/*<DropdownMenu>*/}
                        {/*    <DropdownMenuTrigger asChild>*/}
                        {/*        <Button*/}
                        {/*            variant="ghost"*/}
                        {/*            size="icon"*/}
                        {/*            className="relative hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent transition-all"*/}
                        {/*        >*/}
                        {/*            <Bell className="h-5 w-5" />*/}
                        {/*            <Badge*/}
                        {/*                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"*/}
                        {/*                style={{ background: "var(--gradient-accent)" }}*/}
                        {/*            >*/}
                        {/*                {pendingEvaluations.length}*/}
                        {/*            </Badge>*/}
                        {/*        </Button>*/}
                        {/*    </DropdownMenuTrigger>*/}

                        {/*    <DropdownMenuContent align="end" className="w-80">*/}
                        {/*        */}{/* ... resto de tu menú igual ... */}
                        {/*    </DropdownMenuContent>*/}
                        {/*</DropdownMenu>*/}

                        {/* User Avatar */}

                        {/*El boton de usuario debe reaccionar a los siguientes dos casos*/}
                        {/*1. Debe desaparecer si esta en la tabla de seguridad */}
                        {/*2. Aparecer el boton si no esta en la tabla de seguridad */}

                        {/*<Button*/}
                        {/*    variant="ghost"*/}
                        {/*    className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"*/}
                        {/*    style={{ boxShadow: "var(--shadow-sm)" }}*/}
                        {/*    onClick={() => setIsProfileOpen(!isProfileOpen)}*/}
                        {/*>*/}
                        {/*    <Avatar className="h-9 w-9 ring-2 ring-white">*/}
                        {/*        <AvatarFallback*/}
                        {/*            className="text-white font-semibold"*/}
                        {/*            style={{ background: "var(--gradient-primary)" }}*/}
                        {/*        >*/}
                        {/*            {loading ? "…" : initials}*/}
                        {/*        </AvatarFallback>*/}
                        {/*    </Avatar>*/}
                        {/*</Button>*/}



                        {showUserButton && (
                            <Button
                                variant="ghost"
                                className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <Avatar className="h-9 w-9 ring-2 ring-white">
                                    <AvatarFallback
                                        className="text-white font-semibold"
                                        style={{ background: "var(--gradient-primary)" }}
                                    >
                                        {loading ? "…" : initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        )}


                    </div>
                </div>
            </header>

            <ProfilePanel
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </>
    );
}