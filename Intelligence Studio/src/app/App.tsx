import { RouterProvider } from "react-router";
import { router } from "./routes";
import AppPVIII from "./pviii/AppPVIII";
import AppScorefy from "./scorefy/AppScorefy";
import AppQualityMetrics from "./qualitymetrics/AppQualityMetrics";
import AppEQCR from "./EQCR/AppEQCR";

export default function App() {
  const p = window.location.pathname;
  if (p.startsWith("/IntelligenceStudio/PVIII")) {
    return <AppPVIII />;
  }
  if (p.startsWith("/IntelligenceStudio/scorefy")) {
    return <AppScorefy />;
  }
  if (p.startsWith("/IntelligenceStudio/quality-metrics")) {
    return <AppQualityMetrics />;
  }
if (p.startsWith("/IntelligenceStudio/eqcr")) {
    return <AppEQCR />;
  }
  return <RouterProvider router={router} />;
}
