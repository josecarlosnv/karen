import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
  // BASE
  "flex h-9 w-full rounded-md px-3 text-[12px] transition-all outline-none",

  // DEFAULT
  "bg-white border border-[#D6DFEE] text-[#1F2937]",

  // PLACEHOLDER
  "placeholder:text-[#9AA8C7]",

  // HOVER
  "hover:border-[#1E49E2]/40 hover:bg-[#F7FAFF]",

  // FOCUS
  "focus:border-[#1E49E2] focus:ring-2 focus:ring-[#1E49E2]/20",

  // DISABLED
  "disabled:cursor-not-allowed",

  className
)}
      {...props}
    />
  );
}

export { Input };
