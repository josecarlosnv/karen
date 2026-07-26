
import { http } from "./http";
export const approvalsApi = {
    async list() {
        const res = await http.get("/api/Apporvals/Approvals");
        return res.data;
    },
    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    },
    async getByIdReview(p8Id: string) {
        const { data } = await http.get(`/api/Apporvals/ReviesApproval/${p8Id}`);
        return data;
    },
    async SaveDocumentation(p8Id: string, payload: any) {
        const { data } = await http.post(
            `/api/Apporvals/Documentation/${p8Id}`, 
            payload
        );
        return data;
    },
    async GetDocumentation(p8Id: string) {
        const { data } = await http.get(
            `/api/Apporvals/Documentation/${p8Id}`
        );
        return data;
    }, async GetApprovalStatus(p8Id: string) {
        const { data } = await http.get(
            `/api/Apporvals/ApprovalStatus/${p8Id}`
        );
        return data;
    }, listServiceLines: async () => {
        const { data } = await http.get("/api/ServiceLine/ServiceLines");
        return data;
    },
    async ReturnToReview(p8Id: string, payload: any) {
        const { data } = await http.post(
            `/api/Apporvals/ReturnToReview/${p8Id}`,
            payload
        );

        return data;
    }

};
export interface Approval {
    p8Id: string;
    currentEngagementManagerName: string;
    currentEngagementPartnerName: string;
    currentEngagementManagerEmail: string;
    currentEngagementPartnerEmail: string;
    p8revenueTypeId: number;
    p8revenueTypeLabel: string;
    clientNumber: string;
    clientName: string;
    p8FiscalYearLabel: number;
    p8StatusLabel: string;
    documentationIndicator: number;
    approvalLevelId: number | null;
    approvalLevelLabel: string | null;
    netAuditRevenue: number;
    standardAuditHours: number;
    valuation: number;
    averageAuditFee: number;
    apprHofA: string;
    apprBuppp: string;
    apprBupic: string;
    apprLeap: string;
    approvalsSummary: string;
}
