import * as React from "react";
import { cn } from "./utils";

export interface SegmentedControlOption {
    value: string;
    label: string;
}

interface SegmentedControlProps {
    options: SegmentedControlOption[];
    value: string | null;
    onChange: (value: string) => void;
    className?: string;
}

export function SegmentedControl({
    options,
    value,
    onChange,
    className,
}: SegmentedControlProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100 border border-gray-200",
                className
            )}
        >
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-offset-1",
                            isSelected
                                ? "bg-white shadow-sm text-[var(--kpmg-blue)] focus:ring-[var(--kpmg-blue)]"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
