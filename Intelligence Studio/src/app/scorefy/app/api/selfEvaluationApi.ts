

//const BASE = import.meta.env.VITE_SCOREFY_API_URL as string;


//async function request(path: string, options: RequestInit = {}) {
//    const res = await fetch(`${BASE}${path}`, {
//        ...options,
//        credentials: "include",
//        headers: {
//            "Content-Type": "application/json",
//            ...(options.headers || {}),
//        },
//    });

//    if (!res.ok) {
//        const text = await res.text().catch(() => "");
//        throw new Error(`Error HTTP ${res.status}: ${text}`);
//    }

//    // Por si algún endpoint regresara 204 o sin JSON
//    const contentType = res.headers.get("content-type") || "";
//    if (!contentType.includes("application/json")) return null;
//    return res.json();
//}

///** ====== Tipos (opcionales) para tu UI ====== */
//export type RespValue = 0 | 1 | 2 | 3;

//export interface AutoEvalItem {
//    ecdId: number;
//    competence: string | null;
//    subCompetence: string | null;
//    reactiveNum: string;
//    evaluatedResp?: number | null;
//    evaluatedComent?: string | null;

//    competenciaDescrip?: string | null;
//    subCompetenceDescrip?: string | null;
//    reactiveDescrip?: string | null;
//}

//export interface AutoEvalFormVM {
//    idColabEmpProy: string;
//    items: AutoEvalItem[];
//    existePrevio: boolean;
//    existeCierre: boolean;
//}

//export interface ProgressVM {
//    contestados: number;
//    total: number;
//    evaluatorOk: boolean;
//    completo: boolean;
//}

//export interface PostDetail {
//    ecdId: number;
//    competence: string | null;
//    subCompetence: string | null;
//    reactiveNum: string;
//    evaluatedResp?: number | null;
//    evaluatedComent?: string | null;
//}

//export interface PostModel {
//    idColabEmpProy: string;
//    detalles: PostDetail[];
//    clientFinalScore?: number;
//}

///** ====== NUEVO tipo para empleados ====== */
//export interface EmployeeOption {
//    id: number;      // EmployeeId
//    name: string;    // FullName
//    email: string;   // EmailAddressBusiness
//    label: string;
//    value: string;
//}


///** ====== API ====== */
//export const selfEvalApi = {
//    /** Bandeja + panel de inicio */
//    getIndex() {
//        return request("/api/self-evaluations");
//    },

//    deleteEvaluation: (payload: {
//        IdColabEmpProy: string;
//        PkEvalGene?: number;
//        KeyReport?: string;
//        GeneratedType?: number;
//    }) =>
//        request(`api/self-evaluations/delete`, {
//            method: "POST",
//            body: JSON.stringify(payload)
//        }),

//    /** Start Evaluation */
//    startEvaluation(data: { PkEvalGene: string; Role: string; EvaluatorId: string }) {
//        return request("/api/self-evaluations/start", {
//            method: "POST",
//            body: JSON.stringify(data),
//        });
//    },

//    /** FORMULARIO */
//    getForm(id: string, role?: string, evaluatorId?: number) {
//        const q = new URLSearchParams();
//        if (role) q.set("role", role);
//        if (evaluatorId) q.set("evaluatorId", evaluatorId.toString());
//        const qs = q.toString();
//        return request(`/api/self-evaluations/${id}/form${qs ? `?${qs}` : ""}`) as Promise<AutoEvalFormVM>;
//    },

//    /** AUTOSAVE */
//    autosave(id: string, role: string, dto: any) {
//        const roleQS = encodeURIComponent(role);
//        return request(`/api/self-evaluations/${id}/items?role=${roleQS}`, {
//            method: "POST",
//            body: JSON.stringify(dto),
//        }) as Promise<{ success: boolean }>;
//    },

//    /** PROGRESO */
//    getProgress(id: string, role: string, evaluatorId?: number) {
//        const q = new URLSearchParams({ role });
//        if (evaluatorId) q.set("evaluatorId", evaluatorId.toString());
//        return request(`/api/self-evaluations/${id}/progress?${q.toString()}`) as Promise<ProgressVM>;
//    },

