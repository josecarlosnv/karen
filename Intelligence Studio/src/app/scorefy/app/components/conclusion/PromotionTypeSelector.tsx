import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";

interface PromotionTypeSelectorProps {
  type: "promotion" | "co" | null;
  promotionCategory?: string;
  justification?: string;
  onTypeChange?: (type: "promotion" | "co") => void;
  onPromotionCategoryChange?: (category: string) => void;
  onJustificationChange?: (justification: string) => void;
  disabled?: boolean;
  errors?: {
    type?: string;
    promotionCategory?: string;
    justification?: string;
  };
}

const promotionCategories = [
  "Senior",
  "Supervising Senior",
  "Staff in Charge",
  "Manager",
  "Senior Manager",
  "Director",
];

export function PromotionTypeSelector({
  type,
  promotionCategory,
  justification,
  onTypeChange,
  onPromotionCategoryChange,
  onJustificationChange,
  disabled = false,
  errors = {},
}: PromotionTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Promotion or CO
        </Label>
        
        <RadioGroup
          value={type || ""}
          onValueChange={(value) => !disabled && onTypeChange?.(value as "promotion" | "co")}
          disabled={disabled}
        >
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="promotion" id="promotion" disabled={disabled} />
              <Label
                htmlFor="promotion"
                className={`text-sm font-medium ${disabled ? "opacity-50" : "cursor-pointer"}`}
              >
                Promotion
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="co" id="co" disabled={disabled} />
              <Label
                htmlFor="co"
                className={`text-sm font-medium ${disabled ? "opacity-50" : "cursor-pointer"}`}
              >
                CO
              </Label>
            </div>
          </div>
        </RadioGroup>

        {errors.type && (
          <p className="text-xs text-red-500">{errors.type}</p>
        )}
      </div>

      {/* Promotion Category Dropdown */}
      {type === "promotion" && (
        <div className="space-y-2">
          <Label htmlFor="promotionCategory" className="text-sm font-medium">
            Promotion Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={promotionCategory || ""}
            onValueChange={onPromotionCategoryChange}
            disabled={disabled}
          >
            <SelectTrigger
              id="promotionCategory"
              style={{ background: "var(--gradient-card)" }}
              className={errors.promotionCategory ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select promotion category..." />
            </SelectTrigger>
            <SelectContent>
              {promotionCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.promotionCategory && (
            <p className="text-xs text-red-500">{errors.promotionCategory}</p>
          )}
        </div>
      )}

      {/* CO Justification */}
      {type === "co" && (
        <div className="space-y-2">
          <Label htmlFor="justification" className="text-sm font-medium">
            Justification <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="justification"
            placeholder="Provide detailed justification for CO decision..."
            value={justification || ""}
            onChange={(e) => onJustificationChange?.(e.target.value)}
            rows={4}
            disabled={disabled}
            style={{ background: "var(--gradient-card)" }}
            className={errors.justification ? "border-red-500" : ""}
          />
          {errors.justification && (
            <p className="text-xs text-red-500">{errors.justification}</p>
          )}
        </div>
      )}
    </div>
  );
}