

const BASE = import.meta.env.VITE_SCOREFY_API_URL as string;

/**
 * ✅ Wrapper SOLO para GET
 */
async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        credentials: "include",
        mode: "cors",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;

    return res.json();
}
function postForm<T = any>(path: string, data: Record<string, any>): Promise<T> {
    const body = new URLSearchParams();

    for (const key in data) {
        const value = data[key];
        if (value === undefined || value === null) continue;
        body.append(key, String(value));
    }

    return fetch(`${BASE}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    }).then(async res => {
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : null;
    });
}

// ===========================
//  📌 Tipos usados por la vista
// ===========================

export type PersonalProfileDto = {
    profileId: number;
    employeeId: string | null;
    employeeIdInt: number | null;
    fullName: string | null;
    email: string | null;
    staffLevel: string | null;
    graduated: boolean | null;
    postalCode: number | null;
    pmId: number | null;
    pmName: string | null;
    pmEmail: string | null;
    isCurrent?: boolean | null;
    hasSecurityAccess: boolean;
};

export type PersonalProfileUpdateDto = {
    pmId: number | null;
    pmName: string | null;
    pmEmail: string | null;
    graduated: boolean | null;
    postalCode: number | null;
};

export type ManagerOption = {
    id: number;       // EmployeeId
    name: string;
    email: string;
    label: string;    // para Combobox
    value: string;    // para Combobox
};

// ===========================
//  📌 API PersonalProfile
// ===========================

export const personalProfileApi = {

    
    getMe(): Promise<{ me: PersonalProfileDto }> {
        return request("/api/personal-profile/me");
    },


    updateProfile(payload: PersonalProfileUpdateDto) {
        return postForm("/api/personal-profile/me", payload);
    },

    
    getManagerOptions(): Promise<ManagerOption[]> {
        return request("/api/personal-profile/managers");
    },

};