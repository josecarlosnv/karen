import { Label } from "@/app/components/ui/label";

interface RatingSelector1to5Props {
  value: number | null;
  onChange?: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

const ratings = [
  { value: 1, label: "1", color: "bg-green-100 text-green-700 border-green-300" },
  { value: 2, label: "2", color: "bg-lime-100 text-lime-700 border-lime-300" },
  { value: 3, label: "3", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: 4, label: "4", color: "bg-orange-100 text-orange-700 border-orange-300" },
  { value: 5, label: "5", color: "bg-red-100 text-red-700 border-red-300" },
];

export function RatingSelector1to5({
  value,
  onChange,
  disabled = false,
  label = "Open PD (1 = highest, 5 = lowest)",
}: RatingSelector1to5Props) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </Label>
      
      <div className="flex gap-2">
        {ratings.map((rating) => (
          <button
            key={rating.value}
            onClick={() => !disabled && onChange?.(rating.value)}
            disabled={disabled}
            className={`
              flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200 font-semibold text-lg
              ${
                value === rating.value
                  ? `${rating.color} border-current shadow-md scale-105`
                  : "bg-white border-border hover:border-primary hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            style={
              value === rating.value
                ? { boxShadow: "var(--shadow-md)" }
                : {}
            }
          >
            {rating.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">
          1 = Highest performance
        </span>
        <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200">
          5 = Lowest performance
        </span>
      </div>
    </div>
  );
}
