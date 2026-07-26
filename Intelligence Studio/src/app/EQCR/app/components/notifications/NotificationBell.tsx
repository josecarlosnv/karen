import { useState } from "react";
import { Bell, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../ui/utils";

type NotificationType = "success" | "pending" | "alert";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const ICONS: Record<NotificationType, typeof CheckCircle2> = {
  success: CheckCircle2,
  pending: Clock3,
  alert: AlertTriangle,
};

const COLORS: Record<NotificationType, string> = {
  success: "#16A34A",
  pending: "#1E49E2",
  alert: "#DC2626",
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "pending",
    title: "Nueva aprobación pendiente",
    description: "Sanchez Mayen, F. está esperando tu revisión como Deputy.",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Asignación aprobada",
    description: "Aguilera Davila, Joaquin Alejandro fue aprobado.",
    time: "Hace 1 h",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Confirmación rechazada",
    description: "Castañon Guzman, Hermes fue rechazado por el Deputy.",
    time: "Ayer",
    read: false,
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-gray-500 hover:text-[#1E49E2] hover:bg-[#1E49E2]/10 transition-all"
        >
          <Bell className="h-4 w-4" strokeWidth={1.75} />
          {unreadCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #1E49E2, #00266A)",
                boxShadow: "0 0 0 2px white",
              }}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-96 p-0 overflow-hidden rounded-2xl border-0"
        style={{
          boxShadow: "0 12px 40px rgba(0, 51, 141, 0.16), 0 0 1px rgba(0, 51, 141, 0.25)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg, #00266A 0%, #1E49E2 100%)" }}
        >
          <div>
            <p className="text-sm font-semibold text-white" style={{ letterSpacing: "0.02em" }}>
              Notificaciones
            </p>
            <p className="text-xs text-white/70 mt-0.5">
              {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium text-white/85 hover:text-white transition-colors"
            >
              Marcar todo leído
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto divide-y" style={{ borderColor: "rgba(0, 51, 141, 0.06)" }}>
          {notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Bell className="mx-auto h-6 w-6 text-gray-300 mb-2" strokeWidth={1.5} />
              <p className="text-sm text-gray-400">No tienes notificaciones</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = ICONS[n.type];
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-5 py-3.5 transition-colors hover:bg-[#1E49E2]/5 cursor-pointer",
                    !n.read && "bg-[#1E49E2]/[0.03]",
                  )}
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ background: `${COLORS[n.type]}14` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: COLORS[n.type] }} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      {!n.read && (
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1E49E2]" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.description}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="px-5 py-3 border-t" style={{ borderTopColor: "rgba(0, 51, 141, 0.08)" }}>
          <button className="w-full text-center text-xs font-medium text-[#1E49E2] hover:text-[#00266A] transition-colors">
            Ver todas las notificaciones
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
