


const BASE = import.meta.env.VITE_SCOREFY_API_URL;

// Reusable request wrapper (same as StatusReminder)
async function request(path: string, options: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
        ...options,
        credentials: "include", mode: "cors",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
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

        const ct = res.headers.get("content-type") ?? "";
        return ct.includes("application/json") ? res.json() : null;
    });
}


export interface SectionData {
    promotionType?: string | null;
    promotionCategory?: string | null;
    justification?: string | null;
    openPDRating?: number | null;
    strengths?: string | null;
    areasOfOpportunity?: string | null;
    generalComments?: string | null;
}

export const finalConclusionApi = {


    getMySecurity() {
        return request("/api/final-conclusion/me");
    },

    // ✅ NUEVO: enviar reminder de Final Conclusion


    sendRemind(employeeId: number, fy: number) {
        return request(
            `/api/final-conclusion/remind/${employeeId}/${fy}`,
            { method: "POST" }
        );
    },





    getFull(employeeId: number, fy: number) {
        return request(`/api/final-conclusion/full/${employeeId}/${fy}`);
    },

    getCatalog() {
        return request(`/api/final-conclusion/catalog/employees`);
    },

    getCatalogStatus() {
        return request(`/api/final-conclusion/catalog/employeesstatus`);
    },

    deleteSection(section: string, employeeId: number, fy: number) {
        return postForm(
            `/api/final-conclusion/delete/${section}/${employeeId}/${fy}`,
            {}
        );
    },

    getWorkflow(employeeId: number, fy: number) {
        return request(`/api/final-conclusion/workflow/${employeeId}/${fy}`);
    },

    savePM(employeeId: number, fy: number, data: SectionData) {
        return postForm("/api/final-conclusion/performance-manager", {
            EmployeeId: employeeId,
            FY: fy,

            // ✅ PROPIEDADES ANIDADAS
            "Data.FeedbackConversationCompleted": data.feedbackConversationCompleted ?? null,
            "Data.PromotionType": data.promotionType ?? null,
            "Data.PromotionCategory": data.promotionCategory ?? null,
            "Data.Justification": data.justification ?? "n/a",
            "Data.OpenPDRating": data.openPDRating ?? null,
            "Data.Strengths": data.strengths ?? null,
            "Data.AreasOfOpportunity": data.areasOfOpportunity ?? null,
            "Data.GeneralComments": data.generalComments ?? null,

            // ✅ OBJETOS ANIDADOS
            "Data.Compliance806A.TrainingCompleted":
                data.compliance806A?.trainingCompleted ?? null,
            "Data.Compliance806A.IndependenceEthicsIssues":
                data.compliance806A?.independenceEthicsIssues ?? null,
            "Data.Compliance806A.RolePerformance":
                data.compliance806A?.rolePerformance ?? null,
            "Data.Compliance806A.CodeOfConductIssues":
                data.compliance806A?.codeOfConductIssues ?? null,

            "Data.Compliance806B.TrainingCompleted":
                data.compliance806B?.trainingCompleted ?? null,
            "Data.Compliance806B.IndependenceEthicsIssues":
                data.compliance806B?.independenceEthicsIssues ?? null,
            "Data.Compliance806B.QPRScore":
                data.compliance806B?.qprScore ?? "compliance",
            "Data.Compliance806B.RolePerformance":
                data.compliance806B?.rolePerformance ?? null,
            "Data.Compliance806B.CodeOfConductIssues":
                data.compliance806B?.codeOfConductIssues ?? null,

            "Data.ComplianceComments": data.complianceComments ?? null,
        });
    },

    saveCommittee(employeeId: number, fy: number, data: SectionData) {
        return postForm("/api/final-conclusion/committee", {
            EmployeeId: employeeId,
            FY: fy,

            "Data.PromotionType": data.promotionType ?? null,
            "Data.PromotionCategory": data.promotionCategory ?? null,
            "Data.Justification": data.justification ?? null,
            "Data.OpenPDRating": data.openPDRating ?? null,
            "Data.GeneralComments": data.generalComments ?? null,
        });
    },

    saveCalibration(employeeId: number, fy: number, data: SectionData) {
        return postForm("/api/final-conclusion/calibration", {
            EmployeeId: employeeId,
            FY: fy,

            "Data.OpenPDRating": data.openPDRating ?? null,
            "Data.GeneralComments": data.generalComments ?? null,
        });
    },
};