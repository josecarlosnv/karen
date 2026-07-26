import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { AnalyticalPerspectives } from "./components/AnalyticalPerspectives";
import { TalentAssessment } from "./components/TalentAssessment";
import { EngagementOperations } from "./components/EngagementOperations";
import { StrategyOffice } from "./components/StrategyOffice";
import { LearningEnablement } from "./components/LearningEnablement";
import { Governance } from "./components/Governance";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      
      { index: true, Component: Home },
      { path: "analytical-perspectives", Component: AnalyticalPerspectives },
      { path: "talent-assessment", Component: TalentAssessment },
      { path: "engagement-operations", Component: EngagementOperations },
      { path: "strategy-office", Component: StrategyOffice },
      { path: "learning-enablement", Component: LearningEnablement },
      { path: "governance", Component: Governance },
    ],
  },
],

 {
    basename: "/IntelligenceStudio",
  }

);
