import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Home,
  ClipboardList,
  CheckSquare,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const BASE_NAVIGATION = [
  { name: "Home", href: "/", icon: Home, requiresAdmin: false },
  { name: "Self-Evaluations", href: "/self-evaluations", icon: ClipboardList, requiresAdmin: false },
  { name: "Evaluations", href: "/evaluations", icon: CheckSquare, requiresAdmin: false },
  { name: "Status & Reminders", href: "/status-reminders", icon: Bell, requiresAdmin: false },
  { name: "Final Conclusion", href: "/final-conclusion", icon: FileText, requiresAdmin: false },
  { name: "Administration", href: "/admin", icon: Settings, requiresAdmin: true },
];

const API_BASE = import.meta.env.VITE_SCOREFY_API_URL as string;

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/administration/access`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : { hasAccess: false })
      .then((data) => setIsAdmin(data.hasAccess))
      .catch(() => setIsAdmin(false));
  }, []);

  const navigation = BASE_NAVIGATION.filter((item) => !item.requiresAdmin || isAdmin);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-border bg-white/80 backdrop-blur-lg transition-all duration-300 z-40",
          isCollapsed ? "w-20" : "w-64"
        )}
        style={{ boxShadow: 'var(--shadow-md)' }}
      >
        {/* Collapse Toggle */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hover:bg-gradient-to-br hover:from-blue-50 hover:to-transparent transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
                           (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "text-white"
                    : ""
                )}
                style={isActive ? {
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-glow)',
                  color: '#FFFFFF'
                } : {
                  color: '#0C233C'
                }}
              >
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-20 blur-xl"
                    style={{ background: 'var(--gradient-primary)' }}
                  />
                )}
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive && "drop-shadow-lg"
                )}
                style={!isActive ? { color: '#0C233C' } : {}}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-white z-50 transform transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ boxShadow: 'var(--shadow-xl)' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
                           (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "text-white"
                    : ""
                )}
                style={isActive ? {
                  background: 'var(--gradient-primary)',
                  boxShadow: 'var(--shadow-md)',
                  color: '#FFFFFF'
                } : {
                  color: '#0C233C'
                }}
              >
                <item.icon className="h-5 w-5" style={!isActive ? { color: '#0C233C' } : {}} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white/95 backdrop-blur-lg" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex justify-around items-center h-16 px-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.href ||
                           (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs rounded-lg transition-all"
                )}
                style={isActive ? {
                  color: 'var(--kpmg-blue)'
                } : {
                  color: '#9CA3AF'
                }}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-all",
                  isActive && "bg-gradient-to-br from-blue-50 to-transparent"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "scale-110"
                  )} />
                </div>
                <span className="text-[10px] font-medium">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
