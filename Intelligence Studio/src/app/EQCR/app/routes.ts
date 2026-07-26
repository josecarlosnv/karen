import { createBrowserRouter } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Credentials from "./pages/Credentials";
import EqcrEdit from "./pages/EqcrEdit";
import Confirmations from "./pages/Confirmations";
import Assignments from "./pages/Assignments";
import AssignmentView from "./pages/AssignmentView";
import Approvals from "./pages/Approvals";
import Administration from "./pages/Administration";
import AnnualReassessment from "./pages/AnnualReassessment";
import Rollforward from "./pages/annual/Rollforward";
import AssuranceOthers from "./pages/annual/AssuranceOthers";
import EqReview307 from "./pages/annual/EqReview307";

const rutaServidor = "/IntelligenceStudio/eqcr"
export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "credentials", Component: Credentials },
      { path: "credentials/eqcr/:id", Component: EqcrEdit },
      { path: "confirmations", Component: Confirmations },
      { path: "assignments", Component: Assignments },
      { path: "assignments/view/:id", Component: AssignmentView },
      { path: "approvals", Component: Approvals },
      { path: "administration", Component: Administration },
      { path: "annual-reassessment", Component: AnnualReassessment },
      { path: "annual-reassessment/rollforward", Component: Rollforward },
      { path: "annual-reassessment/assurance-others", Component: AssuranceOthers },
      { path: "eq-review-307", Component: EqReview307 },
    ],
  },
]
  ,{basename: rutaServidor}
);