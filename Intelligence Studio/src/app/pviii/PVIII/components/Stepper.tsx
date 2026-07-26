import { Check, Circle, CircleDot } from "lucide-react";
import { cn } from "./ui/utils";

export type StepStatus = "not_started" | "in_progress" | "completed" | "current";

export interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  status?: StepStatus;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  const getVisualStatus = (step: Step, index: number): StepStatus => {
    if (index === currentStep) {
      return "current";
    }
    if (step.status) {
      return step.status;
    }
    if (step.completed) {
      return "completed";
    }
    return "not_started";
  };

  const isConnectorFilled = (index: number, step: Step): boolean => {
    if (index <= currentStep) return true;
    if (index > 0 && steps[index - 1].completed) return true;
    return false;
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const visualStatus = getVisualStatus(step, index);
              const isCompleted = step.completed || visualStatus === "completed";
              const isCurrent = visualStatus === "current";
              const isInProgress = visualStatus === "in_progress";
              const isNotStarted = visualStatus === "not_started";

              return (
                <li
                  key={step.id}
                  className="relative flex items-center flex-1 group"
                >
                  {index !== 0 && (
                    <div className="absolute right-1/2 top-4 -left-0 h-[2px] -translate-y-1/2 flex items-center">
                      <div className="w-full h-full bg-slate-200">
                        <div
                          className={cn(
                            "h-full bg-gradient-to-r from-[#00338D] to-[#1E49E2] transition-all duration-500",
                            isConnectorFilled(index, step) ? "w-full" : "w-0"
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative flex flex-col items-center w-full">
                    <button
                      onClick={() => onStepClick?.(index)}
                      className={cn(
                        "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-sm z-10 cursor-pointer hover:scale-105",
                        isCompleted && "bg-gradient-to-br from-[#00338D] to-[#1E49E2] border-[#00338D] text-white shadow-md",
                        isCurrent && !isCompleted && "bg-white border-[#1E49E2] text-[#1E49E2] ring-2 ring-[#1E49E2]/10 shadow-lg scale-110",
                        isInProgress && !isCurrent && "bg-white border-[#1E49E2] text-[#1E49E2] shadow-sm",
                        isNotStarted && !isCurrent && "bg-white border-slate-300 text-slate-400 hover:border-[#1E49E2]/40"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : isInProgress && !isCurrent ? (
                        <CircleDot className="w-4 h-4" />
                      ) : (
                        <span className={cn(
                          "text-xs font-semibold",
                          isCurrent && "text-[#1E49E2]"
                        )}>{index + 1}</span>
                      )}
                    </button>

                    <div className="mt-1.5 text-center">
                      <p
                        className={cn(
                          "text-xs font-normal transition-colors whitespace-nowrap",
                          isCurrent && "text-[#00338D] font-medium",
                          isCompleted && "text-slate-600",
                          isInProgress && !isCurrent && "text-[#1E49E2]",
                          isNotStarted && !isCurrent && "text-slate-400"
                        )}
                      >
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{step.description}</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-900">{steps[currentStep].title}</p>
          <p className="text-xs text-slate-500 font-medium">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00338D] to-[#1E49E2] h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}