import { Outlet, Link, useLocation } from "react-router";
import {
  Bell,
  User,
  Menu,
  Home,
  FileCheck,
  Users,
  CheckCircle,
  Settings,
  Award,
  X,
  HelpCircle,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from "../components/ui/sheet";
import { authApi, Claims } from "../API/authApi";
import { userInfo } from "node:os";
import { motion } from "motion/react";
import NotificationBell from "../components/notifications/NotificationBell";



export default function MainLayout() {
  
    const useUser = () => {
    const [user, setUser] = useState<Claims | null>(null);
  
      useEffect(() => {
        authApi.getClaims()
          .then(setUser)
          .catch(console.error);
      }, []);
  
      return user;
    };
  
  const user = useUser();




  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home, section: "main" },
    {
      path: "/credentials",
      label: "Credentials",
      icon: Award,
      section: "main",
    },
    {
      path: "/assignments",
      label: "Assignments",
      icon: Users,
      section: "workflows",
    },
   /* {
      path: "/confirmations",
      label: "Confirmations",
      icon: FileCheck,
      section: "workflows",
    },*/
    {
      path: "/approvals",
      label: "Approvals",
      icon: CheckCircle,
      section: "workflows",
    },
    /*
    {
      path: "/administration",
      label: "Administration",
      icon: Settings,
      section: "admin",
    },
    */
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMenuOpen(false)}
            className={cn(
             "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
              active
                ? "text-[#1E49E2] bg-[#1E49E2]/8 border border-[#1E49E2]/15"
                : "text-[#3A4A6B]/80 hover:text-[#1E49E2] hover:bg-[#1E49E2]/5",
            )}
            style={{
              fontWeight: active ? 500 : 400,
              letterSpacing: "0.01em",
            }}
          >
            <Icon
              className={cn(
                "h-[16px] w-[16px] flex-shrink-0 transition-colors",
                active ? "text-[#1E49E2]" : "text-[#1E49E2]/35",
              )}
              strokeWidth={1.75}
            />
            <span className="truncate text-[13px]">{item.label}</span>
            {active && (
              <div className="ml-auto w-1 h-1 rounded-full bg-[#1E49E2]" />
            )}
          </Link>
        );
      })}
    </>
  );
  