//    /** SAVE DRAFT */
//    saveDraft(id: string, form: PostModel) {
//        return request(`/api/self-evaluations/${id}?accion=guardar`, {
//            method: "POST",
//            body: JSON.stringify(form),
//        }) as Promise<{ success: boolean; message: string }>;
//    },

//    /** SUBMIT */
//    submit(id: string, form: PostModel) {
//        return request(`/api/self-evaluations/${id}?accion=cerrar`, {
//            method: "POST",
//            body: JSON.stringify(form),
//        }) as Promise<{ success: boolean; message: string }>;
//    },



//    /** VALIDATE EXTRA */
//    validateExtra(body: { clientId: number; employeeId: number }) {
//        return request("/api/self-evaluations/extra/validate", {
//            method: "POST",
//            body: JSON.stringify(body),
//        }) as Promise<{ available: boolean; message?: string }>;
//    },

//    /** ADD EXTRA */
//    addExtra(body: {
//        clientId: number;
//        clientName: string;
//        employeeId: number;
//        totalHours?: number;
//        generatedDocumentation?: string;
//    }) {
//        return request("/api/self-evaluations/extra", {
//            method: "POST",
//            body: JSON.stringify(body),
//        });
//    },

//    /** LOOKUP CLIENT */
//    lookupClientName(clientId: number) {
//        return request(
//            `/api/self-evaluations/lookup-client?clientId=${encodeURIComponent(clientId)}`
//        ) as Promise<{ clientId: number; clientName: string | null; found: boolean }>;
//    },

//};

// ================================
//    Self Evaluation API CLIENT
// ================================

const BASE = import.meta.env.VITE_SCOREFY_API_URL as string;

//async function request(path: string, options: RequestInit = {}) {
//    const res = await fetch(`${BASE}${path}`, {
//        ...options,
//        credentials: "include", mode: "cors",

//    });

//    if (!res.ok) {
//        const text = await res.text().catch(() => "");
//        throw new Error(`Error HTTP ${res.status}: ${text}`);
//    }

//    // Algunos endpoints regresan 204 o sin JSON
//    const contentType = res.headers.get("content-type") || "";
//    if (!contentType.includes("application/json")) return null;

//    return res.json();
//}


async function request(path: string, options: RequestInit = {}) {

    const hasBody = !!options.body;

    const headers = {
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
    };

    const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
        mode: "cors",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Error HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return null;

    return res.json();
}

//function postForm(path: string, data: Record<string, any>) {
//    const body = new URLSearchParams();

//    for (const key in data) {
//        const value = data[key];
//        if (value === undefined || value === null) continue;

//        if (typeof value === "object") {
//            body.append(key, JSON.stringify(value));
//        } else {
//            body.append(key, String(value));
//        }
//    }

//    return fetch(`${BASE}${path}`, {
//        method: "POST",
//        credentials: "include",
//        headers: {
//            "Content-Type": "application/x-www-form-urlencoded",
//        },
//        body,
//    });
//}

async function postForm(path: string, data: Record<string, any>) {
    const body = new URLSearchParams();

    for (const key in data) {
        const value = data[key];
        if (value === undefined || value === null) continue;

        body.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value)
        );
    }

    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return null;

    return res.json(); // ✅ AQUÍ ESTABA EL PROBLEMA
}


// ================================
//         TYPES (DTOs)
// ================================

export type RespValue = 0 | 1 | 2 | 3;

export interface AutoEvalItem {
    ecdId: number;
    competence: string | null;
    subCompetence: string | null;
    reactiveNum: string;
    evaluatedResp?: number | null;
    evaluatedComent?: string | null;
    competenciaDescrip?: string | null;
    subCompetenceDescrip?: string | null;
    reactiveDescrip?: string | null;
}

export interface AutoEvalFormVM {
    idColabEmpProy: string;
    items: AutoEvalItem[];
    existePrevio: boolean;
    existeCierre: boolean;
}

export interface ProgressVM {
    contestados: number;
    total: number;
    evaluatorOk: boolean;
    completo: boolean;
}

export interface PostDetail {
    ecdId: number;
    competence: string | null;
    subCompetence: string | null;
    reactiveNum: string;
    evaluatedResp?: number | null;
    evaluatedComent?: string | null;
}

export interface PostModel {
    idColabEmpProy: string;
    detalles: PostDetail[];
    clientFinalScore?: number;
}

