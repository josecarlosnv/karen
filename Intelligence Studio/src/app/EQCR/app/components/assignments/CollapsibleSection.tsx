import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../ui/utils";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  isOpen,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  return (
    <div className="rounded-xl overflow-hidden border border-[#E6ECF5] bg-white shadow-sm">
      
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4
                   bg-white hover:bg-[#F9FBFF] transition-colors"
      >
        <h3 className="text-[11px] font-semibold text-[#1E49E2] capitalize tracking-[0.12em]">
          {title}
        </h3>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#1E49E2] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div
          className="px-5 pt-4 pb-5 space-y-4
                     bg-gradient-to-b from-[#F4F8FF] to-white"
        >
          {children}
        </div>
      )}
    </div>
  );
}
