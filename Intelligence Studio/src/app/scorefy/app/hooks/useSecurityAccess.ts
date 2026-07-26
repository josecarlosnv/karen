////// este archivo sirve para ocultar/mostrar el icono de usuario en Header
//import { useEffect, useState } from "react";
//import { securityApi, SecurityAccessDto } from "@/app/api/securityApi";

//export function useSecurityAccess() {
//    const [data, setData] = useState<SecurityAccessDto | null>(null);
//    const [loading, setLoading] = useState(true);

//    useEffect(() => {
//        securityApi.getMe()
//            .then((res) => setData(res))
//            .catch(() => setData({ hasSecurityAccess: false }))
//            .finally(() => setLoading(false));
//    }, []);

//    return { hasAccess: data?.hasSecurityAccess ?? false, loading, raw: data };
//}

import { useEffect, useState } from "react";
import { securityApi, SecurityAccessDto } from "@/app/api/securityApi";

export function useSecurityAccess() {
    const [data, setData] = useState<SecurityAccessDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        securityApi.getMe()
            .then((res) => setData(res))
            .catch(() => setData({
                hasSecurityAccess: false,
                inEmployeesView: false
            }))
            .finally(() => setLoading(false));
    }, []);

    // ✅ SOLO APARECE EL ÍCONO SI ESTÁ EN LA VISTA
    return {
        hasAccess: data?.inEmployeesView ?? false,
        loading,
        raw: data
    };
}
