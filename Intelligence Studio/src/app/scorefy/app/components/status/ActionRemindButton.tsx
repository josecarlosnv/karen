import { Button } from "@/app/components/ui/button";
import { Bell, Loader2, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface ActionRemindButtonProps {
  state?: "default" | "loading" | "sent";
  onClick?: () => void;
}

export function ActionRemindButton({ state = "default", onClick }: ActionRemindButtonProps) {
  const getIcon = () => {
    if (state === "loading") return <Loader2 className="h-4 w-4 animate-spin" />;
    if (state === "sent") return <Check className="h-4 w-4" />;
    return <Bell className="h-4 w-4" />;
  };

  const getTooltip = () => {
    if (state === "loading") return "Sending...";
    if (state === "sent") return "Reminder sent";
    return "Send reminder";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-50 transition-all"
            onClick={onClick}
            disabled={state === "loading" || state === "sent"}
            aria-label={getTooltip()}
          >
            {getIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltip()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}