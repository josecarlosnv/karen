import { ReactNode } from "react";

export function FilterBar({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 py-2.5 px-4 bg-[#A5B6F3]/50 rounded-lg border border-gray-200/50">
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
