// src/app/api/statusReminders.ts

const BASE = import.meta.env.VITE_SCOREFY_API_URL;

// Wrapper local de request
async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        credentials: "include", mode: "cors",

    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;
    return res.json();
}
function postForm<T = any>(path: string, data: Record<string, any> = {}): Promise<T> {
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
            throw new Error(`Error HTTP ${res.status}: ${text}`);
        }

        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : null;
    });
}


// ===== Tipos expuestos al front =====
export type SortField =
    | "employeeName"
    | "projectClient"
    | "evaluatorName"
    | "evaluatorStatus"
    | "evaluationType"
    | "hours"
    | "employeeStatus";

export type SortDirection = "none" | "asc" | "desc";

export interface StatusReminderRow {
    id: string;           // KeyReport mapeado a id en el BL
    keyReport: string;
    employeeName: string;
    projectClient: string;
    evaluatorName: string;
    evaluatorStatus: "pending" | "in-progress" | "complete";
    employeeStatus: "pending" | "complete";
    evaluationType: "ordinary" | "extra";
    hours: number;
}

export interface StatusReminderVM {
    results: StatusReminderRow[];
    hasAccess?: boolean;
    warnings?: string[];
}

export interface StatusFilters {
    search?: string;
    evaluatorStatus?: string;   // "all"|"pending"|"in-progress"|"complete"
    employeeStatus?: string;    // "all"|"pending"|"complete"
    evaluationType?: string;    // "all"|"ordinary"|"extra"
    sortField?: SortField;
    sortDirection?: SortDirection;
}

// ============ Tipos para getData ============
export type StatusItem = {
    id: string;            // En tu backend actualmente equivale a keyReport
    keyReport: string;
    employeeName: string;
    projectClient: string;
    evaluatorName: string;
    evaluatorStatus: string;
    employeeStatus: string;
    evaluationType: string;
    hours: number;
};

export type StatusListResponse = {
    hasAccess: boolean;
    results: StatusItem[];
    warnings?: string[];
};

// ===== Excepciones =====
export interface ExceptionItem {
    id: number;
    keyReport: string;
    employeeName: string;
    projectClient: string;
    evaluatorName?: string;
    isException: boolean;
    reason?: string;
    eventNumber: number;
    exceptionType?: string;//para update 
}
//Catalogo para la funcion de change evaluator 
export type CatEmpleadoItem = { employeeId: number; fullName: string };

export type CatEmpleadoVM = {
    hasAccess: boolean;
    warnings?: string[];
    results: CatEmpleadoItem[];
};
//

export const statusRemindersApi = {
    // ===========================
    // 1) LISTADO (con filtros)
    // ===========================
    list(filters?: StatusFilters) {
        const q = new URLSearchParams();

        if (filters?.search) q.set("search", filters.search);
        if (filters?.evaluatorStatus && filters.evaluatorStatus !== "none")
            q.set("evaluatorStatus", filters.evaluatorStatus);
        if (filters?.employeeStatus && filters.employeeStatus !== "none")
            q.set("employeeStatus", filters.employeeStatus);
        if (filters?.evaluationType && filters.evaluationType !== "none")
            q.set("evaluationType", filters.evaluationType);
        if (filters?.sortField) q.set("sortField", filters.sortField);
        if (filters?.sortDirection && filters.sortDirection !== "none")
            q.set("sortDirection", filters.sortDirection);

        const qs = q.toString();
        const path = qs ? `/api/status-reminders?${qs}` : `/api/status-reminders`;

        // Devuelve el VM completo (results + hasAccess + warnings)
        return request(path) as Promise<StatusReminderVM>;
    },

    // Opción simple para el hook actual:
    getData(): Promise<StatusListResponse> {
        return request(`/api/status-reminders`);
    },

    // ===========================
    // 2) REMIND
    // ===========================
    remind(payload: { keyReport: string; note?: string }) {
        return postForm(`/api/status-reminders/remind`, payload);
    },

    // ===========================
    // 3) EXCEPTIONS
    // ===========================
    getExceptions() {
        return request(`/api/status-reminders/exceptions`) as Promise<ExceptionItem[]>;
    },
    //codigo Mich
    //createException(body: { keyReport: string; exceptionType: string; reason: string }) {
    //    return request(`/api/status-reminders/exceptions`, {
    //        method: "POST",
    //        body: JSON.stringify(body),
    //    }) as Promise<{ pkScorExceptions?: number; keyReport?: string; eventNumber?: number }>;
    //},
    //fin codigo Mich

    //Codigo Isaac
    createException(body: {
        keyReport: string;
        reason: string;
        isException: boolean;
        fy: number;
        exceptionType: string;
    }) {
        return postForm(`/api/status-reminders/exceptions`, body);
    },

    //fin codigo Isaac
    //updateException(id: number, body: { reason: string;/*exceptionType: string;*/  }) {
    //    return request(`/api/status-reminders/exceptions/${id}`, {
    //        method: "PUT",
    //        body: JSON.stringify({ id, ...body }),
    //    }) as Promise<{ pkScorExceptions?: number }>;
    //},
    updateException(id: number, body: { reason?: string; exceptionType?: string }) {
        return postForm(`/api/status-reminders/exceptions/${id}`, {
            id,
            ...body,
        });
    },


    restoreException(id: number) {
        return postForm(
            `/api/status-reminders/exceptions/${id}/restore`,
            {}
        );
    },
    //metodo para obtener ctalogo 
    getCatEmpleados(): Promise<CatEmpleadoVM> {
        return request(`/api/status-reminders/cat-empleados`);
    },

    //evaluador

    changeEvaluator(body: { keyReport: string; newEvaluatorId: number }) {
        return postForm(`/api/status-reminders/change-evaluator`, body);
    },


    getCurrentEvaluator(keyReport: string) {
        return request(
            `/api/status-reminders/${encodeURIComponent(keyReport)}/current-evaluator`
        ) as Promise<{ id: number | null; name: string }>;
    },

};