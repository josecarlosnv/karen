"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
  // BASE
  "peer size-4 shrink-0 rounded-[6px] border transition-all ",

  // DEFAULT (unchecked)
  "bg-white border-[#D6DFEE]",

  // HOVER
  "hover:border-[#1E49E2]/50 hover:bg-[#F5F8FF]",

  // CHECKED
  "data-[state=checked]:bg-[#1E49E2] data-[state=checked]:border-[#1E49E2] data-[state=checked]:text-white",

  // CHECKED HOVER
  "data-[state=checked]:hover:bg-[#00266A]",

  // FOCUS (clave para que se vea pro)
  "focus-visible:ring-2 focus-visible:ring-[#1E49E2]/20 focus-visible:outline-none",

  // DISABLED
  //"disabled:opacity-40 disabled:cursor-not-allowed",

  className
)}

      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3 text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
