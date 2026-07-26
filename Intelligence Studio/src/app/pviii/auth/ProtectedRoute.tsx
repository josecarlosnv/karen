
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { loading, hasNoAccess, claims } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (hasNoAccess) {
        return <Navigate to="/access-denied" replace />;
    }

    const practica = claims?.practica;
    const buNormalized = claims?.BU; //erikChange claims?.BU.map(x => x.toLowerCase()) // claims?.BU?.toLowerCase()
    const derived = claims?.DerivedAccess;

    const roleKey = claims
        ? Object.keys(claims).find(k => k.toLowerCase().includes("role"))
        : null;

    const rawRole = roleKey ? claims[roleKey] : undefined;

    const roles = rawRole
        ? (Array.isArray(rawRole) ? rawRole : [rawRole])
        : [];

    const isVMaster =
        claims?.vMaster === "true" || roles.includes("vMaster");

    const isKey = roles.includes("Key");
    const isMaster = derived === "Master_Current";

    const path = location.pathname;

    const cleanPath = path.replace("/PVIII", "");

    const isSpecialistRoute =
        cleanPath.startsWith("/specialist-confirmations") ;

    const practicaNormalized = practica?.toLowerCase();
    console.log({
        buNormalized,
        practica,
        roles,
        path,
        isSpecialistRoute
    });
    if (isVMaster) {
        return children;
    }

    const isPublicRoute =
        cleanPath === "/" ||
        cleanPath === "/unauthorized" ||
        cleanPath === "/access-denied";

    const isTaxOrAdvisory =
        buNormalized === "TAX" || buNormalized === "Tax" || buNormalized === "tax" ||
        buNormalized === "ADVISORY" || buNormalized === "Advisory" || buNormalized === "advisory";
        /* before
           buNormalized === "tax" ||
        buNormalized === "advisory";ADVISORY
        */

    if (isTaxOrAdvisory) {
        if (isPublicRoute || isSpecialistRoute) {
            return children;
        }

        return <Navigate to="/unauthorized" replace />;
    }

    if (practica && practicaNormalized !== "audit") {
        if (isPublicRoute || isSpecialistRoute) {
            return children;
        }

        return <Navigate to="/unauthorized" replace />;
    }

    if (practicaNormalized === "audit") {
        if (isSpecialistRoute) {
            return <Navigate to="/unauthorized" replace />;
        }

        return children;
    }

    if (isKey || isMaster) {
        if (isSpecialistRoute) {
            return <Navigate to="/unauthorized" replace />;
        }

        return children;
    }
   
    
    return <Navigate to="/unauthorized" replace />;
}