export interface EmployeeOption {
    id: number;
    name: string;
    email: string;
    label: string;
    value: string;
}

// ================================
//          API METHODS
// ================================

export const selfEvalApi = {
    // ✅ Bandeja
    getIndex() {
        return request("/api/self-evaluations");
    },

    //deleteEvaluation(payload: {
    //    IdColabEmpProy: string;
    //    PkEvalGene?: number;
    //    KeyReport?: string;
    //    GeneratedType?: number;
    //}) {
    //    return request("/api/self-evaluations/delete", {
    //        method: "POST",
    //        body: JSON.stringify(payload),
    //    });
    //},
    deleteEvaluation(payload: {
        IdColabEmpProy: string;
        PkEvalGene?: number;
        KeyReport?: string;
        GeneratedType?: number;
    }) {
        return postForm("/api/self-evaluations/delete", payload);
    },

    // ✅ Start Evaluation
    //startEvaluation(data: {
    //    PkEvalGene: string;
    //    Role: string;
    //    EvaluatorId: string;
    //}) {
    //    return request("/api/self-evaluations/start", {
    //        method: "POST",
    //        body: JSON.stringify(data),
    //    });
    //},
    startEvaluation(data: {
        PkEvalGene: string;
        Role: string;
        EvaluatorId: string;
    }) {
        return postForm("/api/self-evaluations/start", data);
    },


    // ✅ Formulario
    getForm(id: string, role?: string, evaluatorId?: number) {
        const q = new URLSearchParams();
        if (role) q.set("role", role);
        if (evaluatorId) q.set("evaluatorId", evaluatorId.toString());
        return request(
            `/api/self-evaluations/${id}/form${q.toString() ? "?" + q.toString() : ""}`
        ) as Promise<AutoEvalFormVM>;
    },

    // ✅ Autosave
    //autosave(id: string, role: string, dto: any) {
    //    return request(`/api/self-evaluations/${id}/items?role=${encodeURIComponent(role)}`, {
    //        method: "POST",
    //        body: JSON.stringify(dto),
    //    }) as Promise<{ success: boolean }>;
    //},

    autosave(id: string, role: string, dto: any) {
        return postForm(
            `/api/self-evaluations/${id}/items?role=${encodeURIComponent(role)}`,
            dto
        );
    },

    // ✅ Progress
    getProgress(id: string, role: string, evaluatorId?: number) {
        const q = new URLSearchParams({ role });
        if (evaluatorId) q.set("evaluatorId", evaluatorId.toString());
        return request(
            `/api/self-evaluations/${id}/progress?${q.toString()}`
        ) as Promise<ProgressVM>;
    },

    // ✅ Save Draft
    //saveDraft(id: string, form: PostModel) {
    //    return request(`/api/self-evaluations/${id}?accion=guardar`, {
    //        method: "POST",
    //        body: JSON.stringify(form),
    //    });
    //},
    saveDraft(id: string, form: PostModel) {
        return postForm(
            `/api/self-evaluations/${id}?accion=guardar`,
            form
        );
    },

    // ✅ Submit
    //submit(id: string, form: PostModel) {
    //    return request(`/api/self-evaluations/${id}?accion=cerrar`, {
    //        method: "POST",
    //        body: JSON.stringify(form),
    //    });
    //},
    submit(id: string, form: PostModel) {
        return postForm(
            `/api/self-evaluations/${id}?accion=cerrar`,
            form
        );
    },


    // ✅ Validate Extra
    //validateExtra(body: { clientId: number; employeeId: number }) {
    //    return request("/api/self-evaluations/extra/validate", {
    //        method: "POST",
    //        body: JSON.stringify(body),
    //    });
    //},
    validateExtra(body: { clientId: number; employeeId: number }) {
        return postForm("/api/self-evaluations/extra/validate", body);
    },


    // ✅ Add Extra
    addExtra(body: {
        clientId: number;
        clientName: string;
        employeeId: number;
        totalHours?: number;
        generatedDocumentation?: string;
    }) {
        return postForm("/api/self-evaluations/extra", body);
    },

    // ✅ Lookup client
    lookupClientName(clientId: number) {
        return request(
            `/api/self-evaluations/lookup-client?clientId=${encodeURIComponent(clientId)}`
        ) as Promise<{ clientId: number; clientName: string | null; found: boolean }>;
    },
};