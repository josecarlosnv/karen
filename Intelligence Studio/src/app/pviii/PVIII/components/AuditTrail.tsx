import { Clock } from "lucide-react";
import { cn } from "./ui/utils";

export interface AuditEvent {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  comment?: string;
  status?: string;
}

interface AuditTrailProps {
  events: AuditEvent[];
  className?: string;
}

export function AuditTrail({ events, className }: AuditTrailProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#00338D]">
              <Clock className="w-4 h-4" />
            </div>
            {index !== events.length - 1 && (
              <div className="w-0.5 flex-1 bg-slate-200 mt-2" />
            )}
          </div>
          <div className="flex-1 pb-8">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-medium text-slate-900">{event.action}</p>
              <p className="text-xs text-slate-500">{event.timestamp}</p>
            </div>
            <p className="text-sm text-slate-600 mb-1">by {event.user}</p>
            {event.status && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700 mb-2">
                {event.status}
              </span>
            )}
            {event.comment && (
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 mt-2">
                {event.comment}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
