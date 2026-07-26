import { createBrowserRouter, BrowserRouter, Switch, Route } from "react-router";
import { MainLayout } from "../app/components/layouts/MainLayout";
import { Dashboard } from "../app/pages/Dashboard";
import { SelfEvaluations } from "../app/pages/SelfEvaluations";
import { SelfEvaluationForm } from "../app/pages/SelfEvaluationForm";
import { ManagerEvaluations } from "../app/pages/ManagerEvaluations";
import { ManagerEvaluationDetail } from "../app/pages/ManagerEvaluationDetail";
import { EvaluationDetail } from "../app/pages/EvaluationDetail";
import { StatusReminders } from "../app/pages/StatusReminders";
import { FinalConclusion } from "../app/pages/FinalConclusion";
import { Reports } from "../app/pages/Reports";
import { UserProfile } from "../app/pages/UserProfile";
import { Administration } from "../app/pages/Administration";
import { Component } from "react";


const rutaServidor = "/IntelligenceStudio/scorefy"

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <MainLayout />,
            children: [
                { index: true, element: <Dashboard /> },
                { path: "self-evaluations", element: <SelfEvaluations /> },
                { path: "self-evaluations/form", element: <SelfEvaluationForm /> },
                { path: "self-evaluations/:id/edit", element: <SelfEvaluationForm /> },
                { path: "self-evaluations/:id", element: <SelfEvaluationForm /> },
                { path: "evaluations", element: <ManagerEvaluations /> },
                { path: "evaluations/:id", element: <ManagerEvaluationDetail /> },
                { path: "status-reminders", element: <StatusReminders /> },
                { path: "final-conclusion", element: <FinalConclusion /> },
                { path: "reports", element: <Reports /> },
                { path: "profile", element: <UserProfile /> },
                { path: "admin", element: <Administration /> },
            ],
        },
    ],
    {
        basename: rutaServidor
    }
);

