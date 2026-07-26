import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface ReactivoCardProps {
  competency: string;
  subCompetency: string;
  description: string;
  index: number;
  value?: {
    score: number | null;
    comment: string;
  };
  onChange?: (value: { score: number | null; comment: string }) => void;
}

const scoreOptions = [
  { value: 1, label: "Needs Development", color: "bg-red-100 text-red-700 border-red-300" },
  { value: 2, label: "Competent", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: 3, label: "Strong Performance", color: "bg-green-100 text-green-700 border-green-300" },
];

export function ReactivoCard({
  competency,
  subCompetency,
  description,
  index,
  value = { score: null, comment: "" },
  onChange,
}: ReactivoCardProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleScoreChange = (score: number) => {
    const newValue = { ...localValue, score };
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  const handleCommentChange = (comment: string) => {
    const newValue = { ...localValue, comment };
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className="border-0 group hover:shadow-xl transition-all duration-300"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <CardContent className="p-6 space-y-4">
          {/* Competency Metadata Block */}
          <div
            className="p-4 rounded-lg space-y-2"
            style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #E9F0FF 100%)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    className="text-white font-medium"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    Competency
                  </Badge>
                  <h3 className="font-semibold text-[var(--kpmg-blue)]">
                    {competency}
                  </h3>
                </div>
                <div className="flex items-center gap-2 ml-1">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Sub-Competency:
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {subCompetency}
                  </span>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-sm">
                      Rate your performance in this competency area and provide specific examples.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Reactivo Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Evaluation Criteria
            </Label>
            <p className="text-sm leading-relaxed text-foreground">{description}</p>
          </div>

          {/* Score Selector - Desktop: Horizontal Pills, Mobile: Dropdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Self-Evaluation Score <span className="text-red-500">*</span>
              </Label>
            </div>

            {/* Desktop/Tablet: Segmented Control */}
            <div className="hidden md:flex gap-2">
              {scoreOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleScoreChange(option.value)}
                  className={`
                    flex-1 px-4 py-3 rounded-lg border-2 transition-all duration-200
                    ${
                      localValue.score === option.value
                        ? `${option.color} border-current shadow-md scale-105`
                        : "bg-white border-border hover:border-primary hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent"
                    }
                  `}
                  style={
                    localValue.score === option.value
                      ? { boxShadow: "var(--shadow-md)" }
                      : {}
                  }
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-bold">{option.value}</span>
                    <span className="text-xs font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile: Dropdown */}
            <div className="md:hidden">
              <Select
                value={localValue.score?.toString() || ""}
                onValueChange={(value) => handleScoreChange(parseInt(value))}
              >
                <SelectTrigger style={{ background: "var(--gradient-card)" }}>
                  <SelectValue placeholder="Select a score..." />
                </SelectTrigger>
                <SelectContent>
                  {scoreOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{option.value}</span>
                        <span className="text-sm">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Score Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200">
                1 = Needs Development
              </span>
              <span className="px-2 py-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-200">
                2 = Competent
              </span>
              <span className="px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200">
                3 = Strong Performance
              </span>
            </div>
          </div>

          {/* Comment Box */}
          <div className="space-y-2">
            <Label htmlFor={`comment-${index}`} className="text-sm font-medium">
              Comments & Evidence
            </Label>
            <Textarea
              id={`comment-${index}`}
              placeholder="Provide specific examples, evidence, or context to support your score..."
              value={localValue.comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              rows={4}
              style={{ background: "var(--gradient-card)" }}
            />
            <p className="text-xs text-muted-foreground">
              Minimum 50 characters recommended
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
