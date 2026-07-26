//import { RouterProvider } from "react-router";
//import { router } from "../app/routes.tsx";
//import { Toaster } from "../app/components/ui/sonner";

//export default function App() {
//  return (
//    <>
//      <RouterProvider router={router} />
//      <Toaster />
//    </>
//  );
//}

import { RouterProvider } from "react-router";
import { router } from "../app/routes";
import { Toaster } from "../app/components/ui/sonner";

import { useSecurityGuard } from "@/app/hooks/useSecurityGuard";
import { FullBlockPage } from "../app/pages/FullBlockPage";

export default function App() {
    const allowed = useSecurityGuard();

    if (allowed === null) {
        return <div>Cargando...</div>;
    }

    if (allowed === false) {
        // ✅ BLOQUE TOTAL DE SCOREFY (NO HAY HEADER, NO HAY SIDEBAR)
        return <FullBlockPage />;
    }

    // ✅ SOLO SI ESTÁ AUTORIZADO LE PERMITES VER EL SISTEMA
    return (
        <>
            <RouterProvider router={router} />
            <Toaster />
        </>
    );
}