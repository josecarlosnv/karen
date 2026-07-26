import { cn } from "./ui/utils";

export type StatusType = 
  | "draft" 
  | "submitted" 
  | "approved" 
  | "rejected" 
  | "pending" 
  | "exception"
  | "confirmed"
  | "declined"
  | "progress"
  | "needs-changes";

interface StatusChipProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  progress: {
    label: "Progress",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  submitted: {
    label: "Submitted",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  exception: {
    label: "Exception Review",
    className: "bg-pink-50 text-pink-700 border-pink-200",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  declined: {
    label: "Declined",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  "needs-changes": {
    label: "Needs Changes",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

export function StatusChip({ status, className }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
