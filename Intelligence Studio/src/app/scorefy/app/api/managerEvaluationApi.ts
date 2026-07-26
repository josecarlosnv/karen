
//// src/app/api/managerEvaluationApi.ts
//const BASE = import.meta.env.VITE_SCOREFY_API_URL;

//async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
//    const res = await fetch(`${BASE}${path}`, {
//        ...init,
//        credentials: "include", mode: "cors", // si usas cookies; con bearer, agrega el header abajo

//    });

//    if (!res.ok) {
//        const text = await res.text().catch(() => "");
//        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
//    }
//    try {
//        return (await res.json()) as T;
//    } catch {
//        return {} as T;
//    }
//}

//export type ApiItem = {
//    EcdId: number;
//    Competence?: string;
//    SubCompetence?: string;        // decimal en string (ej. "1.10")
//    ReactiveNum?: string;
//    SubCompetenceDescrip?: string | null;
//    CompetenciaDescrip?: string | null;
//    ReactiveDescrip?: string | null;
//    Weight?: number | null;        // 0..1
//    EvaluatedResp?: number | null;
//    EvaluatedComent?: string | null;
//    EvaluatorResp?: number | null; // 1..3 o 0 (NA)
//    EvaluatorComent?: string | null;
//};

//export type ApiHeader = {
//    EvaluatedName?: string | null;
//    Role?: string | null;
//    ClientName?: string | null;
//    EntityNumber?: string | null;
//    CreatedTime?: string | null;
//};

//export type ApiFormResponse = {
//    IdColabEmpProy: string;
//    Items: ApiItem[];
//    Header: ApiHeader;
//    LazyValues?: boolean;
//};

//export const managerApi = {
//    /** Bandeja */
//    getInbox: () => request(`/api/manager-evaluations`),

//    /** Form (carga rápida, con textos, pesos y valores si existen) */
//    getForm: (id: string, role?: string) => {
//        const q = new URLSearchParams();
//        if (role) q.set("role", role);
//        return request<ApiFormResponse>(
//            `/api/manager-evaluations/${encodeURIComponent(id)}/form?${q.toString()}`
//        );
//    },

//    /** Valores diferidos (evaluado + evaluador) por subcompetencia (opcional) */
//    getValues: (id: string, sub?: string) => {
//        const q = new URLSearchParams();
//        if (sub) q.set("sub", sub);
//        return request<any[]>(
//            `/api/manager-evaluations/${encodeURIComponent(id)}/values?${q.toString()}`
//        );
//    },

//    /** Guardar borrador (UPDATE + GradeEvaluator = clientFinalScore) */
//    saveDraft: (id: string, detalles: any[], clientFinalScore: number) =>
//        request(`/api/manager-evaluations/${encodeURIComponent(id)}?accion=guardar`, {
//            method: "POST",
//            body: JSON.stringify({
//                idColabEmpProy: id,      // model binder mapea a IdColabEmpProy
//                detalles,                 // -> Detalles
//                clientFinalScore,         // -> ClientFinalScore (obligatorio en BL)
//            }),
//        }),

//    /** Cerrar (UPDATE + GradeEvaluator) */
//    closeAndSend: (id: string, detalles: any[], clientFinalScore: number) =>
//        request(`/api/manager-evaluations/${encodeURIComponent(id)}?accion=cerrar`, {
//            method: "POST",
//            body: JSON.stringify({
//                idColabEmpProy: id,
//                detalles,
//                clientFinalScore,
//            }),
//        }),


//    deleteEvaluation: (payload: {
//        IdColabEmpProy: string;
//        PkEvalGene?: number;
//        KeyReport?: string;
//        GeneratedType?: number;
//    }) =>
//        request(`/api/manager-evaluations/delete`, {
//            method: "POST",
//            body: JSON.stringify(payload)
//        }),

//};

const BASE = import.meta.env.VITE_SCOREFY_API_URL as string;

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        ...init,
        credentials: "include", mode: "cors", // si usas cookies; con bearer, agrega el header abajo

    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
    }
    try {
        return (await res.json()) as T;
    } catch {
        return {} as T;
    }
}

function postForm<T = any>(path: string, data: Record<string, any>): Promise<T> {
    const body = new URLSearchParams();

    for (const key in data) {
        const value = data[key];
        if (value === undefined || value === null) continue;

        // Si viene un array (ej. detalles), lo serializamos
        if (Array.isArray(value)) {
            body.append(key, JSON.stringify(value));
        } else {
            body.append(key, String(value));
        }
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
            throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
        }
        const ct = res.headers.get("content-type") || "";
        return ct.includes("application/json") ? res.json() : ({} as T);
    });
}
export type ApiItem = {
    EcdId: number;
    Competence?: string;
    SubCompetence?: string;        // decimal en string (ej. "1.10")
    ReactiveNum?: string;
    SubCompetenceDescrip?: string | null;
    CompetenciaDescrip?: string | null;
    ReactiveDescrip?: string | null;
    Weight?: number | null;        // 0..1
    EvaluatedResp?: number | null;
    EvaluatedComent?: string | null;
    EvaluatorResp?: number | null; // 1..3 o 0 (NA)
    EvaluatorComent?: string | null;
};

export type ApiHeader = {
    EvaluatedName?: string | null;
    Role?: string | null;
    ClientName?: string | null;
    EntityNumber?: string | null;
    CreatedTime?: string | null;
};

export type ApiFormResponse = {
    IdColabEmpProy: string;
    Items: ApiItem[];
    Header: ApiHeader;
    LazyValues?: boolean;
};


export const managerApi = {
    /** Bandeja */
    getInbox: () => request(`/api/manager-evaluations`),

    /** Form (carga rápida, con textos, pesos y valores si existen) */
    getForm: (id: string, role?: string) => {
        const q = new URLSearchParams();
        if (role) q.set("role", role);
        return request<ApiFormResponse>(
            `/api/manager-evaluations/${encodeURIComponent(id)}/form?${q.toString()}`
        );
    },

    /** Valores diferidos (evaluado + evaluador) por subcompetencia (opcional) */
    getValues: (id: string, sub?: string) => {
        const q = new URLSearchParams();
        if (sub) q.set("sub", sub);
        return request<any[]>(
            `/api/manager-evaluations/${encodeURIComponent(id)}/values?${q.toString()}`
        );
    },

    /** Guardar borrador (UPDATE + GradeEvaluator = clientFinalScore) */
    saveDraft: (id: string, detalles: any[], clientFinalScore: number) =>
        postForm(`/api/manager-evaluations/${encodeURIComponent(id)}?accion=guardar`, {
            idColabEmpProy: id,
            detalles,
            clientFinalScore,
        }),

    /** Cerrar (UPDATE + GradeEvaluator) */
    closeAndSend: (id: string, detalles: any[], clientFinalScore: number) =>
        postForm(`/api/manager-evaluations/${encodeURIComponent(id)}?accion=cerrar`, {
            idColabEmpProy: id,
            detalles,
            clientFinalScore,
        }),


    deleteEvaluation: (payload: {
        IdColabEmpProy: string;
        PkEvalGene?: number;
        KeyReport?: string;
        GeneratedType?: number;
    }) =>
        postForm(`/api/manager-evaluations/delete`, payload),

};