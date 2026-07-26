import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { Landing } from './components/Landing';
import { PartnerDetail } from './components/PartnerDetail';
import { HeatmapDashboard } from './components/HeatmapDashboard';
import { HeadOfAuditView } from './components/HeadOfAuditView';
import { HoFAReportView } from './components/HoFAReportView';
import { AdminSection } from './components/AdminSection';
import { PerformanceView } from './components/PerformanceView';
import { AppGuard, PerformanceGuard, HofaGuard, PartnersGuard } from './components/RouteGuards';

function AppContent() {
  const location = useLocation();
  const isDarkMode = location.pathname !== '/';

  return (
    <div className={isDarkMode ? 'dark min-h-screen bg-navy-950' : 'min-h-screen'}>
      {/* MARKER-MAKE-KIT-INVOKED */}
      <AppGuard>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/performance" element={<PerformanceGuard><AdminSection /></PerformanceGuard>} />
          <Route path="/admin" element={<PerformanceGuard><PerformanceView /></PerformanceGuard>} />
          <Route path="/partner/:id" element={<PartnersGuard><PartnerDetail /></PartnersGuard>} />
          <Route path="/heatmap" element={<HeatmapDashboard />} />
          <Route path="/head-of-audit/:id" element={<HofaGuard><HeadOfAuditView /></HofaGuard>} />
          <Route path="/hofa-report" element={<HoFAReportView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppGuard>
    </div>
  );
}

export default function App() {
  return (
<BrowserRouter basename="/IntelligenceStudio/quality-metrics">
      <AppContent />
    </BrowserRouter>
  );
}
