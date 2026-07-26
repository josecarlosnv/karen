import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
    Home,
    FileText,
    CheckCircle,
    Users,
    Menu,
    X,
    HelpCircle,
    MoreVertical,
    ChevronDown,
    BarChart3,
} from "lucide-react";
import { cn } from "./ui/utils";
import { motion, AnimatePresence } from "motion/react";

interface AppShellProps {
    children: ReactNode;
}

const topNavigation = [
    { name: "Home", href: "/" },
    { name: "Workspace", href: "/p8/new" },
    { name: "Approvals", href: "/approvals" },
    { name: "Specialists", href: "/specialist-confirmations" },
];

const fullNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Workspace", href: "/p8/new", icon: FileText },
    { name: "Approvals", href: "/approvals", icon: CheckCircle },
    { name: "Specialists", href: "/specialist-confirmations", icon: Users },
];

export function AppShell({ children }: AppShellProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [insightsOpen, setInsightsOpen] = useState(false);

    const insightsRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const insightsItems = [
        {
            label: "Audit",
            action: () => {
                window.open(
                    "https://app.powerbi.com/reportEmbed?reportId=09864177-e72d-4c63-a72d-f227a0942d52&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
                    "_blank",
                    "noopener,noreferrer"
                );
            },
        },
        {
            label: "Other Functions",
            action: () => {
                navigate("/insights/other-functions");
            },
        },
    ];

    const isActive = (href: string) => {
        if (href === "/") return location.pathname === "/";
        return location.pathname.startsWith(href);
    };

    const isInsightsActive = location.pathname.startsWith("/insights");

    useEffect(() => {
        if (!insightsOpen) return;

        const handleOutside = (e: MouseEvent) => {
            if (
                insightsRef.current &&
                !insightsRef.current.contains(e.target as Node)
            ) {
                setInsightsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [insightsOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <motion.header
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200/50 shadow-sm"
            >
                <div className="max-w-[1920px] mx-auto">
                    <div className="flex items-center justify-between h-16 px-6 lg:px-8">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-12">
                            <Link to="/" className="group flex items-center">
                                <div className="relative">
                                    <h1
                                        className="text-[#00338D] font-light text-[28px] tracking-[0.25em] uppercase transition-all duration-300 group-hover:tracking-[0.28em] group-hover:text-[#1E49E2]"
                                        style={{
                                            textShadow:
                                                "0 1px 2px rgba(0, 51, 141, 0.08)",
                                        }}
                                    >
                                        PVIII
                                    </h1>
                                    <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00338D]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden lg:flex items-center gap-2">
                                {topNavigation.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="relative px-5 py-5 group"
                                        >
                                            <span
                                                className={cn(
                                                    "text-sm font-medium transition-colors duration-200",
                                                    active
                                                        ? "text-[#1E49E2]"
                                                        : "text-[#00338D] group-hover:text-[#1E49E2]"
                                                )}
                                            >
                                                {item.name}
                                            </span>

                                            {active && (
                                                <motion.div
                                                    layoutId="activeIndicator"
                                                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00338D] via-[#1E49E2] to-[#00338D] shadow-[0_0_12px_rgba(30,73,226,0.4)]"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 40,
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}

                                {/* Insights Dropdown */}
                                <div className="relative" ref={insightsRef}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setInsightsOpen((prev) => !prev)
                                        }
                                        className="relative flex items-center gap-1 px-5 py-5 group"
                                    >
                                        <span
                                            className={cn(
                                                "text-sm font-medium transition-colors duration-200",
                                                isInsightsActive
                                                    ? "text-[#1E49E2]"
                                                    : "text-[#00338D] group-hover:text-[#1E49E2]"
                                            )}
                                        >
                                            Insights
                                        </span>

                                        <ChevronDown
                                            className={cn(
                                                "h-3.5 w-3.5 transition-all duration-200",
                                                isInsightsActive
                                                    ? "text-[#1E49E2]"
                                                    : "text-[#00338D] group-hover:text-[#1E49E2]",
                                                insightsOpen && "rotate-180"
                                            )}
                                        />

                                        {isInsightsActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00338D] via-[#1E49E2] to-[#00338D] shadow-[0_0_12px_rgba(30,73,226,0.4)]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 40,
                                                }}
                                            />
                                        )}
                                    </button>
                                    
                                    <AnimatePresence>
                                        {insightsOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute left-0 top-full mt-1 w-44 bg-white border border-slate-200/70 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1 z-50"
                                            >
                                                {insightsItems.map(
                                                    ({ label, action }) => (
                                                        <button
                                                            key={label}
                                                            type="button"
                                                            onClick={() => {
                                                                setInsightsOpen(
                                                                    false
                                                                );
                                                                action();
                                                            }}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-[#00338D] hover:bg-[#00338D]/5 hover:text-[#1E49E2] transition-colors duration-150"
                                                        >
                                                            {label}
                                                        </button>
                                                    )
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>
                            </nav>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-1">
                            <div className="hidden lg:flex items-center gap-1 group/header">
                                <a
                                    href="https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-AppPVIII/Shared%20Documents/Forms/AllItems.aspx?id=/sites/MX-InteligenciadeNegociosAudit-AppPVIII/Shared%20Documents/PS03%20-%20Scorefy/Manual/Manual_App_PVIII.pdf&parent=/sites/MX-InteligenciadeNegociosAudit-AppPVIII/Shared%20Documents/PS03%20-%20Scorefy/Manual&p=true&ga=1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button
                                        type="button"
                                        className="flex items-center justify-center w-9 h-9 rounded-lg text-[#00338D] hover:text-[#1E49E2] hover:bg-slate-50 transition-colors"
                                        aria-label="Help"
                                    >
                                        <HelpCircle className="h-5 w-5" />
                                    </button>
                                </a>
                                {/*
                                <Link
                                    to="/admin"
                                    className="flex items-center justify-center w-9 h-9 rounded-lg text-[#00338D] hover:text-[#1E49E2] hover:bg-slate-50 transition-all opacity-0 group-hover/header:opacity-70 hover:!opacity-100"
                                    aria-label="Admin"
                                >
                                    <MoreVertical className="h-5 w-5" />
                                </Link>
                                */}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                type="button"
                                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[#0C233C] hover:text-[#1E49E2] hover:bg-slate-50 transition-colors"
                                onClick={() => setMobileMenuOpen(true)}
                                aria-label="Menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm lg:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{
                                type: "spring",
                                damping: 30,
                                stiffness: 300,
                            }}
                            className="fixed inset-y-0 right-0 z-[60] w-full max-w-sm bg-white shadow-2xl lg:hidden overflow-y-auto"
                        >
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                                <div>
                                    <h1 className="text-[#00338D] font-light text-xl tracking-[0.2em] uppercase">
                                        PVIII
                                    </h1>
                                    <p className="text-slate-500 text-xs mt-0.5">
                                        Project Valuation
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="text-slate-400 hover:text-slate-900 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* User Info Mobile */}
                            <div className="px-6 py-6 bg-slate-50 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00338D] to-[#0C233C] flex items-center justify-center">
                                        <span className="text-white text-base font-semibold">
                                            JS
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            John Specialist
                                        </p>
                                        <p className="text-xs text-slate-600">
                                            Partner
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="px-4 py-6">
                                <ul role="list" className="space-y-1">
                                    {fullNavigation.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    to={item.href}
                                                    onClick={() =>
                                                        setMobileMenuOpen(false)
                                                    }
                                                    className={cn(
                                                        "group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                                                        active
                                                            ? "bg-[#00338D]/10 text-[#00338D]"
                                                            : "text-slate-700 hover:bg-slate-50 hover:text-[#00338D]"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            "h-5 w-5 shrink-0 transition-colors",
                                                            active
                                                                ? "text-[#00338D]"
                                                                : "text-slate-400 group-hover:text-[#00338D]"
                                                        )}
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                    
                                    {/* Insights Mobile */}
                                    <li>
                                        <div className="pt-2">
                                            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700">
                                                <BarChart3 className="h-5 w-5 shrink-0 text-slate-400" />
                                                Insights
                                            </div>

                                            <div className="ml-8 mt-1 space-y-1">
                                                {insightsItems.map(
                                                    ({ label, action }) => (
                                                        <button
                                                            key={label}
                                                            type="button"
                                                            onClick={() => {
                                                                setMobileMenuOpen(
                                                                    false
                                                                );
                                                                action();
                                                            }}
                                                            className="w-full text-left rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#00338D] transition-all"
                                                        >
                                                            {label}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </li>

                                    {/* Admin option in mobile menu */}
                                    {/*
                                    <li>
                                        <Link
                                            to="/admin"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all text-slate-700 hover:bg-slate-50 hover:text-[#00338D]"
                                        >
                                            <MoreVertical className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-[#00338D]" />
                                            Admin
                                        </Link>
                                    </li>
                                    */}
                                </ul>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="pt-16">
                <div className="min-h-screen">{children}</div>
            </main>
        </div>
    );
}