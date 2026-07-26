import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { ProjectProvider } from "./context/ProjectContext";
import { AuthProvider } from "../auth/AuthContext";

export default function App() {
    return (
        <AuthProvider>
            <ProjectProvider>
                <RouterProvider router={router} />
                <Toaster />
            </ProjectProvider>
        </AuthProvider>
    );
}
