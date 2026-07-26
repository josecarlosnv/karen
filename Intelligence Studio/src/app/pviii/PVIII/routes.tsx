import { createBrowserRouter } from "react-router";
import React from "react";
import { AppShell } from "./components/AppShell";
import Home from "./pages/Home";
import ClientSelection from "./pages/p8/ClientSelection";
import NewProject from "./pages/p8/NewProject";
import Leadership from "./pages/p8/Leadership";
import GeneralData from "./pages/p8/GeneralData";
import Quality from "./pages/p8/Quality";
import Entities from "./pages/p8/Entities";
import Staffing from "./pages/p8/Staffing";
import Specialists from "./pages/p8/Specialists";
import Valuation from "./pages/p8/Valuation";
import Review from "./pages/p8/Review";
import Approvals from "./pages/Approvals";
import ApprovalDetail from "./pages/approvals/ApprovalDetail";
import SpecialistConfirmations from "./pages/SpecialistConfirmations";
import Reports from "./pages/Reports";
import ClientRegistry from "./pages/ClientRegistry";
import DesignSystem from "./pages/DesignSystem";
import AccessDenied from "./pages/AccessDenied";
import ProtectedRoute from "../auth/ProtectedRoute";
import Unauthorized from "./pages/unauthorized";
import Unauthorizeds from "./pages/unauthorized";
import AdminConsole from "./pages/AdminConsole";
import OtherFunctions from "./pages/insights/OtherFunctions";

//function Layout({ children }: { children: React.ReactNode }) {
//  return <AppShell>{children}</AppShell>;
//}
function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <AppShell>{children}</AppShell>
        </ProtectedRoute>
    );
}
const rutaSerrvidor="/IntelligenceStudio/PVIII"


export const router = createBrowserRouter([
    {
        path: "/access-denied",
        element: <AccessDenied />,
    },
    {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    },
    {
        path: "/unauthorized",
        element: (
            <Layout>
                <Unauthorized />
            </Layout>
        ),
    },
    {
        path: "/unauthorizeds",
        element: (
            <Layout>
                <Unauthorizeds />
            </Layout>
        ),
    },
   
  {
    path: "/p8/new-project",
    element: (
      <Layout>
        <NewProject />
      </Layout>
    ),
  },
  {
    path: "/p8/new",
    element: (
      <Layout>
        <ClientSelection />
      </Layout>
    ),
  },
  {
    path: "/p8/recurrent",
    element: (
      <Layout>
        <ClientSelection />
      </Layout>
    ),
  },
  {
    path: "/p8/manage",
    element: (
      <Layout>
        <ClientSelection />
      </Layout>
    ),
  },
  {
    path: "/p8/client-selection",
    element: (
      <Layout>
        <ClientSelection />
      </Layout>
    ),
  },
  {
      path: "/p8/leadership/:p8Id",
    element: (
      <Layout>
        <Leadership />
      </Layout>
    ),
  },
  //{
  //  path: "/p8/general-data",
  //  element: (
  //    <Layout>
  //      <GeneralData />
  //    </Layout>
  //  ),
    //},
    {
        path: "/p8/general-data",
        element: (
            <Layout>
                <GeneralData />
            </Layout>
        ),
    },
    {
        path: "/p8/general-data/:p8Id",
        element: (
            <Layout>
                <GeneralData />
            </Layout>
        ),
    },
  {
    path: "/p8/quality/:p8Id",
    element: (
      <Layout>
        <Quality />
      </Layout>
    ),
  },
  {
      path: "/p8/entities/:p8Id",
    element: (
      <Layout>
        <Entities />
      </Layout>
    ),
  },
  {
      path: "/p8/staffing/:p8Id",
    element: (
      <Layout>
        <Staffing />
      </Layout>
    ),
  },
  {
    path: "/p8/specialists/:p8Id",
    element: (
      <Layout>
        <Specialists />
      </Layout>
    ),
  },
  {
      path: "/p8/valuation/:p8Id",
    element: (
      <Layout>
        <Valuation />
      </Layout>
    ),
  },
  {
      path: "/p8/review/:p8Id",
    element: (
      <Layout>
        <Review />
      </Layout>
    ),
  },
  {
    path: "/approvals",
    element: (
      <Layout>
        <Approvals />
      </Layout>
    ),
  },
  {
    path: "approvals/:id",
    element: (
      <Layout>
        <ApprovalDetail />
      </Layout>
    ),
  },
  {
    path: "/approvals/bu-leader/:id",
    element: (
      <Layout>
        <ApprovalDetail />
      </Layout>
    ),
  },
  {
    path: "/approvals/buppp/:id",
    element: (
      <Layout>
        <ApprovalDetail />
      </Layout>
    ),
  },
  {
    path: "/approvals/hofa/:id",
    element: (
      <Layout>
        <ApprovalDetail />
      </Layout>
    ),
  },
  {
    path: "/specialist-confirmations",
    element: (
      <Layout>
        <SpecialistConfirmations />
      </Layout>
    ),
  },
  {
    path: "/reports",
    element: (
      <Layout>
        <Reports />
      </Layout>
    ),
  },
  {
    path: "/reports/:id",
    element: (
      <Layout>
        <Reports />
      </Layout>
    ),
  },
  {
    path: "/clients",
    element: (
      <Layout>
        <ClientRegistry />
      </Layout>
    ),
  },
  {
    path: "/clients/new",
    element: (
      <Layout>
        <ClientRegistry />
      </Layout>
    ),
  },
  {
    path: "/clients/:id",
    element: (
      <Layout>
        <ClientRegistry />
      </Layout>
    ),
  },
  {
        path: "admin",
        element: (
          <Layout>
            <AdminConsole />
          </Layout>
        ),
      },
  {
        path: "insights/other-functions",
        element: <OtherFunctions />,
      },
  {
    path: "/design-system",
    element: (
      <Layout>
        <DesignSystem />
      </Layout>
    ),
    },
    

],{
    basename: rutaSerrvidor,
});