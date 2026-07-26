import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface StatusTableHeaderProps {
  label: string;
  sortable?: boolean;
  sorted?: "none" | "asc" | "desc";
  onSort?: () => void;
  align?: "left" | "center" | "right";
  className?: string;
}

export function StatusTableHeader({
  label,
  sortable = false,
  sorted = "none",
  onSort,
  align = "left",
  className = "",
}: StatusTableHeaderProps) {
  const alignClass =
    align === "right" ? "justify-end" : align === "center" ? "justify-center" : "justify-start";

  return (
    <th className={`px-4 py-3 text-left ${className}`}>
      {sortable ? (
        <button
          onClick={onSort}
          className={`
            flex items-center gap-2 ${alignClass} w-full
            text-sm font-semibold text-muted-foreground
            hover:text-foreground transition-colors
            ${sorted !== "none" ? "text-[var(--kpmg-blue)]" : ""}
          `}
        >
          {label}
          {sorted === "none" && (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
          )}
          {sorted === "asc" && (
            <ArrowUp className="h-3.5 w-3.5 text-[var(--kpmg-blue)]" />
          )}
          {sorted === "desc" && (
            <ArrowDown className="h-3.5 w-3.5 text-[var(--kpmg-blue)]" />
          )}
        </button>
      ) : (
        <span className={`text-sm font-semibold text-muted-foreground flex ${alignClass}`}>
          {label}
        </span>
      )}
    </th>
  );
}
