import { http } from "./http";

export const pviiiApi = {
   
    async getById(p8Id: string) {
        const { data } = await http.get(`/api/Pviii/detail/${p8Id}`);
        return data;
    }, async getTeamLeaderStats(): Promise<TeamLeaderStats[]> {
        try {
            const res = await http.get("/api/Entity/EstadisticasTeamLeaders");
            return res.data || [];
        } catch (err) {
            console.error("Error fetching Team Leader Stats:", err);
            return [];
        }
    },
    async submitReview(p8Id: string, payload: ReviewSubmitPayload) {
        const { data } = await http.post(`/api/Pviii/review/${p8Id}`, payload);
        return data;
    },
    async getFramework(p8Id: string) {
        try {
            const { data } = await http.get(`/api/Pviii/framework/${p8Id}`);
            return data.object;
        } catch (err: any) {
            if (err.response?.status === 400) {
                return null;
            }
            throw err;
        }
    },
};
export interface TeamLeaderStats {
    catTeamLeaderId: number;
    employeeId: number;
    employeeName: string;
    levelLabel: string;
    yearsInRole: number | null;
    isFirstYear: boolean;
    qprResult: boolean;
    openPdIndicator: boolean;
}
export interface ReviewSubmitPayload {
    p8Id: string;
    isHighRisk: boolean;
    isFinancialRisk: boolean;
    approvalLevelId: number;
}
export interface ApiResult {
    correct: boolean;
    errorCode?: string;
    errorMessage?: string;
}