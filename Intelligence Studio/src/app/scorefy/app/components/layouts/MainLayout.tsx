import { Outlet } from "react-router";
import { Header } from "@/app/components/layouts/Header";
import { Sidebar } from "@/app/components/layouts/Sidebar";
import { useState } from "react";

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className="flex">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <main 
          className={`flex-1 p-6 md:p-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
          }`}
          style={{ minHeight: 'calc(100vh - 4rem)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
