import { Badge } from "@/app/components/ui/badge";

interface ChipEvaluationTypeProps {
  type: "ordinary" | "extra";
  size?: "sm" | "md";
}

const typeConfig = {
  ordinary: {
    label: "Ordinary",
    className: "bg-transparent border-0 text-[#94a3b8]",
  },
  extra: {
    label: "Extra",
    className: "bg-transparent border border-[#F59E0B] text-[#F59E0B]",
  },
};

export function ChipEvaluationType({ type, size = "sm" }: ChipEvaluationTypeProps) {
  const config = typeConfig[type];

  // Standardized sizes for consistency
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 h-7",
    md: "text-sm px-3 py-2 h-8",
  };

  return (
    <Badge
      className={`${config.className} ${sizeClasses[size]} font-medium w-fit rounded-md`}
    >
      {config.label}
    </Badge>
  );
}