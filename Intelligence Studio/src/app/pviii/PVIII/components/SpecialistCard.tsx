import { motion } from "motion/react";
import { Button } from "./ui/button";

interface SpecialistCardProps {
  client: {
    name: string;
    leadPartner: string;
    function: string;
    serviceLine: string;
  };
  status: string;
  statusType?: "revision" | "pending" | "submitted" | "draft";
  buttonLabel: string;
  onButtonClick: () => void;
}

export function SpecialistCard({
  client,
  status,
  statusType = "pending",
  buttonLabel,
  onButtonClick,
}: SpecialistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-lg p-[1px] bg-gradient-to-br from-[#00338D]/15 via-[#1E49E2]/10 to-[#00338D]/15 hover:from-[#00338D]/25 hover:via-[#1E49E2]/20 hover:to-[#00338D]/25 transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(30,73,226,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col min-h-[280px]">
        <div className="p-8 flex flex-col flex-1">
          <h3 className="text-xl font-semibold text-[#00338D] mb-2 group-hover:text-[#1E49E2] transition-colors duration-300 leading-tight line-clamp-2">
            {client.name}
          </h3>

          <p className="text-sm text-slate-400 mb-4">{client.leadPartner}</p>

          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 flex-grow">
            <span className="text-[#00338D] font-medium">{client.function}</span>
            <span>•</span>
            <span>{client.serviceLine}</span>
          </div>

          <Button
            onClick={onButtonClick}
            size="sm"
            className="w-full bg-gradient-to-r from-[#00338D] to-[#1E49E2] text-white hover:from-[#00338D]/90 hover:to-[#1E49E2]/90 border-0 mt-auto"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}