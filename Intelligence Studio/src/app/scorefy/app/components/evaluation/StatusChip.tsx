import { Badge } from "@/app/components/ui/badge";
import { CheckCircle2, Clock, Eye } from "lucide-react";

interface StatusChipProps {
  type: "pending" | "complete" | "in-progress";
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-700 border border-gray-300",
    icon: Clock,
  },
  complete: {
    label: "Complete",
    className: "text-white border-0",
    gradient: "var(--gradient-primary)",
    icon: CheckCircle2,
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    icon: Eye,
  },
};

export function StatusChip({ type, size = "md" }: StatusChipProps) {
  const config = statusConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} font-semibold flex items-center gap-1.5 w-fit`}
      style={config.gradient ? { background: config.gradient, boxShadow: "var(--shadow-sm)" } : {}}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {config.label}
    </Badge>
  );
}
