// api/specialist.ts
import { http } from "./http";

export const specialistApi = {
    async getSpecialists() {
        const { data } = await http.get("/api/specialists");
        return data;
    },

    async upsertSpecialists(p8Id: string, payload: SpecialistsDto[]) {
        const { data } = await http.put(
            `api/Pviii/specialists/${p8Id}`,
            payload
        );
        return data;
    },
    listServiceLines: async () => {
        const { data } = await http.get("/api/ServiceLine/ServiceLines");
            return data;
    },


    async getPartners(): Promise<StaffItem[]> {
        try {
            const res = await http.get("/api/CatSpecialist/CatSpecialist");

            return (res.data || []).map((item: any) => ({
                id: item.employeeId?.toString().trim(),
                name: item.employeeName?.trim(),
                email : item.employeeEmail?.trim(),
            }));
        } catch (err) {
            console.error("Error fetching partners:", err);
            return [];
        }
    },


    async getPviii(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },
    async getAuditMonths() {
        const { data } = await http.get("/api/CatAuditStageMth/CatAuditMth");
        return data;
    }




};
export interface AuditMonthDto {
    auditStageMthId: number;
    monthyearLabel: string;
    monthyearId: number;
}

export interface StaffItem {
    id: string;
    name: string;
    email: string;
}

export interface ServiceLineDto {
    specialistServiceLineId: number;
    serviceLineLabel: string;
    functionLabel: string;
    officeLabel: string;
    serviceLineGroup: string;

    serviceLineLeadPartnerId?: number;
    serviceLineLeadPartnerEmail?: string;
}


export interface SpecialistsDto {
    keyId: number;
    functionLabel: string;
    serviceLineLabel: string;
    officeLabel: string;
    agreedFeesAmount: number;

    auditStagePreliminaryInd: boolean;
    auditStageInterimInd: boolean;
    auditStageFinalInd: boolean;

    auditStagePreliminaryMths?: number | null;
    auditStageInterimMths?: number | null;
    auditStageFinalMths?: number | null;

    isActive: boolean;
    createdByUserEmail?: string;

    serviceLinePartnerId?: string | null;
    serviceLinePartnerLabel?: string | null;
    serviceLineInChargeEmail?: string | null;
}