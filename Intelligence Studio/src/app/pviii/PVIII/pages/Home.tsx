import { Link } from "react-router";
import {
    FileText,
    ArrowRight,
    CheckCircle,
    Building2,
    Users,
    BarChart3,
    FolderOpen,
} from "lucide-react";
import { motion } from "motion/react";

const actionCards = [
    {
        id: "start-pviii",
        label: "Start PVIII",
        description: "Create for Client New or Client Recurrent",
        icon: FileText,
        href: "/p8/new",
    },

    {
        id: "approvals",
        label: "Approvals",
        description: "Review and approve or reassign PVIII proposals",
        icon: CheckCircle,
        href: "/approvals",
    },
    {
        id: "new-client",
        label: "New Entity",
        description: "Create or validate a new entity record",
        icon: Building2,
        href: "/p8/new-project",
    },
    {
        id: "specialists",
        label: "Specialists",
        description: "Manage specialist inputs and confirmations",
        icon: Users,
        href: "/specialist-confirmations",
    },

    {
        id: "manage-pviii",
        label: "Manage PVIII",
        description: "View, edit, and track PVIII proposals",
        icon: FolderOpen,
        href: "/p8/manage",
    },
    {
        id: "insights",
        label: "PVIII Insights",
        description: "Open the Power BI insights dashboard",
        icon: BarChart3,
        href: "https://app.powerbi.com/reportEmbed?reportId=09864177-e72d-4c63-a72d-f227a0942d52&autoAuth=true&ctid=deff24bb-2089-4400-8c8e-f71e680378b2",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden" style={{ height: '140vh' }}>
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

                    <motion.div
                        animate={{
                            x: [0, 20, 0],
                            y: [0, -15, 0],
                        }}
                        transition={{
                            duration: 22,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-[60vh] left-[20%] w-[400px] h-[400px] bg-gradient-to-br from-[#00338D]/6 via-[#1E49E2]/6 to-transparent rounded-full blur-3xl"
                    />

                    <motion.div
                        animate={{
                            opacity: [0.05, 0.08, 0.05],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, #00338D 1px, transparent 1px),
                linear-gradient(to bottom, #00338D 1px, transparent 1px)
              `,
                            backgroundSize: "80px 80px",
                        }}
                    />

                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.6) 75%, rgba(255,255,255,0.85) 85%, white 100%)'
                        }}
                    />
                </div>

                <div className="relative border-b border-slate-200/60">
                    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl"
                        >
                            <div className="inline-block mb-4">
                                <span className="text-xs font-medium tracking-wider uppercase text-[#00338D]/60">
                                    Executive Dashboard
                                </span>
                            </div>
                            <h1 className="text-5xl font-light text-[#0C233C] tracking-tight mb-4">
                                Welcome to{" "}
                                <span className="font-normal text-[#00338D]">PVIII</span>
                            </h1>
                            <p className="text-lg text-slate-600 font-light">
                                Enterprise valuation management platform
                            </p>
                        </motion.div>
                    </div>
                </div>
                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {actionCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <Link
                                        to={card.href}
                                        className="group relative block h-full bg-white rounded-lg border border-[#1E49E2]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(30,73,226,0.12)] hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00338D]/[0.08] via-[#1E49E2]/[0.12] to-[#1E49E2]/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <div className="relative z-10 p-10 h-full flex flex-col">
                                            <div className="mb-8">
                                                <Icon className="w-9 h-9 text-[#00338D] group-hover:text-[#1E49E2] transition-colors duration-300" />
                                            </div>

                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="text-lg font-medium text-[#0C233C] group-hover:text-[#00338D] transition-colors duration-300">
                                                    {card.label}
                                                </h3>
                                                <ArrowRight className="w-4 h-4 text-[#00338D] group-hover:text-[#1E49E2] shrink-0 mt-1 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>

                                            <div className="overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 group-hover:mt-2">
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative h-24" />
            </div>
        </div>
        
    );
}