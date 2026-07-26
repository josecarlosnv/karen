// este archivo sirve para ocultar/mostrar el icono de usuario en Header
const BASE = import.meta.env.VITE_SCOREFY_API_URL as string;

async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        credentials: "include", mode: "cors",
        
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json();
}

export type SecurityAccessDto = {
    hasSecurityAccess: boolean;
    email?: string;
    inEmployeesView?: boolean;
    allowed?: boolean;
};


export const securityApi = {
    getMe(): Promise<SecurityAccessDto> {
        return request("/api/security/me");
    },

    guard(): Promise<SecurityAccessDto> {
        return request("/api/security/guard"); 
    },
};

