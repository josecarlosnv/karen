import { ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function FormSection({ title, children, defaultOpen = true }: FormSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-white mb-4">
      <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 hover:bg-gray-50">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-6 pb-6">
        <div className="pt-4 space-y-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
