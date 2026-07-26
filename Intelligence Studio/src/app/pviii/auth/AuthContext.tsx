
import React, { createContext, useContext, useEffect, useState } from "react";
// import { getClaims } from "../app/Api/authApi";   // ✅
import { getClaims } from "../PVIII/Api/authApi";   // ✅

type AuthState = {
    claims: Record<string, any> | null;
    loading: boolean;
    hasNoAccess: boolean;
};

const AuthContext = createContext<AuthState>({
    claims: null,
    loading: true,
    hasNoAccess: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [claims, setClaims] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasNoAccess, setHasNoAccess] = useState(false);

    useEffect(() => {
        let cancelled = false;

        getClaims()
            .then((data) => {
                if (cancelled) return;

                setClaims(data);

                const noAccess = data?.NO_ACCESS === "true";
                setHasNoAccess(noAccess);
            })
            .catch((err) => {
                console.error("Error obteniendo claims:", err);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ claims, loading, hasNoAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}