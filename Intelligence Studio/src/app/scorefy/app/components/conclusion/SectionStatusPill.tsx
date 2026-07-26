import { Badge } from "@/app/components/ui/badge";

interface SectionStatusPillProps {
  status: "pending" | "in-progress" | "completed" | "locked";
  size?: "sm" | "md";
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-gray-100 text-gray-700 border border-gray-300",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  completed: {
    label: "Completed",
    className: "text-white border-0",
    gradient: "var(--gradient-primary)",
  },
  locked: {
    label: "Locked",
    className: "bg-gray-100 text-gray-500 border border-gray-300",
  },
};

export function SectionStatusPill({ status, size = "sm" }: SectionStatusPillProps) {
  const config = statusConfig[status];

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
  };

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} font-semibold`}
      style={config.gradient ? { background: config.gradient, boxShadow: "var(--shadow-sm)" } : {}}
    >
      {config.label}
    </Badge>
  );
}
