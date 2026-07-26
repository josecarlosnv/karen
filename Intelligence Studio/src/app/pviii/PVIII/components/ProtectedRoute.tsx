import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const raw = localStorage.getItem("claims");
    const claims = raw ? JSON.parse(raw) : null;

    if (claims?.NO_ACCESS === "true") {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
}