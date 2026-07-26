import { Badge } from "@/app/components/ui/badge";
import { Clock, Eye, CheckCircle2 } from "lucide-react";

interface ChipStatusProps {
  role: "evaluator" | "employee";
  state: "pending" | "in-progress" | "complete";
  size?: "sm" | "md";
}

const stateConfig = {
  pending: {
    label: "Pending",
    className: "bg-transparent border border-[#CBD5E1] text-[#64748b]",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-transparent border border-[#2F8FFF] text-[#2F8FFF]",
    icon: Eye,
  },
  complete: {
    label: "Complete",
    className: "text-white border-0",
    gradient: "var(--gradient-primary)",
    icon: CheckCircle2,
  },
};

export function ChipStatus({ state, size = "sm" }: ChipStatusProps) {
  const config = stateConfig[state];
  const Icon = config.icon;

  // Standardized sizes for consistency
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 h-7",
    md: "text-sm px-3 py-2 h-8",
  };

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} font-medium inline flex items-center justify-center gap-1.5 rounded-md min-w-[110px]`}
      style={config.gradient ? { background: config.gradient, boxShadow: "var(--shadow-sm)" } : {}}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {config.label}
    </Badge>
  );
}