if (!user) return (

    <div className="relative min-h-screen overflow-hidden bg-navy-950">
      {/* Acentos azules KPMG */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 50%),
            radial-gradient(circle at 82% 78%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 48%)
          `,
        }}
      />
      <div
        className="absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(30,73,226,0.14)" }}
      />
      <div
        className="absolute right-0 bottom-0 h-80 w-80 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(0,51,141,0.16)" }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-[28px] p-10 text-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
        >

          <h1
            className="mb-3"
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
           Cargando...
          </h1>

          <p
            className="mb-8"
            style={{
              color: "rgba(0, 0, 0, 0.62)",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              letterSpacing: "-0.005em",
            }}
          >
            
          </p>

        </motion.div>
      </div>
    </div>
//<div>Cargando...</div>
);





if (user.NO_ACCESS) return (


  <div className="relative min-h-screen overflow-hidden bg-navy-950">
      {/* Acentos azules KPMG */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(30,73,226,0.18) 0%, rgba(30,73,226,0) 50%),
            radial-gradient(circle at 82% 78%, rgba(0,94,184,0.16) 0%, rgba(0,94,184,0) 48%)
          `,
        }}
      />
      <div
        className="absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(30,73,226,0.14)" }}
      />
      <div
        className="absolute right-0 bottom-0 h-80 w-80 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "rgba(0,51,141,0.16)" }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md rounded-[28px] p-10 text-center"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
        >

          <h1
            className="mb-3"
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
           Not authorized
          </h1>
            <br />
          <p
            className="mb-8"
            style={{
              color: "rgba(255, 255, 255, 0.62)",
              fontSize: "0.92rem",
              lineHeight: 1.6,
              letterSpacing: "-0.005em",
            }}
          >
            {user.email} has no access
          </p>

        </motion.div>
      </div>
    </div>
    /*
<div className="flex items-center justify-center min-h-screen">
    Not authorized {user.email} has no access
  </div>*/);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header - White Background */}
      <header
        className="sticky top-0 z-50 w-full bg-white border-b"
        style={{ borderBottomColor: "rgba(0, 51, 141, 0.12)" }}
      >
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Left Side - Menu Trigger */}
          <div className="flex items-center">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#1E49E2] hover:bg-[#1E49E2]/8/50 h-9 w-9"
                >
                  <Menu
                    className="h-[18px] w-[18px]"
                    strokeWidth={1.75}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 p-0 border-r-0 shadow-2xl [&>button]:hidden [&_[data-radix-close]]:hidden"
                style={{
                  borderRadius: "0 16px 16px 0",
                  boxShadow:
                    "0 4px 24px rgba(0, 51, 141, 0.08), 0 0 1px rgba(0, 51, 141, 0.12)",
                }}
              >
                {/* Menu Header */}
                <div
                  className="px-6 py-6 border-b flex items-center justify-between group/header"
                  style={{
                    borderBottomColor: "rgba(0, 51, 141, 0.08)",
                  }}
                >
                  <div className="text-center flex-1">
                    <SheetTitle
                      className="font-semibold text-[#00266A]"
                      style={{
                        letterSpacing: "0.12em",
                        fontSize: "0.9375rem",
                        textShadow:
                          "0 1px 1px rgba(0, 51, 141, 0.15), 0 0 4px rgba(30, 73, 226, 0.15)",
                      }}
                    >
                      EQCR
                    </SheetTitle>
                    <SheetDescription
                      className="text-xs mt-0.5"
                      style={{
                        color: "#6B85D6",
                        letterSpacing: "0.08em",
                        opacity: 0.85,
                        textShadow:
                          "0 1px 1px rgba(0, 51, 141, 0.08)",
                      }}
                    >
                      Monitoring
                    </SheetDescription>
                  </div>

                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-400 hover:text-gray-600 opacity-0 group-hover/header:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Button>
                  </SheetClose>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5 p-6">
                  <NavLinks />
                </nav>

                {/* Footer */}
                <div
                  className="mt-auto px-6 py-5 border-t"
                  style={{
                    borderTopColor: "rgba(0, 51, 141, 0.08)",
                  }}
                >
                  <p
                    className="text-xs text-gray-400 text-center"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    Navigation
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center - Brand Wordmark */}
          <Link
            to="/"
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <div
              className="font-semibold text-[#00266A]"
              style={{
                letterSpacing: "0.12em",
                fontSize: "0.9375rem",
                textShadow:
                  "0 1px 1px rgba(0, 51, 141, 0.15), 0 0 4px rgba(30, 73, 226, 0.15)",
              }}
            >
              EQCR
            </div>
            <div
              className="text-xs mt-0.5"
              style={{
                color: "#6B85D6",
                letterSpacing: "0.08em",
                opacity: 0.85,
                textShadow: "0 1px 1px rgba(0, 51, 141, 0.08)",
              }}
            >
              Monitoring
            </div>
          </Link>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-3">         
          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            title="User guide"
            className="h-8 w-8 text-gray-500 hover:text-[#1E49E2] hover:bg-[#1E49E2]/10 transition-all"
            //onClick={() => window.open("/user-guide", "_self")}
          >
            <HelpCircle className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          {/* Notifications */}
          <NotificationBell />

          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-gray-500 hover:text-[#1E49E2] hover:bg-[#1E49E2]/10 transition-all"
          >
            <Bell className="h-4 w-4" strokeWidth={1.5} />
            {/*<span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#1E49E2]" />*/}
          </Button>
          </div>
        </div>
      </header>          
      {/* Main Content - Full Width */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}