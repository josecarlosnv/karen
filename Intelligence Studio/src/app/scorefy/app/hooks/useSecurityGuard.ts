import { useEffect, useState } from "react";
import { securityApi } from "@/app/api/securityApi";

export function useSecurityGuard() {
    const [allowed, setAllowed] = useState<boolean | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await securityApi.guard();
                setAllowed(res.allowed);
            } catch {
                // Si el backend responde 401
                setAllowed(false);
            }
        };

        load();
    }, []);

    return allowed;
}